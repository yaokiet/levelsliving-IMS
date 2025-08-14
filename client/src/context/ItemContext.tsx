'use client'

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useParams } from 'next/navigation'; // Or 'react-router-dom'
import { getItemDetails } from '@/lib/api/itemsApi';
import { ItemWithComponents } from '@/types/item';

// Define the shape of the context data
interface ItemContextType {
  item: ItemWithComponents | null;
  loading: boolean;
  error: string | null;
}

// Create the context with a default value of null
const ItemContext = createContext<ItemContextType | null>(null);

// Create the Provider component
export const ItemProvider = ({ children }: { children: ReactNode }) => {
  const [item, setItem] = useState<ItemWithComponents | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use useParams to get the ID from the URL
  const params = useParams();
  const itemId = params.id ? parseInt(params.id as string, 10) : null;

  useEffect(() => {
    if (!itemId) {
      setError("No item ID found in URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    getItemDetails(itemId)
      .then(data => {
        setItem(data);
        setError(null);
      })
      .catch(err => {
        console.error("Error fetching item details:", err);
        setError("Failed to load item details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [itemId]); // Re-run the effect if the itemId changes

  const value = { item, loading, error };

  return (
    <ItemContext.Provider value={value}>
      {children}
    </ItemContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useItem = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItem must be used within an ItemProvider');
  }
  return context;
};