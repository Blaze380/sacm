import { getMe200ProvinceEnum } from "@/gen/models/GetMe";
import { isValidMozPhone } from "@/lib/phone/mozambique";
import { z } from "zod/v4";

const provinceValues = Object.values(getMe200ProvinceEnum).filter(
  (v) => !v.startsWith("//"),
) as [string, ...string[]];

export const onboardingStep1Schema = z.object({
  firstName: z.string().min(2, "Deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Deve ter pelo menos 2 caracteres"),
  phone: z.string().refine(isValidMozPhone, "Telefone inválido"),
  birthDate: z
    .date("Data inválida")
    .max(new Date(), "A data não pode ser no futuro"),
});

export type OnboardingStep1FormData = z.infer<typeof onboardingStep1Schema>;

export const onboardingStep2Schema = z.object({
  province: z.enum(provinceValues, "Selecione a província"),
  city: z.string().min(2, "Deve ter pelo menos 2 caracteres"),
  neighborhood: z.string().min(2, "Deve ter pelo menos 2 caracteres"),
});

export type OnboardingStep2FormData = z.infer<typeof onboardingStep2Schema>;
