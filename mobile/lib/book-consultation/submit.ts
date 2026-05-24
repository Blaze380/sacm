import { createPatientAppointment } from "@/lib/api/appointments";
import { fetchDefaultSpecialtyId } from "@/lib/api/specialties";
import { createPatientTriage } from "@/lib/api/triages";
import type {
  BookConsultationFormData,
  DirectWizardData,
  ReferralWizardData,
  TriageWizardData,
} from "@/lib/validation/book-consultation-schemas";

function toAppointmentDateIso(date: Date): string {
  return date.toISOString();
}

export async function submitBookConsultation(
  data: BookConsultationFormData,
  patientId: string,
): Promise<void> {
  if (data.mode === "TRIAGE") {
    await submitTriage(data, patientId);
    return;
  }

  if (data.mode === "REFERRAL") {
    await submitReferralAppointment(data, patientId);
    return;
  }

  await submitDirectAppointment(data, patientId);
}

async function submitTriage(data: TriageWizardData, patientId: string) {
  await createPatientTriage({
    complaint: data.complaint.trim(),
    symptomDuration: data.symptomDuration.trim(),
    symptom: data.symptomTaken.trim(),
    actionTaken: data.actionTaken.trim(),
    reactionAfterAction: data.reactionAfterAction.trim(),
    patient: { id: patientId },
  });
}

async function submitDirectAppointment(
  data: DirectWizardData,
  patientId: string,
) {
  const specialtyId = await fetchDefaultSpecialtyId();

  await createPatientAppointment({
    date: toAppointmentDateIso(data.date),
    patient: { id: patientId },
    consultationType: { id: data.consultationTypeId },
    specialty: { id: specialtyId },
    ...(data.notes?.trim() ? { notes: data.notes.trim() } : {}),
    source: "DIRECTA",
  });
}

async function submitReferralAppointment(
  data: ReferralWizardData,
  patientId: string,
) {
  await createPatientAppointment({
    date: toAppointmentDateIso(data.date),
    patient: { id: patientId },
    consultationType: { id: data.consultationTypeId },
    specialty: { id: data.specialtyId },
    triage: { id: data.triageId },
    ...(data.notes?.trim() ? { notes: data.notes.trim() } : {}),
    priority: data.priority,
    source: "TRIAGEM",
  });
}
