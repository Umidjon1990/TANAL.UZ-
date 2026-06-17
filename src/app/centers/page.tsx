import Link from "next/link";
import { CalendarDays, MapPin, Navigation, Phone } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CentersPage() {
  const user = await getSessionUser();
  const centers = await prisma.testCenter.findMany({
    where: { isActive: true },
    include: {
      examDates: {
        where: { status: "APPROVED", examDate: { gte: new Date() } },
        orderBy: { examDate: "asc" },
        take: 4
      }
    },
    orderBy: [{ region: "asc" }, { name: "asc" }]
  });

  return (
    <>
      <AppHeader user={user} />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-lg bg-gradient-to-r from-blue-800 to-sky-600 p-6 text-white shadow-lg">
          <p className="text-sm text-blue-100">TANAL test markazlari</p>
          <h1 className="mt-2 text-3xl font-bold">O'zingizga yaqin markazni toping</h1>
          <p className="mt-2 max-w-2xl text-blue-50">Har bir markaz kartasida manzil, aloqa, lokatsiya va mavjud test kunlari ko'rsatiladi.</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {centers.map((center) => (
            <Card key={center.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{center.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{center.region}, {center.district}</p>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {center.address}</p>
                <p className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0" /> {center.phone}</p>
                <div className="rounded-md bg-muted/60 p-3">
                  <p className="mb-2 flex items-center gap-2 font-medium text-foreground">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Mavjud test kunlari
                  </p>
                  {center.examDates.length ? (
                    <div className="flex flex-wrap gap-2">
                      {center.examDates.map((exam) => (
                        <Link key={exam.id} href={`/exams?center=${encodeURIComponent(center.name)}`} className="rounded-md bg-background px-2 py-1 text-xs font-medium text-foreground ring-1 ring-border">
                          {formatDate(exam.examDate)} · {exam.startTime}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs">Hozircha tasdiqlangan test kuni yo'q.</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button asChild size="sm" variant="outline"><Link href={`/centers/${center.id}`}>Batafsil</Link></Button>
                  {center.locationUrl ? (
                    <Button asChild size="sm" variant="secondary">
                      <a href={center.locationUrl} target="_blank" rel="noreferrer"><Navigation className="h-4 w-4" /> Lokatsiya</a>
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
