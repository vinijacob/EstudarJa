import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { Card } from "@/models/Card";
import { shouldReviewToday } from "@/rules/reviewRules";
import { getAllCards } from "@/services/storageService";

export default function HomeScreen() {
  const router = useRouter();

  const [reviewCount, setReviewCount] = useState(0);

  async function loadReviewCount() {
    const cards: Card[] = await getAllCards();

    const cardsToReview = cards.filter((card) => shouldReviewToday(card));

    setReviewCount(cardsToReview.length);
  }

  useFocusEffect(
    useCallback(() => {
      loadReviewCount();
    }, []),
  );

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={["#18090B", "#2A0D12", "#100607"]}
        style={StyleSheet.absoluteFill}
      />

      <ThemedView style={styles.contentWrapper}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.logo}>
            Estudar <ThemedText style={styles.logoAccent}>Já</ThemedText>
          </ThemedText>

          <ThemedText style={styles.subtitle}>
            Estude um pouco. Lembre muito.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.content}>
          <LinearGradient
            colors={["rgba(255, 72, 91, 0.20)", "rgba(90, 15, 25, 0.35)"]}
            style={styles.reviewCard}
          >
            <ThemedView style={styles.glassContent}>
              <ThemedText style={styles.cardLabel}>
                SUA REVISÃO DE HOJE
              </ThemedText>

              <ThemedText style={styles.number}>{reviewCount}</ThemedText>

              <ThemedText style={styles.cardDescription}>
                {reviewCount === 1
                  ? "cartão para revisar"
                  : "cartões para revisar"}
              </ThemedText>
            </ThemedView>
          </LinearGradient>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/review")}
          >
            <LinearGradient
              colors={["#FF4757", "#D7263D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <ThemedText style={styles.primaryButtonText}>
                Começar revisão
              </ThemedText>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/cards")}
          >
            <ThemedText style={styles.secondaryButtonText}>
              Meus cartões
            </ThemedText>
          </Pressable>
        </ThemedView>

        <ThemedText style={styles.footer}>
          Pequenos estudos. Grandes memórias.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#100607",
  },

  contentWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "transparent",
  },

  header: {
    marginTop: 70,
    alignItems: "center",
    backgroundColor: "transparent",
  },

  logo: {
    fontSize: 46,
    lineHeight: 54,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  logoAccent: {
    color: "#FF4757",
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#D7BFC2",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
    backgroundColor: "transparent",
  },

  reviewCard: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(255, 105, 120, 0.35)",
    overflow: "hidden",
    shadowColor: "#FF334A",
    shadowOpacity: 0.2,
    shadowRadius: 25,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 8,
  },

  glassContent: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
  },

  cardLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#FF8B96",
  },

  number: {
    marginTop: 8,
    fontSize: 68,
    lineHeight: 76,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  cardDescription: {
    fontSize: 16,
    color: "#D7BFC2",
  },

  primaryButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#FF334A",
    shadowOpacity: 0.35,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    elevation: 7,
  },

  gradientButton: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  secondaryButton: {
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 105, 120, 0.30)",
    backgroundColor: "rgba(255,255,255,0.045)",
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  footer: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 13,
    color: "#8E6D72",
  },
});
