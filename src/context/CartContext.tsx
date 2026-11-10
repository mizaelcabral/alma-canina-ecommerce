'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, PurchaseType, ShippingQuote } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, purchaseType?: PurchaseType, frequency?: 'monthly' | 'biweekly', petInfo?: CartItem['petInfo']) => void;
  removeFromCart: (productId: string, purchaseType: PurchaseType) => void;
  updateQuantity: (productId: string, purchaseType: PurchaseType, quantity: number) => void;
  togglePurchaseType: (productId: string, currentType: PurchaseType) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  subscriptionDiscount: number;
  total: number;
  shippingQuote: ShippingQuote | null;
  setShippingQuote: (quote: ShippingQuote | null) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shippingQuote, setShippingQuote] = useState<ShippingQuote | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('alma_canina_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('alma_canina_cart', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to localStorage', e);
      }
    }
  }, [items, isLoaded]);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    purchaseType: PurchaseType = 'subscription',
    frequency: 'monthly' | 'biweekly' = 'monthly',
    petInfo?: CartItem['petInfo']
  ) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.purchaseType === purchaseType
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }

      return [
        ...prev,
        {
          product,
          quantity,
          purchaseType,
          subscriptionFrequency: frequency,
          petInfo,
        },
      ];
    });

    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string, purchaseType: PurchaseType) => {
    setItems((prev) => prev.filter((i) => !(i.product.id === productId && i.purchaseType === purchaseType)));
  };

  const updateQuantity = (productId: string, purchaseType: PurchaseType, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, purchaseType);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.purchaseType === purchaseType) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const togglePurchaseType = (productId: string, currentType: PurchaseType) => {
    const newType: PurchaseType = currentType === 'subscription' ? 'one_time' : 'subscription';
    setItems((prev) => {
      const targetItem = prev.find((i) => i.product.id === productId && i.purchaseType === currentType);
      if (!targetItem) return prev;

      // Filter out old item
      const withoutOld = prev.filter((i) => !(i.product.id === productId && i.purchaseType === currentType));

      // Check if newType already exists
      const existingNewType = withoutOld.find((i) => i.product.id === productId && i.purchaseType === newType);
      if (existingNewType) {
        return withoutOld.map((i) =>
          i.product.id === productId && i.purchaseType === newType
            ? { ...i, quantity: i.quantity + targetItem.quantity }
            : i
        );
      }

      return [
        ...withoutOld,
        {
          ...targetItem,
          purchaseType: newType,
          subscriptionFrequency: newType === 'subscription' ? 'monthly' : undefined,
        },
      ];
    });
  };

  const clearCart = () => {
    setItems([]);
    setShippingQuote(null);
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Subtotal calculated at full one-time price
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Discount gained from subscription items
  const subscriptionDiscount = items.reduce((sum, item) => {
    if (item.purchaseType === 'subscription') {
      const diff = (item.product.price - item.product.subscriptionPrice) * item.quantity;
      return sum + diff;
    }
    return sum;
  }, 0);

  const shippingCost = shippingQuote ? shippingQuote.price : 0;
  const total = subtotal - subscriptionDiscount + shippingCost;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        togglePurchaseType,
        clearCart,
        totalItemsCount,
        subtotal,
        subscriptionDiscount,
        total,
        shippingQuote,
        setShippingQuote,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
