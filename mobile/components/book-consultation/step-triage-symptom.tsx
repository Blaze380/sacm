import { ControllerInput } from "@/components/ui/controlled-input";
import { ControlledTextarea } from "@/components/ui/controlled-textarea";
import { useStepFormErrors } from "@/hooks/use-step-form-errors";
import type { BookConsultationFormValues } from "@/lib/validation/book-consultation-schemas";
import { useFormContext } from "react-hook-form";
import { View } from "react-native";

export function StepTriageSymptom() {
  const { control } = useFormContext<BookConsultationFormValues>();
  const errors = useStepFormErrors(["symptomTaken", "symptomDuration"]);

  return (
    <View className="gap-4">
      <ControlledTextarea
        control={control}
        name="symptomTaken"
        placeholder="Descreva o sintoma principal"
        error={errors.symptomTaken?.message}
      />
      <ControllerInput
        control={control}
        name="symptomDuration"
        full
        placeholder="Há quanto tempo? (ex.: 3 dias)"
        error={errors.symptomDuration?.message}
      />
    </View>
  );
}
