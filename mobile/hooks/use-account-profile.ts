import type { GetMe200 } from "@/gen/models/GetMe";
import {
  profileFormToUpdatePayload,
  userToProfileFormValues,
} from "@/lib/account/profile-form";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getCurrentUser, updateCurrentUser } from "@/lib/auth/user";
import {
  accountProfileSchema,
  type AccountProfileFormData,
} from "@/lib/validation/account-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

export function useAccountProfile() {
  const [user, setUser] = useState<GetMe200 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const form = useForm<AccountProfileFormData>({
    resolver: zodResolver(accountProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "+258",
      birthDate: new Date(2000, 0, 1),
      province: "MAPUTO",
      city: "",
      neighborhood: "",
    },
  });

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    setSaveSuccess(false);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      form.reset(userToProfileFormValues(currentUser));
    } catch (e) {
      setLoadError(getApiErrorMessage(e));
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const saveProfile = useCallback(
    async (data: AccountProfileFormData) => {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);
      try {
        const updated = await updateCurrentUser(profileFormToUpdatePayload(data));
        setUser(updated);
        form.reset(userToProfileFormValues(updated));
        setSaveSuccess(true);
      } catch (e) {
        setSaveError(getApiErrorMessage(e));
      } finally {
        setIsSaving(false);
      }
    },
    [form],
  );

  return {
    user,
    form,
    isLoading,
    isSaving,
    loadError,
    saveError,
    saveSuccess,
    refetch: load,
    saveProfile,
  };
}
