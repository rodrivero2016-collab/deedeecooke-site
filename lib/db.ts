import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import os from "os";

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  const DATA_DIR = path.join(os.tmpdir(), "deedeecooke-content-queue");
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  const db = new Database(path.join(DATA_DIR, "content-queue.db"));
  db.pragma("busy_timeout = 5000");
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS queue_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Needs Review',
      platform TEXT NOT NULL,
      content_type TEXT NOT NULL,
      source TEXT NOT NULL,
      song TEXT,
      preview TEXT,
      body TEXT NOT NULL,
      why_this_angle TEXT,
      needs_from_dee_dee TEXT,
      her_best_line TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS mailing_list (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      event_details TEXT,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  _db = db;
  return db;
}

export type QueueItem = {
  id: string;
  name: string;
  status: "Needs Review" | "Approved" | "Needs Changes" | "Posted";
  platform: string;
  content_type: string;
  source: string;
  song: string | null;
  preview: string | null;
  body: string;
  why_this_angle: string | null;
  needs_from_dee_dee: string | null;
  her_best_line: string | null;
  notes: string | null;
  created_at: string;
};
