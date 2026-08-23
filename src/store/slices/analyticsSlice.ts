import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type {
  AnalyticsEvent,
  LogEventInput,
} from "@/features/analytics/types";

type AnalyticsState = {
  events: AnalyticsEvent[];
};

type AnalyticsRootState = {
  analytics: AnalyticsState;
};

const initialState: AnalyticsState = {
  events: [],
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    logEvent(state, action: PayloadAction<LogEventInput>) {
      const event: AnalyticsEvent = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: action.payload.name,
        timestamp: new Date().toISOString(),
        payload: action.payload.payload,
      };
      state.events.unshift(event);
    },
  },
});

export const { logEvent } = analyticsSlice.actions;

export const selectAnalyticsEvents = (state: AnalyticsRootState) =>
  state.analytics.events;

export default analyticsSlice.reducer;
