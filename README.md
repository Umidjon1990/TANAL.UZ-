# Zamonaviy Ta'lim Tanal Loyihasi

TANAL arab tili sertifikat imtihon sanalarini O'zbekistondagi test markazlari bo'yicha ko'rsatadigan public va admin platforma.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui uslubidagi reusable komponentlar
- Prisma
- PostgreSQL
- Secure credentials auth
- Telegram Bot API
- Railway-ready deployment

## Rollar

- `SUPER_ADMIN`: barcha markazlar, foydalanuvchilar, imtihon so'rovlari, yangiliklar va sozlamalarni boshqaradi.
- `CENTER_ADMIN`: faqat o'ziga biriktirilgan test markazi ma'lumotlari va imtihon so'rovlarini ko'radi.
- Public user: ro'yxatdan o'tmaydi, faqat tasdiqlangan public ma'lumotlarni ko'radi.

## Muhim qoidalar

- Public registration yo'q.
- Foydalanuvchini faqat Super Admin yaratadi.
- Parollar `bcrypt` bilan hash qilinadi.
- Center Admin boshqa markaz ma'lumotiga kira olmaydi.
- Center Admin o'z so'rovini tasdiqlay olmaydi.
- Public sahifalarda faqat `APPROVED` imtihon sanalari ko'rinadi.
- Telegram xabari yuborilmasa ham tasdiqlash jarayoni to'xtamaydi, xato `TelegramPostLog` jadvaliga yoziladi.

## Statuslar

- `PENDING` - Tasdiqlash kutilmoqda
- `APPROVED` - Tasdiqlandi
- `REJECTED` - Rad etildi
- `CANCELLED` - Bekor qilindi
- `EXPIRED` - Muddati o'tgan

## Environment

`.env.example` faylidan `.env` yarating:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tanal?schema=public"
AUTH_SECRET="kamida-32-belgidan-iborat-maxfiy-kalitni-bu-yerga-yozing"
SUPER_ADMIN_USERNAME="superadmin"
SUPER_ADMIN_PASSWORD="Parolni_almashtiring_123"
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHANNEL_ID=""
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## Lokal ishga tushirish

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Seed login:

- Login: `superadmin`
- Parol: `Parolni_almashtiring_123`

Productionda seed parolini env orqali almashtiring.

## Prisma

Migration fayllari `prisma/migrations` ichida saqlanadi.

Development:

```bash
npm run prisma:migrate
```

Production/Railway:

```bash
npm run prisma:deploy
```

Seed:

```bash
npm run prisma:seed
```

## Asosiy route'lar

Public:

- `/`
- `/exams`
- `/centers`
- `/centers/[id]`
- `/news`
- `/about`
- `/contact`

Auth:

- `/login`

Super Admin:

- `/admin/dashboard`
- `/admin/centers`
- `/admin/centers/new`
- `/admin/centers/[id]`
- `/admin/users`
- `/admin/exams`
- `/admin/exams/pending`
- `/admin/news`
- `/admin/settings`

Center Admin:

- `/center/dashboard`
- `/center/exams`
- `/center/exams/new`
- `/center/exams/[id]`
- `/center/profile`

## Telegram

Super Admin imtihon sanasini tasdiqlaganda `sendExamApprovedPostToTelegram` ishlaydi.

Xabar formati Uzbek Latin:

```text
📢 Yangi TANAL imtihon sanasi

🏢 Markaz: {centerName}
📍 Hudud: {region}, {district}
🗓 Sana: {examDate}
⏰ Vaqt: {startTime} - {endTime}
👥 Joylar soni: {seatsLimit}
💰 Narx: {price}
📞 Bog'lanish: {phone}
🔗 Batafsil: {examUrl}
```

Duplicate postdan himoya: `TelegramPostLog.examDateId` unique.

## Railway deploy

1. GitHub repo yarating va kodni push qiling.
2. Railway’da yangi project oching.
3. PostgreSQL plugin qo'shing.
4. Railway env variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `SUPER_ADMIN_USERNAME`
   - `SUPER_ADMIN_PASSWORD`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHANNEL_ID`
   - `NEXT_PUBLIC_SITE_URL`
5. Deploy command `railway.json` orqali:

```bash
npm run prisma:deploy && npm run start
```

6. Birinchi deploydan keyin seed kerak bo'lsa:

```bash
npm run prisma:seed
```

## Tekshiruv

```bash
npm run build
npm exec tsc -- --noEmit
```

## Security checklist

- `AUTH_SECRET` productionda uzun va maxfiy bo'lishi kerak.
- Public registration yo'q.
- `/admin/*` faqat Super Admin uchun.
- `/center/*` faqat Center Admin uchun.
- Center Admin so'rovlari server tomonda `testCenterId` orqali filtrlanadi.
- Public querylarda `status: APPROVED` va `testCenter.isActive: true` ishlatiladi.
