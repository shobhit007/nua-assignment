import { Colors } from "@/constants/theme";
import { persistor, store } from "@/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function TabLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.light.background },
            animation: "ios_from_right",
          }}
        >
          <Stack.Screen name="list" />
          <Stack.Screen name="product/[id]" />
        </Stack>
      </PersistGate>
    </Provider>
  );
}
