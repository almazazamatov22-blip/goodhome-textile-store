const SUPABASE_REF = 'kbkjmtvumoxjtmmspiqk';
const SUPABASE_URL = `https://${SUPABASE_REF}.supabase.co`;
const ADMIN_ENDPOINT = `${SUPABASE_URL}/functions/v1/admin`;
let cachedAnonKey;

const IMAGE_KEYWORDS_BY_SLUG = {
  bedding: ['bedding,bedroom', 'bed,sheets', 'duvet,cover', 'white,bedding'],
  pillows: ['pillow,bedroom', 'cushion,sofa', 'pillow,home', 'decorative,pillow'],
  blankets: ['blanket,bed', 'quilt,bed', 'comforter,bed', 'wool,blanket'],
  sheets: ['bed,sheets', 'linen,bed', 'fitted,sheet', 'white,sheets'],
  bedspreads: ['bedspread,quilt', 'throw,blanket', 'quilt,bed', 'plaid,bed'],
  towels: ['towels,bathroom', 'bath,towel', 'terry,towel', 'towel,spa'],
  robes: ['bathrobe,spa', 'robe,hotel', 'bathrobe,home', 'spa,robe'],
  kitchen: ['kitchen,towels', 'tablecloth,dining', 'napkin,table', 'kitchen,textile'],
  children: ['children,bedding', 'baby,blanket', 'kids,room', 'nursery,bedding'],
  slippers: ['slippers,home', 'hotel,slippers', 'soft,slippers', 'house,slippers'],
  curtains: ['curtains,interior', 'window,curtains', 'fabric,curtains', 'linen,curtains'],
};

const CATEGORY_KEYWORD = {
  bedding: 'bedding,bedroom',
  pillows: 'pillow,bedroom',
  blankets: 'blanket,bed',
  sheets: 'bed,sheets',
  bedspreads: 'bedspread,quilt',
  towels: 'towels,bathroom',
  robes: 'bathrobe,spa',
  kitchen: 'kitchen,towels',
  children: 'children,bedding',
  slippers: 'slippers,home',
  curtains: 'curtains,interior',
};

function textilePhoto(keywords, lock, size = 900) {
  return `https://loremflickr.com/${size}/${size}/${keywords}?lock=${lock}`;
}

function pick(values, index) {
  return values[index % values.length];
}

function categoryPhoto(category) {
  return textilePhoto(CATEGORY_KEYWORD[category.slug] || 'home,textile', category.id * 1000 + 1);
}

function productKeywords(product, slug, variant) {
  const text = `${product.title} ${product.subCategory}`.toLowerCase();

  if (text.includes('скатерт')) return 'tablecloth,dining';
  if (text.includes('салфет')) return 'napkin,table';
  if (text.includes('прихват')) return 'oven,mitt';
  if (text.includes('тюль')) return 'tulle,curtains';
  if (text.includes('ткан')) return 'fabric,textile';
  if (text.includes('кимоно')) return 'kimono,robe';
  if (text.includes('коврик')) return 'bath,mat';
  if (text.includes('наматрас')) return 'mattress,protector';
  if (text.includes('пижам')) return 'kids,pajamas';
  if (text.includes('тапоч')) return 'slippers,home';

  return pick(IMAGE_KEYWORDS_BY_SLUG[slug] || ['home,textile'], product.id + variant);
}

function productImages(product, slug) {
  return [0, 1, 2].map((variant) => textilePhoto(
    productKeywords(product, slug, variant),
    product.id * 10 + variant,
  ));
}

async function fetchAnonKey() {
  if (cachedAnonKey) return cachedAnonKey;
  if (process.env.SUPABASE_ANON_KEY) return process.env.SUPABASE_ANON_KEY;

  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) {
    throw new Error('Set SUPABASE_ACCESS_TOKEN or SUPABASE_ANON_KEY');
  }

  const response = await fetch(`https://api.supabase.com/v1/projects/${SUPABASE_REF}/api-keys?reveal=true`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Supabase API keys request failed: ${response.status} ${await response.text()}`);
  }

  const keys = await response.json();
  const anon = keys.find((key) => key.name === 'anon' || key.name?.toLowerCase().includes('anon'));
  if (!anon?.api_key) {
    throw new Error('Anon key was not found in Supabase project keys');
  }

  cachedAnonKey = anon.api_key;
  return cachedAnonKey;
}

async function adminRequest(resource, options = {}) {
  const adminKey = process.env.GOODHOME_ADMIN_API_KEY;
  if (!adminKey) throw new Error('Set GOODHOME_ADMIN_API_KEY');

  const anonKey = await fetchAnonKey();
  const id = options.id ? `&id=${encodeURIComponent(options.id)}` : '';
  const response = await fetch(`${ADMIN_ENDPOINT}?resource=${encodeURIComponent(resource)}${id}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'x-admin-key': adminKey,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    throw new Error(`Admin request failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function main() {
  const data = await adminRequest('all');
  const categoryByName = new Map(data.categories.map((category) => [category.name, category]));

  for (const category of data.categories) {
    await adminRequest('categories', {
      method: 'PATCH',
      id: category.id,
      body: { ...category, image: categoryPhoto(category) },
    });
  }

  for (const product of data.products) {
    const category = categoryByName.get(product.category);
    const slug = category?.slug || 'bedding';
    const images = productImages(product, slug);

    await adminRequest('products', {
      method: 'PATCH',
      id: product.id,
      body: {
        ...product,
        image: images[0],
        images,
      },
    });
  }

  console.log(`Updated images: ${data.categories.length} categories, ${data.products.length} products`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
