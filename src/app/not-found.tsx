import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold">Sahifa topilmadi</h1>
      <p className="text-muted-foreground">Kiritilgan manzil mavjud emas yoki ko'chirilgan.</p>
      <Button asChild>
        <Link href="/">Bosh sahifaga qaytish</Link>
      </Button>
    </main>
  );
}
