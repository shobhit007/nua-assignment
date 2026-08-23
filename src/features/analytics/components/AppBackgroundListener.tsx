import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";

import { logAnalytics } from "@/features/analytics/logAnalytics";

export function AppBackgroundListener() {
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        const previous = appStateRef.current;
        appStateRef.current = nextState;

        if (
          nextState === "background" &&
          previous !== "background"
        ) {
          logAnalytics({ name: "app_backgrounded" });
        }
      },
    );

    return () => subscription.remove();
  }, []);

  return null;
}
