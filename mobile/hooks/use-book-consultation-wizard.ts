import { fetchConsultationTypes } from "@/lib/api/consultation-types";
import type { ConsultationTypeItem } from "@/lib/api/consultation-types";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getCurrentUser } from "@/lib/auth/user";
import { submitBookConsultation } from "@/lib/book-consultation/submit";
import {
  getDefaultValuesForMode,
  getStepsForMode,
  getWizardSchema,
  STEP_FIELDS,
  STEP_SCHEMAS,
  type BookConsultationFormData,
  type BookConsultationFormValues,
  type BookConsultationMode,
  type ReferralDefaults,
  type WizardStepId,
} from "@/lib/validation/book-consultation-schemas";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export type ReferralWizardContext = ReferralDefaults;

export function useBookConsultationWizard(
  mode: BookConsultationMode,
  referral?: ReferralWizardContext,
) {
  const [stepIndex, setStepIndex] = useState(0);
  const [consultationTypes, setConsultationTypes] = useState<
    ConsultationTypeItem[]
  >([]);
  const loadsScheduleOptions = mode === "DIRECT" || mode === "REFERRAL";
  const [isLoadingOptions, setIsLoadingOptions] = useState(loadsScheduleOptions);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultValues = useMemo(
    () => getDefaultValuesForMode(mode, referral),
    [mode, referral],
  );

  const form = useForm<BookConsultationFormValues>({
    defaultValues,
    mode: "onTouched",
    shouldUnregister: false,
    shouldFocusError: true,
  });

  const steps = useMemo(() => getStepsForMode(mode), [mode]);
  const currentStep = steps[stepIndex] ?? steps[0];
  const isLastStep = stepIndex === steps.length - 1;
  const isFirstStep = stepIndex === 0;

  useEffect(() => {
    if (!loadsScheduleOptions) {
      return;
    }

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
  }, [loadsScheduleOptions]);

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
    const fields = STEP_FIELDS[currentStep];
    const stepValues = Object.fromEntries(
      fields.map((key) => [key, values[key]]),
    );
    const parsed = schema.safeParse(stepValues);

    for (const field of STEP_FIELDS[currentStep]) {
      form.clearErrors(field);
    }

    if (!parsed.success) {
      let focused = false;
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") {
          form.setError(field as keyof BookConsultationFormValues, {
            message: issue.message,
          });
          if (!focused) {
            form.setFocus(field as keyof BookConsultationFormValues);
            focused = true;
          }
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

  const submit = useCallback(async (): Promise<boolean> => {
    setSubmitError(null);
    const stepValid = await validateCurrentStep();
    if (!stepValid) {
      return false;
    }

    const schema = getWizardSchema(mode);
    const parsed = schema.safeParse(form.getValues());
    if (!parsed.success) {
      let focused = false;
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") {
          form.setError(field as keyof BookConsultationFormValues, {
            message: issue.message,
          });
          if (!focused) {
            form.setFocus(field as keyof BookConsultationFormValues);
            focused = true;
          }
        }
      }
      return false;
    }

    const payload = parsed.data as BookConsultationFormData;

    return new Promise<boolean>((resolve) => {
      form.handleSubmit(
        async () => {
          try {
            const user = await getCurrentUser();
            await submitBookConsultation(payload, user.id);
            resolve(true);
          } catch (error) {
            setSubmitError(getApiErrorMessage(error));
            resolve(false);
          }
        },
        () => resolve(false),
      )();
    });
  }, [form, mode, validateCurrentStep]);

  const resetWizard = useCallback(() => {
    form.reset(getDefaultValuesForMode(mode, referral));
    setStepIndex(0);
    setSubmitError(null);
  }, [form, mode, referral]);

  return {
    form,
    mode,
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
    resetWizard,
  };
}

export type { WizardStepId };
