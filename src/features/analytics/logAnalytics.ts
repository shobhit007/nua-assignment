import type { LogEventInput } from "@/features/analytics/types";
import { store } from "@/store";
import { logEvent } from "@/store/slices/analyticsSlice";

export function logAnalytics(input: LogEventInput) {
  store.dispatch(logEvent(input));
}
