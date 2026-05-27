import { Tabs } from "expo-router";
import { CalendarDays, Home, User } from "lucide-react-native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createNestedStackTabListeners } from "@/lib/navigation/tab-stack-reset";

const tabBarStyle = {
  borderTopWidth: 1,
  borderTopColor: Colors.light.border,
  backgroundColor: Colors.light.background,
} as const;

type TabRoute = Parameters<
  NonNullable<Parameters<typeof Tabs.Screen>[0]["options"]>
>[0]["route"];

function getConsultationsTabBarStyle(route: TabRoute) {
  const focused = getFocusedRouteNameFromRoute(route);
  if (focused && focused !== "index") {
    return { display: "none" as const };
  }
  return tabBarStyle;
}

function getAccountTabBarStyle(route: TabRoute) {
  const focused = getFocusedRouteNameFromRoute(route);
  if (focused && focused !== "index") {
    return { display: "none" as const };
  }
  return tabBarStyle;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      initialRouteName="home/index"
      screenOptions={{
        tabBarActiveTintColor: palette.tint,
        tabBarInactiveTintColor: palette.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="consultations"
        listeners={createNestedStackTabListeners("/(tabs)/consultations")}
        options={({ route }) => ({
          title: "Consultas",
          tabBarIcon: ({ color, size }) => (
            <CalendarDays color={color} size={size ?? 24} />
          ),
          tabBarStyle: getConsultationsTabBarStyle(route),
        })}
      />
      <Tabs.Screen
        name="account"
        listeners={createNestedStackTabListeners("/(tabs)/account")}
        options={({ route }) => ({
          title: "Conta",
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size ?? 24} />
          ),
          tabBarStyle: getAccountTabBarStyle(route),
        })}
      />
    </Tabs>
  );
}
