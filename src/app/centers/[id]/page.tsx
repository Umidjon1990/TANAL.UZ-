import { notFound } from "next/navigation";
import { MapPin, Navigation, Phone, Send } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { ExamList } from "@/components/exam-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PublicCenterDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  const { id } = await params;
  const center = await prisma.testCenter.findFirst({
    where: { id, isActive: true },
    include: { examDates: { where: { status: "APPROVED", examDate: { gte: new Date() } }, include: { testCenter: true }, orderBy: { examDate: "asc" } } }
  });
  if (!center) notFound();

  return (
    <>
      <AppHeader user={user} />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-800 to-sky-600 p-6 text-white">
            <p className="text-sm text-blue-100">Test markazi</p>
            <h1 className="mt-2 text-3xl font-bold">{center.name}</h1>
            <p className="mt-2 text-blue-50">{center.region}, {center.district}</p>
          </div>
          <CardHeader>
            <CardTitle>Markaz ma'lumotlari</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>{center.description}</p>
            <p className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {center.address}</p>
            <p className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0" /> {center.phone}</p>
            {center.telegram ? <p className="flex gap-2"><Send className="mt-0.5 h-4 w-4 shrink-0" /> {center.telegram}</p> : null}
            {center.locationUrl ? (
              <Button asChild className="mt-3">
                <a href={center.locationUrl} target="_blank" rel="noreferrer"><Navigation className="h-4 w-4" /> Xaritada ko'rish</a>
              </Button>
            ) : null}
          </CardContent>
        </Card>
        <div className="mb-4 mt-8">
          <p className="text-sm text-muted-foreground">Mavjud test kunlari</p>
          <h2 className="text-2xl font-semibold">Tasdiqlangan imtihonlar</h2>
        </div>
        <ExamList exams={center.examDates} />
      </main>
    </>
  );
}
