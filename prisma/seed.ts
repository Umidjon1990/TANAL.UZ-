import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.SUPER_ADMIN_USERNAME ?? "superadmin";
  const password = process.env.SUPER_ADMIN_PASSWORD ?? "Parolni_almashtiring_123";
  const passwordHash = await bcrypt.hash(password, 12);

  const center = await prisma.testCenter.upsert({
    where: { id: "seed-toshkent-tanal" },
    update: {
      name: "TANAL Toshkent markazi",
      isActive: true
    },
    create: {
      id: "seed-toshkent-tanal",
      name: "TANAL Toshkent markazi",
      description: "Arab tili sertifikat imtihonlari uchun namunaviy test markazi.",
      imageUrl: "/images/center-placeholder.jpg",
      region: "Toshkent shahri",
      district: "Yunusobod tumani",
      address: "Amir Temur ko'chasi, 15-uy",
      locationUrl: "https://maps.google.com",
      phone: "+998 90 123 45 67",
      telegram: "@tanal_toshkent"
    }
  });

  await prisma.user.upsert({
    where: { username },
    update: {
      name: "Bosh administrator",
      passwordHash,
      role: "SUPER_ADMIN",
      testCenterId: null,
      isActive: true
    },
    create: {
      name: "Bosh administrator",
      username,
      passwordHash,
      role: "SUPER_ADMIN"
    }
  });

  await prisma.news.upsert({
    where: { slug: "tanal-platformasi-ishga-tushdi" },
    update: {},
    create: {
      title: "TANAL imtihon sanalari platformasi ishga tushdi",
      slug: "tanal-platformasi-ishga-tushdi",
      content: "Endi talabalar tasdiqlangan TANAL imtihon sanalarini bitta platformada kuzatishi mumkin.",
      isPublished: true,
      publishedAt: new Date()
    }
  });

  await prisma.auditLog.create({
    data: {
      action: "SEED",
      entityType: "Project",
      entityId: center.id,
      details: { message: "Boshlang'ich ma'lumotlar yaratildi" }
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
