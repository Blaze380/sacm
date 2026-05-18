import { signupMutationRequestSchema } from "@/gen/zod/signupSchema";
import { z } from "zod/v4";

export const signupEmailSchema = z.object({
  email: z.email("Email inválido"),
});

export type SignupEmailFormData = z.infer<typeof signupEmailSchema>;

export const signupPasswordSchema = signupMutationRequestSchema.extend({
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula"),
});

export type SignupPasswordFormData = z.infer<typeof signupPasswordSchema>;
