import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId");
  const apiKey = process.env.ANAM_API_KEY;

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId." }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "ANAM_API_KEY not configured." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.anam.ai/v1/sessions/${encodeURIComponent(sessionId)}/transcript`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const body = await response.text();
      return NextResponse.json(
        { error: `Transcript fetch failed (${response.status}): ${body}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const transcriptText = extractTranscriptText(data);

    return NextResponse.json({ transcriptText, raw: data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown transcript fetch error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function extractTranscriptText(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const candidate = payload as Record<string, unknown>;

  if (typeof candidate.transcript === "string") {
    return candidate.transcript;
  }

  const messages = candidate.messages;
  if (Array.isArray(messages)) {
    return messages
      .map((message) => {
        if (typeof message === "string") {
          return message;
        }
        if (message && typeof message === "object") {
          const record = message as Record<string, unknown>;
          const speaker =
            typeof record.speaker === "string" ? `${record.speaker}: ` : "";
          if (typeof record.text === "string") {
            return `${speaker}${record.text}`;
          }
          if (typeof record.content === "string") {
            return `${speaker}${record.content}`;
          }
        }
        return "";
      })
      .filter(Boolean)
      .join("\n");
  }

  return JSON.stringify(payload);
}
