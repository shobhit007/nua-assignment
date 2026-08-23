import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react-native";
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
import type { CartItem } from "@/features/cart/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addToCart,
  decrementQuantity,
  removeFromCart,
  selectCartItems,
  selectCartSubtotal,
} from "@/store/slices/cartSlice";

function unitPrice(item: CartItem) {
  return item.price * (1 - item.discountPercentage / 100);
}

export function CartScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);

  const renderItem = useCallback<ListRenderItem<CartItem>>(
    ({ item }) => {
      const price = unitPrice(item);

      return (
        <View style={styles.row}>
          <Image
            style={styles.thumbnail}
            source={item.thumbnail ? { uri: item.thumbnail } : undefined}
            contentFit="cover"
          />
          <View style={styles.rowBody}>
            <ThemedText type="smallBold" numberOfLines={2}>
              {item.title}
            </ThemedText>
            <ThemedText type="small" style={styles.price}>
              ${price.toFixed(2)}
            </ThemedText>
            <View style={styles.qtyRow}>
              <Pressable
                style={styles.qtyButton}
                onPress={() => dispatch(decrementQuantity(item.id))}
                accessibilityLabel="Decrease quantity"
              >
                <Minus size={16} color={Colors.light.text} />
              </Pressable>
              <ThemedText type="smallBold" style={styles.qtyValue}>
                {item.quantity}
              </ThemedText>
              <Pressable
                style={styles.qtyButton}
                onPress={() =>
                  dispatch(
                    addToCart({
                      id: item.id,
                      title: item.title,
                      thumbnail: item.thumbnail,
                      price: item.price,
                      discountPercentage: item.discountPercentage,
                    }),
                  )
                }
                accessibilityLabel="Increase quantity"
              >
                <Plus size={16} color={Colors.light.text} />
              </Pressable>
              <Pressable
                style={styles.removeButton}
                onPress={() => dispatch(removeFromCart(item.id))}
                accessibilityLabel="Remove from cart"
              >
                <Trash2 size={18} color={Colors.light.textSecondary} />
              </Pressable>
            </View>
          </View>
        </View>
      );
    },
    [dispatch],
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
          Cart
        </ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          items.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText type="default" style={styles.emptyText}>
              Your cart is empty
            </ThemedText>
          </View>
        }
      />

      {items.length > 0 ? (
        <View style={styles.footer}>
          <ThemedText type="small" style={styles.totalLabel}>
            Total
          </ThemedText>
          <ThemedText type="default" style={styles.totalValue}>
            ${subtotal.toFixed(2)}
          </ThemedText>
        </View>
      ) : null}
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
    flexDirection: "row",
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.backgroundSelected,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: Spacing.two,
    backgroundColor: Colors.light.backgroundElement,
  },
  rowBody: {
    flex: 1,
    gap: Spacing.one,
  },
  price: {
    fontWeight: "700",
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: Spacing.two,
    backgroundColor: Colors.light.backgroundElement,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyValue: {
    minWidth: 24,
    textAlign: "center",
  },
  removeButton: {
    marginLeft: "auto",
    padding: Spacing.one,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.light.backgroundSelected,
    backgroundColor: Colors.light.background,
  },
  totalLabel: {
    color: Colors.light.textSecondary,
  },
  totalValue: {
    fontWeight: "700",
    fontSize: 18,
  },
});
