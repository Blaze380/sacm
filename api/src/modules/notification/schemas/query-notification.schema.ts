import { z } from "zod";

const StringFilterSchema = z.object({
  icontains: z.string().optional()
});

const DateTimeFilterSchema = z.object({
  equals: z.string().optional(),
  gte: z.string().optional(),
  lte: z.string().optional()
});

const QueryNotificationSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().max(100).optional(),
  sort: z.string().optional(),
  fields: z.string().optional(),
  user: z.object({ id: z.string().optional() }).optional(),
  title: StringFilterSchema.optional(),
  message: StringFilterSchema.optional(),
  read: z.boolean().optional(),
  createdAt: DateTimeFilterSchema.optional(),
  updatedAt: DateTimeFilterSchema.optional()
});

export default QueryNotificationSchema;

export type QueryNotificationSchemaType = z.infer<typeof QueryNotificationSchema>;
