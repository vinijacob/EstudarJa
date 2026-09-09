import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { processReview } from "@/services/reviewService";

import { Card } from "@/models/Card";
import { getAllCards } from "@/services/storageService";

export default function ReviewScreen() {
  const router = useRouter();

  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentCard = cards[currentIndex];

  async function loadCards() {
    setLoading(true);

    const storedCards = await getAllCards();

    setCards(storedCards);
    setCurrentIndex(0);
    setShowAnswer(false);

    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, []),
  );

  function handleAnswer() {
    setShowAnswer(true);
  }

  async function handleResult(correct: boolean) {
    if (!currentCard) {
      return;
    }

    await processReview(currentCard, correct ? "correct" : "incorrect");

    const nextIndex = currentIndex + 1;

    if (nextIndex >= cards.length) {
      router.back();
      return;
    }

    setCurrentIndex(nextIndex);
    setShowAnswer(false);
  }

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (cards.length === 0) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="title">Nada para revisar</ThemedText>

        <ThemedText style={styles.message}>
          Crie alguns cartões primeiro.
        </ThemedText>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/cards/create")}
        >
          <ThemedText style={styles.buttonText}>Criar cartão</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText>
          Cartão {currentIndex + 1} de {cards.length}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.flashcard}>
        <ThemedText style={styles.label}>
          {showAnswer ? "RESPOSTA" : "PERGUNTA"}
        </ThemedText>

        <ThemedText style={styles.question}>
          {showAnswer ? currentCard.answer : currentCard.question}
        </ThemedText>
      </ThemedView>

      {!showAnswer ? (
        <Pressable style={styles.button} onPress={handleAnswer}>
          <ThemedText style={styles.buttonText}>Mostrar resposta</ThemedText>
        </Pressable>
      ) : (
        <ThemedView style={styles.actions}>
          <Pressable
            style={styles.wrongButton}
            onPress={() => handleResult(false)}
          >
            <ThemedText style={styles.actionText}>Errei</ThemedText>
          </Pressable>

          <Pressable
            style={styles.correctButton}
            onPress={() => handleResult(true)}
          >
            <ThemedText style={styles.actionText}>Acertei</ThemedText>
          </Pressable>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },

  header: {
    marginTop: 30,
    alignItems: "center",
    backgroundColor: "transparent",
  },

  flashcard: {
    flex: 1,
    marginVertical: 30,
    padding: 30,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2,
    opacity: 0.5,
  },

  question: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },

  message: {
    textAlign: "center",
    opacity: 0.6,
  },

  button: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    fontSize: 17,
    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "transparent",
    marginBottom: 20,
  },

  wrongButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  correctButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  actionText: {
    fontSize: 17,
    fontWeight: "700",
  },
});
