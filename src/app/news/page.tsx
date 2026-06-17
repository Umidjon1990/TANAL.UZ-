import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const user = await getSessionUser();
  const news = await prisma.news.findMany({ where: { isPublished: true }, orderBy: { publishedAt: "desc" } });

  return (
    <>
      <AppHeader user={user} />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold">Yangiliklar</h1>
        <div className="mt-6 grid gap-4">
          {news.map((item) => (
            <Card key={item.id}>
              <CardHeader><CardTitle>{item.title}</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{item.content}</p>
                <Link href={`/news/${item.slug}`} className="mt-3 inline-flex text-primary hover:underline">Batafsil</Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
