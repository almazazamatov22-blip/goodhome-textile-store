import { supabaseRest } from '../lib/supabase';
import type { Category, Order, Product, User } from './products';

export function fetchSupabaseProducts() {
  return supabaseRest<Product[]>('products', {
    query: 'select=*&order=id.asc',
  });
}

export function fetchSupabaseCategories() {
  return supabaseRest<Category[]>('categories', {
    query: 'select=*&order=id.asc',
  });
}

export function fetchSupabaseOrders() {
  return supabaseRest<Order[]>('orders', {
    query: 'select=*&order=date.desc',
  });
}

export function fetchSupabaseUsers() {
  return supabaseRest<User[]>('profiles', {
    query: 'select=*&order=id.asc',
  });
}

export function createSupabaseOrder(order: Order) {
  return supabaseRest<Order[]>('orders', {
    method: 'POST',
    body: order,
  });
}

export function createSupabaseProduct(product: Product) {
  return supabaseRest<Product[]>('products', {
    method: 'POST',
    body: product,
  });
}

export function updateSupabaseProduct(product: Product) {
  return supabaseRest<Product[]>('products', {
    method: 'PATCH',
    query: `id=eq.${product.id}`,
    body: product,
  });
}

export function deleteSupabaseProduct(id: number) {
  return supabaseRest<Product[]>('products', {
    method: 'DELETE',
    query: `id=eq.${id}`,
  });
}

export function createSupabaseCategory(category: Category) {
  return supabaseRest<Category[]>('categories', {
    method: 'POST',
    body: category,
  });
}

export function updateSupabaseCategory(category: Category) {
  return supabaseRest<Category[]>('categories', {
    method: 'PATCH',
    query: `id=eq.${category.id}`,
    body: category,
  });
}

export function deleteSupabaseCategory(id: number) {
  return supabaseRest<Category[]>('categories', {
    method: 'DELETE',
    query: `id=eq.${id}`,
  });
}
