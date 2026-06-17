import { createExamAction } from "@/app/actions";
import { AdminExamsTable } from "@/components/admin-exams-table";
import { ExamForm } from "@/components/exam-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminExamsPage() {
  const [exams, centers] = await Promise.all([
    prisma.examDate.findMany({
      include: { testCenter: true, telegramPostLog: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.testCenter.findMany({ where: { isActive: true }, orderBy: { name: "asc" } })
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Barcha imtihon so'rovlari</h1>
        <p className="text-sm text-muted-foreground">Super Admin barcha markazlarning imtihon sanalarini ko'radi va boshqaradi.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Admin nomidan imtihon qo'shish</CardTitle>
          </CardHeader>
          <CardContent>
            <ExamForm action={createExamAction} centers={centers} showCenter submitLabel="Tasdiqlab e'lon qilish" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Imtihonlar jadvali</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminExamsTable exams={exams} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
