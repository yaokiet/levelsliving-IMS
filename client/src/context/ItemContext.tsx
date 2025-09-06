"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { useParams } from "next/navigation"; // Or 'react-router-dom'
import { getItemDetails } from "@/lib/api/itemsApi";
import { ItemWithComponents } from "@/types/item";

// Define the shape of the context data
interface ItemContextType {
  item: ItemWithComponents | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Create the context with a default value of null
const ItemContext = createContext<ItemContextType | null>(null);

/**
 * Provider that:
 * - Extracts item ID from the current route (expects a route param named "id")
 * - Fetches item details from the API
 * - Makes item, loading, error, and refetch available to descendants
 */
export const ItemProvider = ({ children }: { children: ReactNode }) => {
  const [item, setItem] = useState<ItemWithComponents | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use useParams to get the ID from the URL
  const params = useParams();
  const itemId = params.id ? parseInt(params.id as string, 10) : null;

  /**
   * Fetch the item details for the current itemId.
   * Manages loading/error states and stores the result in state.
   */
  const fetchItem = React.useCallback(async () => {
    if (!itemId) {
      setError("No item ID found in URL.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Call the API layer for item details
      const data = await getItemDetails(itemId);
      setItem(data);
    } catch (err) {
      console.error("Error fetching item details:", err);
      setError("Failed to load item details.");
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  // Fetch on mount and whenever the itemId changes.
  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  /**
   * Public refetch callback exposed via context.
   * Useful after mutations to refresh the latest server state.
   */
  const refetch = React.useCallback(async () => {
    await fetchItem();
  }, [fetchItem]);

  const value = { item, loading, error, refetch };

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
};

// Create a custom hook for easy access to the context
export const useItem = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("useItem must be used within an ItemProvider");
  }
  return context;
};
