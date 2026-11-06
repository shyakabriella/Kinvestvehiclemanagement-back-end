import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { laravelRequest } from "@/lib/api/laravel";
import type { LoginResponse } from "@/types/auth";


export async function POST(request: NextRequest) {
  // Reject requests originating from other websites.
  const origin = request.headers.get("origin");

  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json(
      { message: "Invalid request origin." },
      { status: 403 }
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

  if (!input || typeof input !== "object") {
    return NextResponse.json(
      { message: "Invalid login information." },
      { status: 422 }
    );
  }

  const data = input as Record<string, unknown>;

  if (
    typeof data.email !== "string" ||
    typeof data.password !== "string" ||
    data.email.length > 255 ||
    data.password.length > 1024
  ) {
    return NextResponse.json(
      { message: "Valid email and password are required." },
      { status: 422 }
    );
  }

  try {
    const response = await laravelRequest("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email.trim(),
        password: data.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);

      return NextResponse.json(
        {
          message:
            response.status === 429
              ? "Too many login attempts. Please try again later."
              : response.status === 403
                ? "Your account is not active. Contact the administrator."
                : "Invalid email or password.",
        },
        {
          status:
            response.status === 429
              ? 429
              : response.status === 403
                ? 403
                : response.status >= 500
                  ? 502
                  : 401,
          headers: {
            "Cache-Control": "no-store",
            ...(response.status === 429 &&
            error?.retry_after
              ? {
                  "Retry-After": String(error.retry_after),
                }
              : {}),
          },
        }
      );
    }

    const result = (await response.json()) as LoginResponse;

    if (
      !result.access_token ||
      !result.user ||
      result.user.status !== "active"
    ) {
      return NextResponse.json(
        { message: "Invalid authentication response." },
        { status: 502 }
      );
    }

    const session = await getSession();

    session.accessToken = result.access_token;
    session.userId = result.user.id;
    session.expiresAt =
      Date.now() + Math.min(result.expires_in, 43200) * 1000;

    await session.save();

    // Never return the Laravel access token to JavaScript.
    return NextResponse.json(
      {
        message: "Login successful.",
        user: result.user,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "KFMS login server error:",
      error instanceof Error ? error.name : "Unknown error"
    );

    return NextResponse.json(
      {
        message: "Authentication service temporarily unavailable.",
      },
      { status: 503 }
    );
  }
}
