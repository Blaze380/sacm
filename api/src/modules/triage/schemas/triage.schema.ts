import { z } from "zod";
import { TriageStatus } from "@prisma/client";

const TriageSchema = z.object({
  id: z.string(),
  complaint: z.string(),
  symptomDuration: z.string(),
  symptomTaken: z.string(),
  actionTaken: z.string(),
  reactionAfterAction: z.string(),
  status: z.nativeEnum(TriageStatus).optional(),
  patientId: z.string(),
  analyzedById: z.string().optional(),
  createdAt: z.date().or(z.string()).refine((val) => val instanceof Date || !isNaN(Date.parse(val)), 'Invalid date'),
  updatedAt: z.date().or(z.string()).refine((val) => val instanceof Date || !isNaN(Date.parse(val)), 'Invalid date')
});

export default TriageSchema;

export type TriageSchemaType = z.infer<typeof TriageSchema>;
