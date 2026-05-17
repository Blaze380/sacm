import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Link, useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login () {
    const router = useRouter();
    return (
        <SafeAreaView className="flex-1 items-center justify- p-4">
            <View className="space-y-20 flex-col w-full px-10 gap-10">
                <View className='flex items-center  justify-center mt-32'>
                    <Text>LOGO</Text>
                    <Text className='text-3xl text-primary '>Bem Vindo de Volta!</Text>
                </View>
                <View className="flex-col justify-center gap-5 items-center">
                    <Input
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        autoComplete="email"
                        placeholder="Email"
                    />
                    <View className="w-full items-center justify-center flex">

                        <Button className="w-11/12a w-full" >
                            <Text className="text-white">Entrar</Text>
                        </Button>
                        <View className='flex-row items-center justify-center gap-2 mt-4'>
                            <Text className='text-center  '>Não possui uma conta?</Text>
                            <Link href="/(auth)/signup/step1" className=' text-center  text-primary'>Registe-se</Link>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}