import type { FetchProductsParams, Product, ProductsResponse } from "../types";

export async function fetchProducts({
  skip = 0,
  limit = 10,
}: FetchProductsParams = {}): Promise<ProductsResponse> {
  const response = await fetch(
    `https://dummyjson.com/products?skip=${skip}&limit=${limit}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch products (${response.status})`);
  }

  return response.json();
}

export async function fetchProductById(id: number): Promise<Product> {
  const response = await fetch(`https://dummyjson.com/products/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch product (${response.status})`);
  }

  return response.json();
}
