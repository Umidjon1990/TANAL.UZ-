import { ActionForm } from "@/components/action-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CenterFormValue = {
  id?: string;
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  region?: string;
  district?: string;
  address?: string;
  locationUrl?: string | null;
  phone?: string;
  telegram?: string | null;
};

export function CenterForm({
  action,
  center,
  submitLabel
}: {
  action: (state: unknown, formData: FormData) => Promise<{ ok: boolean; message: string } | undefined>;
  center?: CenterFormValue;
  submitLabel: string;
}) {
  return (
    <ActionForm action={action} submitLabel={submitLabel}>
      {center?.id ? <input type="hidden" name="id" value={center.id} /> : null}
      <Field name="name" label="Markaz nomi" defaultValue={center?.name} />
      <Field name="region" label="Viloyat yoki shahar" defaultValue={center?.region} />
      <Field name="district" label="Tuman yoki hudud" defaultValue={center?.district} />
      <Field name="address" label="Manzil" defaultValue={center?.address} />
      <Field name="locationUrl" label="Lokatsiya havolasi" defaultValue={center?.locationUrl ?? ""} required={false} />
      <Field name="phone" label="Telefon" defaultValue={center?.phone} />
      <Field name="telegram" label="Telegram" defaultValue={center?.telegram ?? ""} required={false} />
      <Field name="imageUrl" label="Rasm havolasi" defaultValue={center?.imageUrl ?? ""} required={false} />
      <label className="block space-y-2">
        <span className="text-sm font-medium">Tavsif</span>
        <Textarea name="description" defaultValue={center?.description ?? ""} />
      </label>
    </ActionForm>
  );
}

function Field({
  name,
  label,
  defaultValue,
  required = true
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <Input name={name} defaultValue={defaultValue ?? ""} required={required} />
    </label>
  );
}
