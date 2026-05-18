import type { AppointmentItem } from "@/lib/api/appointments";
import type { TriageItem } from "@/lib/api/triages";

export type HomeAppointmentItem = {
  kind: "appointment";
  date: Date;
  appointment: AppointmentItem;
  consultationTypeName: string;
};

export type HomeTriageItem = {
  kind: "triage";
  date: Date;
  triage: TriageItem;
};

export type HomeUpcomingItem = HomeAppointmentItem | HomeTriageItem;
