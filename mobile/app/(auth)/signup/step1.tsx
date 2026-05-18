import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ControllerInput } from "@/components/ui/controlled-input";
import {
  signupEmailSchema,
  type SignupEmailFormData,
} from "@/lib/validation/signup-schemas";

export default function SignupStep1() {
  const ref = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["15%"], []);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupEmailFormData>({
    resolver: zodResolver(signupEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const handlePresentModalPress = useCallback(() => {
    ref.current?.present();
    ref.current?.expand();
    ref.current?.snapToIndex(0);
  }, []);

  function gotoStep2(data: SignupEmailFormData) {
    router.push({
      pathname: "/(auth)/signup/step2",
      params: { email: data.email },
    });
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-between p-4">
      <View className="w-full flex-col px-10 gap-10">
        <View className="flex items-center justify-center mt-32">
          <Text>LOGO</Text>
          <Text className="text-3xl text-primary ">SEJA BEM VINDO AO SACM!</Text>
        </View>
        <View className="flex-col w-full justify-center gap-5 items-center">
          <ControllerInput
            control={control}
            className="w-full"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
            keyboardType="email-address"
            error={errors.email?.message}
          />
          <View className="w-full items-center justify-center flex">
            <Button className="w-11/12" onPress={handleSubmit(gotoStep2)}>
              <Text className="text-white">Continuar</Text>
            </Button>
            <View className="flex-row items-center justify-center gap-2 mt-4">
              <Text className="text-center  ">Já tem  conta?</Text>
              <Link href="/(auth)/login" className=" text-center  text-primary">
                Entrar
              </Link>
            </View>
          </View>
        </View>
      </View>
      <View className="flex-row items-center justify-center gap-2 mt-4">
        <Text className="text-center  ">Continuando você concorda com os</Text>
        <Pressable onPress={() => handlePresentModalPress()}>
          <Text className=" text-center  text-primary">Termos e Privacidade.</Text>
        </Pressable>
      </View>
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        index={-1}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            pressBehavior="close"
            opacity={0.5}
          />
        )}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View className="flex-col items-center justify-center ">
            <Text className="text-xl text-center self-start font-bold">
              Termos e Privacidade
            </Text>
            <Text className="text-start self-start  mt-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora,
              voluptate. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Tempora, voluptate.
            </Text>
          </View>
          <Button className="w-11/12 mt-3" onPress={() => ref.current?.dismiss()}>
            <Text className="text-white ">Fechar</Text>
          </Button>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 5,
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
});
