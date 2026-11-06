import { NextRequest, NextResponse } from "next/server";
import { getSession, isSessionExpired } from "@/lib/auth/session";
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
  const employeeId = Number(id);

  if (!Number.isSafeInteger(employeeId) || employeeId < 1) {
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
      { message: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    return NextResponse.json(
      { message: "Invalid request." },
      { status: 422 }
    );
  }

  const data = input as Record<string, unknown>;

  if (
    data.status !== "active" &&
    data.status !== "suspended"
  ) {
    return NextResponse.json(
      { message: "Invalid status." },
      { status: 422 }
    );
  }

  try {
    const response = await laravelRequest(
      `/users/${employeeId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: data.status,
        }),
      },
      session.accessToken
    );

    const result = await response.json().catch(() => ({
      message: "Unexpected Laravel response.",
    }));

    return NextResponse.json(result, {
      status: response.status,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Laravel API unavailable." },
      { status: 503 }
    );
  }
}
