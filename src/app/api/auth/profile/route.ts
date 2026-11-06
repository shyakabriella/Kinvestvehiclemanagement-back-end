import { NextRequest, NextResponse } from "next/server";
import {
  getSession,
  isSessionExpired,
} from "@/lib/auth/session";
import { laravelRequest } from "@/lib/api/laravel";

async function authorizedToken(): Promise<string | null> {
  const session = await getSession();

  if (
    !session.accessToken ||
    isSessionExpired(session.expiresAt)
  ) {
    return null;
  }

  return session.accessToken;
}

export async function GET() {
  const token = await authorizedToken();

  if (!token) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401 }
    );
  }

  try {
    const response = await laravelRequest(
      "/auth/me",
      { method: "GET" },
      token
    );

    const result = await response.json().catch(() => ({
      message: "Invalid backend response.",
    }));

    return NextResponse.json(result, {
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

export async function PATCH(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (origin !== request.nextUrl.origin) {
    return NextResponse.json(
      { message: "Invalid request origin." },
      { status: 403 }
    );
  }

  const token = await authorizedToken();

  if (!token) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON request." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { message: "Invalid profile information." },
      { status: 422 }
    );
  }

  const data = body as Record<string, unknown>;

  if (
    typeof data.name !== "string" ||
    typeof data.email !== "string" ||
    !data.name.trim() ||
    !data.email.trim() ||
    data.name.length > 255 ||
    data.email.length > 255 ||
    (data.current_password !== undefined &&
      typeof data.current_password !== "string")
  ) {
    return NextResponse.json(
      { message: "Please enter a valid name and email." },
      { status: 422 }
    );
  }

  try {
    const response = await laravelRequest(
      "/auth/me",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          ...(typeof data.current_password === "string"
            ? { current_password: data.current_password }
            : {}),
        }),
      },
      token
    );

    const result = await response.json().catch(() => ({
      message: "Invalid backend response.",
    }));

    return NextResponse.json(result, {
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
