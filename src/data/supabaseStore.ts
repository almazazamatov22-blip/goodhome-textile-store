import { supabaseRest } from '../lib/supabase';
import { DEFAULT_SITE_SETTINGS, type Category, type Order, type Product, type Review, type SiteSettings, type User } from './products';

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

export function fetchSupabaseReviews() {
  return supabaseRest<Review[]>('product_reviews', {
    query: 'select=*&status=eq.approved&order=createdAt.desc',
  }).then(reviews => reviews.map(mapReview));
}

export function fetchSupabaseSettings() {
  return supabaseRest<{ key: string; value: SiteSettings }[]>('site_settings', {
    query: 'select=*&key=eq.main',
  }).then(rows => rows[0]?.value || DEFAULT_SITE_SETTINGS);
}

export function createSupabaseOrder(order: Order) {
  return supabaseRest<Order[]>('orders', {
    method: 'POST',
    body: order,
  });
}

export function createSupabaseReview(review: Omit<Review, 'id' | 'status' | 'createdAt'>) {
  return supabaseRest<[]>('product_reviews', {
    method: 'POST',
    prefer: 'return=minimal',
    body: {
      productId: review.productId,
      customerName: review.customerName,
      customerContact: review.customerContact,
      rating: review.rating,
      text: review.text,
      status: 'pending',
    },
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

function mapReview(row: Review & { product_id?: number; customer_name?: string; customer_contact?: string; created_at?: string }): Review {
  return {
    id: row.id,
    productId: row.productId ?? row.product_id ?? 0,
    customerName: row.customerName ?? row.customer_name ?? '',
    customerContact: row.customerContact ?? row.customer_contact ?? '',
    rating: row.rating,
    text: row.text,
    status: row.status,
    createdAt: row.createdAt ?? row.created_at ?? '',
  };
}
