import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";

import { ArrowLeft } from "lucide-react-native";
import { useProduct } from "../hooks/useProduct";
import type { ProductReview } from "../types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CAROUSEL_HEIGHT = Dimensions.get("window").height * 0.4;
const CART_BAR_HEIGHT = 64;

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function ProductDetailsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const productId = useMemo(() => {
    const parsed = Number(params.id);
    return Number.isFinite(parsed) ? parsed : null;
  }, [params.id]);

  const { product, loading, error, retry } = useProduct(productId);
  const [activeIndex, setActiveIndex] = useState(0);

  const images = useMemo(() => {
    if (!product) return [];
    if (product.images?.length) return product.images;
    return product.thumbnail ? [product.thumbnail] : [];
  }, [product]);

  const discountedPrice = useMemo(() => {
    if (!product) return 0;
    return product.price * (1 - product.discountPercentage / 100);
  }, [product]);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(
        event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
      );
      setActiveIndex(index);
    },
    [],
  );

  const renderImage = useCallback<ListRenderItem<string>>(
    ({ item, index }) => (
      <Image
        style={styles.carouselImage}
        source={{ uri: item }}
        recyclingKey={`${productId}-${index}`}
        contentFit="contain"
        transition={200}
      />
    ),
    [productId],
  );

  const onAddToCart = useCallback(() => {
    if (!product) return;
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        thumbnail: product.thumbnail || product.images[0] || "",
        price: product.price,
        discountPercentage: product.discountPercentage,
      }),
    );
    Alert.alert("Added to cart", product.title);
  }, [dispatch, product]);

  if (loading && !product) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.light.textSecondary} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.centered} edges={["top", "left", "right"]}>
        <ThemedText type="default" style={styles.errorText}>
          {error ?? "Product not found"}
        </ThemedText>
        {productId != null ? (
          <Pressable style={styles.retryButton} onPress={retry}>
            <ThemedText type="smallBold">Retry</ThemedText>
          </Pressable>
        ) : null}
        <Pressable style={styles.retryButton} onPress={() => router.back()}>
          <ThemedText type="smallBold">Go back</ThemedText>
        </Pressable>
      </SafeAreaView>
    );
  }

  const bottomPad = CART_BAR_HEIGHT + insets.bottom + Spacing.three;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.carouselWrap}>
          <FlatList
            data={images}
            keyExtractor={(uri, index) => `${uri}-${index}`}
            renderItem={renderImage}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onMomentumScrollEnd}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
          />

          <Pressable
            style={[styles.backButton, { top: insets.top + Spacing.two }]}
            onPress={() => router.back()}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={20} color={Colors.light.text} />
          </Pressable>

          {images.length > 1 ? (
            <View style={styles.indicatorRow}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicatorSegment,
                    index === activeIndex && styles.indicatorSegmentActive,
                  ]}
                />
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.details}>
          <ThemedText type="small" style={styles.metaLine}>
            {product.brand}
            {product.brand && product.category ? " · " : ""}
            {product.category}
          </ThemedText>

          <ThemedText type="subtitle" style={styles.title}>
            {product.title}
          </ThemedText>

          <View style={styles.priceRow}>
            <ThemedText type="default" style={styles.discountedPrice}>
              ${discountedPrice.toFixed(2)}
            </ThemedText>
            {product.discountPercentage > 0 ? (
              <>
                <ThemedText type="small" style={styles.originalPrice}>
                  ${product.price.toFixed(2)}
                </ThemedText>
                <ThemedText type="smallBold" style={styles.discountBadge}>
                  {product.discountPercentage.toFixed(0)}% off
                </ThemedText>
              </>
            ) : null}
          </View>

          <ThemedText type="small" style={styles.ratingLine}>
            ★ {product.rating.toFixed(2)}
            {product.availabilityStatus
              ? ` · ${product.availabilityStatus}`
              : ""}
            {` · ${product.stock} in stock`}
          </ThemedText>

          <ThemedText type="default" style={styles.description}>
            {product.description}
          </ThemedText>

          <Pressable
            style={styles.policyButton}
            onPress={() => router.push("/return-policy")}
            accessibilityRole="button"
            accessibilityLabel="Return policy"
          >
            <ThemedText type="smallBold" style={styles.policyButtonLabel}>
              Return Policy
            </ThemedText>
          </Pressable>

          <ThemedText type="default" style={styles.reviewsHeading}>
            Reviews ({product.reviews?.length ?? 0})
          </ThemedText>

          {(product.reviews ?? []).map((review: ProductReview, index) => (
            <View
              key={`${review.reviewerEmail}-${index}`}
              style={styles.reviewCard}
            >
              <View style={styles.reviewHeader}>
                <ThemedText type="smallBold">{review.reviewerName}</ThemedText>
                <ThemedText type="small" style={styles.reviewMeta}>
                  ★ {review.rating} · {formatDate(review.date)}
                </ThemedText>
              </View>
              <ThemedText type="small" style={styles.reviewComment}>
                {review.comment}
              </ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>

      <SafeAreaView
        style={[styles.cartBar, { paddingBottom: insets.bottom + Spacing.two }]}
        edges={["left", "right"]}
      >
        <Pressable
          style={styles.cartButton}
          onPress={onAddToCart}
          accessibilityRole="button"
          accessibilityLabel="Add to cart"
        >
          <ThemedText type="smallBold" style={styles.cartButtonLabel}>
            Add to Cart · ${discountedPrice.toFixed(2)}
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scroll: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  errorText: {
    textAlign: "center",
    color: Colors.light.textSecondary,
  },
  retryButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: Colors.light.backgroundSelected,
    borderRadius: Spacing.two,
  },
  carouselWrap: {
    height: CAROUSEL_HEIGHT,
    backgroundColor: Colors.light.backgroundElement,
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: CAROUSEL_HEIGHT,
    backgroundColor: Colors.light.backgroundElement,
  },
  backButton: {
    position: "absolute",
    left: Spacing.three,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorRow: {
    position: "absolute",
    left: Spacing.three,
    right: Spacing.three,
    bottom: Spacing.two,
    flexDirection: "row",
    gap: Spacing.one,
  },
  indicatorSegment: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.backgroundSelected,
  },
  indicatorSegmentActive: {
    backgroundColor: Colors.light.text,
  },
  details: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  metaLine: {
    color: Colors.light.textSecondary,
    textTransform: "capitalize",
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  discountedPrice: {
    fontWeight: "700",
    fontSize: 20,
  },
  originalPrice: {
    color: Colors.light.textSecondary,
    textDecorationLine: "line-through",
  },
  discountBadge: {
    color: Colors.light.textSecondary,
  },
  ratingLine: {
    color: Colors.light.textSecondary,
  },
  description: {
    marginTop: Spacing.one,
    color: Colors.light.text,
  },
  policyButton: {
    marginTop: Spacing.two,
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Spacing.two,
  },
  policyButtonLabel: {
    color: Colors.light.text,
  },
  infoBlock: {
    marginTop: Spacing.one,
    gap: Spacing.one,
    padding: Spacing.three,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Spacing.two,
  },
  infoLine: {
    color: Colors.light.textSecondary,
  },
  reviewsHeading: {
    marginTop: Spacing.three,
    fontWeight: "700",
  },
  reviewCard: {
    padding: Spacing.three,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Spacing.two,
    gap: Spacing.one,
  },
  reviewHeader: {
    gap: Spacing.half,
  },
  reviewMeta: {
    color: Colors.light.textSecondary,
  },
  reviewComment: {
    color: Colors.light.text,
  },
  cartBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    backgroundColor: Colors.light.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.light.backgroundSelected,
  },
  cartButton: {
    height: CART_BAR_HEIGHT - Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: Colors.light.text,
    alignItems: "center",
    justifyContent: "center",
  },
  cartButtonLabel: {
    color: Colors.light.background,
  },
});
