import { useCallback, useEffect, useReducer, useRef } from "react";

import { fetchProducts } from "../api/product.api";
import type { Product } from "../types";

const PAGE_LIMIT = 20;

type ProductsState = {
  products: Product[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  skip: number;
  limit: number;
  total: number;
};

type ProductsAction =
  | { type: "FETCH_START"; append: boolean }
  | {
      type: "FETCH_SUCCESS";
      products: Product[];
      skip: number;
      limit: number;
      total: number;
      append: boolean;
    }
  | { type: "FETCH_ERROR"; error: string; append: boolean };

const initialState: ProductsState = {
  products: [],
  loading: true,
  loadingMore: false,
  error: null,
  skip: 0,
  limit: PAGE_LIMIT,
  total: 0,
};

function productsReducer(
  state: ProductsState,
  action: ProductsAction,
): ProductsState {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        error: null,
        loading: action.append ? state.loading : true,
        loadingMore: action.append,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: null,
        products: action.append
          ? [...state.products, ...action.products]
          : action.products,
        skip: action.skip,
        limit: action.limit,
        total: action.total,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: action.error,
      };
    default:
      return state;
  }
}

export function useProducts() {
  const [state, dispatch] = useReducer(productsReducer, initialState);
  const requestIdRef = useRef(0);

  const loadProducts = useCallback(async (skip: number, append: boolean) => {
    const requestId = ++requestIdRef.current;
    dispatch({ type: "FETCH_START", append });

    try {
      const data = await fetchProducts({ skip, limit: PAGE_LIMIT });
      if (requestId !== requestIdRef.current) return;

      dispatch({
        type: "FETCH_SUCCESS",
        products: data.products,
        skip: data.skip,
        limit: data.limit,
        total: data.total,
        append,
      });
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      dispatch({
        type: "FETCH_ERROR",
        error:
          error instanceof Error ? error.message : "Failed to fetch products",
        append,
      });
    }
  }, []);

  useEffect(() => {
    loadProducts(0, false);
  }, [loadProducts]);

  const loadMore = useCallback(() => {
    const { loading, loadingMore, error, products, total } = state;
    if (loading || loadingMore || error || products.length >= total) {
      return;
    }

    loadProducts(products.length, true);
  }, [loadProducts, state]);

  const retry = useCallback(() => {
    loadProducts(0, false);
  }, [loadProducts]);

  return {
    ...state,
    loadMore,
    retry,
  };
}
