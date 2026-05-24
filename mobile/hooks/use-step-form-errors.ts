import type { BookConsultationFormValues } from "@/lib/validation/book-consultation-schemas";
import {
  useFormContext,
  useFormState,
  type FieldPath,
} from "react-hook-form";

export function useStepFormErrors(
  names: FieldPath<BookConsultationFormValues>[],
) {
  const { control } = useFormContext<BookConsultationFormValues>();
  const { errors } = useFormState({
    control,
    name: names,
  });

  return errors;
}
