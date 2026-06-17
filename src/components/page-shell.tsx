import { AppHeader } from "@/components/app-header";
import type { SessionUser } from "@/lib/auth";

export function PageShell({ user, children }: { user?: SessionUser | null; children: React.ReactNode }) {
  return (
    <>
      <AppHeader user={user} />
      {children}
    </>
  );
}
