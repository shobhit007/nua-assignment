import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";

import { ProductCard } from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types";

const NUM_COLUMNS = 2;
const COLUMN_GAP = Spacing.two;

export function ProductListScreen() {
  const {
    products,
    loading,
    loadingMore,
    error,
    searchError,
    query,
    total,
    loadMore,
    retry,
    refreshProducts,
    search,
    retrySearch,
  } = useProducts();

  const keyExtractor = useCallback((item: Product) => String(item.id), []);

  const renderItem = useCallback<ListRenderItem<Product>>(
    ({ item }) => (
      <View style={styles.column}>
        <ProductCard product={item} />
      </View>
    ),
    [],
  );

  const onEndReached = useCallback(() => {
    loadMore();
  }, [loadMore]);

  const listEmpty = (
    <View style={styles.empty}>
      {loading.initial || loading.search ? (
        <ActivityIndicator size="large" color={Colors.light.textSecondary} />
      ) : searchError ? (
        <>
          <ThemedText type="default" style={styles.emptyText}>
            {searchError}
          </ThemedText>
          <Pressable style={styles.retryButton} onPress={retrySearch}>
            <ThemedText type="smallBold" style={styles.retryLabel}>
              Retry search
            </ThemedText>
          </Pressable>
        </>
      ) : error ? (
        <>
          <ThemedText type="default" style={styles.emptyText}>
            {error}
          </ThemedText>
          <Pressable style={styles.retryButton} onPress={retry}>
            <ThemedText type="smallBold" style={styles.retryLabel}>
              Retry
            </ThemedText>
          </Pressable>
        </>
      ) : (
        <ThemedText type="default" style={styles.emptyText}>
          {query ? "No products match your search" : "No products found"}
        </ThemedText>
      )}
    </View>
  );

  const listFooter = (
    <View style={styles.footer}>
      {loadingMore ? (
        <ActivityIndicator color={Colors.light.textSecondary} />
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Products</ThemedText>
        {total > 0 && !loading.search ? (
          <ThemedText type="small" style={styles.count}>
            {products.length} of {total}
          </ThemedText>
        ) : null}
      </View>

      <SearchBar onSearch={search} />

      {(loading.search || loading.initial) && products.length > 0 ? (
        <View style={styles.searchLoading}>
          <ActivityIndicator color={Colors.light.textSecondary} />
        </View>
      ) : null}

      {searchError && products.length > 0 ? (
        <View style={styles.searchErrorBanner}>
          <ThemedText type="small" style={styles.emptyText}>
            {searchError}
          </ThemedText>
          <Pressable onPress={retrySearch}>
            <ThemedText type="smallBold" style={styles.retryLabel}>
              Retry
            </ThemedText>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={products}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.listContent,
          products.length === 0 && styles.listContentEmpty,
        ]}
        refreshing={loading.refresh}
        onRefresh={refreshProducts}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={listFooter}
        initialNumToRender={10}
        maxToRenderPerBatch={8}
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
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  count: {
    color: Colors.light.textSecondary,
  },
  searchLoading: {
    paddingBottom: Spacing.two,
    alignItems: "center",
  },
  searchErrorBanner: {
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.two,
    padding: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: Colors.light.backgroundElement,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  columnWrapper: {
    marginHorizontal: -COLUMN_GAP / 2,
  },
  column: {
    width: "50%",
    paddingHorizontal: COLUMN_GAP / 2,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.six,
    gap: Spacing.three,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.light.textSecondary,
  },
  retryButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: Colors.light.backgroundSelected,
    borderRadius: Spacing.two,
  },
  retryLabel: {
    color: Colors.light.text,
  },
  footer: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
