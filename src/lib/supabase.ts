type SupabaseMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

interface AuthUser {
  id: string;
  email?: string;
}

interface AuthSession {
  access_token: string;
  refresh_token?: string;
  user: AuthUser;
}

interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  user?: AuthUser;
  session?: AuthSession | null;
  msg?: string;
}

export async function supabaseRest<T>(
  table: string,
  options: { method?: SupabaseMethod; query?: string; body?: unknown; prefer?: string } = {},
): Promise<T> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const method = options.method ?? 'GET';
  const query = options.query ? `?${options.query}` : '';
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}${query}`, {
    method,
    headers: {
      apikey: supabaseAnonKey!,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      Prefer: options.prefer ?? 'return=representation',
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase ${method} ${table} failed: ${response.status} ${detail}`);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : []) as T;
}

async function supabaseAuthRequest<T>(path: string, body: unknown) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/${path}`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.msg || data.message || `Supabase auth failed: ${response.status}`);
  }

  return data as T;
}

async function saveProfileWithToken(profile: { id: string; name: string; email: string; phone: string }, accessToken: string) {
  const response = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey!,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      registeredAt: new Date().toISOString().slice(0, 10),
      cartItems: 0,
      totalOrders: 0,
      totalSpent: 0,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Не удалось сохранить профиль: ${detail}`);
  }
}

export async function signUpCustomer(input: { name: string; email: string; phone: string; password: string }) {
  const data = await supabaseAuthRequest<AuthResponse>('signup', {
    email: input.email,
    password: input.password,
    data: {
      name: input.name,
      phone: input.phone,
    },
  });

  const session = data.session || (data.access_token && data.user ? { access_token: data.access_token, refresh_token: data.refresh_token, user: data.user } : null);
  if (session?.access_token && session.user?.id) {
    await saveProfileWithToken({
      id: session.user.id,
      name: input.name,
      email: input.email,
      phone: input.phone,
    }, session.access_token);
    localStorage.setItem('gh_auth_session', JSON.stringify(session));
  }

  return { user: data.user || session?.user, hasSession: Boolean(session?.access_token) };
}

export async function signInCustomer(input: { email: string; password: string }) {
  const data = await supabaseAuthRequest<AuthSession>('token?grant_type=password', {
    email: input.email,
    password: input.password,
  });
  localStorage.setItem('gh_auth_session', JSON.stringify(data));
  return data;
}

export function getStoredAuthSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem('gh_auth_session');
    return raw ? JSON.parse(raw) as AuthSession : null;
  } catch {
    return null;
  }
}

export function signOutCustomer() {
  localStorage.removeItem('gh_auth_session');
}
