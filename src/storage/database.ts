import { Card } from "@/models/Card";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CARDS_KEY = "@estudar_ja:cards";

export async function saveCards(cards: Card[]): Promise<void> {
  await AsyncStorage.setItem(CARDS_KEY, JSON.stringify(cards));
}

export async function getCards(): Promise<Card[]> {
  const data = await AsyncStorage.getItem(CARDS_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

export async function clearCards(): Promise<void> {
  await AsyncStorage.removeItem(CARDS_KEY);
}
