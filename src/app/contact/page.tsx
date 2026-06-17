import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth";

export default async function ContactPage() {
  const user = await getSessionUser();
  return (
    <>
      <AppHeader user={user} />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <Card>
          <CardHeader><CardTitle>Aloqa</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Savollar bo'yicha TANAL rasmiy test markazlari bilan bog'laning.</p>
            <p>Telegram integratsiya yoqilgandan keyin yangi e'lonlarni kanal orqali kuzatishingiz mumkin.</p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
