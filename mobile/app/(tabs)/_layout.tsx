import { Tabs } from "expo-router";
import { CalendarDays, Home, User } from "lucide-react-native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const TAB_ACTIVE_COLOR = "#24b447";

const tabBarStyle = {
  borderTopWidth: 1,
  borderTopColor: "#e5e7eb",
} as const;

type TabRoute = Parameters<
  NonNullable<Parameters<typeof Tabs.Screen>[0]["options"]>
>[0]["route"];

function getConsultationsTabBarStyle(route: TabRoute) {
  const focused = getFocusedRouteNameFromRoute(route);
  if (focused === "new") {
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
  const inactiveColor = Colors[colorScheme ?? "light"].tabIconDefault;

  return (
    <Tabs
      initialRouteName="home/index"
      screenOptions={{
        tabBarActiveTintColor: TAB_ACTIVE_COLOR,
        tabBarInactiveTintColor: inactiveColor,
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
