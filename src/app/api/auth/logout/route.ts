import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { laravelRequest } from "@/lib/api/laravel";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (origin !== request.nextUrl.origin) {
    return NextResponse.json(
      { message: "Invalid request origin." },
      { status: 403 }
    );
  }

  const session = await getSession();
  const token = session.accessToken;

  // Invalidate the browser session even when Laravel
  // is temporarily unreachable.
  session.destroy();

  if (token) {
    try {
      await laravelRequest(
        "/auth/logout",
        { method: "POST" },
        token
      );
    } catch {
      // Local session is already invalidated.
      // Laravel token expires according to its own policy.
    }
  }

  return NextResponse.json(
    { message: "Logged out." },
    { headers: { "Cache-Control": "no-store" } }
  );
}
