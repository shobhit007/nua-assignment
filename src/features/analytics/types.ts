export type AnalyticsEventName =
  | "product_viewed"
  | "add_to_cart"
  | "search_performed"
  | "app_backgrounded";

export type AnalyticsEventPayload = Record<string, string | number | null>;

export type AnalyticsEvent = {
  id: string;
  name: AnalyticsEventName;
  timestamp: string;
  payload?: AnalyticsEventPayload;
};

export type LogEventInput = {
  name: AnalyticsEventName;
  payload?: AnalyticsEventPayload;
};
