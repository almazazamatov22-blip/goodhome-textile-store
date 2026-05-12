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
  deliveryStatus?: 'not_started' | 'courier_assigned' | 'shipped' | 'delivered' | 'returned';
  deliveryService?: string | null;
  trackingNumber?: string | null;
  deliveryPrice?: number | null;
  deliveryComment?: string | null;
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

export interface Review {
  id: string;
  productId: number;
  customerName: string;
  customerContact: string;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink extends FooterLink {
  type: 'instagram' | 'youtube' | 'tiktok' | 'whatsapp' | '2gis' | 'other';
}

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  workHours: string;
  infoLinks: FooterLink[];
  socialLinks: SocialLink[];
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  phone: '+7 702 379 72 33',
  whatsapp: 'https://wa.me/77023797233',
  email: 'info@goodhome.kz',
  city: 'г. Астана, Казахстан',
  workHours: 'ПН-ВС: 10:00 - 20:00',
  infoLinks: [
    { label: 'О нас', href: '/about' },
    { label: 'Доставка и оплата', href: '/delivery-payment' },
    { label: 'Обмен и возврат', href: '/exchange-return' },
    { label: 'Гарантия качества', href: '/quality-guarantee' },
    { label: 'Контакты', href: '/contacts' },
  ],
  socialLinks: [
    { type: 'instagram', label: 'Instagram', href: 'https://instagram.com/goodhomekz' },
    { type: 'youtube', label: 'YouTube', href: 'https://youtube.com/' },
    { type: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/' },
    { type: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/77023797233' },
    { type: '2gis', label: '2GIS', href: 'https://2gis.kz/astana' },
  ],
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: 'Постельное белье', slug: 'bedding', image: 'https://images.unsplash.com/photo-1606855637183-ea2a00b6f15f?auto=format&fit=crop&w=600&q=80', subCategories: ['Сатин', 'Страйп-Сатин', 'Поплин', 'Бязь', 'Ранфорс', 'Фланель'] },
  { id: 2, name: 'Подушки', slug: 'pillows', image: 'https://images.unsplash.com/photo-1595191830227-a008b640e215?auto=format&fit=crop&w=400&q=80', subCategories: ['Анатомические', 'Декоративные', 'Детские', 'Ортопедические'] },
  { id: 3, name: 'Одеяла', slug: 'blankets', image: 'https://images.unsplash.com/photo-1612152505858-6c8f94d935f0?auto=format&fit=crop&w=400&q=80', subCategories: ['Бамбук', 'Шерсть', 'Хлопок', 'Всесезонные', 'Летние'] },
  { id: 4, name: 'Простыни', slug: 'sheets', image: 'https://images.unsplash.com/photo-1629949009765-40f74d96f285?auto=format&fit=crop&w=400&q=80', subCategories: ['На резинке', 'Классические', 'Наматрасники'] },
  { id: 5, name: 'Покрывала', slug: 'bedspreads', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80', subCategories: ['Жаккард', 'Хлопок', 'Пледы', 'Велюр'] },
  { id: 6, name: 'Полотенца', slug: 'towels', image: 'https://images.unsplash.com/photo-1653762238785-a3d9f435603a?auto=format&fit=crop&w=600&q=80', subCategories: ['Банные', 'Лицевые', 'Наборы', 'Коврики'] },
  { id: 7, name: 'Халаты', slug: 'robes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80', subCategories: ['Махровые', 'Вафельные', 'Детские', 'Кимоно'] },
  { id: 8, name: 'Текстиль для кухни', slug: 'kitchen', image: 'https://images.unsplash.com/photo-1740760188069-ad88835726c5?auto=format&fit=crop&w=600&q=80', subCategories: ['Скатерти', 'Салфетки', 'Полотенца кухонные', 'Прихватки'] },
  { id: 9, name: 'Детский текстиль', slug: 'children', image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=400&q=80', subCategories: ['Пижамы', 'Одеяла', 'Постельное', 'Полотенца'] },
  { id: 10, name: 'Тапочки', slug: 'slippers', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=400&q=80', subCategories: ['Закрытые', 'Открытые', 'Детские'] },
  { id: 11, name: 'Шторы и ткани', slug: 'curtains', image: 'https://images.unsplash.com/photo-1775662039200-44ec3a6c5061?auto=format&fit=crop&w=600&q=80', subCategories: ['Портьеры', 'Тюль', 'Ткани метражом', 'Пошив на заказ'] },
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
