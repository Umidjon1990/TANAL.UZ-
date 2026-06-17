import { createCenterAdminAction, resetCenterAdminPasswordAction, toggleUserAction } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { ConfirmButton } from "@/components/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const [centers, users] = await Promise.all([
    prisma.testCenter.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.user.findMany({ where: { role: "CENTER_ADMIN" }, include: { testCenter: true }, orderBy: { createdAt: "desc" } })
  ]);

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Markaz administratori yaratish</CardTitle>
        </CardHeader>
        <CardContent>
          <ActionForm action={createCenterAdminAction} submitLabel="Login yaratish">
            <Field name="name" label="Ism-familiya" />
            <Field name="username" label="Login" />
            <Field name="password" label="Boshlang'ich parol" type="password" />
            <label className="block space-y-2">
              <span className="text-sm font-medium">Test markazi</span>
              <select name="testCenterId" required className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="">Tanlang</option>
                {centers.map((center) => (
                  <option key={center.id} value={center.id}>{center.name}</option>
                ))}
              </select>
            </label>
          </ActionForm>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Center adminlar</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foydalanuvchi</TableHead>
                <TableHead>Markaz</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead>Parol reset</TableHead>
                <TableHead>Aktivlik</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.username}</p>
                  </TableCell>
                  <TableCell>{user.testCenter?.name ?? "Biriktirilmagan"}</TableCell>
                  <TableCell><Badge tone={user.isActive ? "success" : "neutral"}>{user.isActive ? "Faol" : "Faol emas"}</Badge></TableCell>
                  <TableCell>
                    <ActionForm action={resetCenterAdminPasswordAction} submitLabel="Yangilash">
                      <input type="hidden" name="userId" value={user.id} />
                      <Input name="password" type="password" placeholder="Yangi parol" required className="h-9" />
                    </ActionForm>
                  </TableCell>
                  <TableCell>
                    <form action={toggleUserAction}>
                      <input type="hidden" name="id" value={user.id} />
                      <input type="hidden" name="isActive" value={String(!user.isActive)} />
                      <ConfirmButton size="sm" variant="outline" message="Foydalanuvchi holatini o'zgartirishni tasdiqlaysizmi?">
                        {user.isActive ? "O'chirish" : "Faollashtirish"}
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

function Field({ name, label, type = "text" }: { name: string; label: string; type?: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <Input name={name} type={type} required />
    </label>
  );
}
