import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { Card } from "@/models/Card";
import { saveCard } from "@/services/storageService";

export default function CreateCardScreen() {
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function handleCreateCard() {
    Keyboard.dismiss();

    if (!question.trim() || !answer.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha a pergunta e a resposta.");
      return;
    }

    const card = new Card(
      Date.now().toString(),
      question.trim(),
      answer.trim(),
    );

    await saveCard(card);

    Alert.alert("Cartão criado!", "Seu cartão foi salvo.", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.header}>
            <ThemedText type="title">Novo cartão</ThemedText>

            <ThemedText style={styles.subtitle}>
              Crie uma pergunta para estudar depois.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.form}>
            <ThemedText type="subtitle">Pergunta</ThemedText>

            <TextInput
              style={styles.input}
              placeholder="Ex: Qual é a capital do Brasil?"
              value={question}
              onChangeText={setQuestion}
              multiline
              returnKeyType="next"
            />

            <ThemedText type="subtitle">Resposta</ThemedText>

            <TextInput
              style={[styles.input, styles.answerInput]}
              placeholder="Ex: Brasília"
              value={answer}
              onChangeText={setAnswer}
              multiline
              returnKeyType="done"
            />

            <Pressable style={styles.button} onPress={handleCreateCard}>
              <ThemedText style={styles.buttonText}>Criar cartão</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },

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

  answerInput: {
    minHeight: 140,
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
