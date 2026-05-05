import { z } from "zod";
import { TriageStatus } from "@prisma/client";

const UpdateTriageSchema = z.object({
  complaint: z.string().optional(),
  symptomDuration: z.string().optional(),
  symptomTaken: z.string().optional(),
  actionTaken: z.string().optional(),
  reactionAfterAction: z.string().optional(),
  status: z.nativeEnum(TriageStatus).optional(),
  patient: z.object({ id: z.string().min(1) }).optional(),
  analyzedBy: z.object({ id: z.string().min(1) }).optional()
});

export default UpdateTriageSchema;

export type UpdateTriageSchemaType = z.infer<typeof UpdateTriageSchema>;
