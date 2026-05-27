import { logout } from "@/gen/clients/logout";
import type { GetMe200 } from "@/gen/models/GetMe";
import { apiClient } from "@/lib/api-client";
import { clearAccessToken, getAccessToken } from "@/lib/auth/session";
import { registerClearSessionState } from "@/lib/auth/session-state";
import { clearCachedUser, getCurrentUser } from "@/lib/auth/user";
import { clearAllOnboardingState } from "@/lib/onboarding/storage";
import { useRouter } from "expo-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SessionContextValue = {
  user: GetMe200 | null;
  isLoading: boolean;
  refreshSession: () => Promise<GetMe200 | null>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<GetMe200 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionBootstrappedRef = useRef(false);

  const clearSession = useCallback(async () => {
    await clearAccessToken();
    clearCachedUser();
    await clearAllOnboardingState();
    setUser(null);
  }, []);

  const refreshSession = useCallback(async (): Promise<GetMe200 | null> => {
    const token = await getAccessToken();
    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch {
      await clearSession();
      router.replace("/(auth)/login");
      return null;
    }
  }, [clearSession, router]);

  const signOut = useCallback(async () => {
    try {
      await logout({ client: apiClient });
    } catch {
      // Best-effort: clear local session even if API fails
    }
    await clearSession();
    router.replace("/(auth)/login");
  }, [clearSession, router]);

  useEffect(() => {
    registerClearSessionState(() => setUser(null));
    return () => registerClearSessionState(null);
  }, []);

  useEffect(() => {
    if (sessionBootstrappedRef.current) return;

    void (async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          setUser(null);
          return;
        }

        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        await clearSession();
        router.replace("/(auth)/login");
      } finally {
        sessionBootstrappedRef.current = true;
        setIsLoading(false);
      }
    })();
  }, [clearSession, router]);

  const value = useMemo(
    () => ({ user, isLoading, refreshSession, signOut }),
    [user, isLoading, refreshSession, signOut],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}
