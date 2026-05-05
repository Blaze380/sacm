import { z } from "zod";

const CreateConsultationTypeSchema = z.object({
  name: z.string()
});

export default CreateConsultationTypeSchema;

export type CreateConsultationTypeSchemaType = z.infer<typeof CreateConsultationTypeSchema>;
