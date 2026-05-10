import { useState, type ReactNode } from 'react';
import { type Product } from './data/products';
import { CartContext, type CartItem } from './cartStore';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const add = (p: Product) => setItems(prev => {
    const ex = prev.find(i => i.id === p.id);
    return ex ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...p, qty: 1 }];
  });
  const remove = (id: number) => setItems(prev => prev.filter(i => i.id !== id));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  return <CartContext.Provider value={{ items, add, remove, clear, total }}>{children}</CartContext.Provider>;
}
