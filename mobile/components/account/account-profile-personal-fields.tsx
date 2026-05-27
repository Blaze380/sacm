import { PhoneInput } from "@/components/phone-input";
import { ControllerInput } from "@/components/ui/controlled-input";
import { Text } from "@/components/ui/text";
import type { ProfilePersonalFormFields } from "@/lib/account/profile-field-types";
import { format } from "date-fns";
import { useState } from "react";
import type {
  Control,
  FieldErrors,
  FieldValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Platform, Pressable, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props<T extends ProfilePersonalFormFields & FieldValues> = {
  control: Control<T>;
  errors: FieldErrors<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  showSectionTitle?: boolean;
};

export function AccountProfilePersonalFields<
  T extends ProfilePersonalFormFields & FieldValues,
>({
  control,
  errors,
  watch,
  setValue,
  showSectionTitle = true,
}: Props<T>) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const birthDate = watch("birthDate" as never) as unknown as Date | undefined;

  return (
    <View className="gap-4">
      {showSectionTitle ? (
        <Text className="text-lg font-semibold">Dados pessoais</Text>
      ) : null}
      <View className="flex-row w-full gap-3">
        <ControllerInput
          control={control}
          name={"firstName" as never}
          className="flex-1"
          placeholder="Primeiro nome"
          textContentType="givenName"
          autoComplete="given-name"
          error={errors.firstName?.message as string | undefined}
        />
        <ControllerInput
          control={control}
          name={"lastName" as never}
          className="flex-1"
          placeholder="Apelido"
          textContentType="familyName"
          autoComplete="family-name"
          error={errors.lastName?.message as string | undefined}
        />
      </View>
      <PhoneInput
        control={control}
        name={"phone" as never}
        error={errors.phone?.message as string | undefined}
      />
      <Pressable
        onPress={() => setShowDatePicker(true)}
        className="border border-border rounded-lg h-10 px-3 justify-center bg-card w-full"
      >
        <Text
          className={
            birthDate instanceof Date && !isNaN(birthDate.getTime())
              ? "text-foreground"
              : "text-muted-foreground"
          }
        >
          {birthDate instanceof Date && !isNaN(birthDate.getTime())
            ? format(birthDate, "dd/MM/yyyy")
            : "Data de nascimento"}
        </Text>
      </Pressable>
      {errors.birthDate?.message ? (
        <Text className="text-red-400">
          {errors.birthDate.message as string}
        </Text>
      ) : null}
      {showDatePicker ? (
        <DateTimePicker
          mode="date"
          value={
            birthDate instanceof Date && !isNaN(birthDate.getTime())
              ? birthDate
              : new Date(2000, 0, 1)
          }
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, date) => {
            if (Platform.OS === "android") {
              setShowDatePicker(false);
            }
            if (date) {
              setValue("birthDate" as never, date as never, {
                shouldValidate: true,
              });
            }
          }}
        />
      ) : null}
    </View>
  );
}
