import { NextRequest, NextResponse } from "next/server";
import { getSession, isSessionExpired } from "@/lib/auth/session";
import { laravelRequest } from "@/lib/api/laravel";

type Context = {
  params: Promise<{ id: string }>;
};

const allowedRoles = [
  "employee",
  "fleet_admin",
  "management",
  "system_admin",
];

export async function PUT(
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

  if (
    !Number.isSafeInteger(employeeId) ||
    employeeId < 1
  ) {
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
      { message: "Invalid role information." },
      { status: 422 }
    );
  }

  const data = input as Record<string, unknown>;

  if (
    !Array.isArray(data.roles) ||
    data.roles.length !== 1 ||
    typeof data.roles[0] !== "string" ||
    !allowedRoles.includes(data.roles[0])
  ) {
    return NextResponse.json(
      { message: "Select a valid employee role." },
      { status: 422 }
    );
  }

  try {
    const response = await laravelRequest(
      `/users/${employeeId}/roles`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roles: data.roles,
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
      { message: "Laravel service unavailable." },
      { status: 503 }
    );
  }
}
