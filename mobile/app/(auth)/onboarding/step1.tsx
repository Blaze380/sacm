import { Button } from "@/components/ui/button";
import { ControllerInput } from "@/components/ui/controlled-input";
import { Text } from "@/components/ui/text";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// eslint-disable-next-line import/no-named-as-default
import DateTimePicker from '@react-native-community/datetimepicker';
import z from "zod";
import { useState } from "react";
export const step1Schema = z.object({
    firstName: z.string().min(3, "Deve ter pelo menos 3 caracteres"),
    lastName: z.string().min(3, "Deve ter pelo menos 3 caracteres"),
    phone: z.string(),
    birthDate: z.date("Deve ser data válida").max(new Date(), "Data inválida")
});

export type Step1FormData = z.infer<typeof step1Schema>;

export default function Airst () {
    const router = useRouter();
    const {
        control,
        handleSubmit,

        formState: { errors, isSubmitting, isSubmitSuccessful, },
    } = useForm<Step1FormData>({
        resolver: zodResolver(step1Schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phone: "",
            birthDate: undefined,
        },
    });
    const [selectedDate, setSelectedDate] = useState(new Date());
    async function onSubmit (data: Step1FormData) {
        console.log(data)
        void (async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        })();
        router.push("/(auth)/signup/step2")
    }
    return (
        <SafeAreaView className="flex-1 items-center justify-between p-4">
            <View className="w-full flex-col px-10 gap-10">
                <View className='flex items-start justify-start mt-32 mb-3'>
                    <Text className='text-3xl '>Fale um pouco sobre você</Text>
                    <Text className="text-lga text-muted-foreground">Vamos começar com algumas informações básicas</Text>
                </View>
                <View className="flex-col w-full justify-center gap-5 items-center">
                    <View className=" flex-row w-full  justify-between gap-3 items-center">
                        <ControllerInput
                            control={control}
                            className=" w-[50%]"
                            name="firstName"
                            placeholder="Nome"
                            disabled={true}
                            textContentType="name"
                            keyboardType="default"
                            autoComplete="name"
                            error={errors.firstName?.message}

                        />
                        <ControllerInput
                            control={control}
                            className=" w-[50%]"
                            name="lastName"
                            placeholder="Sobrenome"
                            textContentType="name"
                            keyboardType="default"
                            error={errors.lastName?.message}
                            autoComplete="name"
                        />
                    </View>
                    <ControllerInput
                        control={control}
                        name="phone"
                        full
                        placeholder="Telefone"
                        textContentType="telephoneNumber"
                        keyboardType="phone-pad"
                        error={errors.phone?.message}
                        autoComplete="tel"
                    />
                    <DateTimePicker
                        mode="date"
                        value={control._formValues.birthDate || new Date()}
                        maximumDate={new Date()}
                        minimumDate={new Date(1900, 0, 1)}
                    />
                    <ControllerInput
                        control={control}
                        name="birthDate"
                        full
                        placeholder="Data de Nascimento"
                        textContentType="dateTime"
                        keyboardType="numeric"
                        error={errors.birthDate?.message}
                    />
                </View>
            </View>
            <View className="w-full items-center justify-center flex">

                <Button className="w-11/12" isLoading={isSubmitting} onPress={handleSubmit(onSubmit)}>
                    <Text className="text-white">Próximo</Text>
                </Button>
            </View>
        </SafeAreaView>
    )
}