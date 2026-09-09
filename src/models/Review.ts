export class Review {
  cardId: string;
  reviewedAt: Date;
  correct: boolean;

  constructor(cardId: string, correct: boolean) {
    this.cardId = cardId;
    this.reviewedAt = new Date();
    this.correct = correct;
  }
}
