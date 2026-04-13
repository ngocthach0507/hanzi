export interface Vocabulary {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  type: string;
  hsk_level?: number;
  topic?: string;
  example_zh?: string;
  example_pinyin?: string;
  example_vi?: string;
  audio_url?: string;
}

export interface UserProgress {
  user_id: string;
  content_type: 'hsk_lesson' | 'topic_lesson' | 'conversation' | 'reading';
  content_id: string;
  status: 'started' | 'completed';
  score?: number;
  last_practiced: string;
}

export interface UserVocabulary {
  user_id: string;
  vocabulary_id: string;
  interval: number;
  repetition: number;
  ease_factor: number;
  next_review: string;
}

export interface UserStreak {
  user_id: string;
  streak_count: number;
  last_activity: string;
  total_xp: number;
}
