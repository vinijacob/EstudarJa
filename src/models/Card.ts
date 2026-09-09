export class Card {
  id: string;
  question: string;
  answer: string;
  createdAt: Date;
  nextReview: Date;
  consecutiveErrors: number;

  constructor(id: string, question: string, answer: string) {
    this.id = id;
    this.question = question;
    this.answer = answer;
    this.createdAt = new Date();
    this.nextReview = new Date();
    this.consecutiveErrors = 0;
  }
}
