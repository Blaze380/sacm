import { z } from "zod";

const StringFilterSchema = z.object({
  icontains: z.string().optional()
});

const DateTimeFilterSchema = z.object({
  equals: z.string().optional(),
  gte: z.string().optional(),
  lte: z.string().optional()
});

const QuerySpecialtySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().max(100).optional(),
  sort: z.string().optional(),
  fields: z.string().optional(),
  name: StringFilterSchema.optional(),
  createdAt: DateTimeFilterSchema.optional(),
  updatedAt: DateTimeFilterSchema.optional()
});

export default QuerySpecialtySchema;

export type QuerySpecialtySchemaType = z.infer<typeof QuerySpecialtySchema>;
