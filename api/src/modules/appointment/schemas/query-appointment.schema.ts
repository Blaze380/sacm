import { z } from "zod";
import { AppointmentStatus, PriorityLevel, AppointmentSource } from "@prisma/client";

const StringFilterSchema = z.object({
  icontains: z.string().optional()
});

const DateTimeFilterSchema = z.object({
  equals: z.string().optional(),
  gte: z.string().optional(),
  lte: z.string().optional()
});

const QueryAppointmentSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().max(100).optional(),
  sort: z.string().optional(),
  fields: z.string().optional(),
  date: DateTimeFilterSchema.optional(),
  patient: z.object({ id: z.string().optional() }).optional(),
  specialty: z.object({ id: z.string().optional() }).optional(),
  consultationType: z.object({ id: z.string().optional() }).optional(),
  doctor: z.object({ id: z.string().optional() }).optional(),
  triage: z.object({ id: z.string().optional() }).optional(),
  notes: StringFilterSchema.optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  priority: z.nativeEnum(PriorityLevel).optional(),
  source: z.nativeEnum(AppointmentSource).optional(),
  createdAt: DateTimeFilterSchema.optional(),
  updatedAt: DateTimeFilterSchema.optional()
});

export default QueryAppointmentSchema;

export type QueryAppointmentSchemaType = z.infer<typeof QueryAppointmentSchema>;
