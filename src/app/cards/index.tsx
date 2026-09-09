import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { Card } from "@/models/Card";
import { deleteCard, getAllCards } from "@/services/storageService";

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

  function handleEdit(card: Card) {
    router.push({
      pathname: "/cards/edit",
      params: {
        id: card.id,
      },
    });
  }

  function handleDelete(card: Card) {
    Alert.alert(
      "Excluir cartão",
      "Tem certeza que deseja excluir este cartão?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteCard(card.id);
            await loadCards();
          },
        },
      ],
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
          <ThemedText style={styles.title}>Meus cartões</ThemedText>

          <ThemedText style={styles.subtitle}>
            {cards.length} cartão
            {cards.length !== 1 ? "s" : ""} salvo
            {cards.length !== 1 ? "s" : ""}
          </ThemedText>
        </ThemedView>

        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <ThemedView style={styles.empty}>
              <ThemedText style={styles.icon}>📚</ThemedText>

              <ThemedText style={styles.emptyTitle}>
                Nenhum cartão ainda
              </ThemedText>

              <ThemedText style={styles.description}>
                Crie seu primeiro cartão para começar a estudar.
              </ThemedText>
            </ThemedView>
          }
          renderItem={({ item }) => (
            <LinearGradient
              colors={["rgba(255, 72, 91, 0.14)", "rgba(255,255,255,0.035)"]}
              style={styles.card}
            >
              <ThemedView style={styles.cardContent}>
                <ThemedText style={styles.questionLabel}>PERGUNTA</ThemedText>

                <ThemedText style={styles.question}>{item.question}</ThemedText>

                <ThemedView style={styles.divider} />

                <ThemedText style={styles.answerLabel}>RESPOSTA</ThemedText>

                <ThemedText style={styles.answer}>{item.answer}</ThemedText>

                <ThemedView style={styles.actions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.editButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={() => handleEdit(item)}
                  >
                    <ThemedText style={styles.editText}>Editar</ThemedText>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.deleteButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={() => handleDelete(item)}
                  >
                    <ThemedText style={styles.deleteText}>Excluir</ThemedText>
                  </Pressable>
                </ThemedView>
              </ThemedView>
            </LinearGradient>
          )}
        />

        <Pressable
          style={({ pressed }) => [
            styles.createButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/cards/create")}
        >
          <LinearGradient
            colors={["#FF4757", "#D7263D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.createGradient}
          >
            <ThemedText style={styles.createText}>+ Criar cartão</ThemedText>
          </LinearGradient>
        </Pressable>
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
    marginBottom: 10,
    backgroundColor: "transparent",
  },

  title: {
    fontSize: 38,
    lineHeight: 46,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  subtitle: {
    marginTop: 7,
    fontSize: 15,
    color: "#B99B9F",
  },

  list: {
    paddingTop: 20,
    paddingBottom: 120,
    gap: 14,
  },

  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 105, 120, 0.28)",
    overflow: "hidden",
  },

  cardContent: {
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.025)",
  },

  questionLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#FF7B87",
  },

  question: {
    marginTop: 7,
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  divider: {
    height: 1,
    marginVertical: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  answerLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#8E6D72",
  },

  answer: {
    marginTop: 6,
    fontSize: 16,
    lineHeight: 23,
    color: "#D7BFC2",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    backgroundColor: "transparent",
  },

  editButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "rgba(255, 105, 120, 0.30)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "rgba(255,80,90,0.18)",
    backgroundColor: "rgba(255,40,55,0.06)",
  },

  editText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  deleteText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF7B87",
  },

  createButton: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
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

  createGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },

  createText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  empty: {
    marginTop: 100,
    alignItems: "center",
    gap: 10,
    backgroundColor: "transparent",
  },

  icon: {
    fontSize: 48,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  description: {
    maxWidth: 280,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    color: "#8E6D72",
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});
