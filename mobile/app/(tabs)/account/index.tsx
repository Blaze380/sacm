import { AccountHeader } from "@/components/account/account-header";
import { AccountLogoutDialog } from "@/components/account/account-logout-dialog";
import { AccountMenuRow } from "@/components/account/account-menu-row";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getCurrentUser } from "@/lib/auth/user";
import type { GetMe200 } from "@/gen/models/GetMe";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountTab() {
  const router = useRouter();
  const [user, setUser] = useState<GetMe200 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="flex-1 px-6 pt-8 gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="flex-1 px-6 pt-8 gap-4 items-center justify-center">
          <Text className="text-red-500 text-center">{error}</Text>
          <Button variant="outline" onPress={() => void load()}>
            <Text>Tentar novamente</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-1 px-6 pt-8">
        <AccountHeader firstName={user?.firstName} email={user?.email} />

        <View className="mt-8 rounded-xl bordera border-bordera abg-card px-4">
          <AccountMenuRow
            label="Dados pessoais"
            subtitle="Nome, contacto e morada"
            onPress={() => router.push("/(tabs)/account/personal")}
          />
          <AccountMenuRow
            label="Segurança"
            subtitle="Palavra-passe"
            onPress={() => router.push("/(tabs)/account/security")}
          />
          <AccountMenuRow
            label="Sair"
            destructive
            onPress={() => setLogoutOpen(true)}
          />
        </View>
      </View>

      <AccountLogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </SafeAreaView>
  );
}
