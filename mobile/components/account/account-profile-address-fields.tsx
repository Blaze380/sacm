import { ControllerInput } from "@/components/ui/controlled-input";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { Text } from "@/components/ui/text";
import type { ProfileAddressFormFields } from "@/lib/account/profile-field-types";
import { PROVINCE_OPTIONS } from "@/lib/onboarding/provinces";
import type { Control, FieldErrors, FieldValues } from "react-hook-form";
import { View } from "react-native";

type Props<T extends ProfileAddressFormFields & FieldValues> = {
  control: Control<T>;
  errors: FieldErrors<T>;
  showSectionTitle?: boolean;
};

export function AccountProfileAddressFields<
  T extends ProfileAddressFormFields & FieldValues,
>({ control, errors, showSectionTitle = true }: Props<T>) {
  return (
    <View className="gap-4">
      {showSectionTitle ? (
        <Text className="text-lg font-semibold">Morada</Text>
      ) : null}
      <ControlledSelect
        control={control}
        name={"province" as never}
        options={PROVINCE_OPTIONS}
        placeholder="Província"
        error={errors.province?.message as string | undefined}
      />
      <ControllerInput
        control={control}
        name={"city" as never}
        full
        placeholder="Cidade"
        textContentType="addressCity"
        error={errors.city?.message as string | undefined}
      />
      <ControllerInput
        control={control}
        name={"neighborhood" as never}
        full
        placeholder="Bairro"
        textContentType="fullStreetAddress"
        error={errors.neighborhood?.message as string | undefined}
      />
    </View>
  );
}
