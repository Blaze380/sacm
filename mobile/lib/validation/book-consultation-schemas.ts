import { z } from "zod/v4";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export const bookConsultationModeSchema = z.object({
  mode: z.enum(["TRIAGE", "DIRECT", "REFERRAL"], "Selecione uma opção"),
});

export const bookConsultationComplaintSchema = z.object({
  complaint: z.string().min(3, "Descreva a sua reclamação"),
});

export const bookConsultationSymptomSchema = z.object({
  symptomTaken: z.string().min(2, "Descreva o sintoma"),
  symptomDuration: z.string().min(2, "Indique a duração dos sintomas"),
});

export const bookConsultationActionSchema = z.object({
  actionTaken: z.string().min(2, "Descreva a acção tomada"),
  reactionAfterAction: z.string().min(2, "Descreva a reação após a acção"),
});

export const bookConsultationScheduleSchema = z.object({
  consultationTypeId: z.string().min(1, "Selecione o tipo de consulta"),
  date: z
    .date("Selecione a data")
    .min(startOfToday(), "A data deve ser hoje ou no futuro"),
  notes: z.string().optional(),
});

export const triageWizardSchema = z.object({
  mode: z.literal("TRIAGE"),
  complaint: z.string().min(3, "Descreva a sua reclamação"),
  symptomTaken: z.string().min(2, "Descreva o sintoma"),
  symptomDuration: z.string().min(2, "Indique a duração dos sintomas"),
  actionTaken: z.string().min(2, "Descreva a acção tomada"),
  reactionAfterAction: z.string().min(2, "Descreva a reação após a acção"),
});

export const directWizardSchema = z.object({
  mode: z.literal("DIRECT"),
  consultationTypeId: z.string().min(1, "Selecione o tipo de consulta"),
  date: z
    .date("Selecione a data")
    .min(startOfToday(), "A data deve ser hoje ou no futuro"),
  notes: z.string().optional(),
});

export const referralWizardSchema = z.object({
  mode: z.literal("REFERRAL"),
  triageId: z.string().min(1, "Triagem de encaminhamento em falta"),
  specialtyId: z.string().min(1),
  consultationTypeId: z.string().min(1, "Selecione o tipo de consulta"),
  priority: z.enum(["BAIXA", "MEDIA", "ALTA"]),
  date: z
    .date("Selecione a data")
    .min(startOfToday(), "A data deve ser hoje ou no futuro"),
  notes: z.string().optional(),
});

export const bookConsultationFormSchema = z.discriminatedUnion("mode", [
  triageWizardSchema,
  directWizardSchema,
  referralWizardSchema,
]);

export type TriageWizardData = z.infer<typeof triageWizardSchema>;
export type DirectWizardData = z.infer<typeof directWizardSchema>;
export type ReferralWizardData = z.infer<typeof referralWizardSchema>;
export type BookConsultationFormData = z.infer<typeof bookConsultationFormSchema>;

export type BookConsultationMode = BookConsultationFormData["mode"];

export type BookConsultationFormValues = {
  mode: BookConsultationMode;
  complaint: string;
  symptomTaken: string;
  symptomDuration: string;
  actionTaken: string;
  reactionAfterAction: string;
  consultationTypeId: string;
  triageId?: string;
  specialtyId?: string;
  priority?: "BAIXA" | "MEDIA" | "ALTA";
  date?: Date;
  notes?: string;
};

const triageDefaultValues: BookConsultationFormValues = {
  mode: "TRIAGE",
  complaint: "",
  symptomTaken: "",
  symptomDuration: "",
  actionTaken: "",
  reactionAfterAction: "",
  consultationTypeId: "",
  notes: "",
};

const directDefaultValues: BookConsultationFormValues = {
  mode: "DIRECT",
  complaint: "",
  symptomTaken: "",
  symptomDuration: "",
  actionTaken: "",
  reactionAfterAction: "",
  consultationTypeId: "",
  notes: "",
};

export type ReferralDefaults = {
  triageId: string;
  specialtyId: string;
  consultationTypeId: string;
  priority: "BAIXA" | "MEDIA" | "ALTA";
};

export function getDefaultValuesForMode(
  mode: BookConsultationMode,
  referral?: ReferralDefaults,
): BookConsultationFormValues {
  if (mode === "TRIAGE") {
    return { ...triageDefaultValues };
  }
  if (mode === "REFERRAL" && referral) {
    return {
      mode: "REFERRAL",
      complaint: "",
      symptomTaken: "",
      symptomDuration: "",
      actionTaken: "",
      reactionAfterAction: "",
      consultationTypeId: referral.consultationTypeId,
      triageId: referral.triageId,
      specialtyId: referral.specialtyId,
      priority: referral.priority,
      notes: "",
    };
  }
  return { ...directDefaultValues, mode: "DIRECT" };
}

/** @deprecated Use getDefaultValuesForMode */
export const bookConsultationDefaultValues = triageDefaultValues;

export function getWizardSchema(mode: BookConsultationMode) {
  switch (mode) {
    case "TRIAGE":
      return triageWizardSchema;
    case "DIRECT":
      return directWizardSchema;
    case "REFERRAL":
      return referralWizardSchema;
  }
}

export type WizardStepId =
  | "complaint"
  | "symptom"
  | "action"
  | "consultation";

export function getStepsForMode(mode: BookConsultationMode): WizardStepId[] {
  if (mode === "DIRECT" || mode === "REFERRAL") {
    return ["consultation"];
  }
  return ["complaint", "symptom", "action"];
}

export const STEP_FIELDS: Record<
  WizardStepId,
  (keyof BookConsultationFormValues)[]
> = {
  complaint: ["complaint"],
  symptom: ["symptomTaken", "symptomDuration"],
  action: ["actionTaken", "reactionAfterAction"],
  consultation: ["consultationTypeId", "date", "notes"],
};

export const STEP_SCHEMAS: Record<WizardStepId, z.ZodType> = {
  complaint: bookConsultationComplaintSchema,
  symptom: bookConsultationSymptomSchema,
  action: bookConsultationActionSchema,
  consultation: bookConsultationScheduleSchema,
};

export const STEP_META: Record<
  WizardStepId,
  { title: string; subtitle: string }
> = {
  complaint: {
    title: "Qual é a sua reclamação?",
    subtitle: "Descreva o motivo principal da sua visita.",
  },
  symptom: {
    title: "Sintomas",
    subtitle: "Indique o sintoma e há quanto tempo o sente.",
  },
  action: {
    title: "Acção e reação",
    subtitle: "O que já fez e como reagiu o seu corpo?",
  },
  consultation: {
    title: "Consulta",
    subtitle: "Escolha o tipo de consulta, a data e notas opcionais.",
  },
};
