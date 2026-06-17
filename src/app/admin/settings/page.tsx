import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  const checks = [
    ["DATABASE_URL", Boolean(process.env.DATABASE_URL)],
    ["AUTH_SECRET", Boolean(process.env.AUTH_SECRET)],
    ["TELEGRAM_BOT_TOKEN", Boolean(process.env.TELEGRAM_BOT_TOKEN)],
    ["TELEGRAM_CHANNEL_ID", Boolean(process.env.TELEGRAM_CHANNEL_ID)],
    ["NEXT_PUBLIC_SITE_URL", Boolean(process.env.NEXT_PUBLIC_SITE_URL)]
  ];

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Production sozlamalari</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {checks.map(([name, ok]) => (
          <div key={String(name)} className="flex items-center justify-between rounded-md border p-3">
            <span>{name}</span>
            <span className={ok ? "text-emerald-700" : "text-amber-700"}>{ok ? "Sozlangan" : "Kiritilmagan"}</span>
          </div>
        ))}
        <p className="text-muted-foreground">Telegram sozlanmagan bo'lsa ham tasdiqlash ishlaydi, xatolik Telegram logiga yoziladi.</p>
      </CardContent>
    </Card>
  );
}
