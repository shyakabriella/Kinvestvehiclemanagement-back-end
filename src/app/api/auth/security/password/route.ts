import { NextRequest, NextResponse } from "next/server";
import { getSession, isSessionExpired } from "@/lib/auth/session";
import { laravelRequest } from "@/lib/api/laravel";

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json(
      { message: "Invalid request origin." },
      { status: 403 }
    );
  }

  const session = await getSession();

  if (!session.accessToken || isSessionExpired(session.expiresAt)) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401 }
    );
  }

  let input: unknown;

  try {
    input = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON request." },
      { status: 400 }
    );
  }

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return NextResponse.json(
      { message: "Invalid password information." },
      { status: 422 }
    );
  }

  const data = input as Record<string, unknown>;

  if (
    typeof data.current_password !== "string" ||
    typeof data.password !== "string" ||
    typeof data.password_confirmation !== "string" ||
    data.password.length < 12 ||
    data.password.length > 1024 ||
    data.password !== data.password_confirmation
  ) {
    return NextResponse.json(
      { message: "Check the password fields and confirmation." },
      { status: 422 }
    );
  }

  try {
    const response = await laravelRequest(
      "/auth/change-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: data.current_password,
          password: data.password,
          password_confirmation: data.password_confirmation,
        }),
      },
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
