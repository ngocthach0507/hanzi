/**
 * Thuật toán SRS (Spaced Repetition System) - SM-2
 * Giúp tính toán thời gian ôn tập tiếp theo dựa trên chất lượng phản hồi của người học.
 */

export interface SRSData {
  repetitions: number;
  easeFactor: number;
  interval: number;
}

export function calculateNextReview(
  quality: number, // 0: quên hoàn toàn, 5: nhớ hoàn hảo
  currentSRS: SRSData = { repetitions: 0, easeFactor: 2.5, interval: 0 }
): SRSData {
  let { repetitions, easeFactor, interval } = currentSRS;

  if (quality >= 3) {
    // Nếu nhớ bài (quality >= 3)
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  } else {
    // Nếu quên bài (quality < 3)
    repetitions = 0;
    interval = 1;
  }

  // Cập nhật Ease Factor (Độ dễ)
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  return { repetitions, easeFactor, interval };
}
