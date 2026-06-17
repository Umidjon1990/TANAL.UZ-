import { AppHeader } from "@/components/app-header";
import { ExamList } from "@/components/exam-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getMonthRange(month?: string) {
  if (!month) return { gte: new Date() };
  const [year, monthIndex] = month.split("-").map(Number);
  if (!year || !monthIndex) return { gte: new Date() };

  const start = new Date(Date.UTC(year, monthIndex - 1, 1));
  const end = new Date(Date.UTC(year, monthIndex, 1));
  return { gte: start, lt: end };
}

export default async function ExamsPage({ searchParams }: { searchParams: Promise<{ region?: string; month?: string; center?: string }> }) {
  const user = await getSessionUser();
  const params = await searchParams;
  const [exams, regions, centers] = await Promise.all([
    prisma.examDate.findMany({
      where: {
        status: "APPROVED",
        examDate: getMonthRange(params.month),
        testCenter: {
          isActive: true,
          region: params.region ? { equals: params.region } : undefined,
          name: params.center ? { contains: params.center, mode: "insensitive" } : undefined
        }
      },
      include: { testCenter: true },
      orderBy: { examDate: "asc" }
    }),
    prisma.testCenter.findMany({
      where: { isActive: true },
      select: { region: true },
      distinct: ["region"],
      orderBy: { region: "asc" }
    }),
    prisma.testCenter.findMany({
      where: { isActive: true },
      select: { name: true },
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <>
      <AppHeader user={user} />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-lg bg-gradient-to-r from-blue-800 to-sky-600 p-6 text-white shadow-lg">
          <p className="text-sm text-blue-100">Mavjud test kunlari</p>
          <h1 className="mt-2 text-3xl font-bold">Tasdiqlangan TANAL imtihon sanalari</h1>
          <p className="mt-2 max-w-2xl text-blue-50">Oy, viloyat va test markazi bo'yicha qidiring. Faqat bosh administrator tasdiqlagan e'lonlar ko'rsatiladi.</p>
        </div>
        <Card className="my-6 shadow-sm">
          <CardContent className="pt-5">
            <form className="grid gap-3 md:grid-cols-4">
              <label className="space-y-2">
                <span className="text-sm font-medium">Oy</span>
                <Input name="month" type="month" defaultValue={params.month ?? ""} />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Viloyat</span>
                <select name="region" defaultValue={params.region ?? ""} className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="">Barcha viloyatlar</option>
                  {regions.map((item) => (
                    <option key={item.region} value={item.region}>{item.region}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Test markazi</span>
                <Input name="center" list="centers" placeholder="Markaz nomi" defaultValue={params.center ?? ""} />
                <datalist id="centers">
                  {centers.map((center) => <option key={center.name} value={center.name} />)}
                </datalist>
              </label>
              <div className="flex items-end">
                <Button className="w-full">Qidirish</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Topilgan test kunlari: <span className="font-semibold text-foreground">{exams.length}</span></p>
          <Button asChild variant="outline"><a href="/exams">Filtrlarni tozalash</a></Button>
        </div>
        <ExamList exams={exams} />
      </main>
    </>
  );
}
