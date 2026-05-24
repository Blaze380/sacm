import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { BookConsultationMode } from "@/lib/validation/book-consultation-schemas";
import { Pressable, View } from "react-native";

type Props = {
  value: BookConsultationMode;
  title: string;
  description: string;
  selected: boolean;
  onSelect: (value: BookConsultationMode) => void;
};

export function TypeOptionCard({
  value,
  title,
  description,
  selected,
  onSelect,
}: Props) {
  return (
    <Pressable
      onPress={() => onSelect(value)}
      className={cn(
        "flex-row items-start gap-3 rounded-xl border p-4",
        selected ? "border-primary bg-primary/5" : "border-border bg-card",
      )}
    >
      <View
        className={cn(
          "mt-0.5 aspect-square size-4 shrink-0 items-center justify-center rounded-full border",
          selected ? "border-primary" : "border-input",
        )}
      >
        {selected ? (
          <View className="size-2 rounded-full bg-primary" />
        ) : null}
      </View>
      <View className="flex-1 gap-1">
        <Text className="font-semibold text-base">{title}</Text>
        <Text className="text-muted-foreground text-sm">{description}</Text>
      </View>
    </Pressable>
  );
}
