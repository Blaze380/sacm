import { Textarea } from "@/components/ui/textarea";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { View } from "react-native";

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  error?: string;
  className?: string;
}

export function ControlledTextarea<T extends FieldValues>({
  control,
  name,
  placeholder,
  error,
  className,
}: Props<T>) {
  const { field } = useController({ control, name });

  return (
    <View className={cn("w-full", className)}>
      <Textarea
        value={typeof field.value === "string" ? field.value : ""}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        placeholder={placeholder}
      />
      {error ? <Text className="text-red-500 mt-1">{error}</Text> : null}
    </View>
  );
}
