import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NewsDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await getSessionUser();
  const { slug } = await params;
  const item = await prisma.news.findFirst({ where: { slug, isPublished: true } });
  if (!item) notFound();

  return (
    <>
      <AppHeader user={user} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-muted-foreground">{item.publishedAt ? formatDate(item.publishedAt) : "Nashr qilinmagan"}</p>
        <h1 className="mt-2 text-3xl font-bold">{item.title}</h1>
        <article className="prose prose-slate mt-6 max-w-none whitespace-pre-line text-muted-foreground">{item.content}</article>
      </main>
    </>
  );
}
