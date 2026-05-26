import { AccountProfileAddressFields } from "@/components/account/account-profile-address-fields";
import { AccountProfilePersonalFields } from "@/components/account/account-profile-personal-fields";
import { AccountSubScreen } from "@/components/account/account-sub-screen";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useAccountProfile } from "@/hooks/use-account-profile";
import { FormProvider } from "react-hook-form";
import { View } from "react-native";

export default function AccountPersonalScreen() {
  const {
    form,
    isLoading,
    isSaving,
    loadError,
    saveError,
    saveSuccess,
    refetch,
    saveProfile,
  } = useAccountProfile();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  if (isLoading) {
    return (
      <AccountSubScreen title="Dados pessoais">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </AccountSubScreen>
    );
  }

  if (loadError) {
    return (
      <AccountSubScreen title="Dados pessoais">
        <Text className="text-red-500 text-center">{loadError}</Text>
        <Button variant="outline" onPress={() => void refetch()}>
          <Text>Tentar novamente</Text>
        </Button>
      </AccountSubScreen>
    );
  }

  return (
    <AccountSubScreen title="Dados pessoais">
      <FormProvider {...form}>
        <View className="gap-8">
          <AccountProfilePersonalFields
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
          <AccountProfileAddressFields control={control} errors={errors} />
        </View>
      </FormProvider>

      {saveError ? (
        <Text className="text-red-500">{saveError}</Text>
      ) : null}
      {saveSuccess ? (
        <Text className="text-primary">Alterações guardadas com sucesso.</Text>
      ) : null}

      <Button
        className="w-full"
        isLoading={isSaving}
        disabled={isSaving}
        onPress={handleSubmit((data) => void saveProfile(data))}
      >
        <Text className="text-white">Guardar alterações</Text>
      </Button>
    </AccountSubScreen>
  );
}
