import { AdminExamsTable } from "@/components/admin-exams-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PendingExamsPage() {
  const exams = await prisma.examDate.findMany({
    where: { status: "PENDING" },
    include: { testCenter: true, telegramPostLog: true },
    orderBy: { createdAt: "asc" }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasdiqlash kutilayotgan so'rovlar</CardTitle>
      </CardHeader>
      <CardContent>
        <AdminExamsTable exams={exams} />
      </CardContent>
    </Card>
  );
}
