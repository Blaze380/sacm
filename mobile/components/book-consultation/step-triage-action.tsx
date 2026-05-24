import { ControlledTextarea } from "@/components/ui/controlled-textarea";
import { useStepFormErrors } from "@/hooks/use-step-form-errors";
import type { BookConsultationFormValues } from "@/lib/validation/book-consultation-schemas";
import { useFormContext } from "react-hook-form";
import { View } from "react-native";

export function StepTriageAction() {
  const { control } = useFormContext<BookConsultationFormValues>();
  const errors = useStepFormErrors(["actionTaken", "reactionAfterAction"]);

  return (
    <View className="gap-4">
      <ControlledTextarea
        control={control}
        name="actionTaken"
        placeholder="Que medicação ou cuidados já tomou?"
        error={errors.actionTaken?.message}
      />
      <ControlledTextarea
        control={control}
        name="reactionAfterAction"
        placeholder="Como reagiu após a acção?"
        error={errors.reactionAfterAction?.message}
      />
    </View>
  );
}
