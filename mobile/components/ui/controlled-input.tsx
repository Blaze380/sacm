import { Control, FieldValues, useController } from "react-hook-form"
import { Input } from "./input";
import { KeyboardType, TextInputProps, View } from "react-native";
import { Text } from "./text";
import { LoginFormData } from "@/app/(auth)/signup/step2";

interface Props<T extends FieldValues> {
    control: Control<T>
    name: string;
    defaultValue?: string;
    keyboardType?: KeyboardType;
    autoComplete?: TextInputProps["autoComplete"];
    textContentType: TextInputProps["textContentType"];
    placeholder?: string;
    error?: string
    className?: string;
    full?: boolean;
    disabled?: boolean;
}
export function ControllerInput ({
    control,
    name,
    defaultValue,
    autoComplete,
    keyboardType,
    textContentType,
    disabled,
    placeholder,
    full=false,
    error,
    className,
}: Props<LoginFormData>) {
    const { field } = useController({
        name: name as any,
        defaultValue,
        control,
    })

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
            />
            {error &&
                <Text className="text-red-400">{error}</Text>
            }
        </View>
    )
}