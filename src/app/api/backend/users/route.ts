import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { laravelRequest } from "@/lib/api/laravel";

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (
    !session.accessToken ||
    !session.expiresAt ||
    Date.now() >= session.expiresAt
  ) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401 }
    );
  }

  const search = request.nextUrl.searchParams.get("search") || "";
  const rawPage = request.nextUrl.searchParams.get("page") || "1";
  const page = Number(rawPage);

  if (
    search.length > 150 ||
    !Number.isSafeInteger(page) ||
    page < 1 ||
    page > 100000
  ) {
    return NextResponse.json(
      { message: "Invalid search parameters." },
      { status: 422 }
    );
  }

  const params = new URLSearchParams({
    page: String(page),
  });

  if (search.trim()) {
    params.set("search", search.trim());
  }

  try {
    const response = await laravelRequest(
      `/users?${params.toString()}`,
      { method: "GET" },
      session.accessToken
    );

    const payload = await response.json().catch(() => ({
      message: "Unable to retrieve employees.",
    }));

    return NextResponse.json(payload, {
      status: response.status,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Laravel backend is unavailable." },
      { status: 503 }
    );
  }
}


export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (origin !== request.nextUrl.origin) {
    return NextResponse.json(
      { message: "Invalid request origin." },
      { status: 403 }
    );
  }

  const session = await getSession();

  if (
    !session.accessToken ||
    !session.expiresAt ||
    Date.now() >= session.expiresAt
  ) {
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
      { message: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { message: "Invalid employee information." },
      { status: 422 }
    );
  }

  const data = body as Record<string, unknown>;

  if (
    typeof data.name !== "string" ||
    typeof data.email !== "string" ||
    typeof data.password !== "string" ||
    typeof data.password_confirmation !== "string" ||
    data.name.trim().length < 2 ||
    data.name.length > 255 ||
    data.email.length > 255 ||
    data.password.length < 12 ||
    data.password.length > 1024 ||
    data.password !== data.password_confirmation ||
    (data.role !== undefined &&
      ![
        "employee",
        "fleet_admin",
        "management",
        "system_admin",
      ].includes(String(data.role)))
  ) {
    return NextResponse.json(
      { message: "Please check the employee information." },
      { status: 422 }
    );
  }

  try {
    const response = await laravelRequest(
      "/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          password: data.password,
          password_confirmation: data.password_confirmation,
          role: data.role || "employee",
        }),
      },
      session.accessToken
    );

    const result = await response.json().catch(() => ({
      message: "Unexpected response from Laravel.",
    }));

    return NextResponse.json(result, {
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
