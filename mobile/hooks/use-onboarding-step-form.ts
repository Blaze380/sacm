import { getCurrentUser } from "@/lib/auth/user";
import {
  getOnboardingStep1Draft,
  getOnboardingStep2Draft,
  setOnboardingCurrentStep,
  setOnboardingStep1Draft,
  setOnboardingStep2Draft,
  type OnboardingStep1Draft,
  type OnboardingStep2Draft,
} from "@/lib/onboarding/storage";
import {
  ONBOARDING_STEP1_DEFAULT_VALUES,
  ONBOARDING_STEP2_DEFAULT_VALUES,
} from "@/lib/onboarding/form-defaults";
import { parseStoredPhoneToLocal } from "@/lib/phone/mozambique";
import type {
  OnboardingStep1FormData,
  OnboardingStep2FormData,
} from "@/lib/validation/onboarding-schemas";
import { useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

const DRAFT_DEBOUNCE_MS = 400;

type Step1Options = {
  step: "step1";
  form: UseFormReturn<OnboardingStep1FormData>;
};

type Step2Options = {
  step: "step2";
  form: UseFormReturn<OnboardingStep2FormData>;
};

export function useOnboardingStepForm(options: Step1Options | Step2Options) {
  const [isHydrating, setIsHydrating] = useState(true);
  const hydratedRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formRef = useRef(options.form);

  formRef.current = options.form;

  const { step } = options;

  useEffect(() => {
    void setOnboardingCurrentStep(step);
  }, [step]);

  useEffect(() => {
    if (hydratedRef.current) return;

    let cancelled = false;
    setIsHydrating(true);

    void (async () => {
      try {
        const draft =
          step === "step1"
            ? await getOnboardingStep1Draft()
            : await getOnboardingStep2Draft();

        let serverValues: Partial<
          OnboardingStep1FormData & OnboardingStep2FormData
        > = {};

        try {
          const user = await getCurrentUser();
          if (cancelled) return;

          if (step === "step1") {
            serverValues = {
              firstName: user.firstName ?? "",
              lastName: user.lastName ?? "",
              phone: user.phone
                ? `+258${parseStoredPhoneToLocal(user.phone)}`
                : "+258",
              birthDate: user.birthDate
                ? new Date(user.birthDate)
                : undefined,
            };
          } else {
            serverValues = {
              province: user.province,
              city: user.city ?? "",
              neighborhood: user.neighborhood ?? "",
            };
          }
        } catch {
          // preload optional
        }

        if (cancelled) return;

        const { reset } = formRef.current;

        if (step === "step1") {
          const d = draft as OnboardingStep1Draft | null;
          reset(
            {
              ...ONBOARDING_STEP1_DEFAULT_VALUES,
              ...serverValues,
              firstName: d?.firstName ?? serverValues.firstName ?? "",
              lastName: d?.lastName ?? serverValues.lastName ?? "",
              phone: d?.phone ?? serverValues.phone ?? "+258",
              birthDate: d?.birthDate
                ? new Date(d.birthDate)
                : serverValues.birthDate,
            } as OnboardingStep1FormData,
            { keepDirtyValues: true },
          );
        } else {
          const d = draft as OnboardingStep2Draft | null;
          reset(
            {
              ...ONBOARDING_STEP2_DEFAULT_VALUES,
              ...serverValues,
              province: d?.province ?? serverValues.province,
              city: d?.city ?? serverValues.city ?? "",
              neighborhood: d?.neighborhood ?? serverValues.neighborhood ?? "",
            } as OnboardingStep2FormData,
            { keepDirtyValues: true },
          );
        }

        hydratedRef.current = true;
      } finally {
        if (!cancelled) {
          setIsHydrating(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [step]);

  useEffect(() => {
    const { watch } = formRef.current;

    const subscription = watch((values) => {
      if (!hydratedRef.current) return;

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        if (step === "step1") {
          const v = values as OnboardingStep1FormData;
          const draft: OnboardingStep1Draft = {
            firstName: v.firstName ?? "",
            lastName: v.lastName ?? "",
            phone: v.phone ?? "+258",
            birthDate:
              v.birthDate instanceof Date && !isNaN(v.birthDate.getTime())
                ? v.birthDate.toISOString()
                : undefined,
          };
          void setOnboardingStep1Draft(draft);
        } else {
          const v = values as OnboardingStep2FormData;
          void setOnboardingStep2Draft({
            province: v.province,
            city: v.city ?? "",
            neighborhood: v.neighborhood ?? "",
          });
        }
      }, DRAFT_DEBOUNCE_MS);
    });

    return () => {
      subscription.unsubscribe();
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [step]);

  return { isHydrating };
}
