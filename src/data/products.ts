export interface Product {
  id: number;
  title: string;
  category: string;
  subCategory: string;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  description: string;
  rating: number;
  reviews: number;
  stock: number;
  badge?: string;
  installment?: number;
  attributes?: Record<string, string | string[]>;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  subCategories: string[];
}

export interface Order {
  id: string;
  userId: string | null;
  userName: string;
  items: { title: string; qty: number; price: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  date: string;
  address: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
  cartItems: number;
  totalOrders: number;
  totalSpent: number;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: 'Постельное белье', slug: 'bedding', image: 'https://loremflickr.com/900/900/bedding,bedroom?lock=1001', subCategories: ['Сатин', 'Страйп-Сатин', 'Поплин', 'Бязь', 'Ранфорс', 'Фланель'] },
  { id: 2, name: 'Подушки', slug: 'pillows', image: 'https://loremflickr.com/900/900/pillow,bedroom?lock=2001', subCategories: ['Анатомические', 'Декоративные', 'Детские', 'Ортопедические'] },
  { id: 3, name: 'Одеяла', slug: 'blankets', image: 'https://loremflickr.com/900/900/blanket,bed?lock=3001', subCategories: ['Бамбук', 'Шерсть', 'Хлопок', 'Всесезонные', 'Летние'] },
  { id: 4, name: 'Простыни', slug: 'sheets', image: 'https://loremflickr.com/900/900/bed,sheets?lock=4001', subCategories: ['На резинке', 'Классические', 'Наматрасники'] },
  { id: 5, name: 'Покрывала', slug: 'bedspreads', image: 'https://loremflickr.com/900/900/bedspread,quilt?lock=5001', subCategories: ['Жаккард', 'Хлопок', 'Пледы', 'Велюр'] },
  { id: 6, name: 'Полотенца', slug: 'towels', image: 'https://loremflickr.com/900/900/towels,bathroom?lock=6001', subCategories: ['Банные', 'Лицевые', 'Наборы', 'Коврики'] },
  { id: 7, name: 'Халаты', slug: 'robes', image: 'https://loremflickr.com/900/900/bathrobe,spa?lock=7001', subCategories: ['Махровые', 'Вафельные', 'Детские', 'Кимоно'] },
  { id: 8, name: 'Текстиль для кухни', slug: 'kitchen', image: 'https://loremflickr.com/900/900/kitchen,towels?lock=8001', subCategories: ['Скатерти', 'Салфетки', 'Полотенца кухонные', 'Прихватки'] },
  { id: 9, name: 'Детский текстиль', slug: 'children', image: 'https://loremflickr.com/900/900/children,bedding?lock=9001', subCategories: ['Пижамы', 'Одеяла', 'Постельное', 'Полотенца'] },
  { id: 10, name: 'Тапочки', slug: 'slippers', image: 'https://loremflickr.com/900/900/slippers,home?lock=10001', subCategories: ['Закрытые', 'Открытые', 'Детские'] },
  { id: 11, name: 'Шторы и ткани', slug: 'curtains', image: 'https://loremflickr.com/900/900/curtains,interior?lock=11001', subCategories: ['Портьеры', 'Тюль', 'Ткани метражом', 'Пошив на заказ'] },
];

export function getProducts(): Product[] {
  try { 
    const r = localStorage.getItem('gh_products'); 
    return r ? JSON.parse(r) : []; 
  } catch { return []; }
}
export function saveProducts(p: Product[]) { localStorage.setItem('gh_products', JSON.stringify(p)); }

export function getCategories(): Category[] {
  try { 
    const r = localStorage.getItem('gh_categories'); 
    return r ? JSON.parse(r) : DEFAULT_CATEGORIES; 
  } catch { return DEFAULT_CATEGORIES; }
}
export function saveCategories(c: Category[]) { localStorage.setItem('gh_categories', JSON.stringify(c)); }

export function getOrders(): Order[] {
  try { 
    const r = localStorage.getItem('gh_orders'); 
    return r ? JSON.parse(r) : []; 
  } catch { return []; }
}
export function saveOrders(o: Order[]) { localStorage.setItem('gh_orders', JSON.stringify(o)); }

export function getUsers(): User[] {
  try { 
    const r = localStorage.getItem('gh_users'); 
    return r ? JSON.parse(r) : []; 
  } catch { return []; }
}
export function saveUsers(u: User[]) { localStorage.setItem('gh_users', JSON.stringify(u)); }
