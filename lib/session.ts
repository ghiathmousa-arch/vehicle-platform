import "server-only"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const SESSION_COOKIE = "session"
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 أيام

export type SessionPayload = {
  adminId: string
  name: string
  email: string
}

function getKey() {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    throw new Error("SESSION_SECRET غير معرّف في متغيرات البيئة")
  }
  return new TextEncoder().encode(secret)
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getKey())
}

export async function decrypt(session: string | undefined) {
  if (!session) return null

  try {
    const { payload } = await jwtVerify(session, getKey(), {
      algorithms: ["HS256"],
    })
    return payload as SessionPayload & { iat: number; exp: number }
  } catch {
    // توقيع غير صالح أو جلسة منتهية
    return null
  }
}

export async function createSession(payload: SessionPayload) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
  const session = await encrypt(payload)
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  return decrypt(cookieStore.get(SESSION_COOKIE)?.value)
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
