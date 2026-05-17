
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef } from "react";
import { CheckCircle } from "lucide-react-native";
import { CheckValidationText } from "@/components/check-validation-text";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { ControllerInput } from "@/components/ui/controlled-input";
export const loginSchema = z.object({
    email: z.email("Email inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export default function Login () {

    const { email } = useLocalSearchParams<{ email: string }>();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: email,
            password: "",
        },
    });
    const router = useRouter();
    const ref = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["15%"], []);
    // callbacks
    const handlePresentModalPress = useCallback(() => {
        ref.current?.present();
    }, []);
    function onSubmit (data: LoginFormData) {
        console.log(data)
    }

    // callbacks
    return (
        <SafeAreaView className="flex-1 items-center justify-between p-4">
            <View className=" w-full px-10  flex-col gap-14">
                <View className='flex items-start justify-center mt-14'>
                    <Text className='text-3xl'>Criar senha para</Text>
                    <Text className='text-3xl text-primary '>{email}</Text>
                </View>
                <ControllerInput
                    control={control}
                    name="password"
                    placeholder="Palavra-passe"
                    textContentType="password"
                    keyboardType="default"
                />
                <View className="flex-col">
                    <CheckValidationText text="Contém pelo menos 8 caracteres" status="valid" />
                    <CheckValidationText text="Contém pelo menos 1 letra maiúscula" status="invalid" />
                    <CheckValidationText text="Contém pelo menos 1 número" status="error" />
                </View>

            </View>
            <View className="w-full items-center justify-center flex px-10 mb-3">

                <Button className="w-full" onPress={handlePresentModalPress}>
                    <Text className="text-white">Continuar</Text>
                </Button>
            </View>
            <BottomSheetModal
                ref={ref}
                snapPoints={snapPoints}
                enablePanDownToClose
                index={-1}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop
                        {...props}
                        appearsOnIndex={0}     // mostra overlay quando aberto
                        disappearsOnIndex={-1} // some quando fechado
                        pressBehavior="close"  // fecha ao clicar no overlay
                        opacity={0.5}
                    />
                )}
            >
                <BottomSheetView style={styles.contentContainer}>
                    <View className="flex-col items-center justify-center ">

                        <Text className="text-xl text-center self-start font-bold">Termos e Privacidade</Text>
                        <Text className="text-start self-start  mt-4">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, voluptate. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, voluptate.
                        </Text>
                    </View>
                    <Button isLoading={true} className="w-11/12 mt-3" onPress={handleSubmit(onSubmit)}>
                        <Text className="text-white ">Enviar</Text>
                    </Button>
                    <Button variant={"secondary"} className="w-11/12 mt-3" onPress={() => ref.current?.dismiss()}>
                        <Text className="">Fechar</Text>
                    </Button>
                </BottomSheetView>
            </BottomSheetModal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        gap: 2,
        justifyContent: 'center',
        backgroundColor: 'grey',
    },
    contentContainer: {
        padding: 5,
        justifyContent: "center",
        flex: 1,
        alignItems: 'center',
    },
});