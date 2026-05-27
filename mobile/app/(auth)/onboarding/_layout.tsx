import { Redirect, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
export default async function OnboardingLayout() {
  if(await SecureStore.getItemAsync("onboarding_finished")) {
    return <Redirect href="/(tabs)/home" />;
    }
    return <Stack screenOptions={{ headerShown: false }} />;
  
}
