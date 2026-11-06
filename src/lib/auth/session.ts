import "server-only";

import { cookies } from "next/headers";
import { connection } from "next/server";
import { getIronSession, type SessionOptions } from "iron-session";

export interface KFMSession {
  accessToken?: string;
  userId?: number;
  expiresAt?: number;
}

function getSessionOptions(): SessionOptions {
  const secret = process.env.KFMS_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "KFMS_SESSION_SECRET must contain at least 32 characters."
    );
  }

  return {
    password: secret,
    cookieName: "kfms_session",
    ttl: 60 * 60 * 12,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    },
  };
}

export async function getSession() {
  // Wait for a real request before iron-session accesses
  // cookies and evaluates session expiration times.
  await connection();

  return getIronSession<KFMSession>(
    await cookies(),
    getSessionOptions()
  );
}

export function isSessionExpired(expiresAt?: number): boolean {
  return !expiresAt || Date.now() >= expiresAt;
}
