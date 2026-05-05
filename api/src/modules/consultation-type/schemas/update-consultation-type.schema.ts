import { z } from "zod";

const UpdateConsultationTypeSchema = z.object({
  name: z.string().optional()
});

export default UpdateConsultationTypeSchema;

export type UpdateConsultationTypeSchemaType = z.infer<typeof UpdateConsultationTypeSchema>;
