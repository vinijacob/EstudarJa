import { getCards, saveCards } from "@/storage/database";

import { Card } from "@/models/Card";

export async function saveCard(card: Card): Promise<void> {
  const cards = await getCards();

  cards.push(card);

  await saveCards(cards);
}

export async function getAllCards(): Promise<Card[]> {
  return await getCards();
}

export async function deleteCard(id: string): Promise<void> {
  const cards = await getCards();

  const updatedCards = cards.filter((card) => card.id !== id);

  await saveCards(updatedCards);
}

export async function updateCard(updatedCard: Card): Promise<void> {
  const cards = await getCards();

  const updatedCards = cards.map((card) =>
    card.id === updatedCard.id ? updatedCard : card,
  );

  await saveCards(updatedCards);
}
