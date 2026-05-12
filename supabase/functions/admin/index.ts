const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-key',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
};

const tables: Record<string, string> = {
  products: 'products',
  categories: 'categories',
  orders: 'orders',
  users: 'profiles',
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const adminApiKey = Deno.env.get('ADMIN_API_KEY');
  if (!adminApiKey || req.headers.get('x-admin-key') !== adminApiKey) {
    return jsonResponse({ error: 'Invalid admin key' }, 401);
  }

  try {
    const url = new URL(req.url);
    const resource = url.searchParams.get('resource') || 'all';
    const id = url.searchParams.get('id');

    if (req.method === 'GET' && resource === 'all') {
      const [products, categories, orders, users] = await Promise.all([
        supabaseRest('products', { query: 'select=*&order=id.asc' }),
        supabaseRest('categories', { query: 'select=*&order=id.asc' }),
        supabaseRest('orders', { query: 'select=*&order=date.desc' }),
        supabaseRest('profiles', { query: 'select=*&order=id.asc' }),
      ]);
      return jsonResponse({ products, categories, orders, users });
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
