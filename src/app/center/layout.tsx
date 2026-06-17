import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { requireUser } from "@/lib/auth";

const links = [
  { href: "/center/dashboard", label: "Dashboard" },
  { href: "/center/exams", label: "Imtihonlar" },
  { href: "/center/exams/new", label: "Yangi so'rov" },
  { href: "/center/profile", label: "Profil" }
];

export default async function CenterLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser(["CENTER_ADMIN"]);

  return (
    <>
      <AppHeader user={user} />
      <main className="min-h-[calc(100vh-73px)] bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <nav className="mb-6 flex gap-2 overflow-x-auto rounded-lg border bg-background/80 p-2 shadow-sm backdrop-blur">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
                {link.label}
              </Link>
            ))}
          </nav>
          {children}
        </div>
      </main>
    </>
  );
}
