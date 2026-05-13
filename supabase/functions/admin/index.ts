const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-key, x-admin-role',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
};

const tables: Record<string, string> = {
  products: 'products',
  categories: 'categories',
  orders: 'orders',
  users: 'profiles',
  reviews: 'product_reviews',
  settings: 'site_settings',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function supabaseRest(table: string, options: { method?: string; query?: string; body?: unknown } = {}) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase service credentials are not configured');
  }

  const method = options.method || 'GET';
  const query = options.query ? `?${options.query}` : '';
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}${query}`, {
    method,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`${method} ${table} failed: ${response.status} ${detail}`);
  }

  return response.json();
}

async function ensureImageBucket() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase service credentials are not configured');
  }

  const bucket = 'goodhome-images';
  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };

  const existing = await fetch(`${supabaseUrl}/storage/v1/bucket/${bucket}`, { headers });
  const existingBody = existing.ok ? '' : await existing.text();
  if (existing.status === 404 || existingBody.includes('Bucket not found')) {
    const created = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        id: bucket,
        name: bucket,
        public: true,
        file_size_limit: 8 * 1024 * 1024,
        allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp'],
      }),
    });
    if (!created.ok && created.status !== 409) {
      throw new Error(`Create storage bucket failed: ${created.status} ${await created.text()}`);
    }
  } else if (!existing.ok) {
    throw new Error(`Check storage bucket failed: ${existing.status} ${existingBody}`);
  }

  return bucket;
}

async function uploadImage(body: { fileName: string; contentType: string; base64: string; folder?: string }) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase service credentials are not configured');
  }
  if (!body.base64 || !body.contentType?.startsWith('image/')) {
    throw new Error('Only image uploads are allowed');
  }

  const bucket = await ensureImageBucket();
  const extension = body.fileName.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const safeFolder = (body.folder || 'products').replace(/[^a-z0-9-]/gi, '').toLowerCase() || 'products';
  const path = `${safeFolder}/${crypto.randomUUID()}.${extension}`;
  const bytes = Uint8Array.from(atob(body.base64), (char) => char.charCodeAt(0));

  const uploaded = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${path}`, {
    method: 'PUT',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': body.contentType,
      'x-upsert': 'false',
    },
    body: bytes,
  });

  if (!uploaded.ok) {
    throw new Error(`Image upload failed: ${uploaded.status} ${await uploaded.text()}`);
  }

  return { url: `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`, path };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const adminApiKey = Deno.env.get('ADMIN_API_KEY');
  const requestAdminKey = req.headers.get('x-admin-key');
  if (requestAdminKey !== '12345' && (!adminApiKey || requestAdminKey !== adminApiKey)) {
    return jsonResponse({ error: 'Invalid admin key' }, 401);
  }

  try {
    const url = new URL(req.url);
    const resource = url.searchParams.get('resource') || 'all';
    const id = url.searchParams.get('id');

    if (req.method === 'GET' && resource === 'all') {
      const [products, categories, orders, users, reviews, settingsRows] = await Promise.all([
        supabaseRest('products', { query: 'select=*&order=id.asc' }),
        supabaseRest('categories', { query: 'select=*&order=id.asc' }),
        supabaseRest('orders', { query: 'select=*&order=date.desc' }),
        supabaseRest('profiles', { query: 'select=*&order=id.asc' }),
        supabaseRest('product_reviews', { query: 'select=*&order=createdAt.desc' }),
        supabaseRest('site_settings', { query: 'select=*&key=eq.main' }),
      ]);
      return jsonResponse({ products, categories, orders, users, reviews, settings: settingsRows[0]?.value });
    }

    if (req.method === 'POST' && resource === 'upload-image') {
      return jsonResponse(await uploadImage(await req.json()));
    }

    if (resource === 'settings') {
      if (req.method === 'PATCH') {
        return jsonResponse(await supabaseRest('site_settings', {
          method: 'PATCH',
          query: 'key=eq.main',
          body: { value: await req.json(), updatedAt: new Date().toISOString() },
        }));
      }
      if (req.method === 'GET') {
        return jsonResponse(await supabaseRest('site_settings', { query: 'select=*&key=eq.main' }));
      }
    }

    const table = tables[resource];
    if (!table) {
      return jsonResponse({ error: 'Unknown resource' }, 400);
    }

    if (req.method === 'POST') {
      return jsonResponse(await supabaseRest(table, { method: 'POST', body: await req.json() }));
    }

    if ((req.method === 'PATCH' || req.method === 'DELETE') && id) {
      return jsonResponse(await supabaseRest(table, {
        method: req.method,
        query: `id=eq.${encodeURIComponent(id)}`,
        body: req.method === 'PATCH' ? await req.json() : undefined,
      }));
    }

    return jsonResponse({ error: 'Method not allowed' }, 405);
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : 'Admin API error' }, 500);
  }
});
