import { AppHeader } from "@/components/app-header";
import { getSessionUser } from "@/lib/auth";

export default async function AboutPage() {
  const user = await getSessionUser();
  return (
    <>
      <AppHeader user={user} />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold">Loyiha haqida</h1>
        <p className="mt-4 text-muted-foreground">Zamonaviy Ta'lim Tanal Loyihasi talabalar uchun TANAL arab tili sertifikat imtihon sanalarini yagona, ishonchli va qulay ko'rinishda taqdim etadi.</p>
      </main>
    </>
  );
}
