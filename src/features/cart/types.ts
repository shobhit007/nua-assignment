export type CartItem = {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  quantity: number;
};

export type CartItemInput = Omit<CartItem, "quantity">;
