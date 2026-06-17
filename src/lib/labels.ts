import type { ExamStatus, Role } from "@prisma/client";

export const roleLabels: Record<Role, string> = {
  SUPER_ADMIN: "Bosh administrator",
  CENTER_ADMIN: "Test markazi administratori"
};

export const statusLabels: Record<ExamStatus, string> = {
  PENDING: "Tasdiqlash kutilmoqda",
  APPROVED: "Tasdiqlandi",
  REJECTED: "Rad etildi",
  CANCELLED: "Bekor qilindi",
  EXPIRED: "Muddati o'tgan"
};

export const statusTone: Record<ExamStatus, "neutral" | "success" | "warning" | "danger"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
  CANCELLED: "neutral",
  EXPIRED: "neutral"
};
