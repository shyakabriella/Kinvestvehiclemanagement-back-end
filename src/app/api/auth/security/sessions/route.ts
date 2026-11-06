import { NextResponse } from "next/server";
import { getSession, isSessionExpired } from "@/lib/auth/session";
import { laravelRequest } from "@/lib/api/laravel";

export async function GET() {
  const session = await getSession();

  if (!session.accessToken || isSessionExpired(session.expiresAt)) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401 }
    );
  }

  try {
    const response = await laravelRequest(
      "/auth/sessions",
      { method: "GET" },
      session.accessToken
    );

    const payload = await response.json().catch(() => ({
      message: "Unexpected Laravel response.",
    }));

    return NextResponse.json(payload, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { message: "Laravel service unavailable." },
      { status: 503 }
    );
  }
}
