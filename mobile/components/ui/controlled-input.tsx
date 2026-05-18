import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Input } from "./input";
import { KeyboardType, TextInputProps, View } from "react-native";
import { Text } from "./text";

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  keyboardType?: KeyboardType;
  autoComplete?: TextInputProps["autoComplete"];
  textContentType?: TextInputProps["textContentType"];
  placeholder?: string;
  error?: string;
  className?: string;
  full?: boolean;
  disabled?: boolean;
  secureTextEntry?: boolean;
}

export function ControllerInput<T extends FieldValues>({
  control,
  name,
  autoComplete,
  keyboardType,
  textContentType,
  disabled,
  placeholder,
  full = false,
  error,
  className,
  secureTextEntry,
}: Props<T>) {
  const { field } = useController({
    name,
    control,
  });

  return (
    <View className={className + " " + (full ? "w-full" : "")}>
      <Input
        keyboardType={keyboardType}
        editable={!disabled}
        textContentType={textContentType}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={field.value}
        onChangeText={field.onChange}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text className="text-red-400">{error}</Text>}
    </View>
  );
}
