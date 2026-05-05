import { z } from "zod";
import { AppointmentStatus, PriorityLevel, AppointmentSource } from "@prisma/client";

const AppointmentSchema = z.object({
  id: z.string(),
  date: z.date().or(z.string()).refine((val) => val instanceof Date || !isNaN(Date.parse(val)), 'Invalid date'),
  patientId: z.string(),
  specialtyId: z.string(),
  consultationTypeId: z.string(),
  doctorId: z.string().optional(),
  triageId: z.string().optional(),
  notes: z.string().optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  priority: z.nativeEnum(PriorityLevel).optional(),
  source: z.nativeEnum(AppointmentSource).optional(),
  createdAt: z.date().or(z.string()).refine((val) => val instanceof Date || !isNaN(Date.parse(val)), 'Invalid date'),
  updatedAt: z.date().or(z.string()).refine((val) => val instanceof Date || !isNaN(Date.parse(val)), 'Invalid date')
});

export default AppointmentSchema;

export type AppointmentSchemaType = z.infer<typeof AppointmentSchema>;
