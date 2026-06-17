import { createExamAction } from "@/app/actions";
import { ExamForm } from "@/components/exam-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewCenterExamPage() {
  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Yangi imtihon sanasi so'rovi</CardTitle>
      </CardHeader>
      <CardContent>
        <ExamForm action={createExamAction} submitLabel="Tasdiqlashga yuborish" />
      </CardContent>
    </Card>
  );
}
