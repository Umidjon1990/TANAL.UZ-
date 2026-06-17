import { ActionForm } from "@/components/action-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CenterOption = { id: string; name: string };
type ExamValue = {
  id?: string;
  testCenterId?: string;
  examDate?: Date;
  startTime?: string;
  endTime?: string;
  seatsLimit?: number;
  price?: number;
  description?: string | null;
};

function dateInputValue(date?: Date) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function ExamForm({
  action,
  centers,
  exam,
  submitLabel,
  showCenter = false
}: {
  action: (state: unknown, formData: FormData) => Promise<{ ok: boolean; message: string } | undefined>;
  centers?: CenterOption[];
  exam?: ExamValue;
  submitLabel: string;
  showCenter?: boolean;
}) {
  return (
    <ActionForm action={action} submitLabel={submitLabel}>
      {exam?.id ? <input type="hidden" name="id" value={exam.id} /> : null}
      {showCenter ? (
        <label className="block space-y-2">
          <span className="text-sm font-medium">Test markazi</span>
          <select name="testCenterId" required defaultValue={exam?.testCenterId ?? ""} className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Tanlang</option>
            {(centers ?? []).map((center) => (
              <option key={center.id} value={center.id}>{center.name}</option>
            ))}
          </select>
        </label>
      ) : null}
      <Field name="examDate" label="Imtihon sanasi" type="date" defaultValue={dateInputValue(exam?.examDate)} />
      <Field name="startTime" label="Boshlanish vaqti" type="time" defaultValue={exam?.startTime} />
      <Field name="endTime" label="Tugash vaqti" type="time" defaultValue={exam?.endTime} />
      <Field name="seatsLimit" label="Joylar soni" type="number" defaultValue={exam?.seatsLimit?.toString()} />
      <Field name="price" label="Narx" type="number" defaultValue={exam?.price?.toString()} />
      <label className="block space-y-2">
        <span className="text-sm font-medium">Izoh</span>
        <Textarea name="description" defaultValue={exam?.description ?? ""} />
      </label>
    </ActionForm>
  );
}

function Field({
  name,
  label,
  type,
  defaultValue
}: {
  name: string;
  label: string;
  type: string;
  defaultValue?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <Input name={name} type={type} defaultValue={defaultValue ?? ""} required />
    </label>
  );
}
