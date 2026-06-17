import Link from "next/link";
import { Plus } from "lucide-react";
import { toggleCenterAction } from "@/app/actions";
import { ConfirmButton } from "@/components/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCentersPage() {
  const centers = await prisma.testCenter.findMany({
    include: { _count: { select: { users: true, examDates: true } } },
    orderBy: [{ region: "asc" }, { name: "asc" }]
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Test markazlari</h1>
          <p className="text-sm text-muted-foreground">Markazlarni yaratish, tahrirlash va faolligini boshqarish.</p>
        </div>
        <Button asChild>
          <Link href="/admin/centers/new"><Plus className="h-4 w-4" /> Yangi markaz</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Markazlar ro'yxati</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomi</TableHead>
                <TableHead>Hudud</TableHead>
                <TableHead>Aloqa</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead>Amal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {centers.map((center) => (
                <TableRow key={center.id}>
                  <TableCell>
                    <Link className="font-medium text-primary hover:underline" href={`/admin/centers/${center.id}`}>{center.name}</Link>
                    <p className="text-xs text-muted-foreground">{center._count.examDates} ta imtihon, {center._count.users} ta admin</p>
                  </TableCell>
                  <TableCell>{center.region}, {center.district}</TableCell>
                  <TableCell>{center.phone}</TableCell>
                  <TableCell><Badge tone={center.isActive ? "success" : "neutral"}>{center.isActive ? "Faol" : "Faol emas"}</Badge></TableCell>
                  <TableCell>
                    <form action={toggleCenterAction}>
                      <input type="hidden" name="id" value={center.id} />
                      <input type="hidden" name="isActive" value={String(!center.isActive)} />
                      <ConfirmButton size="sm" variant="outline" message="Holatni o'zgartirishni tasdiqlaysizmi?">
                        {center.isActive ? "O'chirish" : "Faollashtirish"}
                      </ConfirmButton>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
