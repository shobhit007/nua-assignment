import { useCallback, useEffect, useReducer, useRef } from "react";

import { fetchProductById } from "../api/product.api";
import type { Product } from "../types";

type ProductState = {
  product: Product | null;
  loading: boolean;
  error: string | null;
};

type ProductAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; product: Product }
  | { type: "FETCH_ERROR"; error: string };

const initialState: ProductState = {
  product: null,
  loading: true,
  error: null,
};

function productReducer(
  state: ProductState,
  action: ProductAction,
): ProductState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        product: action.product,
        loading: false,
        error: null,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
}

export function useProduct(id: number | null) {
  const [state, dispatch] = useReducer(productReducer, initialState);
  const requestIdRef = useRef(0);

  const loadProduct = useCallback(async (productId: number) => {
    const requestId = ++requestIdRef.current;
    dispatch({ type: "FETCH_START" });

    try {
      const product = await fetchProductById(productId);
      if (requestId !== requestIdRef.current) return;
      dispatch({ type: "FETCH_SUCCESS", product });
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      dispatch({
        type: "FETCH_ERROR",
        error:
          error instanceof Error ? error.message : "Failed to fetch product",
      });
    }
  }, []);

  useEffect(() => {
    if (id == null || Number.isNaN(id)) {
      dispatch({
        type: "FETCH_ERROR",
        error: "Invalid product id",
      });
      return;
    }

    loadProduct(id);
  }, [id, loadProduct]);

  const retry = useCallback(() => {
    if (id == null || Number.isNaN(id)) return;
    loadProduct(id);
  }, [id, loadProduct]);

  return {
    ...state,
    retry,
  };
}
