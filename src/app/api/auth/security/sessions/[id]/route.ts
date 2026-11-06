import { NextRequest, NextResponse } from "next/server";
import { getSession, isSessionExpired } from "@/lib/auth/session";
import { laravelRequest } from "@/lib/api/laravel";

type Context = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  request: NextRequest,
  context: Context
) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json(
      { message: "Invalid request origin." },
      { status: 403 }
    );
  }

  const { id } = await context.params;
  const sessionId = Number(id);

  if (!Number.isSafeInteger(sessionId) || sessionId < 1) {
    return NextResponse.json(
      { message: "Invalid session ID." },
      { status: 422 }
    );
  }

  const session = await getSession();

  if (!session.accessToken || isSessionExpired(session.expiresAt)) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401 }
    );
  }

  try {
    const response = await laravelRequest(
      `/auth/sessions/${sessionId}`,
      { method: "DELETE" },
      session.accessToken
    );

    const payload = await response.json().catch(() => ({
      message: "Unexpected Laravel response.",
    }));

    // When the current token is revoked, Laravel rejects it
    // on future requests. The protected layout will redirect.
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
