import { useState, useEffect } from 'react';
import type { Product, Category } from '../types';

const STORAGE_KEY = 'shopping-list-data';

export const useShoppingList = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load storage', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = (name: string, quantity: number, category: Category) => {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name,
      quantity,
      category,
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Omit<Product, 'id'>>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const clearAll = () => {
    setProducts([]);
  };

  return {
    products,
    addProduct,
    updateProduct,
    removeProduct,
    clearAll,
    setProducts,
  };
};
