import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import crypto from "crypto";

// Demo booking/contact endpoint. For production, wire this to a real email
// service (Resend, SendGrid, Postmark) to notify JC/Dee Dee immediately,
// in addition to (or instead of) storing in the local table.
export async function POST(request: NextRequest) {
  try {
    const { name, email, eventDetails, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const db = getDb();
    db.prepare(
      "INSERT INTO contact_messages (id, name, email, event_details, message) VALUES (?, ?, ?, ?, ?)"
    ).run(crypto.randomUUID(), name, email, eventDetails || null, message);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("contact error", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
