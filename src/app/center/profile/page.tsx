import { updateCenterProfileAction } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CenterProfilePage() {
  const user = await requireUser(["CENTER_ADMIN"]);
  if (!user.testCenterId) throw new Error("Test markazi biriktirilmagan");
  const center = await prisma.testCenter.findUniqueOrThrow({ where: { id: user.testCenterId } });

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Markaz profili</CardTitle>
        <p className="text-sm text-muted-foreground">Center admin faqat aloqa va tavsif maydonlarini yangilashi mumkin.</p>
      </CardHeader>
      <CardContent>
        <ActionForm action={updateCenterProfileAction} submitLabel="Profilni saqlash">
          <label className="block space-y-2">
            <span className="text-sm font-medium">Telefon</span>
            <Input name="phone" defaultValue={center.phone} required />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium">Telegram</span>
            <Input name="telegram" defaultValue={center.telegram ?? ""} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium">Tavsif</span>
            <Textarea name="description" defaultValue={center.description ?? ""} />
          </label>
        </ActionForm>
      </CardContent>
    </Card>
  );
}
