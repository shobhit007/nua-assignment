import { StyleSheet, TextInput, View } from "react-native";

import { Colors, Spacing } from "@/constants/theme";
import { Search } from "lucide-react-native";

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Search size={20} color={Colors.light.textSecondary} />
        <TextInput
          style={styles.input}
          placeholder="Search products"
          placeholderTextColor={Colors.light.textSecondary}
          accessibilityLabel="Search products"
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          selectionColor={Colors.light.text}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    height: 44,
    paddingHorizontal: Spacing.three,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Spacing.two,
  },
  icon: {
    color: Colors.light.textSecondary,
    fontSize: 18,
    lineHeight: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    color: Colors.light.text,
    paddingVertical: 0,
  },
});
