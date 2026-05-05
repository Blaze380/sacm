import { z } from "zod";
import { AppointmentStatus, PriorityLevel, AppointmentSource } from "@prisma/client";

const CreateAppointmentSchema = z.object({
  date: z.date().or(z.string()).refine((val) => val instanceof Date || !isNaN(Date.parse(val)), 'Invalid date'),
  patient: z.object({ id: z.string().min(1) }),
  specialty: z.object({ id: z.string().min(1) }),
  consultationType: z.object({ id: z.string().min(1) }),
  doctor: z.object({ id: z.string().min(1) }).optional(),
  triage: z.object({ id: z.string().min(1) }).optional(),
  notes: z.string().optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  priority: z.nativeEnum(PriorityLevel).optional(),
  source: z.nativeEnum(AppointmentSource).optional()
});

export default CreateAppointmentSchema;

export type CreateAppointmentSchemaType = z.infer<typeof CreateAppointmentSchema>;
