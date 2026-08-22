import { Image } from "expo-image";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";

import type { Product } from "../types";

export const IMAGE_HEIGHT = 140;
export const CARD_CONTENT_HEIGHT = 72;
export const CARD_VERTICAL_GAP = Spacing.two;
/** Full row height used by FlatList getItemLayout (image + content + gap). */
export const PRODUCT_ROW_HEIGHT =
  IMAGE_HEIGHT + CARD_CONTENT_HEIGHT + CARD_VERTICAL_GAP;

type ProductCardProps = {
  product: Product;
};

function ProductCardComponent({ product }: ProductCardProps) {
  const imageUri = product.thumbnail || product.images[0];

  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={imageUri ? { uri: imageUri } : undefined}
        recyclingKey={String(product.id)}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.content}>
        <ThemedText
          type="smallBold"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.title}
        >
          {product.title}
        </ThemedText>
        <ThemedText type="small" style={styles.price}>
          ${product.price.toFixed(2)}
        </ThemedText>
        <ThemedText type="small" style={styles.meta} numberOfLines={1}>
          ★ {product.rating.toFixed(1)}
          {product.discountPercentage > 0
            ? ` · ${product.discountPercentage.toFixed(0)}% off`
            : ""}
        </ThemedText>
      </View>
    </View>
  );
}

export const ProductCard = memo(ProductCardComponent);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Spacing.two,
    overflow: "hidden",
    marginBottom: CARD_VERTICAL_GAP,
  },
  image: {
    width: "100%",
    height: IMAGE_HEIGHT,
    backgroundColor: Colors.light.backgroundSelected,
  },
  content: {
    height: CARD_CONTENT_HEIGHT,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    justifyContent: "center",
  },
  title: {
    marginBottom: Spacing.half,
  },
  price: {
    color: Colors.light.text,
    fontWeight: "700",
  },
  meta: {
    color: Colors.light.textSecondary,
    marginTop: Spacing.half,
  },
});
