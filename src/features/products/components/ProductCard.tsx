import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { memo, useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";

import type { Product } from "../types";

export const IMAGE_HEIGHT = 140;
export const CARD_CONTENT_HEIGHT = 72;

type ProductCardProps = {
  product: Product;
};

function ProductCardComponent({ product }: ProductCardProps) {
  const router = useRouter();
  const imageUri = product.thumbnail || product.images[0];

  const onPress = useCallback(() => {
    router.push(`/product/${product.id}`);
  }, [product.id, router]);

  return (
    <Pressable style={styles.card} onPress={onPress}>
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
    </Pressable>
  );
}

export const ProductCard = memo(ProductCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Spacing.two,
    overflow: "hidden",
    marginBottom: Spacing.two,
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
