import { updateExamStatusAction } from "@/app/actions";
import { ConfirmButton } from "@/components/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { statusLabels, statusTone } from "@/lib/labels";
import { formatDate, formatMoney } from "@/lib/utils";

type ExamRow = {
  id: string;
  examDate: Date;
  startTime: string;
  endTime: string;
  seatsLimit: number;
  price: number;
  status: keyof typeof statusLabels;
  rejectionReason: string | null;
  testCenter: { name: string; region: string; district: string; phone: string };
  telegramPostLog?: { status: string; errorMessage: string | null } | null;
};

export function AdminExamsTable({ exams }: { exams: ExamRow[] }) {
  if (exams.length === 0) {
    return <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Imtihon so'rovlari mavjud emas.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Markaz</TableHead>
            <TableHead>Sana</TableHead>
            <TableHead>Joy/Narx</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Telegram</TableHead>
            <TableHead>Amallar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell>
                <p className="font-medium">{exam.testCenter.name}</p>
                <p className="text-xs text-muted-foreground">{exam.testCenter.region}, {exam.testCenter.district}</p>
              </TableCell>
              <TableCell>
                <p>{formatDate(exam.examDate)}</p>
                <p className="text-xs text-muted-foreground">{exam.startTime} - {exam.endTime}</p>
              </TableCell>
              <TableCell>
                <p>{exam.seatsLimit} ta joy</p>
                <p className="text-xs text-muted-foreground">{formatMoney(exam.price)}</p>
              </TableCell>
              <TableCell>
                <Badge tone={statusTone[exam.status]}>{statusLabels[exam.status]}</Badge>
                {exam.rejectionReason ? <p className="mt-1 text-xs text-red-700">{exam.rejectionReason}</p> : null}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {exam.telegramPostLog ? (
                  <>
                    <p>{exam.telegramPostLog.status}</p>
                    {exam.telegramPostLog.errorMessage ? <p className="text-red-700">{exam.telegramPostLog.errorMessage}</p> : null}
                  </>
                ) : "Yuborilmagan"}
              </TableCell>
              <TableCell>
                <div className="flex min-w-64 flex-wrap gap-2">
                  {exam.status !== "APPROVED" ? (
                    <form action={updateExamStatusAction}>
                      <input type="hidden" name="id" value={exam.id} />
                      <input type="hidden" name="status" value="APPROVED" />
                      <Button size="sm">Tasdiqlash</Button>
                    </form>
                  ) : null}
                  {exam.status === "APPROVED" ? (
                    <form action={updateExamStatusAction}>
                      <input type="hidden" name="id" value={exam.id} />
                      <input type="hidden" name="status" value="CANCELLED" />
                      <ConfirmButton size="sm" variant="outline" message="Tasdiqlangan imtihonni bekor qilasizmi?">Bekor qilish</ConfirmButton>
                    </form>
                  ) : null}
                  {exam.status === "PENDING" ? (
                    <form action={updateExamStatusAction} className="flex gap-2">
                      <input type="hidden" name="id" value={exam.id} />
                      <input type="hidden" name="status" value="REJECTED" />
                      <Input name="rejectionReason" placeholder="Rad etish sababi" className="h-9 w-40" required />
                      <ConfirmButton size="sm" variant="destructive" message="So'rovni rad etishni tasdiqlaysizmi?">Rad etish</ConfirmButton>
                    </form>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
