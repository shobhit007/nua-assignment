import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.light.background },
        animation: "ios_from_right",
      }}
    >
      <Stack.Screen name="/list" />
    </Stack>
  );
}
