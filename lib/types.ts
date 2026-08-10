export type QueueStatus = "Needs Review" | "Approved" | "Needs Changes" | "Posted";

export type QueueItem = {
  id: string;
  name: string;
  status: QueueStatus;
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

export type VoiceCaptionItem = {
  platform: "Facebook" | "Instagram" | "TikTok Hook" | "Email";
  content: string;
  why: string;
};

export type VoiceCaptionResult = {
  idea_summary: string;
  register_used: string;
  needs_from_dee_dee: string;
  items: VoiceCaptionItem[];
};

export type SongStoryItem = {
  content_type: "Caption" | "Story" | "Hook" | "Script" | "Question" | "Lyric Graphic";
  platform: "Facebook" | "Instagram" | "TikTok Hook" | "Email" | "YouTube";
  content: string;
  why: string;
};

export type SongStoryResult = {
  song: string;
  story_summary: string;
  register_used: string;
  her_best_line: string;
  needs_from_dee_dee: string;
  items: SongStoryItem[];
};
