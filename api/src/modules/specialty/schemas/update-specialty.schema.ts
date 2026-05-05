import { z } from "zod";

const UpdateSpecialtySchema = z.object({
  name: z.string().optional()
});

export default UpdateSpecialtySchema;

export type UpdateSpecialtySchemaType = z.infer<typeof UpdateSpecialtySchema>;
