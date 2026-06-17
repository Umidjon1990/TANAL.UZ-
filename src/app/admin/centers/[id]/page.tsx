import { notFound } from "next/navigation";
import { updateCenterAction, toggleCenterAction } from "@/app/actions";
import { CenterForm } from "@/components/center-form";
import { ConfirmButton } from "@/components/confirm-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CenterDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const center = await prisma.testCenter.findUnique({ where: { id } });
  if (!center) notFound();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader>
          <CardTitle>Markazni tahrirlash</CardTitle>
        </CardHeader>
        <CardContent>
          <CenterForm action={updateCenterAction} center={center} submitLabel="O'zgarishlarni saqlash" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Holat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Joriy holat: {center.isActive ? "Faol" : "Faol emas"}</p>
          <form action={toggleCenterAction}>
            <input type="hidden" name="id" value={center.id} />
            <input type="hidden" name="isActive" value={String(!center.isActive)} />
            <ConfirmButton variant={center.isActive ? "destructive" : "default"} message="Markaz holatini o'zgartirishni tasdiqlaysizmi?">
              {center.isActive ? "Faolsizlantirish" : "Faollashtirish"}
            </ConfirmButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
