import { Card } from "@/models/Card";
import { Review } from "@/models/Review";

import {
  calculateNextReview,
  ReviewResult,
} from "@/algorithms/reviewScheduler";

import { updateCard } from "@/services/storageService";

export async function processReview(
  card: Card,
  result: ReviewResult,
): Promise<Review> {
  const review = new Review(card.id, result === "correct");

  if (result === "incorrect") {
    card.consecutiveErrors += 1;
  } else {
    card.consecutiveErrors = 0;
  }

  card.nextReview = calculateNextReview(card, result);

  await updateCard(card);

  return review;
}
