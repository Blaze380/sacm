import { getCurrentUser } from "@/lib/auth/user";
import { getAccessToken } from "@/lib/auth/session";
import { getOnboardingRoute } from "@/lib/onboarding/progress";
import { shouldResumeRedirect } from "@/lib/onboarding/resume";
import { Stack, usePathname, useRouter } from "expo-router";
import { useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default function OnboardingLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const checkedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function resume() {
        const token = await getAccessToken();
        if (!token) {
          router.replace("/(auth)/login");
          return;
        }

        try {
          const user = await getCurrentUser();
          if (cancelled) return;

          const target = getOnboardingRoute(user);
          const currentPath = pathname ?? "";

          if (shouldResumeRedirect(currentPath, target)) {
            router.replace(target);
          }
        } catch {
          // Sessão inválida: apiClient interceptor limpa token e redireciona para login
        } finally {
          checkedRef.current = true;
        }
      }

      void resume();

      return () => {
        cancelled = true;
      };
    }, [pathname, router]),
  );

  return <Stack screenOptions={{ headerShown: false }} />;
}
