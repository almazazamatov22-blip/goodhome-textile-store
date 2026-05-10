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
    query: 'select=*&order=registeredAt.desc',
  });
}

export function createSupabaseOrder(order: Order) {
  return supabaseRest<Order[]>('orders', {
    method: 'POST',
    body: order,
  });
}
