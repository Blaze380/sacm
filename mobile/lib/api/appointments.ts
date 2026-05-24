import { apiClient } from "@/lib/api-client";
import { unwrapPaginated } from "@/lib/api/pagination";
import { unwrapApiData } from "@/lib/api/unwrap";
import type { CreateAppointment201 } from "@/gen/models/CreateAppointment";
import type { CreateAppointmentMutationRequest } from "@/gen/models/CreateAppointment";
import type { FindAppointments200 } from "@/gen/models/FindAppointments";

export type AppointmentItem = NonNullable<FindAppointments200["data"]>[number];

const UPCOMING_STATUSES = new Set(["AGENDADA", "REAGENDADA"]);

export async function fetchPatientAppointments(
  patientId: string,
): Promise<AppointmentItem[]> {
  const res = await apiClient.get<
    FindAppointments200 | { data: FindAppointments200 }
  >("/api/appointments", {
    params: {
      limit: 100,
      sort: "-date",
      patient: { id: patientId },
    },
  });

  return unwrapPaginated(res.data);
}

export async function fetchUpcomingAppointments(
  patientId: string,
): Promise<AppointmentItem[]> {
  const now = Date.now();
  const items = await fetchPatientAppointments(patientId);

  return items.filter(
    (item) =>
      UPCOMING_STATUSES.has(item.status) &&
      new Date(item.date).getTime() >= now,
  );
}

export async function createPatientAppointment(
  payload: CreateAppointmentMutationRequest,
): Promise<CreateAppointment201> {
  const res = await apiClient.post<
    CreateAppointment201 | { data: CreateAppointment201 }
  >("/api/appointments", payload);

  return unwrapApiData(res.data);
}
