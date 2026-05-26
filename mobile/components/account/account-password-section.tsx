import { CheckValidationText } from "@/components/check-validation-text";
import { Button } from "@/components/ui/button";
import { ControllerInput } from "@/components/ui/controlled-input";
import { Text } from "@/components/ui/text";
import { changePassword } from "@/lib/auth/password";
import { getApiErrorMessage } from "@/lib/api/errors";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/lib/validation/account-schemas";
import { getPasswordRuleStatus } from "@/lib/validation/password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { View } from "react-native";

export function AccountPasswordSection() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = useWatch({ control, name: "newPassword" }) ?? "";
  const ruleStatus = getPasswordRuleStatus(newPassword);

  const onSubmit = useCallback(async (data: ChangePasswordFormData) => {
    setSubmitError(null);
    setSuccessMessage(null);
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      reset();
      setSuccessMessage("Palavra-passe atualizada com sucesso.");
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  }, [reset]);

  return (
    <View className="gap-4">
      <Text className="text-lg font-semibold">Palavra-passe</Text>
      <ControllerInput
        control={control}
        name="currentPassword"
        placeholder="Palavra-passe atual"
        textContentType="password"
        secureTextEntry
        error={errors.currentPassword?.message}
      />
      <ControllerInput
        control={control}
        name="newPassword"
        placeholder="Nova palavra-passe"
        textContentType="newPassword"
        secureTextEntry
        error={errors.newPassword?.message}
      />
      <View className="flex-col">
        <CheckValidationText
          text="Mínimo 8 caracteres"
          status={ruleStatus.minLength}
        />
        <CheckValidationText
          text="Pelo menos uma letra minúscula"
          status={ruleStatus.hasLowercase}
        />
        <CheckValidationText
          text="Pelo menos uma letra maiúscula"
          status={ruleStatus.hasUppercase}
        />
      </View>
      <ControllerInput
        control={control}
        name="confirmPassword"
        placeholder="Confirmar nova palavra-passe"
        textContentType="newPassword"
        secureTextEntry
        error={errors.confirmPassword?.message}
      />
      {submitError ? (
        <Text className="text-red-500">{submitError}</Text>
      ) : null}
      {successMessage ? (
        <Text className="text-primary">{successMessage}</Text>
      ) : null}
      <Button
        variant="outline"
        className="w-full"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      >
        <Text>Atualizar palavra-passe</Text>
      </Button>
    </View>
  );
}
