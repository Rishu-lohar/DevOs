
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body?.message;

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const backendUrl =
      process.env.DevHub_AI_BACKEND_URL ||
      "http://127.0.0.1:8001";

    const response = await fetch(`${backendUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
      cache: "no-store",
      signal: AbortSignal.timeout(120000),
    });

    if (!response.ok) {
      console.error("AI backend error:", response.status);

      return NextResponse.json(
        { error: "AI backend request failed" },
        { status: 502 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      reply: data.reply,
    });
  } catch (error) {
    console.error("Mentor chat error:", error);

    return NextResponse.json(
      { error: "Unable to connect to DevHub AI backend" },
      { status: 502 }
    );
  }
}
