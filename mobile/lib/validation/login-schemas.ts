import { loginMutationRequestSchema } from "@/gen/zod/loginSchema";
import { z } from "zod/v4";

export const loginSchema = loginMutationRequestSchema.extend({
  email: z.email("Email inválido"),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
