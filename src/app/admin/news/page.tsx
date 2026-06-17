import { createNewsAction } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const news = await prisma.news.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Card>
        <CardHeader><CardTitle>Yangilik qo'shish</CardTitle></CardHeader>
        <CardContent>
          <ActionForm action={createNewsAction} submitLabel="Yangilikni saqlash">
            <label className="block space-y-2"><span className="text-sm font-medium">Sarlavha</span><Input name="title" required /></label>
            <label className="block space-y-2"><span className="text-sm font-medium">Slug</span><Input name="slug" placeholder="yangilik-slugi" required /></label>
            <label className="block space-y-2"><span className="text-sm font-medium">Rasm havolasi</span><Input name="imageUrl" /></label>
            <label className="block space-y-2"><span className="text-sm font-medium">Matn</span><Textarea name="content" required /></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isPublished" /> Nashr qilish</label>
          </ActionForm>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Yangiliklar</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Sarlavha</TableHead><TableHead>Slug</TableHead><TableHead>Holat</TableHead><TableHead>Sana</TableHead></TableRow></TableHeader>
            <TableBody>
              {news.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.slug}</TableCell>
                  <TableCell><Badge tone={item.isPublished ? "success" : "neutral"}>{item.isPublished ? "Nashr qilingan" : "Qoralama"}</Badge></TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
