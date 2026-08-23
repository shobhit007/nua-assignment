import type {
  FetchProductsParams,
  Product,
  ProductsResponse,
  SearchProductsParams,
} from "../types";

export async function fetchProducts({
  skip = 0,
  limit = 10,
  query,
}: FetchProductsParams = {}): Promise<ProductsResponse> {
  let url = `https://dummyjson.com/products?skip=${skip}&limit=${limit}`;
  if (query) {
    url = `https://dummyjson.com/products/search?q=${query}&skip=${skip}&limit=${limit}`;
  }
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch products (${response.status})`);
  }

  return response.json();
}

export async function searchProducts({
  q,
  skip = 0,
  limit = 10,
}: SearchProductsParams): Promise<ProductsResponse> {
  const params = new URLSearchParams({
    q,
    skip: String(skip),
    limit: String(limit),
  });
  const response = await fetch(
    `https://dummyjson.com/products/search?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to search products (${response.status})`);
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
