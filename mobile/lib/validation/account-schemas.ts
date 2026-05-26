import {
  onboardingStep1Schema,
  onboardingStep2Schema,
} from "@/lib/validation/onboarding-schemas";
import { z } from "zod/v4";

export const accountProfileSchema = onboardingStep1Schema.extend(
  onboardingStep2Schema.shape,
);

export type AccountProfileFormData = z.infer<typeof accountProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Introduza a palavra-passe atual"),
    newPassword: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula"),
    confirmPassword: z.string().min(1, "Confirme a nova palavra-passe"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As palavras-passe não coincidem",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
