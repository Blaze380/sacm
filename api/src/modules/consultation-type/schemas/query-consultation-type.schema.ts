import { z } from "zod";

const StringFilterSchema = z.object({
  icontains: z.string().optional()
});

const DateTimeFilterSchema = z.object({
  equals: z.string().optional(),
  gte: z.string().optional(),
  lte: z.string().optional()
});

const QueryConsultationTypeSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().max(100).optional(),
  sort: z.string().optional(),
  fields: z.string().optional(),
  name: StringFilterSchema.optional(),
  createdAt: DateTimeFilterSchema.optional(),
  updatedAt: DateTimeFilterSchema.optional()
});

export default QueryConsultationTypeSchema;

export type QueryConsultationTypeSchemaType = z.infer<typeof QueryConsultationTypeSchema>;
