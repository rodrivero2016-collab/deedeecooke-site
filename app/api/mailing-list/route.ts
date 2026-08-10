import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import crypto from "crypto";

// Demo capture endpoint. For production, swap this for a real ESP
// (Mailchimp, ConvertKit, Flodesk) by calling their API here instead of
// (or in addition to) writing to the local table.
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    const db = getDb();
    db.prepare("INSERT OR IGNORE INTO mailing_list (id, email) VALUES (?, ?)").run(
      crypto.randomUUID(),
      email.trim().toLowerCase()
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("mailing list error", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
