import type { ExamDate, TestCenter, TelegramPostLog } from "@prisma/client";
import { Clock, MapPin, Phone, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statusLabels, statusTone } from "@/lib/labels";
import { formatDate, formatMoney } from "@/lib/utils";

type ExamWithCenter = ExamDate & { testCenter: TestCenter; telegramPostLog?: TelegramPostLog | null };

export function ExamList({ exams, showStatus = false }: { exams: ExamWithCenter[]; showStatus?: boolean }) {
  if (exams.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Hozircha imtihon sanalari mavjud emas.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {exams.map((exam) => (
        <Card key={exam.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <CardTitle>{formatDate(exam.examDate)}</CardTitle>
              {showStatus ? <Badge tone={statusTone[exam.status]}>{statusLabels[exam.status]}</Badge> : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium">{exam.testCenter.name}</p>
              <p className="text-muted-foreground">{exam.testCenter.region}, {exam.testCenter.district}</p>
            </div>
            <p className="flex gap-2 text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {exam.testCenter.address}
            </p>
            <p className="flex gap-2 text-muted-foreground">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" />
              {exam.startTime} - {exam.endTime}
            </p>
            <p className="flex gap-2 text-muted-foreground">
              <Phone className="mt-0.5 h-4 w-4 shrink-0" />
              {exam.testCenter.phone}
            </p>
            <p className="flex gap-2 text-muted-foreground">
              <Users className="mt-0.5 h-4 w-4 shrink-0" />
              {exam.seatsLimit} ta joy
            </p>
            <div className="grid gap-1 border-t pt-3 text-muted-foreground">
              <span>To'lov: {formatMoney(exam.price)}</span>
              {exam.description ? <span>Izoh: {exam.description}</span> : null}
              {exam.rejectionReason ? <span>Rad etish sababi: {exam.rejectionReason}</span> : null}
              {exam.telegramPostLog ? <span>Telegram: {exam.telegramPostLog.status}</span> : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
