import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CartItem, CartItemInput } from "@/features/cart/types";

type CartState = {
  items: CartItem[];
};

type CartRootState = {
  cart: CartState;
};

const initialState: CartState = {
  items: [],
};

function discountedUnitPrice(
  item: Pick<CartItem, "price" | "discountPercentage">,
) {
  return item.price * (1 - item.discountPercentage / 100);
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItemInput>) {
      const existing = state.items.find(
        (item) => item.id === action.payload.id,
      );
      if (existing) {
        existing.quantity += 1;
        return;
      }
      state.items.push({ ...action.payload, quantity: 1 });
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    decrementQuantity(state, action: PayloadAction<number>) {
      const existing = state.items.find((item) => item.id === action.payload);
      if (!existing) return;
      if (existing.quantity <= 1) {
        state.items = state.items.filter((item) => item.id !== action.payload);
        return;
      }
      existing.quantity -= 1;
    },
  },
});

export const { addToCart, removeFromCart, decrementQuantity } =
  cartSlice.actions;

export const selectCartItems = (state: CartRootState) => state.cart.items;

export const selectCartItemCount = (state: CartRootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartSubtotal = (state: CartRootState) =>
  state.cart.items.reduce(
    (sum, item) => sum + discountedUnitPrice(item) * item.quantity,
    0,
  );

export default cartSlice.reducer;
