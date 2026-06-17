"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";

type State = { ok: boolean; message: string } | null | undefined;

export function ActionForm({
  action,
  children,
  submitLabel
}: {
  action: (state: State, formData: FormData) => Promise<{ ok: boolean; message: string } | undefined>;
  children: React.ReactNode;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      {children}
      {state?.message ? (
        <p className={state.ok ? "text-sm text-emerald-700" : "text-sm text-red-700"}>{state.message}</p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saqlanmoqda..." : submitLabel}
      </Button>
    </form>
  );
}
