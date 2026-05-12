import { createContext, useContext } from 'react';
import type { Category, Order, Product, Review, SiteSettings, User } from './products';

export interface ShopDataContextValue {
  products: Product[];
  categories: Category[];
  orders: Order[];
  users: User[];
  reviews: Review[];
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  saveCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  createOrder: (order: Order) => Promise<void>;
  createReview: (review: Omit<Review, 'id' | 'status' | 'createdAt'>) => Promise<void>;
}

export const ShopDataContext = createContext<ShopDataContextValue>({} as ShopDataContextValue);

export const useShopData = () => useContext(ShopDataContext);
