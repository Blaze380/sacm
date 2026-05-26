import type { GetMe200, GetMe200ProvinceEnumKey } from "@/gen/models/GetMe";
import {
  normalizeMozPhone,
  parseStoredPhoneToLocal,
} from "@/lib/phone/mozambique";
import type { AccountProfileFormData } from "@/lib/validation/account-schemas";

export function userToProfileFormValues(
  user: GetMe200,
): AccountProfileFormData {
  return {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    phone: user.phone ? `+258${parseStoredPhoneToLocal(user.phone)}` : "+258",
    birthDate: user.birthDate ? new Date(user.birthDate) : new Date(2000, 0, 1),
    province: user.province ?? "MAPUTO",
    city: user.city ?? "",
    neighborhood: user.neighborhood ?? "",
  };
}

export function profileFormToUpdatePayload(data: AccountProfileFormData) {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    phone: normalizeMozPhone(data.phone),
    birthDate: data.birthDate.toISOString(),
    province: data.province as GetMe200ProvinceEnumKey,
    city: data.city.trim(),
    neighborhood: data.neighborhood.trim(),
  };
}
