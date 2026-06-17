import { notFound } from "next/navigation";
import { updateCenterExamAction } from "@/app/actions";
import { ExamForm } from "@/components/exam-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditCenterExamPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(["CENTER_ADMIN"]);
  if (!user.testCenterId) notFound();
  const { id } = await params;
  const exam = await prisma.examDate.findFirst({ where: { id, testCenterId: user.testCenterId } });
  if (!exam) notFound();

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>So'rovni tahrirlash</CardTitle>
        <p className="text-sm text-muted-foreground">Faqat tasdiqlash kutilayotgan so'rovni tahrirlash mumkin.</p>
      </CardHeader>
      <CardContent>
        <ExamForm action={updateCenterExamAction} exam={exam} submitLabel="So'rovni yangilash" />
      </CardContent>
    </Card>
  );
}
