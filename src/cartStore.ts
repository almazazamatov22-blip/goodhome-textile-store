import { createContext, useContext } from 'react';
import { type Product } from './data/products';

export interface CartItem extends Product {
  qty: number;
}

export interface CartCtx {
  items: CartItem[];
  add: (p: Product) => void;
  remove: (id: number) => void;
  clear: () => void;
  total: number;
}

export const CartContext = createContext<CartCtx>({} as CartCtx);

export const useCart = () => useContext(CartContext);
