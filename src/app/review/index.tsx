import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { Card } from "@/models/Card";
import { processReview } from "@/services/reviewService";
import { getAllCards } from "@/services/storageService";

export default function ReviewScreen() {
  const router = useRouter();

  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const currentCard = cards[currentIndex];

  async function loadCards() {
    setLoading(true);

    const storedCards = await getAllCards();

    setCards(storedCards);
    setCurrentIndex(0);
    setShowAnswer(false);
    setProcessing(false);

    scale.setValue(1);
    translateX.setValue(0);
    translateY.setValue(0);

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
    if (!currentCard || processing) {
      return;
    }

    setProcessing(true);

    if (correct) {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1.06,
          duration: 180,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(translateY, {
          toValue: -12,
          duration: 180,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(async () => {
        await finishReview(correct);
      });
    } else {
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -10,
          duration: 60,
          useNativeDriver: true,
        }),

        Animated.timing(translateX, {
          toValue: 10,
          duration: 60,
          useNativeDriver: true,
        }),

        Animated.timing(translateX, {
          toValue: -7,
          duration: 50,
          useNativeDriver: true,
        }),

        Animated.timing(translateX, {
          toValue: 7,
          duration: 50,
          useNativeDriver: true,
        }),

        Animated.timing(translateX, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start(async () => {
        await finishReview(correct);
      });
    }
  }

  async function finishReview(correct: boolean) {
    if (!currentCard) {
      return;
    }

    await processReview(currentCard, correct ? "correct" : "incorrect");

    const nextIndex = currentIndex + 1;

    if (nextIndex >= cards.length) {
      router.back();
      return;
    }

    scale.setValue(1);
    translateX.setValue(0);
    translateY.setValue(0);

    setCurrentIndex(nextIndex);
    setShowAnswer(false);
    setProcessing(false);
  }

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <LinearGradient
          colors={["#18090B", "#2A0D12", "#100607"]}
          style={StyleSheet.absoluteFill}
        />

        <ThemedView style={styles.center}>
          <ActivityIndicator size="large" color="#FF4757" />

          <ThemedText style={styles.loadingText}>
            Preparando sua revisão...
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (cards.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <LinearGradient
          colors={["#18090B", "#2A0D12", "#100607"]}
          style={StyleSheet.absoluteFill}
        />

        <ThemedView style={styles.center}>
          <ThemedText style={styles.emptyIcon}>📚</ThemedText>

          <ThemedText type="title" style={styles.emptyTitle}>
            Nada para revisar
          </ThemedText>

          <ThemedText style={styles.message}>
            Crie alguns cartões primeiro.
          </ThemedText>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/cards/create")}
          >
            <LinearGradient
              colors={["#FF4757", "#D7263D"]}
              style={styles.buttonGradient}
            >
              <ThemedText style={styles.primaryButtonText}>
                Criar cartão
              </ThemedText>
            </LinearGradient>
          </Pressable>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={["#18090B", "#2A0D12", "#100607"]}
        style={StyleSheet.absoluteFill}
      />

      <ThemedView style={styles.content}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>← Voltar</ThemedText>
        </Pressable>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.reviewLabel}>REVISÃO</ThemedText>

          <ThemedText style={styles.counter}>
            {currentIndex + 1} / {cards.length}
          </ThemedText>
        </ThemedView>

        <Animated.View
          style={[
            styles.cardWrapper,
            {
              transform: [{ scale }, { translateX }, { translateY }],
            },
          ]}
        >
          <LinearGradient
            colors={["rgba(255, 71, 87, 0.18)", "rgba(255,255,255,0.035)"]}
            style={styles.flashcard}
          >
            <ThemedView style={styles.flashcardContent}>
              <ThemedText style={styles.label}>
                {showAnswer ? "RESPOSTA" : "PERGUNTA"}
              </ThemedText>

              <ThemedText style={styles.question}>
                {showAnswer ? currentCard.answer : currentCard.question}
              </ThemedText>

              {!showAnswer && (
                <ThemedText style={styles.tapHint}>
                  Pense na resposta antes de revelar
                </ThemedText>
              )}
            </ThemedView>
          </LinearGradient>
        </Animated.View>

        {!showAnswer ? (
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleAnswer}
          >
            <LinearGradient
              colors={["#FF4757", "#D7263D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <ThemedText style={styles.primaryButtonText}>
                Mostrar resposta
              </ThemedText>
            </LinearGradient>
          </Pressable>
        ) : (
          <ThemedView style={styles.actions}>
            <Pressable
              disabled={processing}
              style={({ pressed }) => [
                styles.actionButton,
                styles.wrongButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => handleResult(false)}
            >
              <ThemedText style={styles.wrongText}>✕ Errei</ThemedText>
            </Pressable>

            <Pressable
              disabled={processing}
              style={({ pressed }) => [
                styles.actionButton,
                styles.correctButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => handleResult(true)}
            >
              <ThemedText style={styles.correctText}>✓ Acertei</ThemedText>
            </Pressable>
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#100607",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "transparent",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
    backgroundColor: "transparent",
  },

  loadingText: {
    color: "#B99B9F",
    fontSize: 15,
  },

  backButton: {
    alignSelf: "flex-start",
    marginTop: 60,
    marginBottom: 0,
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: "transparent",
  },

  backButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF6B78",
  },

  header: {
    marginTop: 30,
    alignItems: "center",
    backgroundColor: "transparent",
  },

  reviewLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#FF6B78",
  },

  counter: {
    marginTop: 7,
    fontSize: 15,
    color: "#B99B9F",
  },

  cardWrapper: {
    flex: 1,
    marginVertical: 25,
  },

  flashcard: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 105, 120, 0.30)",
    overflow: "hidden",
  },

  flashcardContent: {
    flex: 1,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.025)",
  },

  label: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#FF7B87",
    marginBottom: 20,
  },

  question: {
    fontSize: 27,
    lineHeight: 36,
    fontWeight: "800",
    textAlign: "center",
    color: "#FFFFFF",
  },

  tapHint: {
    position: "absolute",
    bottom: 25,
    fontSize: 12,
    textAlign: "center",
    color: "#76595D",
  },

  primaryButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
  },

  buttonGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
    backgroundColor: "transparent",
  },

  actionButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  wrongButton: {
    backgroundColor: "rgba(255, 255, 255, 0.035)",
    borderColor: "rgba(255, 100, 110, 0.22)",
  },

  correctButton: {
    backgroundColor: "rgba(255, 71, 87, 0.15)",
    borderColor: "rgba(255, 90, 105, 0.45)",
  },

  wrongText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FF929B",
  },

  correctText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FF5C6C",
  },

  emptyIcon: {
    fontSize: 52,
  },

  emptyTitle: {
    fontSize: 30,
    textAlign: "center",
    color: "#FFFFFF",
  },

  message: {
    textAlign: "center",
    color: "#B99B9F",
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});
