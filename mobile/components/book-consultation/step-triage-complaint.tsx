import { ControlledTextarea } from "@/components/ui/controlled-textarea";
import { useStepFormErrors } from "@/hooks/use-step-form-errors";
import type { BookConsultationFormValues } from "@/lib/validation/book-consultation-schemas";
import { useFormContext } from "react-hook-form";

export function StepTriageComplaint() {
  const { control } = useFormContext<BookConsultationFormValues>();
  const errors = useStepFormErrors(["complaint"]);

  return (
    <ControlledTextarea
      control={control}
      name="complaint"
      placeholder="Ex.: Dor forte no peito desde ontem..."
      error={errors.complaint?.message}
    />
  );
}
