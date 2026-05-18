import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import {
  COUNTRY_CODE,
  extractMozLocalDigits,
  formatMozPhoneDisplay,
} from "@/lib/phone/mozambique";
import { cn } from "@/lib/utils";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { View } from "react-native";

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  error?: string;
  className?: string;
}

export function PhoneInput<T extends FieldValues>({
  control,
  name,
  error,
  className,
}: Props<T>) {
  const { field } = useController({ control, name });

  const localDigits = extractMozLocalDigits(field.value ?? "");
  const display = formatMozPhoneDisplay(localDigits);

  function onChangeText(text: string) {
    const digits = extractMozLocalDigits(text);
    field.onChange(`${COUNTRY_CODE}${digits}`);
  }

  return (
    <View className={cn("w-full", className)}>
      <View className="flex-row items-center border border-input rounded-md bg-background overflow-hidden">
        <View className="flex-row items-center gap-1 px-3 border-r border-input h-10">
          <Text className="text-base">🇲🇿</Text>
          <Text className="text-foreground text-base">{COUNTRY_CODE}</Text>
        </View>
        <Input
          className="flex-1 border-0 rounded-none h-10"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          placeholder="84 123 4567"
          value={display}
          onChangeText={onChangeText}
          maxLength={13}
        />
      </View>
      {error && <Text className="text-red-400 mt-1">{error}</Text>}
    </View>
  );
}
