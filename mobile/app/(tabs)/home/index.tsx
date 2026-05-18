import { HelloSection } from "@/components/home/hello-section";
import { UpcomingList } from "@/components/home/upcoming-list";
import { WeekdayCheckStrip } from "@/components/home/weekday-check-strip";
import { Text } from "@/components/ui/text";
import { useHomeData } from "@/hooks/use-home-data";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeTab() {
  const router = useRouter();
  const { user, items, isLoading, error, refetch } = useHomeData();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-8 gap-8"
        showsVerticalScrollIndicator={false}
      >
        <WeekdayCheckStrip />
        <HelloSection firstName={user?.firstName} />
        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-semibold">Próximas consultas</Text>
            <Pressable
              onPress={() => router.push("/(tabs)/consultations/new")}
              className="h-9 w-9 rounded-full bg-primary items-center justify-center"
              accessibilityLabel="Nova consulta"
            >
              <Plus size={20} color="#fff" />
            </Pressable>
          </View>
          <UpcomingList
            items={items}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
