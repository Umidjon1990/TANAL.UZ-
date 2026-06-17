"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { ExamStatus } from "@prisma/client";
import { clearSession, createSession, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendExamApprovedPostToTelegram } from "@/lib/telegram";

type ActionState = { ok: boolean; message: string };

const usernameSchema = z.string().min(3, "Login kamida 3 ta belgidan iborat bo'lishi kerak");
const passwordSchema = z.string().min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak");

const loginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(6, "Parolni kiriting")
});

const centerSchema = z.object({
  name: z.string().min(2, "Markaz nomini kiriting"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  region: z.string().min(2, "Hududni kiriting"),
  district: z.string().min(2, "Tumanni kiriting"),
  address: z.string().min(5, "Manzilni to'liq kiriting"),
  locationUrl: z.string().optional(),
  phone: z.string().min(7, "Telefon raqamini kiriting"),
  telegram: z.string().optional()
});

const userSchema = z.object({
  name: z.string().min(2, "Ism-familiyani kiriting"),
  username: usernameSchema,
  password: passwordSchema,
  testCenterId: z.string().min(1, "Test markazini tanlang")
});

const passwordResetSchema = z.object({
  userId: z.string().min(1),
  password: passwordSchema
});

const examSchema = z.object({
  testCenterId: z.string().optional(),
  examDate: z.string().min(1, "Imtihon sanasini kiriting"),
  startTime: z.string().min(1, "Boshlanish vaqtini kiriting"),
  endTime: z.string().min(1, "Tugash vaqtini kiriting"),
  seatsLimit: z.coerce.number().int().positive("Joylar soni musbat bo'lishi kerak"),
  price: z.coerce.number().int().nonnegative("Narx manfiy bo'lmasligi kerak"),
  description: z.string().optional()
});

const newsSchema = z.object({
  title: z.string().min(3, "Sarlavhani kiriting"),
  slug: z.string().min(3, "Slug kiriting").regex(/^[a-z0-9-]+$/, "Slug faqat lotin harflari, raqam va chiziqchadan iborat bo'lishi kerak"),
  content: z.string().min(10, "Matnni to'liq kiriting"),
  imageUrl: z.string().optional(),
  isPublished: z.coerce.boolean().optional()
});

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalValue(formData: FormData, key: string) {
  const item = value(formData, key);
  return item.length ? item : undefined;
}

function fail(message: string): ActionState {
  return { ok: false, message };
}

function success(message: string): ActionState {
  return { ok: true, message };
}

async function audit(userId: string | null, action: string, entityType: string, entityId: string, details?: object) {
  await prisma.auditLog.create({
    data: { userId, action, entityType, entityId, details: details ?? undefined }
  });
}

function revalidateAdmin() {
  revalidatePath("/");
  revalidatePath("/exams");
  revalidatePath("/centers");
  revalidatePath("/admin");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/centers");
  revalidatePath("/admin/users");
  revalidatePath("/admin/exams");
  revalidatePath("/admin/exams/pending");
  revalidatePath("/center/dashboard");
  revalidatePath("/center/exams");
}

export async function loginAction(_: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse({
    username: value(formData, "username"),
    password: value(formData, "password")
  });

  if (!parsed.success) return fail(parsed.error.errors[0]?.message ?? "Ma'lumotlarni tekshiring");

  const user = await prisma.user.findUnique({ where: { username: parsed.data.username } });
  if (!user?.isActive) return fail("Login yoki parol noto'g'ri");

  const passwordOk = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!passwordOk) return fail("Login yoki parol noto'g'ri");

  await createSession({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    testCenterId: user.testCenterId
  });
  await audit(user.id, "LOGIN", "User", user.id);

  redirect(user.role === "SUPER_ADMIN" ? "/admin/dashboard" : "/center/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}

export async function createCenterAction(_: unknown, formData: FormData) {
  const user = await requireUser(["SUPER_ADMIN"]);
  const parsed = centerSchema.safeParse({
    name: value(formData, "name"),
    description: optionalValue(formData, "description"),
    imageUrl: optionalValue(formData, "imageUrl"),
    region: value(formData, "region"),
    district: value(formData, "district"),
    address: value(formData, "address"),
    locationUrl: optionalValue(formData, "locationUrl"),
    phone: value(formData, "phone"),
    telegram: optionalValue(formData, "telegram")
  });

  if (!parsed.success) return fail(parsed.error.errors[0]?.message ?? "Ma'lumotlarni tekshiring");

  const center = await prisma.testCenter.create({ data: parsed.data });
  await audit(user.id, "CREATE", "TestCenter", center.id, { name: center.name });
  revalidateAdmin();
  return success("Test markazi yaratildi");
}

export async function updateCenterAction(_: unknown, formData: FormData) {
  const user = await requireUser(["SUPER_ADMIN"]);
  const id = value(formData, "id");
  const parsed = centerSchema.safeParse({
    name: value(formData, "name"),
    description: optionalValue(formData, "description"),
    imageUrl: optionalValue(formData, "imageUrl"),
    region: value(formData, "region"),
    district: value(formData, "district"),
    address: value(formData, "address"),
    locationUrl: optionalValue(formData, "locationUrl"),
    phone: value(formData, "phone"),
    telegram: optionalValue(formData, "telegram")
  });

  if (!id) return fail("Markaz topilmadi");
  if (!parsed.success) return fail(parsed.error.errors[0]?.message ?? "Ma'lumotlarni tekshiring");

  await prisma.testCenter.update({ where: { id }, data: parsed.data });
  await audit(user.id, "UPDATE", "TestCenter", id);
  revalidateAdmin();
  return success("Test markazi yangilandi");
}

export async function toggleCenterAction(formData: FormData) {
  const user = await requireUser(["SUPER_ADMIN"]);
  const id = value(formData, "id");
  const isActive = value(formData, "isActive") === "true";
  await prisma.testCenter.update({ where: { id }, data: { isActive } });
  await audit(user.id, isActive ? "ACTIVATE" : "DEACTIVATE", "TestCenter", id);
  revalidateAdmin();
}

export async function createCenterAdminAction(_: unknown, formData: FormData) {
  const user = await requireUser(["SUPER_ADMIN"]);
  const parsed = userSchema.safeParse({
    name: value(formData, "name"),
    username: value(formData, "username"),
    password: value(formData, "password"),
    testCenterId: value(formData, "testCenterId")
  });

  if (!parsed.success) return fail(parsed.error.errors[0]?.message ?? "Ma'lumotlarni tekshiring");

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  try {
    const created = await prisma.user.create({
      data: {
        name: parsed.data.name,
        username: parsed.data.username,
        passwordHash,
        role: "CENTER_ADMIN",
        testCenterId: parsed.data.testCenterId
      }
    });
    await audit(user.id, "CREATE", "User", created.id, { role: "CENTER_ADMIN" });
  } catch {
    return fail("Bu login allaqachon ishlatilgan");
  }

  revalidateAdmin();
  return success("Markaz administratori yaratildi");
}

export async function resetCenterAdminPasswordAction(_: unknown, formData: FormData) {
  const user = await requireUser(["SUPER_ADMIN"]);
  const parsed = passwordResetSchema.safeParse({
    userId: value(formData, "userId"),
    password: value(formData, "password")
  });

  if (!parsed.success) return fail(parsed.error.errors[0]?.message ?? "Ma'lumotlarni tekshiring");

  const target = await prisma.user.findUnique({ where: { id: parsed.data.userId } });
  if (!target || target.role !== "CENTER_ADMIN") return fail("Markaz administratori topilmadi");

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.update({ where: { id: target.id }, data: { passwordHash } });
  await audit(user.id, "RESET_PASSWORD", "User", target.id);
  revalidateAdmin();
  return success("Parol yangilandi");
}

export async function toggleUserAction(formData: FormData) {
  const user = await requireUser(["SUPER_ADMIN"]);
  const id = value(formData, "id");
  const isActive = value(formData, "isActive") === "true";
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target || target.role !== "CENTER_ADMIN") return;

  await prisma.user.update({ where: { id }, data: { isActive } });
  await audit(user.id, isActive ? "ACTIVATE" : "DEACTIVATE", "User", id);
  revalidateAdmin();
}

export async function createExamAction(_: unknown, formData: FormData) {
  const user = await requireUser(["SUPER_ADMIN", "CENTER_ADMIN"]);
  const parsed = examSchema.safeParse({
    testCenterId: optionalValue(formData, "testCenterId"),
    examDate: value(formData, "examDate"),
    startTime: value(formData, "startTime"),
    endTime: value(formData, "endTime"),
    seatsLimit: value(formData, "seatsLimit"),
    price: value(formData, "price"),
    description: optionalValue(formData, "description")
  });

  if (!parsed.success) return fail(parsed.error.errors[0]?.message ?? "Ma'lumotlarni tekshiring");

  const testCenterId = user.role === "SUPER_ADMIN" ? parsed.data.testCenterId : user.testCenterId;
  if (!testCenterId) return fail("Test markazi topilmadi");

  const exam = await prisma.examDate.create({
    data: {
      testCenterId,
      examDate: new Date(parsed.data.examDate),
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      seatsLimit: parsed.data.seatsLimit,
      price: parsed.data.price,
      description: parsed.data.description,
      status: user.role === "SUPER_ADMIN" ? "APPROVED" : "PENDING",
      approvedById: user.role === "SUPER_ADMIN" ? user.id : null,
      approvedAt: user.role === "SUPER_ADMIN" ? new Date() : null
    }
  });

  await audit(user.id, "CREATE", "ExamDate", exam.id, { status: exam.status });
  if (user.role === "SUPER_ADMIN") await sendExamApprovedPostToTelegram(exam.id);
  revalidateAdmin();
  return success(user.role === "SUPER_ADMIN" ? "Imtihon sanasi tasdiqlandi va e'lon qilindi" : "So'rov tasdiqlashga yuborildi");
}

export async function updateCenterExamAction(_: unknown, formData: FormData) {
  const user = await requireUser(["CENTER_ADMIN"]);
  if (!user.testCenterId) return fail("Test markazi biriktirilmagan");
  const id = value(formData, "id");
  const parsed = examSchema.safeParse({
    examDate: value(formData, "examDate"),
    startTime: value(formData, "startTime"),
    endTime: value(formData, "endTime"),
    seatsLimit: value(formData, "seatsLimit"),
    price: value(formData, "price"),
    description: optionalValue(formData, "description")
  });

  if (!parsed.success) return fail(parsed.error.errors[0]?.message ?? "Ma'lumotlarni tekshiring");

  const exam = await prisma.examDate.findFirst({ where: { id, testCenterId: user.testCenterId } });
  if (!exam) return fail("So'rov topilmadi");
  if (exam.status !== "PENDING") return fail("Faqat tasdiqlash kutilayotgan so'rovni tahrirlash mumkin");

  await prisma.examDate.update({
    where: { id },
    data: {
      examDate: new Date(parsed.data.examDate),
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      seatsLimit: parsed.data.seatsLimit,
      price: parsed.data.price,
      description: parsed.data.description
    }
  });
  await audit(user.id, "UPDATE", "ExamDate", id);
  revalidateAdmin();
  return success("So'rov yangilandi");
}

export async function cancelCenterExamAction(formData: FormData) {
  const user = await requireUser(["CENTER_ADMIN"]);
  if (!user.testCenterId) return;
  const id = value(formData, "id");
  const exam = await prisma.examDate.findFirst({ where: { id, testCenterId: user.testCenterId } });
  if (!exam || exam.status === "APPROVED") return;

  await prisma.examDate.update({ where: { id }, data: { status: "CANCELLED" } });
  await audit(user.id, "CANCEL", "ExamDate", id);
  revalidateAdmin();
}

export async function updateCenterProfileAction(_: unknown, formData: FormData) {
  const user = await requireUser(["CENTER_ADMIN"]);
  if (!user.testCenterId) return fail("Test markazi biriktirilmagan");

  const phone = value(formData, "phone");
  const telegram = optionalValue(formData, "telegram");
  const description = optionalValue(formData, "description");
  if (phone.length < 7) return fail("Telefon raqamini kiriting");

  await prisma.testCenter.update({
    where: { id: user.testCenterId },
    data: { phone, telegram, description }
  });
  await audit(user.id, "UPDATE_PROFILE", "TestCenter", user.testCenterId);
  revalidateAdmin();
  return success("Profil yangilandi");
}

export async function updateExamStatusAction(formData: FormData) {
  const user = await requireUser(["SUPER_ADMIN"]);
  const id = value(formData, "id");
  const status = value(formData, "status") as ExamStatus;
  const rejectionReason = optionalValue(formData, "rejectionReason");

  if (!["APPROVED", "REJECTED", "CANCELLED", "EXPIRED"].includes(status)) return;

  const data =
    status === "APPROVED"
      ? { status, approvedById: user.id, approvedAt: new Date(), rejectedAt: null, rejectionReason: null }
      : status === "REJECTED"
        ? { status, approvedById: null, approvedAt: null, rejectedAt: new Date(), rejectionReason: rejectionReason ?? "Sabab ko'rsatilmagan" }
        : { status, approvedById: null, approvedAt: null, rejectedAt: null, rejectionReason: null };

  await prisma.examDate.update({ where: { id }, data });
  await audit(user.id, status, "ExamDate", id, status === "REJECTED" ? { rejectionReason: data.rejectionReason } : undefined);
  if (status === "APPROVED") await sendExamApprovedPostToTelegram(id);
  revalidateAdmin();
}

export async function createNewsAction(_: unknown, formData: FormData) {
  const user = await requireUser(["SUPER_ADMIN"]);
  const parsed = newsSchema.safeParse({
    title: value(formData, "title"),
    slug: value(formData, "slug"),
    content: value(formData, "content"),
    imageUrl: optionalValue(formData, "imageUrl"),
    isPublished: formData.get("isPublished") === "on"
  });

  if (!parsed.success) return fail(parsed.error.errors[0]?.message ?? "Ma'lumotlarni tekshiring");

  try {
    const news = await prisma.news.create({
      data: {
        ...parsed.data,
        publishedAt: parsed.data.isPublished ? new Date() : null
      }
    });
    await audit(user.id, "CREATE", "News", news.id);
  } catch {
    return fail("Bu slug allaqachon ishlatilgan");
  }

  revalidatePath("/news");
  revalidatePath("/admin/news");
  return success("Yangilik saqlandi");
}
