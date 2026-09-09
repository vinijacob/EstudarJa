import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

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

    Keyboard.dismiss();
    router.back();
  }

  if (!card) {
    return (
      <ThemedView style={styles.container}>
        <LinearGradient
          colors={["#18090B", "#2A0D12", "#100607"]}
          style={StyleSheet.absoluteFill}
        />

        <ThemedView style={styles.center}>
          <ThemedText style={styles.loadingText}>Carregando...</ThemedText>
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

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              style={styles.backButton}
              onPress={() => {
                Keyboard.dismiss();
                router.back();
              }}
            >
              <ThemedText style={styles.backButtonText}>← Voltar</ThemedText>
            </Pressable>

            <ThemedText style={styles.title}>Editar cartão</ThemedText>

            <ThemedText style={styles.subtitle}>
              Altere a pergunta ou a resposta do seu cartão.
            </ThemedText>

            <ThemedView style={styles.form}>
              <ThemedText style={styles.label}>PERGUNTA</ThemedText>

              <TextInput
                style={styles.input}
                value={question}
                onChangeText={setQuestion}
                placeholder="Digite a pergunta..."
                placeholderTextColor="#76595D"
                multiline
                textAlignVertical="top"
                returnKeyType="done"
                blurOnSubmit={false}
              />

              <ThemedText style={styles.label}>RESPOSTA</ThemedText>

              <TextInput
                style={styles.input}
                value={answer}
                onChangeText={setAnswer}
                placeholder="Digite a resposta..."
                placeholderTextColor="#76595D"
                multiline
                textAlignVertical="top"
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={() => Keyboard.dismiss()}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleSave}
              >
                <LinearGradient
                  colors={["#FF4757", "#D7263D"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.saveGradient}
                >
                  <ThemedText style={styles.saveText}>
                    Salvar alterações
                  </ThemedText>
                </LinearGradient>
              </Pressable>
            </ThemedView>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#100607",
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  loadingText: {
    fontSize: 16,
    color: "#B99B9F",
  },

  backButton: {
    alignSelf: "flex-start",
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: "transparent",
  },

  backButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF6B78",
  },

  title: {
    fontSize: 38,
    lineHeight: 46,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#B99B9F",
  },

  form: {
    marginTop: 35,
    gap: 10,
    backgroundColor: "transparent",
  },

  label: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#FF7B87",
  },

  input: {
    minHeight: 120,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 105, 120, 0.30)",
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 23,
  },

  saveButton: {
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
  },

  saveGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  saveText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});
