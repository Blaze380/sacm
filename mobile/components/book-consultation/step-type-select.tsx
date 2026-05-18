import { TypeOptionCard } from "@/components/book-consultation/type-option-card";
import { RadioGroup } from "@/components/ui/radio-group";
import type { BookConsultationFormValues } from "@/lib/validation/book-consultation-schemas";
import { Text } from "@/components/ui/text";
import { Control, useController } from "react-hook-form";
import { View } from "react-native";

type Props = {
  control: Control<BookConsultationFormValues>;
  onModeChange?: (previousMode?: BookConsultationFormValues["mode"]) => void;
};

export function StepTypeSelect({ control, onModeChange }: Props) {
  const { field, fieldState } = useController({ control, name: "mode" });

  const handleModeChange = (value: BookConsultationFormValues["mode"]) => {
    const previousMode = field.value;
    field.onChange(value);
    onModeChange?.(previousMode);
  };

  return (
    <View className="gap-3">
      <RadioGroup
        value={field.value}
        onValueChange={(value) => {
          if (value === "TRIAGE" || value === "DIRECT") {
            handleModeChange(value);
          }
        }}
      >
        <TypeOptionCard
          value="TRIAGE"
          title="Triagem"
          description="Não sei que consulta preciso — descrevo os sintomas e a equipa orienta."
          selected={field.value === "TRIAGE"}
          onSelect={handleModeChange}
        />
        <TypeOptionCard
          value="DIRECT"
          title="Marcar consulta"
          description="Já sei o tipo de consulta que quero."
          selected={field.value === "DIRECT"}
          onSelect={handleModeChange}
        />
      </RadioGroup>
      {fieldState.error?.message ? (
        <Text className="text-red-500">{fieldState.error.message}</Text>
      ) : null}
    </View>
  );
}
