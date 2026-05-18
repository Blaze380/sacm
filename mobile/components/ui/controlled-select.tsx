import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { View } from "react-native";

type Option = { value: string; label: string };

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  options: Option[];
  placeholder?: string;
  error?: string;
  className?: string;
}

export function ControlledSelect<T extends FieldValues>({
  control,
  name,
  options,
  placeholder = "Selecionar",
  error,
  className,
}: Props<T>) {
  const { field } = useController({ control, name });

  const selected = options.find((o) => o.value === field.value);

  return (
    <View className={cn("w-full", className)}>
      <Select
        value={
          field.value
            ? { value: field.value, label: selected?.label ?? field.value }
            : undefined
        }
        onValueChange={(option) => {
          if (option) {
            field.onChange(option.value);
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} label={option.label}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <Text className="text-red-400 mt-1">{error}</Text>}
    </View>
  );
}
