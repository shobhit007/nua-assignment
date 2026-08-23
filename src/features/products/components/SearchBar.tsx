import { Search, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { Colors, Spacing } from "@/constants/theme";

const DEBOUNCE_MS = 500;

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [search, setSearch] = useState("");
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onSearch(search);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search, onSearch]);

  const handleClearSearch = () => setSearch("");

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Search size={20} color={Colors.light.textSecondary} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          style={styles.input}
          placeholder="Search products"
          placeholderTextColor={Colors.light.textSecondary}
          accessibilityLabel="Search products"
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          selectionColor={Colors.light.text}
        />

        {search && (
          <Pressable onPress={handleClearSearch}>
            <X size={20} color={Colors.light.text} />
          </Pressable>
        )}
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
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    color: Colors.light.text,
    paddingVertical: 0,
  },
});
