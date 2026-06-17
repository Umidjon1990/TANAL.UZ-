"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold">Xatolik yuz berdi</h1>
      <p className="text-muted-foreground">Iltimos, sahifani qayta yuklab ko'ring.</p>
      <Button onClick={reset}>Qayta urinish</Button>
    </main>
  );
}
