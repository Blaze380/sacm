import { z } from "zod";

const CreateNotificationSchema = z.object({
  user: z.object({ id: z.string().min(1) }),
  title: z.string(),
  message: z.string(),
  read: z.boolean().optional()
});

export default CreateNotificationSchema;

export type CreateNotificationSchemaType = z.infer<typeof CreateNotificationSchema>;
