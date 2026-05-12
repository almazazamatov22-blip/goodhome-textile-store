import { createContext, useContext } from 'react';
import type { Category, Order, Product, User } from './products';

export interface ShopDataContextValue {
  products: Product[];
  categories: Category[];
  orders: Order[];
  users: User[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  saveCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  createOrder: (order: Order) => Promise<void>;
}

export const ShopDataContext = createContext<ShopDataContextValue>({} as ShopDataContextValue);

export const useShopData = () => useContext(ShopDataContext);
