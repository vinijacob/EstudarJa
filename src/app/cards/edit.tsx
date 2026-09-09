import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, TextInput } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { Card } from "@/models/Card";
import { getAllCards, updateCard } from "@/services/storageService";

export default function EditCardScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  const [card, setCard] = useState<Card | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    loadCard();
  }, []);

  async function loadCard() {
    const cards = await getAllCards();

    const foundCard = cards.find((item) => item.id === id);

    if (!foundCard) {
      Alert.alert("Erro", "Cartão não encontrado.");

      router.back();
      return;
    }

    setCard(foundCard);
    setQuestion(foundCard.question);
    setAnswer(foundCard.answer);
  }

  async function handleSave() {
    if (!card) {
      return;
    }

    if (!question.trim() || !answer.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha a pergunta e a resposta.");

      return;
    }

    const updatedCard = {
      ...card,
      question: question.trim(),
      answer: answer.trim(),
    };

    await updateCard(updatedCard);

    router.back();
  }

  if (!card) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Carregando...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Editar cartão</ThemedText>

      <ThemedView style={styles.form}>
        <ThemedText type="subtitle">Pergunta</ThemedText>

        <TextInput
          style={styles.input}
          value={question}
          onChangeText={setQuestion}
          multiline
        />

        <ThemedText type="subtitle">Resposta</ThemedText>

        <TextInput
          style={styles.input}
          value={answer}
          onChangeText={setAnswer}
          multiline
        />

        <Pressable style={styles.button} onPress={handleSave}>
          <ThemedText style={styles.buttonText}>Salvar alterações</ThemedText>
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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  form: {
    marginTop: 40,
    gap: 12,
    backgroundColor: "transparent",
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },

  button: {
    marginTop: 16,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 17,
    fontWeight: "700",
  },
});
