"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { loginAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium">Login</span>
        <Input name="username" autoComplete="username" required />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium">Parol</span>
        <Input name="password" type="password" autoComplete="current-password" required />
      </label>
      {state?.message ? <p className="text-sm text-red-700">{state.message}</p> : null}
      <Button className="w-full" disabled={pending}>
        <LogIn className="h-4 w-4" />
        {pending ? "Tekshirilmoqda..." : "Kirish"}
      </Button>
    </form>
  );
}
