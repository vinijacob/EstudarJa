import { Card } from "@/models/Card";

export function shouldReviewToday(card: Card): boolean {
  const now = new Date();
  const reviewDate = new Date(card.nextReview);

  return reviewDate <= now;
}

export function hasHighPriority(card: Card): boolean {
  return card.consecutiveErrors >= 2;
}
