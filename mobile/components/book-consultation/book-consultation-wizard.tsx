import { DiscardSheet, type DiscardSheetRef } from "@/components/book-consultation/discard-sheet";
import { StepSchedule } from "@/components/book-consultation/step-schedule";
import { StepTriageAction } from "@/components/book-consultation/step-triage-action";
import { StepTriageComplaint } from "@/components/book-consultation/step-triage-complaint";
import { StepTriageSymptom } from "@/components/book-consultation/step-triage-symptom";
import { WizardShell } from "@/components/book-consultation/wizard-shell";
import {
  useBookConsultationWizard,
  type ReferralWizardContext,
} from "@/hooks/use-book-consultation-wizard";
import {
  STEP_META,
  type BookConsultationMode,
} from "@/lib/validation/book-consultation-schemas";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { BackHandler } from "react-native";
import { FormProvider } from "react-hook-form";

type Props = {
  mode: BookConsultationMode;
  referral?: ReferralWizardContext;
};

export function BookConsultationWizard({ mode, referral }: Props) {
  const router = useRouter();
  const discardRef = useRef<DiscardSheetRef>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    form,
    currentStep,
    stepIndex,
    stepCount,
    isLastStep,
    isFirstStep,
    consultationTypes,
    isLoadingOptions,
    submitError,
    goNext,
    goBack,
    submit,
    resetWizard,
  } = useBookConsultationWizard(mode, referral);

  const { isDirty } = form.formState;
  const meta = STEP_META[currentStep];
  const primaryLabel =
    isLastStep && mode === "TRIAGE"
      ? "Confirmar triagem"
      : isLastStep
        ? mode === "REFERRAL"
          ? "Confirmar agendamento"
          : "Confirmar pedido"
        : "Próximo";

  const exitForm = useCallback(() => {
    resetWizard();
    router.back();
  }, [resetWizard, router]);

  const tryExit = useCallback(() => {
    if (isDirty) {
      discardRef.current?.present();
      return true;
    }
    exitForm();
    return true;
  }, [exitForm, isDirty]);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        if (!isFirstStep) {
          goBack();
          return true;
        }
        return tryExit();
      });
      return () => sub.remove();
    }, [goBack, isFirstStep, tryExit]),
  );

  const handleClosePress = useCallback(() => {
    tryExit();
  }, [tryExit]);

  const handlePreviousPress = useCallback(() => {
    goBack();
  }, [goBack]);

  const handlePrimary = useCallback(async () => {
    if (!isLastStep) {
      await goNext();
      return;
    }

    setIsSubmitting(true);
    const ok = await submit();
    setIsSubmitting(false);

    if (ok) {
      resetWizard();
      router.replace("/(tabs)/consultations");
    }
  }, [goNext, isLastStep, resetWizard, router, submit]);

  const renderStep = () => {
    if (mode === "TRIAGE") {
      switch (currentStep) {
        case "complaint":
          return <StepTriageComplaint />;
        case "symptom":
          return <StepTriageSymptom />;
        case "action":
          return <StepTriageAction />;
        default:
          return null;
      }
    }

    return (
      <StepSchedule
        consultationTypes={consultationTypes}
        isLoadingOptions={isLoadingOptions}
        lockConsultationType={mode === "REFERRAL"}
      />
    );
  };

  return (
    <FormProvider {...form}>
      <WizardShell
        title={meta.title}
        subtitle={meta.subtitle}
        stepIndex={stepIndex}
        stepCount={stepCount}
        primaryLabel={primaryLabel}
        onPrimaryPress={() => void handlePrimary()}
        onClosePress={handleClosePress}
        showPrevious={!isFirstStep}
        onPreviousPress={handlePreviousPress}
        isLoading={isSubmitting}
        submitError={submitError}
      >
        {renderStep()}
      </WizardShell>

      <DiscardSheet
        ref={discardRef}
        onContinue={() => discardRef.current?.dismiss()}
        onCancel={exitForm}
      />
    </FormProvider>
  );
}
