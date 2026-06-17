import { CalendarCheck, Clock3, Newspaper, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [centers, pending, approved, users, news, telegramErrors] = await Promise.all([
    prisma.testCenter.count(),
    prisma.examDate.count({ where: { status: "PENDING" } }),
    prisma.examDate.count({ where: { status: "APPROVED" } }),
    prisma.user.count({ where: { role: "CENTER_ADMIN" } }),
    prisma.news.count(),
    prisma.telegramPostLog.count({ where: { status: { not: "Yuborildi" } } })
  ]);

  const stats = [
    { label: "Test markazlari", value: centers, icon: Users },
    { label: "Kutilayotgan so'rovlar", value: pending, icon: Clock3 },
    { label: "Tasdiqlangan imtihonlar", value: approved, icon: CalendarCheck },
    { label: "Yangiliklar", value: news, icon: Newspaper }
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-gradient-to-r from-sky-700 via-blue-700 to-amber-500 p-6 text-white shadow-lg">
        <p className="text-sm opacity-90">Bosh administrator</p>
        <h1 className="mt-2 text-3xl font-bold">TANAL boshqaruv markazi</h1>
        <p className="mt-2 max-w-2xl text-sm opacity-90">Tasdiqlash navbati, markazlar, administratorlar va public e'lonlar ustidan to'liq nazorat.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label} className="bg-background/85 shadow-sm backdrop-blur">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm text-muted-foreground">{item.label}</CardTitle>
              <item.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Telegram holati</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Telegram yuborishda xatolik yoki sozlanmagan postlar: {telegramErrors}.
        </CardContent>
      </Card>
    </div>
  );
}
