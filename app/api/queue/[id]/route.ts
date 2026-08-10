import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const ALLOWED_FIELDS = ["status", "notes", "name", "preview", "body"];

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const db = getDb();

  const updates: string[] = [];
  const values: Record<string, any> = { id };

  for (const field of ALLOWED_FIELDS) {
    if (field in body) {
      updates.push(`${field} = @${field}`);
      values[field] = body[field];
    }
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  db.prepare(`UPDATE queue_items SET ${updates.join(", ")} WHERE id = @id`).run(values);
  const row = db.prepare("SELECT * FROM queue_items WHERE id = ?").get(id);

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  db.prepare("DELETE FROM queue_items WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
