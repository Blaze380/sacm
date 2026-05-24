import {
  fetchPatientAppointments,
  fetchUpcomingAppointments,
} from "@/lib/api/appointments";
import {
  fetchPatientTriages,
  fetchPendingTriages,
  fetchReferredTriages,
} from "@/lib/api/triages";
import type { AppointmentItem } from "@/lib/api/appointments";
import type { HomeUpcomingItem } from "@/lib/home/types";

const UPCOMING_STATUSES = new Set(["AGENDADA", "REAGENDADA"]);

function getLinkedTriageIds(appointments: AppointmentItem[]): Set<string> {
  const now = Date.now();
  return new Set(
    appointments
      .filter(
        (a) => a.triageId && new Date(a.date).getTime() >= now,
      )
      .map((a) => a.triageId as string),
  );
}

export async function buildPatientConsultationItems(
  patientId: string,
  typeMap: Record<string, string>,
  options?: { upcomingOnly?: boolean },
): Promise<HomeUpcomingItem[]> {
  const upcomingOnly = options?.upcomingOnly ?? false;
  const allAppointments = await fetchPatientAppointments(patientId);
  const linkedTriageIds = getLinkedTriageIds(allAppointments);

  const appointments = upcomingOnly
    ? await fetchUpcomingAppointments(patientId)
    : allAppointments;

  const triages = upcomingOnly
    ? [
        ...(await fetchPendingTriages(patientId, linkedTriageIds)),
        ...(await fetchReferredTriages(patientId, linkedTriageIds)),
      ]
    : (await fetchPatientTriages(patientId)).filter(
        (t) => !linkedTriageIds.has(t.id),
      );

  const appointmentItems: HomeUpcomingItem[] = appointments.map(
    (appointment) => ({
      kind: "appointment",
      date: new Date(appointment.date),
      appointment,
      consultationTypeName:
        typeMap[appointment.consultationTypeId] ?? "Consulta",
    }),
  );

  const triageItems: HomeUpcomingItem[] = triages.map((triage) => ({
    kind: "triage",
    date: new Date(triage.createdAt),
    triage,
  }));

  const sortAsc = upcomingOnly;
  return [...appointmentItems, ...triageItems].sort((a, b) =>
    sortAsc
      ? a.date.getTime() - b.date.getTime()
      : b.date.getTime() - a.date.getTime(),
  );
}
