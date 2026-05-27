import { NextResponse } from "next/server";

const ANAM_API_URL = "https://api.anam.ai/v1/auth/session-token";

// Your persona ID from Anam Lab
const PERSONA_ID = "67a34ba0-17fa-4c1a-b83c-f7ed27cee8a7";

export async function POST() {
  const apiKey = process.env.ANAM_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ANAM_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(ANAM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        personaConfig: {
          personaId: PERSONA_ID,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anam API error:", errorText);
      return NextResponse.json(
        { error: `Failed to get session token: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ sessionToken: data.sessionToken });
  } catch (error) {
    console.error("Error creating session token:", error);
    return NextResponse.json(
      { error: "Failed to create session token" },
      { status: 500 }
    );
  }
}
