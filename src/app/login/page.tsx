import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { LoginForm } from "@/components/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect(user.role === "SUPER_ADMIN" ? "/admin" : "/center");

  return (
    <>
      <AppHeader />
      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md items-center px-4 py-10">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Boshqaruv paneliga kirish</CardTitle>
            <p className="text-sm text-muted-foreground">Hisobni faqat bosh administrator yaratadi.</p>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
