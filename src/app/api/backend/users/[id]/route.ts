import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { isSessionExpired } from "@/lib/auth/session";
import { laravelRequest } from "@/lib/api/laravel";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: NextRequest,
  context: Context
) {
  const origin = request.headers.get("origin");

  if (origin !== request.nextUrl.origin) {
    return NextResponse.json(
      { message: "Invalid request origin." },
      { status: 403 }
    );
  }

  const { id } = await context.params;

  const userId = Number(id);

  if (!Number.isSafeInteger(userId) || userId < 1) {
    return NextResponse.json(
      { message: "Invalid employee ID." },
      { status: 422 }
    );
  }

  const session = await getSession();

  if (
    !session.accessToken ||
    isSessionExpired(session.expiresAt)
  ) {
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
      { message: "Invalid request body." },
      { status: 400 }
    );
  }

  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    return NextResponse.json(
      { message: "Invalid employee information." },
      { status: 422 }
    );
  }

  const data = input as Record<string, unknown>;

  if (
    typeof data.name !== "string" ||
    typeof data.email !== "string" ||
    !data.name.trim() ||
    !data.email.trim() ||
    data.name.length > 255 ||
    data.email.length > 255
  ) {
    return NextResponse.json(
      { message: "Valid employee name and email are required." },
      { status: 422 }
    );
  }

  try {
    const response = await laravelRequest(
      `/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
        }),
      },
      session.accessToken
    );

    const payload = await response.json().catch(() => ({
      message: "Unexpected Laravel response.",
    }));

    return NextResponse.json(payload, {
      status: response.status,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to Laravel." },
      { status: 503 }
    );
  }
}
