import { Card } from "@/models/Card";

export type ReviewResult = "correct" | "incorrect";

export function calculateNextReview(card: Card, result: ReviewResult): Date {
  const nextReview = new Date();

  if (result === "incorrect") {
    if (card.consecutiveErrors + 1 >= 2) {
      return nextReview;
    }

    nextReview.setDate(nextReview.getDate() + 1);
    return nextReview;
  }

  nextReview.setDate(nextReview.getDate() + 3);

  return nextReview;
}
