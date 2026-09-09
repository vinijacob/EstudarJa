import { Card } from "@/models/Card";

export function shouldReviewToday(card: Card): boolean {
  const today = new Date();
  const reviewDate = new Date(card.nextReview);

  return (
    reviewDate.getFullYear() === today.getFullYear() &&
    reviewDate.getMonth() === today.getMonth() &&
    reviewDate.getDate() <= today.getDate()
  );
}

export function hasHighPriority(card: Card): boolean {
  return card.consecutiveErrors >= 2;
}
