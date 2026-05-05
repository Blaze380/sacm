import { z } from "zod";
import { TriageStatus } from "@prisma/client";

const StringFilterSchema = z.object({
  icontains: z.string().optional()
});

const DateTimeFilterSchema = z.object({
  equals: z.string().optional(),
  gte: z.string().optional(),
  lte: z.string().optional()
});

const QueryTriageSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().max(100).optional(),
  sort: z.string().optional(),
  fields: z.string().optional(),
  complaint: StringFilterSchema.optional(),
  symptomDuration: StringFilterSchema.optional(),
  symptomTaken: StringFilterSchema.optional(),
  actionTaken: StringFilterSchema.optional(),
  reactionAfterAction: StringFilterSchema.optional(),
  status: z.nativeEnum(TriageStatus).optional(),
  patient: z.object({ id: z.string().optional() }).optional(),
  analyzedBy: z.object({ id: z.string().optional() }).optional(),
  createdAt: DateTimeFilterSchema.optional(),
  updatedAt: DateTimeFilterSchema.optional()
});

export default QueryTriageSchema;

export type QueryTriageSchemaType = z.infer<typeof QueryTriageSchema>;
