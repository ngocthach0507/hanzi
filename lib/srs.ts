/**
 * Thuật toán SRS (Spaced Repetition System) - SM-2
 * Giúp tính toán thời gian ôn tập tiếp theo dựa trên chất lượng phản hồi của người học.
 */

export interface SRSData {
  repetition: number;
  ease_factor: number;
  interval: number;
  next_review: Date;
}

export function calculateNextReview(
  quality: number, // 0-5
  current: { repetition: number; ease_factor: number; interval: number } = { repetition: 0, ease_factor: 2.5, interval: 0 }
): SRSData {
  let { repetition, ease_factor, interval } = current;

  if (quality >= 3) {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease_factor);
    }
    repetition++;
  } else {
    repetition = 0;
    interval = 1;
  }

  ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ease_factor < 1.3) ease_factor = 1.3;

  const next_review = new Date();
  next_review.setDate(next_review.getDate() + interval);

  return { repetition, ease_factor, interval, next_review };
}

// Alias for backward compatibility
export const calculateSRS = (quality: number, interval: number, repetition: number, ease_factor: number) => 
  calculateNextReview(quality, { interval, repetition, ease_factor });
