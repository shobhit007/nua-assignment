import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";

const POLICY_URL = "https://www.dummyjson.com";

export function ReturnPolicyScreen() {
  const router = useRouter();
  const [hasError, setHasError] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
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
          Return Policy
        </ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.body}>
        {hasError ? (
          <View style={styles.error}>
            <ThemedText type="default" style={styles.errorText}>
              Failed to load content
            </ThemedText>
          </View>
        ) : (
          <WebView
            source={{ uri: POLICY_URL }}
            style={styles.webview}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.loading}>
                <ActivityIndicator color={Colors.light.textSecondary} />
              </View>
            )}
            onError={() => setHasError(true)}
            onHttpError={() => setHasError(true)}
          />
        )}
      </View>
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
  body: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loading: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
  },
  error: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.three,
  },
  errorText: {
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
});
