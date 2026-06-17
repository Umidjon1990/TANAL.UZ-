import "server-only";

import { prisma } from "@/lib/prisma";
import { formatDate, formatMoney } from "@/lib/utils";

type TelegramResponse = {
  ok: boolean;
  result?: { message_id?: number };
  description?: string;
};

export async function sendExamApprovedPostToTelegram(examDateId: string) {
  const existing = await prisma.telegramPostLog.findUnique({ where: { examDateId } });
  if (existing?.telegramMessageId && existing.status === "Yuborildi") return existing;

  const exam = await prisma.examDate.findUnique({
    where: { id: examDateId },
    include: { testCenter: true }
  });

  if (!exam || exam.status !== "APPROVED") return null;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const examUrl = `${siteUrl}/exams#${exam.id}`;

  const message = [
    "📢 Yangi TANAL imtihon sanasi",
    "",
    `🏢 Markaz: ${exam.testCenter.name}`,
    `📍 Hudud: ${exam.testCenter.region}, ${exam.testCenter.district}`,
    `🗓 Sana: ${formatDate(exam.examDate)}`,
    `⏰ Vaqt: ${exam.startTime} - ${exam.endTime}`,
    `👥 Joylar soni: ${exam.seatsLimit}`,
    `💰 Narx: ${formatMoney(exam.price)}`,
    `📞 Bog'lanish: ${exam.testCenter.phone}`,
    `🔗 Batafsil: ${examUrl}`
  ].join("\n");

  if (!token || !channelId) {
    return prisma.telegramPostLog.upsert({
      where: { examDateId },
      update: {
        status: "Yuborilmadi",
        errorMessage: "Telegram sozlamalari kiritilmagan"
      },
      create: {
        examDateId,
        status: "Yuborilmadi",
        errorMessage: "Telegram sozlamalari kiritilmagan"
      }
    });
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: channelId,
        text: message,
        disable_web_page_preview: false
      })
    });
    const body = (await response.json()) as TelegramResponse;

    return prisma.telegramPostLog.upsert({
      where: { examDateId },
      update: {
        telegramMessageId: body.result?.message_id ? String(body.result.message_id) : null,
        status: response.ok && body.ok ? "Yuborildi" : "Xatolik",
        errorMessage: response.ok && body.ok ? null : body.description ?? "Telegram xabari yuborilmadi"
      },
      create: {
        examDateId,
        telegramMessageId: body.result?.message_id ? String(body.result.message_id) : null,
        status: response.ok && body.ok ? "Yuborildi" : "Xatolik",
        errorMessage: response.ok && body.ok ? null : body.description ?? "Telegram xabari yuborilmadi"
      }
    });
  } catch (error) {
    return prisma.telegramPostLog.upsert({
      where: { examDateId },
      update: {
        status: "Xatolik",
        errorMessage: error instanceof Error ? error.message : "Noma'lum xatolik"
      },
      create: {
        examDateId,
        status: "Xatolik",
        errorMessage: error instanceof Error ? error.message : "Noma'lum xatolik"
      }
    });
  }
}
