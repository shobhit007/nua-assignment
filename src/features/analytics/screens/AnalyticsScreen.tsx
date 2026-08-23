import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useCallback } from "react";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import type { AnalyticsEvent } from "@/features/analytics/types";
import { useAppSelector } from "@/store/hooks";
import { selectAnalyticsEvents } from "@/store/slices/analyticsSlice";

function formatTimestamp(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function AnalyticsScreen() {
  const router = useRouter();
  const events = useAppSelector(selectAnalyticsEvents);

  const keyExtractor = useCallback((item: AnalyticsEvent) => item.id, []);

  const renderItem = useCallback<ListRenderItem<AnalyticsEvent>>(
    ({ item }) => (
      <View style={styles.row}>
        <ThemedText type="smallBold">{item.name}</ThemedText>
        <ThemedText type="small" style={styles.timestamp}>
          {formatTimestamp(item.timestamp)}
        </ThemedText>
        {item.payload
          ? Object.entries(item.payload).map(([key, value]) => (
              <ThemedText key={key} type="small" style={styles.payloadLine}>
                {key}: {value == null ? "—" : String(value)}
              </ThemedText>
            ))
          : null}
      </View>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color={Colors.light.text} />
        </Pressable>
        <ThemedText type="subtitle" style={styles.headerTitle}>
          Analytics
        </ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={events}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          events.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText type="default" style={styles.emptyText}>
              No events yet
            </ThemedText>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    lineHeight: 30,
  },
  headerSpacer: {
    width: 40,
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.six,
  },
  emptyText: {
    color: Colors.light.textSecondary,
  },
  row: {
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.backgroundSelected,
    gap: Spacing.half,
  },
  timestamp: {
    color: Colors.light.textSecondary,
  },
  payloadLine: {
    color: Colors.light.textSecondary,
  },
});
