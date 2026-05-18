import { createPatientAppointment } from "@/lib/api/appointments";
import { fetchDefaultSpecialtyId } from "@/lib/api/specialties";
import { createPatientTriage } from "@/lib/api/triages";
import type { BookConsultationFormData } from "@/lib/validation/book-consultation-schemas";

function toAppointmentDateIso(date: Date): string {
  return date.toISOString();
}

export async function submitBookConsultation(
  data: BookConsultationFormData,
  patientId: string,
): Promise<void> {
  const specialtyId = await fetchDefaultSpecialtyId();
  const appointmentBase = {
    date: toAppointmentDateIso(data.date),
    patient: { id: patientId },
    consultationType: { id: data.consultationTypeId },
    specialty: { id: specialtyId },
    ...(data.notes?.trim() ? { notes: data.notes.trim() } : {}),
  };

  if (data.mode === "TRIAGE") {
    const triage = await createPatientTriage({
      complaint: data.complaint.trim(),
      symptomDuration: data.symptomDuration.trim(),
      symptomTaken: data.symptom.trim(),
      actionTaken: data.actionTaken.trim(),
      reactionAfterAction: data.reactionAfterAction.trim(),
      patient: { id: patientId },
    });

    await createPatientAppointment({
      ...appointmentBase,
      source: "TRIAGEM",
      triage: { id: triage.id },
    });
    return;
  }

  await createPatientAppointment({
    ...appointmentBase,
    source: "DIRECTA",
  });
}
