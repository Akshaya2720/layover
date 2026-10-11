import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, UserProgress, PhotoMemory } from '../../shared/types.js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Synchronize User Profile to Supabase
export async function syncProfileToSupabase(profile: UserProfile): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('profiles').upsert({
      id: profile.id,
      username: profile.username,
      is_guest: profile.isGuest,
      avatar_icon: profile.avatarIcon,
      total_score: profile.totalScore,
      badges: profile.badges,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.warn('[Supabase] Profile sync warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Profile sync exception:', err);
    return false;
  }
}

// Synchronize Quest Progress to Supabase
export async function syncQuestProgressToSupabase(
  userId: string,
  progress: UserProgress
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('quests').upsert({
      id: progress.questId,
      user_id: userId,
      current_chapter_index: progress.currentChapterIndex,
      completed_chapters: progress.completedChapters,
      solved_riddles: progress.solvedRiddles,
      score: progress.score,
      is_completed: progress.isCompleted,
      final_mystery_solved: progress.finalMysterySolved || false,
      collected_artifacts: progress.collectedArtifacts,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.warn('[Supabase] Quest sync warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Quest sync exception:', err);
    return false;
  }
}

// Synchronize Photo Memories to Supabase
export async function syncPhotoMemoryToSupabase(photo: PhotoMemory): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('checkpoint_memories').upsert({
      id: photo.id,
      checkpoint_id: photo.checkpointId,
      checkpoint_name: photo.checkpointName,
      caption: photo.caption,
      photo_url: photo.dataUrl,
      include_in_storybook: photo.includeInStorybook,
      created_at: photo.timestamp,
    });
    if (error) {
      console.warn('[Supabase] Photo memory sync warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Photo memory sync exception:', err);
    return false;
  }
}
