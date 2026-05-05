import { z } from "zod";

const SpecialtySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date().or(z.string()).refine((val) => val instanceof Date || !isNaN(Date.parse(val)), 'Invalid date'),
  updatedAt: z.date().or(z.string()).refine((val) => val instanceof Date || !isNaN(Date.parse(val)), 'Invalid date')
});

export default SpecialtySchema;

export type SpecialtySchemaType = z.infer<typeof SpecialtySchema>;
