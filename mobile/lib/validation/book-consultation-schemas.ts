import { z } from "zod/v4";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export const bookConsultationModeSchema = z.object({
  mode: z.enum(["TRIAGE", "DIRECT"], "Selecione uma opção"),
});

export const bookConsultationComplaintSchema = z.object({
  complaint: z.string().min(3, "Descreva a sua reclamação"),
});

export const bookConsultationSymptomSchema = z.object({
  symptom: z.string().min(2, "Descreva o sintoma"),
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

export const bookConsultationFormSchema = z
  .object({
    mode: z.enum(["TRIAGE", "DIRECT"]),
    complaint: z.string(),
    symptom: z.string(),
    symptomDuration: z.string(),
    actionTaken: z.string(),
    reactionAfterAction: z.string(),
    consultationTypeId: z.string(),
    date: z.date(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "DIRECT") {
      const schedule = bookConsultationScheduleSchema.safeParse({
        consultationTypeId: data.consultationTypeId,
        date: data.date,
        notes: data.notes,
      });
      if (!schedule.success) {
        for (const issue of schedule.error.issues) {
          ctx.addIssue(issue);
        }
      }
    }

    if (data.mode === "TRIAGE") {
      for (const schema of [
        bookConsultationComplaintSchema,
        bookConsultationSymptomSchema,
        bookConsultationActionSchema,
      ]) {
        const result = schema.safeParse(data);
        if (!result.success) {
          for (const issue of result.error.issues) {
            ctx.addIssue(issue);
          }
        }
      }
    }
  });

export type BookConsultationFormData = z.infer<typeof bookConsultationFormSchema>;

export type BookConsultationMode = BookConsultationFormData["mode"];

export type BookConsultationFormValues = {
  mode: BookConsultationMode;
  complaint: string;
  symptom: string;
  symptomDuration: string;
  actionTaken: string;
  reactionAfterAction: string;
  consultationTypeId: string;
  date?: Date;
  notes?: string;
};

export const bookConsultationDefaultValues: BookConsultationFormValues = {
  complaint: "",
  symptom: "",
  symptomDuration: "",
  actionTaken: "",
  reactionAfterAction: "",
  consultationTypeId: "",
  notes: "",
};

export type WizardStepId =
  | "complaint"
  | "symptom"
  | "action"
  | "consultation";

export function getStepsForMode(mode: BookConsultationMode): WizardStepId[] {
  if (mode === "DIRECT") {
    return ["consultation"];
  }
  return ["complaint", "symptom", "action"];
}

export const STEP_FIELDS: Record<WizardStepId, (keyof BookConsultationFormData)[]> =
  {
    complaint: ["complaint"],
    symptom: ["symptom", "symptomDuration"],
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
