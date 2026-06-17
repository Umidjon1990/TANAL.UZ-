import Link from "next/link";
import { CalendarDays, LogOut, Menu } from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function AppHeader({ user }: { user?: SessionUser | null }) {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <CalendarDays className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">Zamonaviy Ta'lim Tanal Loyihasi</span>
          <span className="sm:hidden">TANAL</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link className="hidden rounded-md px-3 py-2 hover:bg-accent md:inline-flex" href="/exams">
            Imtihonlar
          </Link>
          <Link className="hidden rounded-md px-3 py-2 hover:bg-accent md:inline-flex" href="/centers">
            Markazlar
          </Link>
          <Link className="hidden rounded-md px-3 py-2 hover:bg-accent md:inline-flex" href="/news">
            Yangiliklar
          </Link>
          {user ? (
            <>
              <Link className="rounded-md px-3 py-2 hover:bg-accent" href={user.role === "SUPER_ADMIN" ? "/admin/dashboard" : "/center/dashboard"}>
                Boshqaruv
              </Link>
              <form action={logoutAction}>
                <Button variant="ghost" size="icon" title="Chiqish">
                  <LogOut className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <Link className="rounded-md px-3 py-2 hover:bg-accent" href="/login">
              Kirish
            </Link>
          )}
          <Menu className="h-4 w-4 md:hidden" />
        </nav>
      </div>
    </header>
  );
}
