import { DiscardSheet, type DiscardSheetRef } from "@/components/book-consultation/discard-sheet";
import { StepSchedule } from "@/components/book-consultation/step-schedule";
import { StepTriageAction } from "@/components/book-consultation/step-triage-action";
import { StepTriageComplaint } from "@/components/book-consultation/step-triage-complaint";
import { StepTriageSymptom } from "@/components/book-consultation/step-triage-symptom";
import { StepTypeSelect } from "@/components/book-consultation/step-type-select";
import { WizardShell } from "@/components/book-consultation/wizard-shell";
import { useBookConsultationWizard } from "@/hooks/use-book-consultation-wizard";
import { STEP_META } from "@/lib/validation/book-consultation-schemas";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { BackHandler } from "react-native";
import { FormProvider } from "react-hook-form";
import { useFocusEffect } from "@react-navigation/native";

export function BookConsultationWizard() {
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
    resetAfterModeChange,
    resetWizard,
  } = useBookConsultationWizard();

  const { control, formState } = form;
  const errors = formState.errors;
  const meta = STEP_META[currentStep];

  const exitForm = useCallback(() => {
    resetWizard();
    router.back();
  }, [resetWizard, router]);

  const tryExit = useCallback(() => {
    if (formState.isDirty) {
      discardRef.current?.present();
      return true;
    }
    exitForm();
    return true;
  }, [exitForm, formState.isDirty]);

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
    switch (currentStep) {
      case "mode":
        return (
          <StepTypeSelect
            control={control}
            onModeChange={resetAfterModeChange}
          />
        );
      case "complaint":
        return <StepTriageComplaint control={control} errors={errors} />;
      case "symptom":
        return <StepTriageSymptom control={control} errors={errors} />;
      case "action":
        return <StepTriageAction control={control} errors={errors} />;
      case "consultation":
        return (
          <StepSchedule
            control={control}
            errors={errors}
            consultationTypes={consultationTypes}
            isLoadingOptions={isLoadingOptions}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormProvider {...form}>
      <WizardShell
        title={meta.title}
        subtitle={meta.subtitle}
        stepIndex={stepIndex}
        stepCount={stepCount}
        primaryLabel={isLastStep ? "Confirmar pedido" : "Próximo"}
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
