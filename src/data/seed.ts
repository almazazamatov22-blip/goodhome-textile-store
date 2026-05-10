import { saveProducts, getProducts, saveOrders, saveUsers, type Product, type Order, type User } from './products';
import { CATEGORY_FILTERS } from './filters';

const TITLES: Record<string, string[]> = {
  bedding: ['Комплект постельного белья', 'Постельное белье', 'Набор белья'],
  pillows: ['Подушка анатомическая', 'Подушка', 'Ортопедическая подушка', 'Подушка с памятью'],
  blankets: ['Одеяло всесезонное', 'Одеяло теплое', 'Легкое одеяло', 'Одеяло бамбук'],
  sheets: ['Простынь на резинке', 'Простынь классическая', 'Наматрасник водонепроницаемый'],
  bedspreads: ['Покрывало жаккард', 'Плед флисовый', 'Покрывало стеганое'],
  towels: ['Полотенце махровое', 'Набор полотенец', 'Полотенце банное'],
  robes: ['Халат махровый', 'Халат вафельный', 'Кимоно домашнее'],
  kitchen: ['Скатерть льняная', 'Набор кухонных полотенец', 'Салфетки сервировочные'],
  children: ['Постельное детское', 'Пижама детская', 'Одеяло в кроватку'],
  slippers: ['Тапочки домашние', 'Тапочки отельные', 'Мягкие тапочки'],
  curtains: ['Комплект штор блэкаут', 'Тюль в гостиную', 'Ткань портьерная', 'Лен для штор'],
};

const IMAGES = [
  'https://images.unsplash.com/photo-1606855637183-ea2a00b6f15f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1775662039200-44ec3a6c5061?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1740760188069-ad88835726c5?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1653762238785-a3d9f435603a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1625471592808-3b848a6e9ffd?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1595191830227-a008b640e215?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1612152505858-6c8f94d935f0?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1584100936595-c0654b355040?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=600&q=80'
];

function getRandomItem<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function getRandomSubset<T>(arr: T[], max: number): T[] {
  const count = Math.floor(Math.random() * max) + 1;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
function getRandomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

export function runSeed() {
  const existing = getProducts();
  if (existing.length > 50) return; // Already seeded

  console.log("Seeding mock data...");

  const generatedProducts: Product[] = [];
  let idCounter = 1;

  const categoryNames: Record<string, string> = {
    bedding: 'Постельное белье',
    pillows: 'Подушки',
    blankets: 'Одеяла',
    sheets: 'Простыни',
    bedspreads: 'Покрывала',
    towels: 'Полотенца',
    robes: 'Халаты',
    kitchen: 'Текстиль для кухни',
    children: 'Детский текстиль',
    slippers: 'Тапочки',
    curtains: 'Шторы и ткани',
  };

  const ITEMS_PER_CATEGORY = 50;

  for (const [slug, filters] of Object.entries(CATEGORY_FILTERS)) {
    const catName = categoryNames[slug];
    
    for (let i = 0; i < ITEMS_PER_CATEGORY; i++) {
      const attributes: Record<string, string | string[]> = {};
      
      // Randomly assign values for each filter definition
      filters.forEach(filter => {
        if (!filter.options) return;
        if (filter.type === 'multicheck') {
          attributes[filter.key] = getRandomSubset(filter.options.map(o => o.value), 2);
        } else {
          attributes[filter.key] = getRandomItem(filter.options.map(o => o.value));
        }
      });

      const titleBase = getRandomItem(TITLES[slug] || ['Товар']);
      const price = getRandomInt(5, 50) * 1000 + getRandomInt(0, 9) * 100;
      const oldPrice = Math.random() > 0.7 ? price + getRandomInt(1000, 5000) : undefined;
      const isSale = !!oldPrice;
      const isNew = Math.random() > 0.8;
      const isHit = Math.random() > 0.8;
      const badge = isSale ? 'sale' : isHit ? 'hit' : isNew ? 'new' : undefined;

      generatedProducts.push({
        id: idCounter++,
        title: `${titleBase} GoodHome ${idCounter}`,
        category: catName,
        subCategory: 'Разное', // Simplified
        price,
        oldPrice,
        image: getRandomItem(IMAGES),
        images: [getRandomItem(IMAGES), getRandomItem(IMAGES)],
        description: `Высококачественный ${catName.toLowerCase()} от GoodHome. Идеально для вашего дома.`,
        rating: getRandomInt(40, 50) / 10,
        reviews: getRandomInt(0, 300),
        stock: getRandomInt(0, 100),
        badge,
        installment: Math.floor(price / 12),
        attributes
      });
    }
  }

  saveProducts(generatedProducts);

  // Seed some Orders
  const MOCK_ORDERS: Order[] = [
    { id: 'ORD-001', userId: 'u1', userName: 'Айгерим Касымова', items: [{ title: 'Постельное белье Страйп-Сатин', qty: 1, price: 29900 }], total: 29900, status: 'delivered', date: '2026-05-08', address: 'Алматы, ул. Абая 12' },
    { id: 'ORD-002', userId: 'u2', userName: 'Нурлан Бекова', items: [{ title: 'Подушка Memory Foam', qty: 2, price: 15000 }], total: 30000, status: 'shipping', date: '2026-05-09', address: 'Астана, пр. Республики 45' },
    { id: 'ORD-003', userId: 'u3', userName: 'Дина Сейткали', items: [{ title: 'Одеяло Бамбук', qty: 1, price: 22000 }, { title: 'Полотенце 50x100', qty: 3, price: 3500 }], total: 32500, status: 'pending', date: '2026-05-10', address: 'Шымкент, ул. Желтоқсан 7' },
    { id: 'ORD-004', userId: 'u1', userName: 'Айгерим Касымова', items: [{ title: 'Халат махровый', qty: 1, price: 18000 }], total: 18000, status: 'confirmed', date: '2026-05-10', address: 'Алматы, ул. Абая 12' },
    { id: 'ORD-005', userId: 'u4', userName: 'Ерлан Жаксыбеков', items: [{ title: 'Набор полотенец SPA', qty: 1, price: 12000 }], total: 12000, status: 'cancelled', date: '2026-05-07', address: 'Павлодар, ул. Ленина 3' },
    { id: 'ORD-006', userId: 'u5', userName: 'Сания Омарова', items: [{ title: 'Покрывало Жаккард', qty: 1, price: 25000 }], total: 25000, status: 'shipping', date: '2026-05-09', address: 'Алматы, ул. Достык 180' },
  ];
  saveOrders(MOCK_ORDERS);

  const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Айгерим Касымова', email: 'aigеrim@mail.kz', phone: '+7 707 123-45-67', registeredAt: '2026-03-15', cartItems: 2, totalOrders: 8, totalSpent: 187000 },
    { id: 'u2', name: 'Нурлан Бекова', email: 'nurlan@gmail.com', phone: '+7 778 234-56-78', registeredAt: '2026-04-02', cartItems: 0, totalOrders: 3, totalSpent: 75000 },
    { id: 'u3', name: 'Дина Сейткали', email: 'dina@yandex.kz', phone: '+7 701 345-67-89', registeredAt: '2026-04-20', cartItems: 5, totalOrders: 1, totalSpent: 32500 },
    { id: 'u4', name: 'Ерлан Жаксыбеков', email: 'erlan@mail.ru', phone: '+7 747 456-78-90', registeredAt: '2026-02-10', cartItems: 1, totalOrders: 5, totalSpent: 95000 },
    { id: 'u5', name: 'Сания Омарова', email: 'sania@gmail.com', phone: '+7 705 567-89-01', registeredAt: '2026-05-01', cartItems: 3, totalOrders: 2, totalSpent: 57000 },
  ];
  saveUsers(MOCK_USERS);

  console.log(`Seeded ${generatedProducts.length} products!`);
}
