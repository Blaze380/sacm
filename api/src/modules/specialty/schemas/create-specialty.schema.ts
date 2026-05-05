import { z } from "zod";

const CreateSpecialtySchema = z.object({
  name: z.string()
});

export default CreateSpecialtySchema;

export type CreateSpecialtySchemaType = z.infer<typeof CreateSpecialtySchema>;
