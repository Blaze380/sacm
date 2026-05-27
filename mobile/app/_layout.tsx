import "../global.css";
import { DefaultTheme, ThemeProvider, useTheme } from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useEffect, useRef } from "react";

import { Text } from "@/components/ui/text";
import { setAuthRouter } from "@/lib/auth/auth-navigation";
import {
  getResolvedOnboardingRoute,
  isOnTargetOnboardingRoute,
  shouldRedirectToOnboarding,
} from "@/lib/onboarding/redirect";
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
  const onboardingRedirectRef = useRef<string | null>(null);

  useEffect(() => {
    setAuthRouter(router);
  }, [router]);

  useEffect(() => {
    if (isLoading || !user) return;

    const segmentKey = segments.join("/");
    if (onboardingRedirectRef.current === segmentKey) return;

    onboardingRedirectRef.current = segmentKey;

    let cancelled = false;

    void (async () => {
      const needsOnboarding = await shouldRedirectToOnboarding(user);
      if (cancelled) return;

      if (!needsOnboarding) {
        if (segments.includes("onboarding")) {
          router.replace("/(tabs)/home");
        }
        return;
      }

      const target = await getResolvedOnboardingRoute(user);
      if (cancelled) return;

      if (!isOnTargetOnboardingRoute(segments, target)) {
        router.replace(target);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoading, user, segments, router]);

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
