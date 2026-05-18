import { ControlledTextarea } from "@/components/ui/controlled-textarea";
import type { BookConsultationFormValues } from "@/lib/validation/book-consultation-schemas";
import { Control } from "react-hook-form";

type Props = {
  control: Control<BookConsultationFormValues>;
  errors: Partial<Record<keyof BookConsultationFormValues, { message?: string }>>;
};

export function StepTriageComplaint({ control, errors }: Props) {
  return (
    <ControlledTextarea
      control={control}
      name="complaint"
      placeholder="Ex.: Dor forte no peito desde ontem..."
      error={errors.complaint?.message}
    />
  );
}
