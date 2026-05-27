import "../global.css";
import { DefaultTheme, ThemeProvider, useTheme } from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useEffect } from "react";

import { Text } from "@/components/ui/text";
import { setAuthRouter } from "@/lib/auth/auth-navigation";
import { themeColors } from "@/lib/theme-colors";
import { SessionProvider, useSession } from "@/providers/session-provider";
import { PortalHost } from "@rn-primitives/portal";
import { ActivityIndicator, Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootNavigator() {
  const router = useRouter();
  const segments = useSegments();
  const { colors } = useTheme();
  const { user, isLoading } = useSession();
  const showDevSitemapButton = !segments.includes("new");

  useEffect(() => {
    setAuthRouter(router);
  }, [router]);

  if (isLoading) {
    return (
      <SafeAreaView className="bg-primary flex-1 items-center justify-center">
        <ActivityIndicator color={themeColors.primaryForeground} />
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="(auth)/onboarding"
            options={{ headerShown: false }}
          />
        </Stack.Protected>

        <Stack.Protected guard={!user}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/login/index" />
          <Stack.Screen name="(auth)/signup/step1" />
          <Stack.Screen
            name="(auth)/signup/step2"
            options={{
              headerShown: true,
              headerShadowVisible: false,
              headerTitle: "",
              headerStyle: { backgroundColor: colors.background },
            }}
          />
        </Stack.Protected>
      </Stack>

      {showDevSitemapButton ? (
        <Pressable
          onPress={() => router.push("/_sitemap")}
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
            backgroundColor: "#000",
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 999,
            zIndex: 9999,
            elevation: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>+</Text>
        </Pressable>
      ) : null}

      <StatusBar style="auto" />
      <PortalHost />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <SessionProvider>
            <RootNavigator />
          </SessionProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
