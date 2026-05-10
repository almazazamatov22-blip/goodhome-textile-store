// ============================================================
// FILTER DEFINITIONS — per category slug
// ============================================================
export interface FilterOption { value: string; label: string; }
export interface FilterDef {
  key: string;
  label: string;
  type: 'multicheck' | 'range' | 'chips';
  options?: FilterOption[];
}

export const CATEGORY_FILTERS: Record<string, FilterDef[]> = {
  pillows: [
    { key: 'productType', label: 'Тип товара', type: 'multicheck', options: [{ value: 'pillow', label: 'Подушка' }, { value: 'set', label: 'Комплект' }] },
    { key: 'pillowType', label: 'Тип подушки', type: 'multicheck', options: [{ value: 'anatomical', label: 'Анатомическая' }, { value: 'decorative', label: 'Декоративная' }, { value: 'children', label: 'Детская' }, { value: 'orthopedic', label: 'Ортопедическая' }] },
    { key: 'size', label: 'Размер', type: 'chips', options: [{ value: '40x40', label: '40x40' }, { value: '50x70', label: '50x70' }, { value: '70x70', label: '70x70' }, { value: '35x125', label: '35x125' }] },
    { key: 'sleepPosition', label: 'Положение во сне', type: 'multicheck', options: [{ value: 'side', label: 'На боку' }, { value: 'back', label: 'На спине' }, { value: 'stomach', label: 'На животе' }] },
    { key: 'filling', label: 'Наполнитель', type: 'multicheck', options: [{ value: 'memory', label: 'Пена с памятью' }, { value: 'hollowfiber', label: 'Холлофайбер' }, { value: 'latex', label: 'Латекс' }, { value: 'down', label: 'Лебяжий пух' }, { value: 'bamboo', label: 'Бамбуковое волокно' }] },
    { key: 'features', label: 'Особенности', type: 'multicheck', options: [{ value: 'cooling', label: 'Охлаждающий эффект' }, { value: 'hypoallergenic', label: 'Гипоаллергенная' }, { value: 'antibacterial', label: 'Антибактериальная' }] },
    { key: 'firmness', label: 'Жёсткость', type: 'chips', options: [{ value: 'soft', label: 'Мягкая' }, { value: 'medium', label: 'Средняя' }, { value: 'firm', label: 'Жёсткая' }] },
    { key: 'height', label: 'Высота (см)', type: 'chips', options: [{ value: '8-10', label: '8–10 см' }, { value: '10-12', label: '10–12 см' }, { value: '12-14', label: '12–14 см' }, { value: '14-16', label: '14–16 см' }] },
    { key: 'cover', label: 'Материал чехла', type: 'multicheck', options: [{ value: 'cotton', label: 'Хлопок' }, { value: 'satin', label: 'Сатин' }, { value: 'bamboo', label: 'Бамбук' }, { value: 'tencel', label: 'Тенсель' }] },
    { key: 'shape', label: 'Форма', type: 'multicheck', options: [{ value: 'rectangular', label: 'Прямоугольная' }, { value: 'anatomical', label: 'Анатомическая' }, { value: 'square', label: 'Квадратная' }] },
    { key: 'color', label: 'Цвет', type: 'chips', options: [{ value: 'white', label: 'Белый' }, { value: 'beige', label: 'Бежевый' }, { value: 'gray', label: 'Серый' }] },
    { key: 'brand', label: 'Бренд', type: 'multicheck', options: [{ value: 'goodhome', label: 'Good Home' }, { value: 'premium', label: 'Premium Line' }, { value: 'eco', label: 'Eco Sleep' }] },
  ],
  bedding: [
    { key: 'setType', label: 'Комплект', type: 'chips', options: [{ value: '1.5', label: '1,5-спальный' }, { value: '2', label: '2-спальный' }, { value: 'euro', label: 'Евро' }, { value: 'family', label: 'Семейный' }] },
    { key: 'material', label: 'Материал', type: 'multicheck', options: [{ value: 'satin', label: 'Сатин' }, { value: 'stripe', label: 'Страйп-Сатин' }, { value: 'poplin', label: 'Поплин' }, { value: 'calico', label: 'Бязь' }, { value: 'ranforce', label: 'Ранфорс' }, { value: 'flannel', label: 'Фланель' }] },
    { key: 'composition', label: 'Состав', type: 'multicheck', options: [{ value: 'cotton100', label: '100% хлопок' }, { value: 'bamboo', label: 'Бамбук' }, { value: 'linen', label: 'Лён' }, { value: 'microfiber', label: 'Микрофибра' }] },
    { key: 'color', label: 'Цвет', type: 'chips', options: [{ value: 'white', label: 'Белый' }, { value: 'beige', label: 'Бежевый' }, { value: 'gray', label: 'Серый' }, { value: 'blue', label: 'Голубой' }, { value: 'green', label: 'Зелёный' }, { value: 'graphite', label: 'Графит' }, { value: 'pink', label: 'Розовый' }, { value: 'yellow', label: 'Жёлтый' }] },
    { key: 'pillowcaseCount', label: 'Кол-во наволочек', type: 'chips', options: [{ value: '1', label: '1 шт' }, { value: '2', label: '2 шт' }] },
    { key: 'brand', label: 'Бренд', type: 'multicheck', options: [{ value: 'goodhome', label: 'Good Home' }, { value: 'premium', label: 'Premium Line' }, { value: 'turkiye', label: 'Турция' }] },
    { key: 'collection', label: 'Коллекция', type: 'multicheck', options: [{ value: 'classic', label: 'Classic' }, { value: 'luxury', label: 'Luxury' }, { value: 'kids', label: 'Kids' }] },
  ],
  blankets: [
    { key: 'size', label: 'Размер', type: 'chips', options: [{ value: '140x205', label: '140x205 (1,5 сп)' }, { value: '172x205', label: '172x205 (2 сп)' }, { value: '200x220', label: '200x220 (Евро)' }] },
    { key: 'filling', label: 'Наполнитель', type: 'multicheck', options: [{ value: 'bamboo', label: 'Бамбуковое волокно' }, { value: 'hollowfiber', label: 'Холлофайбер' }, { value: 'wool', label: 'Шерсть' }, { value: 'cotton', label: 'Хлопок' }, { value: 'down', label: 'Пух и перо' }, { value: 'silk', label: 'Шёлк' }] },
    { key: 'season', label: 'Сезон', type: 'chips', options: [{ value: 'summer', label: 'Летнее' }, { value: 'all', label: 'Всесезонное' }, { value: 'winter', label: 'Зимнее' }] },
    { key: 'warmth', label: 'Теплота', type: 'chips', options: [{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }] },
    { key: 'cover', label: 'Материал чехла', type: 'multicheck', options: [{ value: 'cotton', label: 'Хлопок' }, { value: 'satin', label: 'Сатин' }, { value: 'microfiber', label: 'Микрофибра' }] },
    { key: 'features', label: 'Особенности', type: 'multicheck', options: [{ value: 'hypoallergenic', label: 'Гипоаллергенное' }, { value: 'antibacterial', label: 'Антибактериальное' }, { value: 'washable', label: 'Машинная стирка' }] },
    { key: 'brand', label: 'Бренд', type: 'multicheck', options: [{ value: 'goodhome', label: 'Good Home' }, { value: 'premium', label: 'Premium Line' }] },
  ],
  sheets: [
    { key: 'sheetType', label: 'Тип', type: 'chips', options: [{ value: 'fitted', label: 'На резинке' }, { value: 'flat', label: 'Классическая' }, { value: 'mattress', label: 'Наматрасник' }] },
    { key: 'size', label: 'Размер кровати', type: 'chips', options: [{ value: '90x200', label: '90x200' }, { value: '120x200', label: '120x200' }, { value: '140x200', label: '140x200' }, { value: '160x200', label: '160x200' }, { value: '180x200', label: '180x200' }, { value: '200x200', label: '200x200' }] },
    { key: 'material', label: 'Материал', type: 'multicheck', options: [{ value: 'cotton', label: 'Хлопок' }, { value: 'jersey', label: 'Трикотаж' }, { value: 'satin', label: 'Сатин' }, { value: 'microfiber', label: 'Микрофибра' }] },
    { key: 'color', label: 'Цвет', type: 'chips', options: [{ value: 'white', label: 'Белый' }, { value: 'beige', label: 'Бежевый' }, { value: 'gray', label: 'Серый' }, { value: 'blue', label: 'Голубой' }] },
    { key: 'elasticHeight', label: 'Высота резинки', type: 'chips', options: [{ value: '20', label: 'до 20 см' }, { value: '25', label: 'до 25 см' }, { value: '30', label: 'до 30 см' }] },
    { key: 'brand', label: 'Бренд', type: 'multicheck', options: [{ value: 'goodhome', label: 'Good Home' }, { value: 'premium', label: 'Premium Line' }] },
  ],
  bedspreads: [
    { key: 'size', label: 'Размер', type: 'chips', options: [{ value: '150x220', label: '150x220 (1,5 сп)' }, { value: '200x220', label: '200x220 (2 сп)' }, { value: '240x260', label: '240x260 (Евро)' }] },
    { key: 'material', label: 'Материал', type: 'multicheck', options: [{ value: 'jacquard', label: 'Жаккард' }, { value: 'velvet', label: 'Велюр' }, { value: 'cotton', label: 'Хлопок' }, { value: 'fleece', label: 'Флис' }, { value: 'plaid', label: 'Плед' }] },
    { key: 'color', label: 'Цвет', type: 'chips', options: [{ value: 'beige', label: 'Бежевый' }, { value: 'gray', label: 'Серый' }, { value: 'blue', label: 'Синий' }, { value: 'green', label: 'Зелёный' }, { value: 'brown', label: 'Коричневый' }, { value: 'gold', label: 'Золотой' }] },
    { key: 'features', label: 'Особенности', type: 'multicheck', options: [{ value: 'twoside', label: 'Двусторонее' }, { value: 'withpillow', label: 'С подушками' }, { value: 'washable', label: 'Машинная стирка' }] },
    { key: 'brand', label: 'Бренд', type: 'multicheck', options: [{ value: 'goodhome', label: 'Good Home' }, { value: 'premium', label: 'Premium Line' }] },
  ],
  towels: [
    { key: 'towelType', label: 'Тип', type: 'chips', options: [{ value: 'bath', label: 'Банное' }, { value: 'face', label: 'Лицевое' }, { value: 'hands', label: 'Для рук' }, { value: 'set', label: 'Набор' }] },
    { key: 'size', label: 'Размер', type: 'chips', options: [{ value: '30x50', label: '30x50' }, { value: '50x90', label: '50x90' }, { value: '50x100', label: '50x100' }, { value: '70x140', label: '70x140' }, { value: '100x150', label: '100x150' }] },
    { key: 'material', label: 'Материал', type: 'multicheck', options: [{ value: 'terry', label: 'Махровое' }, { value: 'bamboo', label: 'Бамбук' }, { value: 'waffle', label: 'Вафельное' }, { value: 'microfiber', label: 'Микрофибра' }] },
    { key: 'density', label: 'Плотность (г/м²)', type: 'chips', options: [{ value: '350', label: '350' }, { value: '450', label: '450' }, { value: '500', label: '500' }, { value: '600', label: '600' }, { value: '700', label: '700+' }] },
    { key: 'color', label: 'Цвет', type: 'chips', options: [{ value: 'white', label: 'Белый' }, { value: 'beige', label: 'Бежевый' }, { value: 'gray', label: 'Серый' }, { value: 'blue', label: 'Синий' }, { value: 'pink', label: 'Розовый' }, { value: 'green', label: 'Зелёный' }] },
    { key: 'features', label: 'Особенности', type: 'multicheck', options: [{ value: 'antibacterial', label: 'Антибактериальное' }, { value: 'quickdry', label: 'Быстросохнущее' }, { value: 'hypoallergenic', label: 'Гипоаллергенное' }] },
    { key: 'brand', label: 'Бренд', type: 'multicheck', options: [{ value: 'goodhome', label: 'Good Home' }, { value: 'premium', label: 'Premium Line' }] },
  ],
  robes: [
    { key: 'robeType', label: 'Тип', type: 'chips', options: [{ value: 'terry', label: 'Махровый' }, { value: 'waffle', label: 'Вафельный' }, { value: 'kimono', label: 'Кимоно' }, { value: 'children', label: 'Детский' }] },
    { key: 'size', label: 'Размер', type: 'chips', options: [{ value: 'XS', label: 'XS' }, { value: 'S', label: 'S' }, { value: 'M', label: 'M' }, { value: 'L', label: 'L' }, { value: 'XL', label: 'XL' }, { value: 'XXL', label: 'XXL' }] },
    { key: 'material', label: 'Материал', type: 'multicheck', options: [{ value: 'cotton', label: 'Хлопок' }, { value: 'bamboo', label: 'Бамбук' }, { value: 'microfiber', label: 'Микрофибра' }] },
    { key: 'gender', label: 'Пол', type: 'chips', options: [{ value: 'unisex', label: 'Унисекс' }, { value: 'women', label: 'Женский' }, { value: 'men', label: 'Мужской' }, { value: 'children', label: 'Детский' }] },
    { key: 'color', label: 'Цвет', type: 'chips', options: [{ value: 'white', label: 'Белый' }, { value: 'beige', label: 'Бежевый' }, { value: 'gray', label: 'Серый' }, { value: 'blue', label: 'Синий' }] },
    { key: 'brand', label: 'Бренд', type: 'multicheck', options: [{ value: 'goodhome', label: 'Good Home' }, { value: 'premium', label: 'Premium Line' }] },
  ],
  kitchen: [
    { key: 'kitchenType', label: 'Тип', type: 'chips', options: [{ value: 'tablecloth', label: 'Скатерть' }, { value: 'napkin', label: 'Салфетка' }, { value: 'towel', label: 'Полотенце' }, { value: 'apron', label: 'Фартук' }, { value: 'mitt', label: 'Прихватка' }] },
    { key: 'size', label: 'Размер', type: 'chips', options: [{ value: '100x140', label: '100x140' }, { value: '140x180', label: '140x180' }, { value: '140x220', label: '140x220' }, { value: '160x220', label: '160x220' }] },
    { key: 'material', label: 'Материал', type: 'multicheck', options: [{ value: 'linen', label: 'Лён' }, { value: 'cotton', label: 'Хлопок' }, { value: 'polyester', label: 'Полиэстер' }] },
    { key: 'color', label: 'Цвет', type: 'chips', options: [{ value: 'white', label: 'Белый' }, { value: 'beige', label: 'Бежевый' }, { value: 'gray', label: 'Серый' }, { value: 'green', label: 'Зелёный' }, { value: 'red', label: 'Красный' }] },
    { key: 'features', label: 'Особенности', type: 'multicheck', options: [{ value: 'waterproof', label: 'Водоотталкивающая' }, { value: 'washable', label: 'Машинная стирка' }, { value: 'wrinkle', label: 'Не мнётся' }] },
    { key: 'brand', label: 'Бренд', type: 'multicheck', options: [{ value: 'goodhome', label: 'Good Home' }] },
  ],
  children: [
    { key: 'childType', label: 'Тип', type: 'chips', options: [{ value: 'bedding', label: 'Постельное' }, { value: 'blanket', label: 'Одеяло' }, { value: 'pillow', label: 'Подушка' }, { value: 'pajamas', label: 'Пижама' }, { value: 'towel', label: 'Полотенце' }] },
    { key: 'ageGroup', label: 'Возраст', type: 'chips', options: [{ value: '0-1', label: '0–1 год' }, { value: '1-3', label: '1–3 года' }, { value: '3-7', label: '3–7 лет' }, { value: '7+', label: '7+ лет' }] },
    { key: 'material', label: 'Материал', type: 'multicheck', options: [{ value: 'cotton', label: 'Хлопок' }, { value: 'flannel', label: 'Фланель' }, { value: 'bamboo', label: 'Бамбук' }, { value: 'microfiber', label: 'Микрофибра' }] },
    { key: 'size', label: 'Размер кроватки', type: 'chips', options: [{ value: '60x120', label: '60x120' }, { value: '70x140', label: '70x140' }, { value: '80x160', label: '80x160' }] },
    { key: 'features', label: 'Особенности', type: 'multicheck', options: [{ value: 'hypoallergenic', label: 'Гипоаллергенное' }, { value: 'antibacterial', label: 'Антибактериальное' }, { value: 'organic', label: 'Органический хлопок' }] },
    { key: 'brand', label: 'Бренд', type: 'multicheck', options: [{ value: 'goodhome', label: 'Good Home Kids' }] },
  ],
  slippers: [
    { key: 'slipperType', label: 'Тип', type: 'chips', options: [{ value: 'closed', label: 'Закрытые' }, { value: 'open', label: 'Открытые' }, { value: 'hotel', label: 'Одноразовые' }] },
    { key: 'size', label: 'Размер', type: 'chips', options: [{ value: '36-37', label: '36–37' }, { value: '38-39', label: '38–39' }, { value: '40-41', label: '40–41' }, { value: '42-43', label: '42–43' }, { value: '44-45', label: '44–45' }] },
    { key: 'material', label: 'Материал', type: 'multicheck', options: [{ value: 'terry', label: 'Махровые' }, { value: 'microfiber', label: 'Микрофибра' }, { value: 'memory', label: 'Memory Foam' }] },
    { key: 'gender', label: 'Пол', type: 'chips', options: [{ value: 'unisex', label: 'Унисекс' }, { value: 'women', label: 'Женские' }, { value: 'men', label: 'Мужские' }] },
    { key: 'color', label: 'Цвет', type: 'chips', options: [{ value: 'white', label: 'Белый' }, { value: 'beige', label: 'Бежевый' }, { value: 'gray', label: 'Серый' }] },
    { key: 'brand', label: 'Бренд', type: 'multicheck', options: [{ value: 'goodhome', label: 'Good Home' }] },
  ],
  curtains: [
    { key: 'curtainType', label: 'Тип', type: 'chips', options: [{ value: 'blackout', label: 'Блэкаут' }, { value: 'tulle', label: 'Тюль' }, { value: 'fabric', label: 'Ткань метражом' }, { value: 'ready', label: 'Готовые шторы' }] },
    { key: 'room', label: 'Комната', type: 'multicheck', options: [{ value: 'bedroom', label: 'Спальня' }, { value: 'living', label: 'Гостиная' }, { value: 'kids', label: 'Детская' }, { value: 'kitchen', label: 'Кухня' }] },
    { key: 'material', label: 'Материал', type: 'multicheck', options: [{ value: 'linen', label: 'Лен' }, { value: 'velvet', label: 'Велюр' }, { value: 'cotton', label: 'Хлопок' }, { value: 'polyester', label: 'Полиэстер' }] },
    { key: 'light', label: 'Светопроницаемость', type: 'chips', options: [{ value: '20', label: 'до 20%' }, { value: '50', label: 'до 50%' }, { value: '80', label: 'до 80%' }] },
    { key: 'color', label: 'Цвет', type: 'chips', options: [{ value: 'white', label: 'Белый' }, { value: 'beige', label: 'Бежевый' }, { value: 'gray', label: 'Серый' }, { value: 'green', label: 'Зеленый' }, { value: 'blue', label: 'Синий' }] },
    { key: 'service', label: 'Услуга', type: 'multicheck', options: [{ value: 'measurement', label: 'Замер' }, { value: 'tailoring', label: 'Пошив' }, { value: 'installation', label: 'Монтаж' }] },
  ],
};
