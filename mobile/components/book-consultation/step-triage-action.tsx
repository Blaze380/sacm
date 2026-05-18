import { ControlledTextarea } from "@/components/ui/controlled-textarea";
import type { BookConsultationFormValues } from "@/lib/validation/book-consultation-schemas";
import { Control } from "react-hook-form";
import { View } from "react-native";

type Props = {
  control: Control<BookConsultationFormValues>;
  errors: Partial<Record<keyof BookConsultationFormValues, { message?: string }>>;
};

export function StepTriageAction({ control, errors }: Props) {
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
