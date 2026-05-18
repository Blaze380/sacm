import { fetchConsultationTypes } from "@/lib/api/consultation-types";
import type { ConsultationTypeItem } from "@/lib/api/consultation-types";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getCurrentUser } from "@/lib/auth/user";
import { submitBookConsultation } from "@/lib/book-consultation/submit";
import {
  bookConsultationDefaultValues,
  bookConsultationFormSchema,
  getStepsForMode,
  STEP_FIELDS,
  STEP_SCHEMAS,
  type BookConsultationFormValues,
  type WizardStepId,
} from "@/lib/validation/book-consultation-schemas";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export function useBookConsultationWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [consultationTypes, setConsultationTypes] = useState<
    ConsultationTypeItem[]
  >([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<BookConsultationFormValues>({
    defaultValues: bookConsultationDefaultValues,
    mode: "onChange",
  });

  const mode = form.watch("mode");
  const steps = useMemo(() => getStepsForMode(mode), [mode]);
  const currentStep = steps[stepIndex] ?? "mode";
  const isLastStep = stepIndex === steps.length - 1;
  const isFirstStep = stepIndex === 0;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoadingOptions(true);
      try {
        const types = await fetchConsultationTypes();
        if (!cancelled) {
          setConsultationTypes(types);
        }
      } catch {
        if (!cancelled) {
          setConsultationTypes([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingOptions(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setStepIndex((current) => {
      if (current >= steps.length) {
        return Math.max(0, steps.length - 1);
      }
      return current;
    });
  }, [steps.length]);

  const validateCurrentStep = useCallback(async () => {
    const values = form.getValues();
    const schema = STEP_SCHEMAS[currentStep];
    const parsed = schema.safeParse(values);

    for (const field of STEP_FIELDS[currentStep]) {
      form.clearErrors(field);
    }

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") {
          form.setError(field as keyof BookConsultationFormValues, {
            message: issue.message,
          });
        }
      }
      return false;
    }

    return true;
  }, [currentStep, form]);

  const goNext = useCallback(async () => {
    setSubmitError(null);
    const valid = await validateCurrentStep();
    if (!valid) {
      return false;
    }

    if (isLastStep) {
      return true;
    }

    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    return true;
  }, [isLastStep, steps.length, validateCurrentStep]);

  const goBack = useCallback(() => {
    setSubmitError(null);
    if (isFirstStep) {
      return false;
    }
    setStepIndex((i) => Math.max(0, i - 1));
    return true;
  }, [isFirstStep]);

  const submit = useCallback(async () => {
    setSubmitError(null);
    const valid = await validateCurrentStep();
    if (!valid) {
      return false;
    }

    const parsed = bookConsultationFormSchema.safeParse(form.getValues());
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") {
          form.setError(field as keyof BookConsultationFormValues, {
            message: issue.message,
          });
        }
      }
      return false;
    }

    try {
      const user = await getCurrentUser();
      await submitBookConsultation(parsed.data, user.id);
      return true;
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
      return false;
    }
  }, [form, validateCurrentStep]);

  const resetAfterModeChange = useCallback(
    (previousMode?: BookConsultationFormValues["mode"]) => {
      const nextMode = form.getValues("mode");
      if (previousMode !== nextMode) {
        setStepIndex(0);
      }
    },
    [form],
  );

  const resetWizard = useCallback(() => {
    form.reset(bookConsultationDefaultValues);
    setStepIndex(0);
    setSubmitError(null);
  }, [form]);

  return {
    form,
    steps,
    currentStep,
    stepIndex,
    stepCount: steps.length,
    isLastStep,
    isFirstStep,
    consultationTypes,
    isLoadingOptions,
    submitError,
    goNext,
    goBack,
    submit,
    resetAfterModeChange,
    resetWizard,
  };
}

export type { WizardStepId };
