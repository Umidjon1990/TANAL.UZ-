import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { statusLabels } from "@/lib/labels";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CenterDashboardPage() {
  const user = await requireUser(["CENTER_ADMIN"]);
  if (!user.testCenterId) throw new Error("Test markazi biriktirilmagan");

  const [center, counts] = await Promise.all([
    prisma.testCenter.findUniqueOrThrow({ where: { id: user.testCenterId } }),
    prisma.examDate.groupBy({
      by: ["status"],
      where: { testCenterId: user.testCenterId },
      _count: { status: true }
    })
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-gradient-to-r from-blue-700 to-sky-500 p-6 text-white shadow-lg">
        <p className="text-sm opacity-90">Test markazi paneli</p>
        <h1 className="mt-2 text-3xl font-bold">{center.name}</h1>
        <p className="mt-2 max-w-2xl text-sm opacity-90">Faqat o'z markazingizga tegishli imtihon so'rovlarini boshqarishingiz mumkin.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-5">
        {Object.entries(statusLabels).map(([status, label]) => {
          const item = counts.find((count) => count.status === status);
          return (
            <Card key={status}>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{item?._count.status ?? 0}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
