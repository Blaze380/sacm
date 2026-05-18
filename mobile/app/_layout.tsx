import "../global.css"
import { DarkTheme, DefaultTheme, ThemeProvider, useTheme, } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import {PortalHost} from "@rn-primitives/portal"
import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
    const { colors } = useTheme();
  return (
    <ThemeProvider value={DefaultTheme}>
    {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
    <GestureHandlerRootView  >
      <BottomSheetModalProvider>

      <Stack screenOptions={{headerShown:false}} >
        <Stack.Screen name="(tabs)"  />
        <Stack.Screen name="(auth)/onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="index"  />
        <Stack.Screen name="(auth)/login/index"  />
        <Stack.Screen name="(auth)/signup/step1"  />
        <Stack.Screen name="(auth)/signup/step2" options={{
          headerShown:true,
          headerShadowVisible:false,
          headerTitle:"",
          headerStyle:{backgroundColor:colors.background}

        }}  />
      </Stack>
          <Pressable
      onPress={() => router.push("/_sitemap")}
      style={{
        position: "absolute",
        bottom: 24,
        right: 24,
        backgroundColor: "#000",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 999,
        zIndex: 9999,
        elevation: 10, // Android
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "600" }}>
        +
      </Text>
    </Pressable>
      <StatusBar style="auto" />
      <PortalHost />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
    </ThemeProvider>
  );
}
