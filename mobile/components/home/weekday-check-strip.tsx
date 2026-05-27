import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { themeColors } from "@/lib/theme-colors";
import { Check } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

const WEEKDAYS = [
  { key: 1, label: "Seg" },
  { key: 2, label: "Ter" },
  { key: 3, label: "Qua" },
  { key: 4, label: "Qui" },
  { key: 5, label: "Sex" },
] as const;

export function WeekdayCheckStrip() {
  const today = new Date().getDay();
  const todayKey = today >= 1 && today <= 5 ? today : null;

  const initialChecked = useMemo(() => {
    const set = new Set<number>();
    if (todayKey !== null) set.add(todayKey);
    return set;
  }, [todayKey]);

  const [checked, setChecked] = useState<Set<number>>(initialChecked);

  useEffect(() => {
    if (todayKey !== null) {
      setChecked((prev) => new Set(prev).add(todayKey));
    }
  }, [todayKey]);

  function toggle(day: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }

  return (
    <View className="gap-4">
      <Text className="text-2xl font-semibold">Início</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4 px-1"
      >
        {WEEKDAYS.map(({ key, label }) => {
          const isToday = key === todayKey;
          const isChecked = checked.has(key);
          return (
            <Pressable
              key={key}
              onPress={() => toggle(key)}
              className="items-center gap-2"
            >
              <Text
                className={cn(
                  "text-sm font-medium",
                  isToday ? "text-primary" : "text-muted-foreground",
                )}
              >
                {label}
              </Text>
              <View
                className={cn(
                  "h-10 w-10 rounded-full border-2 items-center justify-center",
                  isToday ? "border-primary" : "border-border",
                  isChecked && "bg-primary border-primary",
                )}
              >
                {isChecked && (
                  <Check size={20} color={themeColors.primaryForeground} />
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
