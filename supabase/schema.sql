-- ============================================================================
-- Wanderlore — Supabase PostgreSQL Database Schema
-- Production Ready Tables for Profiles, Quests, Memories, and Local Lore
-- ============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL DEFAULT 'Guest Explorer',
  is_guest BOOLEAN DEFAULT TRUE,
  avatar_icon TEXT DEFAULT '🧭',
  total_score INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Quests Table
CREATE TABLE IF NOT EXISTS quests (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  genre TEXT,
  story_type TEXT,
  current_chapter_index INTEGER DEFAULT 0,
  completed_chapters JSONB DEFAULT '[]'::jsonb,
  solved_riddles JSONB DEFAULT '[]'::jsonb,
  score INTEGER DEFAULT 100,
  is_completed BOOLEAN DEFAULT FALSE,
  final_mystery_solved BOOLEAN DEFAULT FALSE,
  collected_artifacts JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Checkpoint Memories Table (Photos & Captions)
CREATE TABLE IF NOT EXISTS checkpoint_memories (
  id TEXT PRIMARY KEY,
  quest_id TEXT REFERENCES quests(id) ON DELETE CASCADE,
  checkpoint_id TEXT NOT NULL,
  checkpoint_name TEXT NOT NULL,
  caption TEXT,
  photo_url TEXT NOT NULL,
  include_in_storybook BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Verified Cultural Stories & Oral History Archive
CREATE TABLE IF NOT EXISTS cultural_stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  synopsis TEXT NOT NULL,
  genre TEXT NOT NULL,
  story_type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  destination TEXT NOT NULL,
  location_tag TEXT NOT NULL,
  verification_status TEXT NOT NULL, -- 'documented_fact', 'verified_oral_history', 'local_folklore'
  source_citations TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkpoint_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_stories ENABLE ROW LEVEL SECURITY;

-- Anonymous / Authenticated Public Policies for Hackathon & Demo Access
CREATE POLICY "Public profiles are readable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Profiles can be created and updated by owner" ON profiles FOR ALL USING (true);

CREATE POLICY "Quests are readable by everyone" ON quests FOR SELECT USING (true);
CREATE POLICY "Quests can be created and updated by owner" ON quests FOR ALL USING (true);

CREATE POLICY "Memories can be viewed and added" ON checkpoint_memories FOR ALL USING (true);
CREATE POLICY "Cultural stories are publicly readable" ON cultural_stories FOR SELECT USING (true);

-- Indexes for Fast Querying
CREATE INDEX IF NOT EXISTS idx_quests_user_id ON quests(user_id);
CREATE INDEX IF NOT EXISTS idx_memories_quest_id ON checkpoint_memories(quest_id);
CREATE INDEX IF NOT EXISTS idx_cultural_stories_genre ON cultural_stories(genre);
