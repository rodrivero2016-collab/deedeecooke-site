import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import crypto from "crypto";

export async function GET() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM queue_items ORDER BY created_at DESC").all();
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      status = "Needs Review",
      platform,
      content_type,
      source,
      song,
      preview,
      body: content,
      why_this_angle,
      needs_from_dee_dee,
      her_best_line,
      image_data,
    } = body || {};

    if (!name || !platform || !content_type || !source || !content) {
      return NextResponse.json(
        { error: "name, platform, content_type, source, and body are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = crypto.randomUUID();
    db.prepare(
      `INSERT INTO queue_items
        (id, name, status, platform, content_type, source, song, preview, body, why_this_angle, needs_from_dee_dee, her_best_line, image_data)
       VALUES (@id, @name, @status, @platform, @content_type, @source, @song, @preview, @body, @why_this_angle, @needs_from_dee_dee, @her_best_line, @image_data)`
    ).run({
      id,
      name,
      status,
      platform,
      content_type,
      source,
      song: song || null,
      preview: preview || (content as string).slice(0, 180),
      body: content,
      why_this_angle: why_this_angle || null,
      needs_from_dee_dee: needs_from_dee_dee || null,
      her_best_line: her_best_line || null,
      image_data: image_data || null,
    });

    const row = db.prepare("SELECT * FROM queue_items WHERE id = ?").get(id);
    return NextResponse.json(row, { status: 201 });
  } catch (err: any) {
    console.error("queue create error", err);
    return NextResponse.json({ error: err?.message || "Failed to create item" }, { status: 500 });
  }
}
