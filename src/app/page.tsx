import Image from "next/image";
import Link from "next/link";
import { Bot, CalendarDays, CheckCircle2, MapPin, Navigation, Search } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { ExamList } from "@/components/exam-list";
import { HeroMotion } from "@/components/hero-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getSessionUser();
  const now = new Date();
  const [exams, centers] = await Promise.all([
    prisma.examDate.findMany({
      where: { status: "APPROVED", examDate: { gte: now }, testCenter: { isActive: true } },
      include: { testCenter: true },
      orderBy: { examDate: "asc" },
      take: 6
    }),
    prisma.testCenter.findMany({ where: { isActive: true }, orderBy: [{ region: "asc" }, { name: "asc" }], take: 6 })
  ]);

  return (
    <>
      <AppHeader user={user} />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-sky-700 text-white">
          <div className="absolute inset-0 opacity-25">
            <Image src="/images/tanal-hero.png" alt="TANAL ta'lim platformasi" fill priority className="object-cover" />
          </div>
          <div className="relative mx-auto grid min-h-[620px] max-w-7xl gap-8 px-4 py-16 md:grid-cols-[1fr_420px] md:items-center">
            <HeroMotion>
              <p className="inline-flex rounded-md bg-white/10 px-3 py-1 text-sm backdrop-blur">TANAL arab tili sertifikat imtihonlari</p>
              <h1 className="max-w-3xl text-4xl font-bold tracking-normal md:text-6xl">Zamonaviy Ta'lim Tanal Loyihasi</h1>
              <p className="max-w-2xl text-lg text-blue-50">O'zbekistondagi rasmiy test markazlarining tasdiqlangan imtihon sanalarini tez, qulay va ishonchli kuzating.</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-amber-400 text-blue-950 hover:bg-amber-300"><Link href="/exams">Imtihonlarni ko'rish</Link></Button>
                <Button asChild variant="secondary"><Link href="/centers">Markazlar</Link></Button>
              </div>
            </HeroMotion>
            <Card className="border-white/20 bg-white/90 shadow-2xl backdrop-blur">
              <CardHeader>
                <CardTitle className="text-blue-950">Qidiruv</CardTitle>
              </CardHeader>
              <CardContent>
                <form action="/exams" className="space-y-3">
                  <Input name="region" placeholder="Viloyat" />
                  <Input name="month" type="month" />
                  <Input name="center" placeholder="Test markazi" />
                  <Button className="w-full"><Search className="h-4 w-4" /> Qidirish</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Yaqin imtihon sanalari</h2>
              <p className="text-muted-foreground">Faqat tasdiqlangan e'lonlar public ko'rinadi.</p>
            </div>
            <Button asChild variant="outline"><Link href="/exams">Barchasi</Link></Button>
          </div>
          <ExamList exams={exams} />
        </section>

        <section className="bg-muted/40 py-12">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-6 text-2xl font-semibold">Test markazlari</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {centers.map((center) => (
                <Card key={center.id} className="bg-background/85 shadow-sm">
                  <CardHeader>
                    <CardTitle>{center.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex gap-2"><MapPin className="h-4 w-4" /> {center.region}, {center.district}</p>
                    <p>{center.address}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button asChild variant="outline" size="sm"><Link href={`/centers/${center.id}`}>Batafsil</Link></Button>
                      {center.locationUrl ? (
                        <Button asChild variant="secondary" size="sm">
                          <a href={center.locationUrl} target="_blank" rel="noreferrer"><Navigation className="h-4 w-4" /> Lokatsiya</a>
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 md:grid-cols-3">
          {[
            ["1", "Markaz so'rov yuboradi", "Test markazi imtihon sanasini bosh administratorga yuboradi."],
            ["2", "Admin tasdiqlaydi", "Tasdiqlangan sanalar public sahifaga avtomatik chiqadi."],
            ["3", "Talaba ko'radi", "Talabalar markaz, sana, vaqt va aloqa ma'lumotlarini tekshiradi."]
          ].map(([step, title, text]) => (
            <Card key={step}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" /> {title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{text}</CardContent>
            </Card>
          ))}
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12">
          <div className="rounded-lg bg-gradient-to-r from-amber-300 to-yellow-500 p-6 text-blue-950 shadow-lg">
            <Bot className="h-8 w-8" />
            <h2 className="mt-3 text-2xl font-semibold">Telegram orqali kuzatib boring</h2>
            <p className="mt-2 max-w-2xl text-sm">Yangi tasdiqlangan imtihon sanalari Telegram kanalga yuborilishi uchun integratsiya tayyor.</p>
          </div>
        </section>
      </main>
    </>
  );
}
