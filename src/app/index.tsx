import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.logo}>
          Estudar Já
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Estude um pouco. Lembre muito.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Sua revisão de hoje</ThemedText>

          <ThemedText style={styles.number}>0</ThemedText>

          <ThemedText>cartões para revisar</ThemedText>
        </ThemedView>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/review")}
        >
          <ThemedText style={(styles.primaryButtonText, styles.buttons)}>
            Começar revisão
          </ThemedText>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push("/cards")}
        >
          <ThemedText style={(styles.secondaryButtonText, styles.buttons)}>
            Meus cartões
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  header: {
    marginTop: 60,
    alignItems: "center",
    backgroundColor: "transparent",
  },

  logo: {
    fontSize: 42,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 8,
    opacity: 0.6,
    fontSize: 16,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
    backgroundColor: "transparent",
  },

  card: {
    padding: 28,
    borderRadius: 20,
    alignItems: "center",
    gap: 8,
  },

  number: {
    fontSize: 56,
    lineHeight: 64,
    fontWeight: "800",
  },

  buttons: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#D1D5DB",
  },

  primaryButton: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  primaryButtonText: {
    fontSize: 17,
    fontWeight: "700",
  },

  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
