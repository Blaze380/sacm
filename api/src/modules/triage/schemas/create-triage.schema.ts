import { z } from "zod";
import { TriageStatus } from "@prisma/client";

const CreateTriageSchema = z.object({
  complaint: z.string(),
  symptomDuration: z.string(),
  symptomTaken: z.string(),
  actionTaken: z.string(),
  reactionAfterAction: z.string(),
  status: z.nativeEnum(TriageStatus).optional(),
  patient: z.object({ id: z.string().min(1) }),
  analyzedBy: z.object({ id: z.string().min(1) }).optional()
});

export default CreateTriageSchema;

export type CreateTriageSchemaType = z.infer<typeof CreateTriageSchema>;
