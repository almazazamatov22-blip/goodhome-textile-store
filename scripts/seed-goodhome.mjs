import fs from 'node:fs';

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

const categories = [
  {
    id: 1,
    name: 'Постельное белье',
    slug: 'bedding',
    image: img('photo-1606855637183-ea2a00b6f15f'),
    subCategories: ['Сатин', 'Страйп-Сатин', 'Поплин', 'Бязь', 'Ранфорс', 'Фланель'],
    titles: ['Комплект постельного белья', 'Постельное белье сатин', 'Набор белья евро', 'Семейный комплект'],
    images: [img('photo-1606855637183-ea2a00b6f15f'), img('photo-1522771739844-6a9f6d5f14af'), img('photo-1540518614846-7eded433c457'), img('photo-1629949009765-40f74d96f285')],
    base: 24900,
    attrs: { setType: ['1.5', '2', 'euro', 'family'], material: ['satin', 'stripe', 'poplin', 'ranforce'], composition: ['cotton100', 'linen'], color: ['white', 'beige', 'gray', 'blue', 'green'], pillowcaseCount: ['2'], brand: ['goodhome'], collection: ['classic', 'luxury'] },
  },
  {
    id: 2,
    name: 'Подушки',
    slug: 'pillows',
    image: img('photo-1595191830227-a008b640e215'),
    subCategories: ['Анатомические', 'Декоративные', 'Детские', 'Ортопедические'],
    titles: ['Подушка анатомическая', 'Подушка Memory Foam', 'Подушка декоративная', 'Ортопедическая подушка'],
    images: [img('photo-1595191830227-a008b640e215'), img('photo-1584100936595-c0654b355040'), img('photo-1540518614846-7eded433c457'), img('photo-1522771739844-6a9f6d5f14af')],
    base: 8900,
    attrs: { productType: ['pillow'], pillowType: ['anatomical', 'decorative', 'orthopedic'], size: ['40x40', '50x70', '70x70'], sleepPosition: ['side', 'back'], filling: ['memory', 'hollowfiber', 'latex', 'bamboo'], features: ['hypoallergenic'], firmness: ['soft', 'medium', 'firm'], height: ['10-12', '12-14'], cover: ['cotton', 'satin'], shape: ['rectangular', 'anatomical'], color: ['white', 'beige', 'gray'], brand: ['goodhome'] },
  },
  {
    id: 3,
    name: 'Одеяла',
    slug: 'blankets',
    image: img('photo-1612152505858-6c8f94d935f0'),
    subCategories: ['Бамбук', 'Шерсть', 'Хлопок', 'Всесезонные', 'Летние'],
    titles: ['Одеяло всесезонное', 'Одеяло бамбуковое', 'Легкое летнее одеяло', 'Одеяло теплое'],
    images: [img('photo-1612152505858-6c8f94d935f0'), img('photo-1606855637183-ea2a00b6f15f'), img('photo-1522771739844-6a9f6d5f14af'), img('photo-1540518614846-7eded433c457')],
    base: 17900,
    attrs: { size: ['140x205', '172x205', '200x220'], filling: ['bamboo', 'hollowfiber', 'wool', 'cotton'], season: ['summer', 'all', 'winter'], warmth: ['1', '2', '3', '4'], cover: ['cotton', 'satin'], features: ['hypoallergenic', 'washable'], brand: ['goodhome'] },
  },
  {
    id: 4,
    name: 'Простыни',
    slug: 'sheets',
    image: img('photo-1629949009765-40f74d96f285'),
    subCategories: ['На резинке', 'Классические', 'Наматрасники'],
    titles: ['Простынь на резинке', 'Простынь классическая', 'Наматрасник защитный', 'Простынь сатиновая'],
    images: [img('photo-1629949009765-40f74d96f285'), img('photo-1522771739844-6a9f6d5f14af'), img('photo-1606855637183-ea2a00b6f15f'), img('photo-1540518614846-7eded433c457')],
    base: 7900,
    attrs: { sheetType: ['fitted', 'flat', 'mattress'], size: ['90x200', '120x200', '160x200', '180x200', '200x200'], material: ['cotton', 'jersey', 'satin'], color: ['white', 'beige', 'gray', 'blue'], elasticHeight: ['20', '25', '30'], brand: ['goodhome'] },
  },
  {
    id: 5,
    name: 'Покрывала',
    slug: 'bedspreads',
    image: img('photo-1580582932707-520aed937b7b'),
    subCategories: ['Жаккард', 'Хлопок', 'Пледы', 'Велюр'],
    titles: ['Покрывало жаккард', 'Плед флисовый', 'Покрывало стеганое', 'Покрывало велюровое'],
    images: [img('photo-1580582932707-520aed937b7b'), img('photo-1606760227091-3dd870d97f1d'), img('photo-1612152505858-6c8f94d935f0'), img('photo-1522771739844-6a9f6d5f14af')],
    base: 15900,
    attrs: { size: ['150x220', '200x220', '240x260'], material: ['jacquard', 'velvet', 'cotton', 'fleece'], color: ['beige', 'gray', 'blue', 'green', 'brown'], features: ['twoside', 'washable'], brand: ['goodhome'] },
  },
  {
    id: 6,
    name: 'Полотенца',
    slug: 'towels',
    image: img('photo-1653762238785-a3d9f435603a'),
    subCategories: ['Банные', 'Лицевые', 'Наборы', 'Коврики'],
    titles: ['Полотенце махровое', 'Набор полотенец', 'Полотенце банное', 'Полотенце для рук'],
    images: [img('photo-1653762238785-a3d9f435603a'), img('photo-1616627561839-074385245fb6'), img('photo-1740760188069-ad88835726c5'), img('photo-1625471592808-3b848a6e9ffd')],
    base: 3900,
    attrs: { towelType: ['bath', 'face', 'hands', 'set'], size: ['30x50', '50x90', '50x100', '70x140', '100x150'], material: ['terry', 'bamboo', 'waffle'], density: ['350', '450', '500', '600'], color: ['white', 'beige', 'gray', 'blue', 'pink', 'green'], features: ['quickdry', 'hypoallergenic'], brand: ['goodhome'] },
  },
  {
    id: 7,
    name: 'Халаты',
    slug: 'robes',
    image: img('photo-1748007702716-0ba414a96ceb'),
    subCategories: ['Махровые', 'Вафельные', 'Детские', 'Кимоно'],
    titles: ['Халат махровый', 'Халат вафельный', 'Кимоно домашнее', 'Халат SPA'],
    images: [img('photo-1748007702716-0ba414a96ceb'), img('photo-1616627561839-074385245fb6'), img('photo-1653762238785-a3d9f435603a'), img('photo-1549298916-b41d501d3772')],
    base: 14900,
    attrs: { robeType: ['terry', 'waffle', 'kimono'], size: ['S', 'M', 'L', 'XL', 'XXL'], material: ['cotton', 'bamboo', 'microfiber'], gender: ['unisex', 'women', 'men'], color: ['white', 'beige', 'gray', 'blue'], brand: ['goodhome'] },
  },
  {
    id: 8,
    name: 'Текстиль для кухни',
    slug: 'kitchen',
    image: img('photo-1740760188069-ad88835726c5'),
    subCategories: ['Скатерти', 'Салфетки', 'Полотенца кухонные', 'Прихватки'],
    titles: ['Скатерть льняная', 'Набор кухонных полотенец', 'Салфетки сервировочные', 'Прихватки хлопковые'],
    images: [img('photo-1740760188069-ad88835726c5'), img('photo-1555041469-a586c61ea9bc'), img('photo-1503944583220-79d8926ad5e2'), img('photo-1625471592808-3b848a6e9ffd')],
    base: 4900,
    attrs: { kitchenType: ['tablecloth', 'napkin', 'towel', 'apron', 'mitt'], size: ['100x140', '140x180', '140x220', '160x220'], material: ['linen', 'cotton', 'polyester'], color: ['white', 'beige', 'gray', 'green', 'red'], features: ['washable', 'wrinkle'], brand: ['goodhome'] },
  },
  {
    id: 9,
    name: 'Детский текстиль',
    slug: 'children',
    image: img('photo-1586015555751-63bb77f4322a'),
    subCategories: ['Пижамы', 'Одеяла', 'Постельное', 'Полотенца'],
    titles: ['Постельное детское', 'Пижама детская', 'Одеяло в кроватку', 'Полотенце детское'],
    images: [img('photo-1586015555751-63bb77f4322a'), img('photo-1606855637183-ea2a00b6f15f'), img('photo-1653762238785-a3d9f435603a'), img('photo-1522771739844-6a9f6d5f14af')],
    base: 6900,
    attrs: { childType: ['bedding', 'blanket', 'pillow', 'pajamas', 'towel'], ageGroup: ['0-1', '1-3', '3-7', '7+'], material: ['cotton', 'flannel', 'bamboo'], size: ['60x120', '70x140', '80x160'], features: ['hypoallergenic', 'organic'], brand: ['goodhome'] },
  },
  {
    id: 10,
    name: 'Тапочки',
    slug: 'slippers',
    image: img('photo-1607082348824-0a96f2a4b9da'),
    subCategories: ['Закрытые', 'Открытые', 'Детские'],
    titles: ['Тапочки домашние', 'Тапочки отельные', 'Мягкие тапочки', 'Тапочки с Memory Foam'],
    images: [img('photo-1607082348824-0a96f2a4b9da'), img('photo-1549298916-b41d501d3772'), img('photo-1748007702716-0ba414a96ceb'), img('photo-1502005097973-6a7082348e28')],
    base: 3900,
    attrs: { slipperType: ['closed', 'open', 'hotel'], size: ['36-37', '38-39', '40-41', '42-43', '44-45'], material: ['terry', 'microfiber', 'memory'], gender: ['unisex', 'women', 'men'], color: ['white', 'beige', 'gray'], brand: ['goodhome'] },
  },
  {
    id: 11,
    name: 'Шторы и ткани',
    slug: 'curtains',
    image: img('photo-1775662039200-44ec3a6c5061'),
    subCategories: ['Портьеры', 'Тюль', 'Ткани метражом', 'Пошив на заказ'],
    titles: ['Комплект штор блэкаут', 'Тюль в гостиную', 'Ткань портьерная', 'Лен для штор'],
    images: [img('photo-1775662039200-44ec3a6c5061'), img('photo-1524758631624-e2822e304c36'), img('photo-1618220179428-22790b461013'), img('photo-1616486338812-3dadae4b4ace')],
    base: 11900,
    attrs: { curtainType: ['blackout', 'tulle', 'fabric', 'ready'], room: ['bedroom', 'living', 'kids', 'kitchen'], material: ['linen', 'velvet', 'cotton', 'polyester'], light: ['20', '50', '80'], color: ['white', 'beige', 'gray', 'green', 'blue'], service: ['measurement', 'tailoring', 'installation'] },
  },
];

function pick(values, index) {
  return values[index % values.length];
}

function attrsFor(category, index) {
  const result = {};
  for (const [key, values] of Object.entries(category.attrs)) {
    result[key] = Array.isArray(values) ? pick(values, index) : values;
  }
  return result;
}

function sql(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return String(value);
  return `'${String(value).replace(/'/g, "''")}'`;
}

function json(value) {
  return `${sql(JSON.stringify(value))}::jsonb`;
}

const productRows = [];

for (const category of categories) {
  for (let index = 0; index < 20; index += 1) {
    const id = category.id * 1000 + index + 1;
    const image = pick(category.images, index);
    const price = category.base + (index % 5) * 1200 + Math.floor(index / 5) * 2500;
    const oldPrice = index % 6 === 0 ? price + 4500 : null;
    const badge = index % 7 === 0 ? 'hit' : index % 5 === 0 ? 'sale' : index % 4 === 0 ? 'new' : null;
    const subCategory = pick(category.subCategories, index);
    const title = `${pick(category.titles, index)} ${subCategory} GH-${index + 1}`;
    const images = [image, pick(category.images, index + 1), pick(category.images, index + 2)];
    const description = `${category.name}: ${subCategory.toLowerCase()} для дома в Астане. Реальная фотография, актуальные размеры и характеристики в карточке товара.`;

    productRows.push([
      id,
      title,
      category.name,
      subCategory,
      price,
      oldPrice,
      image,
      images,
      description,
      0,
      0,
      8 + (index * 3) % 50,
      badge,
      Math.floor(price / 12),
      attrsFor(category, index),
    ]);
  }
}

const statements = [
  'delete from public.orders;',
  'delete from public.product_reviews;',
  'delete from public.products;',
  'delete from public.profiles;',
  'delete from public.categories;',
  `insert into public.categories (id, name, slug, image, "subCategories") values\n${categories.map(category => `(${sql(category.id)}, ${sql(category.name)}, ${sql(category.slug)}, ${sql(category.image)}, ${json(category.subCategories)})`).join(',\n')};`,
  `insert into public.products (id, title, category, "subCategory", price, "oldPrice", image, images, description, rating, reviews, stock, badge, installment, attributes) values\n${productRows.map(row => `(${[
    sql(row[0]),
    sql(row[1]),
    sql(row[2]),
    sql(row[3]),
    sql(row[4]),
    sql(row[5]),
    sql(row[6]),
    json(row[7]),
    sql(row[8]),
    sql(row[9]),
    sql(row[10]),
    sql(row[11]),
    sql(row[12]),
    sql(row[13]),
    json(row[14]),
  ].join(', ')})`).join(',\n')};`,
];

const target = process.argv[2] || '.goodhome-seed.sql';
fs.writeFileSync(target, `${statements.join('\n\n')}\n`, 'utf8');
console.log(`Wrote ${target}: ${categories.length} categories, ${productRows.length} products`);
