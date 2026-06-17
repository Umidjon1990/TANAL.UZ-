import { AppHeader } from "@/components/app-header";
import { ExamList } from "@/components/exam-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ExamsPage({ searchParams }: { searchParams: Promise<{ region?: string; date?: string; center?: string }> }) {
  const user = await getSessionUser();
  const params = await searchParams;
  const exams = await prisma.examDate.findMany({
    where: {
      status: "APPROVED",
      examDate: params.date ? { gte: new Date(params.date) } : { gte: new Date() },
      testCenter: {
        isActive: true,
        region: params.region ? { contains: params.region, mode: "insensitive" } : undefined,
        name: params.center ? { contains: params.center, mode: "insensitive" } : undefined
      }
    },
    include: { testCenter: true },
    orderBy: { examDate: "asc" }
  });

  return (
    <>
      <AppHeader user={user} />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-bold">Tasdiqlangan imtihon sanalari</h1>
        <p className="mt-2 text-muted-foreground">Talabalar uchun ochiq TANAL imtihon e'lonlari.</p>
        <Card className="my-6">
          <CardContent className="pt-5">
            <form className="grid gap-3 md:grid-cols-4">
              <Input name="region" placeholder="Hudud" defaultValue={params.region ?? ""} />
              <Input name="date" type="date" defaultValue={params.date ?? ""} />
              <Input name="center" placeholder="Test markazi" defaultValue={params.center ?? ""} />
              <Button>Filtrlash</Button>
            </form>
          </CardContent>
        </Card>
        <ExamList exams={exams} />
      </main>
    </>
  );
}
