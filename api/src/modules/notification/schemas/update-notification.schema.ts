import { z } from "zod";

const UpdateNotificationSchema = z.object({
  user: z.object({ id: z.string().min(1) }).optional(),
  title: z.string().optional(),
  message: z.string().optional(),
  read: z.boolean().optional()
});

export default UpdateNotificationSchema;

export type UpdateNotificationSchemaType = z.infer<typeof UpdateNotificationSchema>;
