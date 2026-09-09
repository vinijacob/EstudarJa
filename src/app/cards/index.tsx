import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { Card } from "@/models/Card";
import { getAllCards } from "@/services/storageService";

export default function CardsScreen() {
  const router = useRouter();

  const [cards, setCards] = useState<Card[]>([]);

  async function loadCards() {
    const storedCards = await getAllCards();

    setCards(storedCards);
  }

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, []),
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Meus cartões</ThemedText>

        <ThemedText style={styles.subtitle}>
          {cards.length} cartão{cards.length !== 1 ? "s" : ""}
        </ThemedText>
      </ThemedView>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <ThemedView style={styles.empty}>
            <ThemedText style={styles.icon}>📚</ThemedText>

            <ThemedText type="subtitle">Nenhum cartão ainda</ThemedText>

            <ThemedText style={styles.description}>
              Crie seu primeiro cartão para começar.
            </ThemedText>
          </ThemedView>
        }
        renderItem={({ item }) => (
          <ThemedView style={styles.card}>
            <ThemedText type="subtitle">{item.question}</ThemedText>

            <ThemedText style={styles.answer}>{item.answer}</ThemedText>
          </ThemedView>
        )}
      />

      <Pressable
        style={styles.button}
        onPress={() => router.push("/cards/create")}
      >
        <ThemedText style={styles.buttonText}>+ Criar cartão</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  header: {
    marginTop: 30,
    backgroundColor: "transparent",
  },

  subtitle: {
    marginTop: 8,
    opacity: 0.6,
  },

  list: {
    paddingTop: 24,
    paddingBottom: 100,
    gap: 12,
  },

  card: {
    padding: 20,
    borderRadius: 16,
    gap: 10,
  },

  answer: {
    opacity: 0.6,
  },

  empty: {
    marginTop: 100,
    alignItems: "center",
    gap: 12,
    backgroundColor: "transparent",
  },

  icon: {
    fontSize: 48,
  },

  description: {
    textAlign: "center",
    opacity: 0.6,
  },

  button: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 17,
    fontWeight: "700",
  },
});
