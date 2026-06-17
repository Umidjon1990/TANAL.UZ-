import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { ExamList } from "@/components/exam-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PublicCenterDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  const { id } = await params;
  const center = await prisma.testCenter.findFirst({
    where: { id, isActive: true },
    include: { examDates: { where: { status: "APPROVED", examDate: { gte: new Date() } }, include: { testCenter: true }, orderBy: { examDate: "asc" } } }
  });
  if (!center) notFound();

  return (
    <>
      <AppHeader user={user} />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>{center.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>{center.description}</p>
            <p>{center.region}, {center.district}</p>
            <p>{center.address}</p>
            <p>{center.phone}</p>
            {center.telegram ? <p>{center.telegram}</p> : null}
          </CardContent>
        </Card>
        <h2 className="mb-4 mt-8 text-2xl font-semibold">Tasdiqlangan imtihonlar</h2>
        <ExamList exams={center.examDates} />
      </main>
    </>
  );
}
