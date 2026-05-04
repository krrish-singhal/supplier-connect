import "@/src/utils/classNameShim";
import { useEffect, Component, type ReactNode } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, ScrollView } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useAuthStore } from "@/src/store/authStore";

// Keep the native splash visible until we're ready
SplashScreen.preventAutoHideAsync();

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      const err = this.state.error as Error;
      return (
        <View
          style={{
            flex: 1,
            padding: 24,
            paddingTop: 60,
            backgroundColor: "#fff",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#dc2626",
              marginBottom: 12,
            }}
          >
            App Error
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#1e293b",
              marginBottom: 8,
              fontWeight: "600",
            }}
          >
            {err.message}
          </Text>
          <ScrollView>
            <Text
              style={{
                fontSize: 11,
                color: "#64748b",
                fontFamily: "monospace",
              }}
            >
              {err.stack}
            </Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const isLoading = useAuthStore((state) => state.isLoading);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const hydrateUserData =
    require("@/src/store/userDataStore").useUserDataStore.getState().hydrate;

  useEffect(() => {
    hydrate();
    hydrateUserData();
  }, [hydrate]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#F8FAFC" },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
          <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
          <Stack.Screen
            name="suppliers/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="opportunities/[id]"
            options={{ headerShown: false }}
          />
        </Stack>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
