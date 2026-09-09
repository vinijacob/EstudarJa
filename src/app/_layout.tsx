import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />

      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Estudar Já",
          }}
        />

        <Stack.Screen
          name="cards/index"
          options={{
            title: "Meus cartões",
          }}
        />

        <Stack.Screen
          name="cards/create"
          options={{
            title: "Novo cartão",
          }}
        />

        <Stack.Screen
          name="cards/edit"
          options={{
            title: "Editar cartão",
          }}
        />

        <Stack.Screen
          name="review/index"
          options={{
            title: "Revisão",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
