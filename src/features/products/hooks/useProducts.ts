import { useCallback, useEffect, useReducer, useRef } from "react";

import { logAnalytics } from "@/features/analytics/logAnalytics";

import { fetchProducts, searchProducts } from "../api/product.api";
import type { Product } from "../types";

const PAGE_LIMIT = 20;

type Loading = {
  initial: boolean;
  refresh: boolean;
  search: boolean;
};

type ProductsState = {
  products: Product[];
  loading: Loading;
  loadingMore: boolean;
  error: string | null;
  searchError: string | null;
  query: string;
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
  | { type: "FETCH_ERROR"; error: string; append: boolean }
  | { type: "REFRESH" }
  | {
      type: "REFRESH_SUCCESS";
      products: Product[];
      skip: number;
      limit: number;
      total: number;
    }
  | { type: "REFRESH_ERROR"; error: string }
  | { type: "SEARCH_START"; query: string }
  | {
      type: "SEARCH_SUCCESS";
      products: Product[];
      skip: number;
      limit: number;
      total: number;
      query: string;
    }
  | { type: "SEARCH_ERROR"; error: string; query: string }
  | { type: "SEARCH_CLEAR" };

const initialState: ProductsState = {
  products: [],
  loading: {
    initial: true,
    refresh: false,
    search: false,
  },
  loadingMore: false,
  error: null,
  searchError: null,
  query: "",
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
        loading: action.append
          ? state.loading
          : { ...state.loading, initial: true },
        loadingMore: action.append,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: { ...state.loading, initial: false },
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
        loading: { ...state.loading, initial: false },
        loadingMore: false,
        error: action.error,
      };
    case "REFRESH":
      return {
        ...state,
        loading: { ...state.loading, refresh: true },
      };
    case "REFRESH_SUCCESS":
      return {
        ...state,
        loading: { ...state.loading, initial: false, refresh: false },
        products: action.products,
        loadingMore: false,
        error: null,
        skip: action.skip,
        limit: action.limit,
        total: action.total,
      };
    case "REFRESH_ERROR":
      return {
        ...state,
        loading: { ...state.loading, initial: false, refresh: false },
        loadingMore: false,
        error: action.error,
      };
    case "SEARCH_START":
      return {
        ...state,
        query: action.query,
        searchError: null,
        loading: { ...state.loading, search: true },
      };
    case "SEARCH_SUCCESS":
      return {
        ...state,
        query: action.query,
        products: action.products,
        skip: action.skip,
        limit: action.limit,
        total: action.total,
        loading: { ...state.loading, search: false },
        searchError: null,
        loadingMore: false,
        error: null,
      };
    case "SEARCH_ERROR":
      return {
        ...state,
        query: action.query,
        loading: { ...state.loading, search: false },
        searchError: action.error,
      };
    case "SEARCH_CLEAR":
      return {
        ...state,
        query: "",
        searchError: null,
        loading: { ...state.loading, search: false },
      };
    default:
      return state;
  }
}

export function useProducts() {
  const [state, dispatch] = useReducer(productsReducer, initialState);
  const requestIdRef = useRef(0);

  const loadProducts = useCallback(
    async (skip: number, append: boolean, query?: string) => {
      const requestId = ++requestIdRef.current;
      dispatch({ type: "FETCH_START", append });

      try {
        const data = await fetchProducts({ skip, limit: PAGE_LIMIT, query });
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
    },
    [],
  );

  useEffect(() => {
    loadProducts(0, false);
  }, [loadProducts]);

  const loadMore = useCallback(() => {
    const { loading, loadingMore, error, products, total, query } = state;
    if (
      loading.initial ||
      loading.search ||
      loadingMore ||
      error ||
      products.length >= total
    ) {
      return;
    }

    loadProducts(products.length, true, state.query);
  }, [loadProducts, state]);

  const retry = useCallback(() => {
    loadProducts(0, false);
  }, [loadProducts]);

  const refreshProducts = useCallback(async () => {
    if (state.query) return;

    const requestId = ++requestIdRef.current;
    dispatch({ type: "REFRESH" });

    try {
      const data = await fetchProducts({ limit: PAGE_LIMIT });
      if (requestId !== requestIdRef.current) return;

      dispatch({
        type: "REFRESH_SUCCESS",
        products: data.products,
        skip: data.skip,
        limit: data.limit,
        total: data.total,
      });
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      dispatch({
        type: "REFRESH_ERROR",
        error:
          error instanceof Error ? error.message : "Failed to fetch products",
      });
    }
  }, [state.query]);

  const search = useCallback(
    async (rawQuery: string) => {
      const query = rawQuery.trim();

      if (!query) {
        dispatch({ type: "SEARCH_CLEAR" });
        loadProducts(0, false);
        return;
      }

      const requestId = ++requestIdRef.current;
      dispatch({ type: "SEARCH_START", query });

      try {
        // Stale search handling intentionally omitted for now.
        const data = await searchProducts({ q: query, limit: PAGE_LIMIT });

        if (requestId !== requestIdRef.current) return;

        dispatch({
          type: "SEARCH_SUCCESS",
          products: data.products,
          skip: data.skip,
          limit: data.limit,
          total: data.total,
          query,
        });

        logAnalytics({
          name: "search_performed",
          payload: {
            query,
            resultCount: data.total,
          },
        });
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        dispatch({
          type: "SEARCH_ERROR",
          query,
          error:
            error instanceof Error
              ? error.message
              : "Failed to search products",
        });
      }
    },
    [loadProducts],
  );

  const retrySearch = useCallback(() => {
    if (!state.query) return;
    search(state.query);
  }, [search, state.query]);

  return {
    ...state,
    loadMore,
    retry,
    refreshProducts,
    search,
    retrySearch,
  };
}
