import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  DEFAULT_CATEGORIES,
  getCategories,
  getOrders,
  getProducts,
  getUsers,
  saveCategories,
  saveOrders,
  saveProducts,
  saveUsers,
  type Category,
  type Order,
  type Product,
  type User,
} from './products';
import {
  createSupabaseCategory,
  createSupabaseOrder,
  createSupabaseProduct,
  deleteSupabaseCategory,
  deleteSupabaseProduct,
  fetchSupabaseCategories,
  fetchSupabaseOrders,
  fetchSupabaseProducts,
  fetchSupabaseUsers,
  updateSupabaseCategory,
  updateSupabaseProduct,
} from './supabaseStore';
import { ShopDataContext } from './shopDataStore';

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    oldPrice: product.oldPrice || undefined,
    installment: product.installment || Math.floor(product.price / 12),
    images: product.images?.length ? product.images : [product.image],
    attributes: product.attributes || {},
  };
}

export function ShopDataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [categories, setCategories] = useState<Category[]>(getCategories());
  const [orders, setOrders] = useState<Order[]>(getOrders());
  const [users, setUsers] = useState<User[]>(getUsers());
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setCategories(getCategories().length ? getCategories() : DEFAULT_CATEGORIES);
      setProducts(getProducts());
      setOrders(getOrders());
      setUsers(getUsers());
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [nextProducts, nextCategories, nextOrders, nextUsers] = await Promise.all([
        fetchSupabaseProducts(),
        fetchSupabaseCategories(),
        fetchSupabaseOrders(),
        fetchSupabaseUsers(),
      ]);

      setProducts(nextProducts);
      setCategories(nextCategories.length ? nextCategories : DEFAULT_CATEGORIES);
      setOrders(nextOrders);
      setUsers(nextUsers);

      saveProducts(nextProducts);
      saveCategories(nextCategories.length ? nextCategories : DEFAULT_CATEGORIES);
      saveOrders(nextOrders);
      saveUsers(nextUsers);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось загрузить данные из Supabase';
      setError(message);
      setProducts(getProducts());
      setCategories(getCategories().length ? getCategories() : DEFAULT_CATEGORIES);
      setOrders(getOrders());
      setUsers(getUsers());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const saveProduct = useCallback(async (product: Product) => {
    const nextProduct = normalizeProduct(product);
    const exists = products.some(item => item.id === nextProduct.id);

    if (isSupabaseConfigured) {
      const [saved] = exists
        ? await updateSupabaseProduct(nextProduct)
        : await createSupabaseProduct(nextProduct);
      setProducts(prev => exists ? prev.map(item => item.id === saved.id ? saved : item) : [...prev, saved]);
      return;
    }

    const nextProducts = exists
      ? products.map(item => item.id === nextProduct.id ? nextProduct : item)
      : [...products, nextProduct];
    setProducts(nextProducts);
    saveProducts(nextProducts);
  }, [products]);

  const removeProduct = useCallback(async (id: number) => {
    if (isSupabaseConfigured) {
      await deleteSupabaseProduct(id);
    }
    setProducts(prev => {
      const nextProducts = prev.filter(product => product.id !== id);
      saveProducts(nextProducts);
      return nextProducts;
    });
  }, []);

  const saveCategory = useCallback(async (category: Category) => {
    const exists = categories.some(item => item.id === category.id);

    if (isSupabaseConfigured) {
      const [saved] = exists
        ? await updateSupabaseCategory(category)
        : await createSupabaseCategory(category);
      setCategories(prev => exists ? prev.map(item => item.id === saved.id ? saved : item) : [...prev, saved]);
      return;
    }

    const nextCategories = exists
      ? categories.map(item => item.id === category.id ? category : item)
      : [...categories, category];
    setCategories(nextCategories);
    saveCategories(nextCategories);
  }, [categories]);

  const removeCategory = useCallback(async (id: number) => {
    if (isSupabaseConfigured) {
      await deleteSupabaseCategory(id);
    }
    setCategories(prev => {
      const nextCategories = prev.filter(category => category.id !== id);
      saveCategories(nextCategories);
      return nextCategories;
    });
  }, []);

  const createOrder = useCallback(async (order: Order) => {
    if (isSupabaseConfigured) {
      const [saved] = await createSupabaseOrder(order);
      setOrders(prev => [saved, ...prev]);
      return;
    }

    setOrders(prev => {
      const nextOrders = [order, ...prev];
      saveOrders(nextOrders);
      return nextOrders;
    });
  }, []);

  return (
    <ShopDataContext.Provider value={{
      products,
      categories,
      orders,
      users,
      loading,
      error,
      refresh,
      saveProduct,
      deleteProduct: removeProduct,
      saveCategory,
      deleteCategory: removeCategory,
      createOrder,
    }}>
      {children}
    </ShopDataContext.Provider>
  );
}
