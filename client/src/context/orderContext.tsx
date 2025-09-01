'use client'

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useParams } from 'next/navigation'; // Or 'react-router-dom'
import { getOrderById } from '@/lib/api/ordersApi';
import { OrderItem } from '@/types/order-item';

// Define the shape of the context data
interface OrderContextType {
  order: OrderItem | null;
  loading: boolean;
  error: string | null;
}

// Create the context with a default value of null
const OrderContext = createContext<OrderContextType | null>(null);

// Create the Provider component
export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use useParams to get the ID from the URL
  const params = useParams();
  const orderId = params.id ? parseInt(params.id as string, 10) : null;

  useEffect(() => {
    if (!orderId) {
      setError("No order ID found in URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    getOrderById(orderId)
      .then(data => {
        setOrder(data);
        setError(null);
      })
      .catch(err => {
        console.error("Error fetching order details:", err);
        setError("Failed to load order details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]); // Re-run the effect if the orderId changes

  const value = { order, loading, error };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useItem must be used within an ItemProvider');
  }
  return context;
};