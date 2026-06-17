import Link from "next/link";
import { cancelCenterExamAction } from "@/app/actions";
import { ConfirmButton } from "@/components/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireUser } from "@/lib/auth";
import { statusLabels, statusTone } from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import { formatDate, formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CenterExamsPage() {
  const user = await requireUser(["CENTER_ADMIN"]);
  if (!user.testCenterId) throw new Error("Test markazi biriktirilmagan");

  const exams = await prisma.examDate.findMany({
    where: { testCenterId: user.testCenterId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Mening imtihon so'rovlarim</CardTitle>
        <Button asChild><Link href="/center/exams/new">Yangi so'rov</Link></Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sana</TableHead>
              <TableHead>Vaqt</TableHead>
              <TableHead>Joy/Narx</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.map((exam) => (
              <TableRow key={exam.id}>
                <TableCell>{formatDate(exam.examDate)}</TableCell>
                <TableCell>{exam.startTime} - {exam.endTime}</TableCell>
                <TableCell>{exam.seatsLimit} ta joy, {formatMoney(exam.price)}</TableCell>
                <TableCell>
                  <Badge tone={statusTone[exam.status]}>{statusLabels[exam.status]}</Badge>
                  {exam.rejectionReason ? <p className="mt-1 text-xs text-red-700">Sabab: {exam.rejectionReason}</p> : null}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {exam.status === "PENDING" ? <Button size="sm" variant="outline" asChild><Link href={`/center/exams/${exam.id}`}>Tahrirlash</Link></Button> : null}
                    {exam.status !== "APPROVED" && exam.status !== "CANCELLED" ? (
                      <form action={cancelCenterExamAction}>
                        <input type="hidden" name="id" value={exam.id} />
                        <ConfirmButton size="sm" variant="destructive" message="So'rovni bekor qilasizmi?">Bekor qilish</ConfirmButton>
                      </form>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
