import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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
import { saveCard } from "@/services/storageService";

export default function CreateCardScreen() {
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function handleSave() {
    if (!question.trim() || !answer.trim()) {
      return;
    }

    const card = new Card(
      Date.now().toString(),
      question.trim(),
      answer.trim(),
    );

    await saveCard(card);

    router.back();
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
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <ThemedText style={styles.backButtonText}>← Voltar</ThemedText>
            </Pressable>

            <ThemedText style={styles.title}>Novo cartão</ThemedText>

            <ThemedText style={styles.subtitle}>
              Crie uma pergunta e sua resposta.
            </ThemedText>

            <ThemedView style={styles.form}>
              <ThemedText style={styles.label}>PERGUNTA</ThemedText>

              <TextInput
                style={styles.input}
                value={question}
                onChangeText={setQuestion}
                placeholder="Ex: Qual é a capital do Brasil?"
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
                onSubmitEditing={Keyboard.dismiss}
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
                  <ThemedText style={styles.saveText}>Salvar cartão</ThemedText>
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
    paddingBottom: 50,
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
