// lib/auth.ts
import { cookies } from "next/headers";

export async function getIsLoggedIn(): Promise<boolean> {
  const cookieStore = await cookies(); // still synchronous in Server Component
  const token = cookieStore.get("token")?.value;
  return Boolean(token);
}
