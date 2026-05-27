import { Text } from "@/components/ui/text";
import { themeColors } from "@/lib/theme-colors";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react-native";
import { Pressable, View } from "react-native";

type Props = {
  label: string;
  subtitle?: string;
  destructive?: boolean;
  onPress: () => void;
};

export function AccountMenuRow({
  label,
  subtitle,
  destructive,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between py-4 border-b border-border active:opacity-70"
    >
      <View className="flex-1 gap-0.5 pr-3">
        <Text
          className={cn(
            "text-base font-medium",
            destructive ? "text-destructive" : "text-foreground",
          )}
        >
          {label}
        </Text>
        {subtitle ? (
          <Text className="text-sm text-muted-foreground">{subtitle}</Text>
        ) : null}
      </View>
      <ChevronRight
        size={20}
        color={destructive ? themeColors.destructive : themeColors.mutedIcon}
      />
    </Pressable>
  );
}
