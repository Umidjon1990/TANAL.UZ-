import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CentersPage() {
  const user = await getSessionUser();
  const centers = await prisma.testCenter.findMany({ where: { isActive: true }, orderBy: [{ region: "asc" }, { name: "asc" }] });

  return (
    <>
      <AppHeader user={user} />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-bold">Test markazlari</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {centers.map((center) => (
            <Card key={center.id}>
              <CardHeader><CardTitle>{center.name}</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>{center.region}, {center.district}</p>
                <p>{center.address}</p>
                <p>{center.phone}</p>
                <Button asChild size="sm" variant="outline"><Link href={`/centers/${center.id}`}>Batafsil</Link></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
