import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const cookieName = "tanal_session";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret-kamida-32-belgi-qiling");

export type SessionUser = {
  id: string;
  username: string;
  name: string;
  role: Role;
  testCenterId: string | null;
};

export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const id = String(payload.id);
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, name: true, role: true, testCenterId: true, isActive: true }
    });

    if (!user?.isActive) return null;

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      testCenterId: user.testCenterId
    };
  } catch {
    return null;
  }
}

export async function requireUser(roles?: Role[]) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  if (roles && !roles.includes(user.role)) {
    redirect(user.role === "SUPER_ADMIN" ? "/admin/dashboard" : "/center/dashboard");
  }

  return user;
}
