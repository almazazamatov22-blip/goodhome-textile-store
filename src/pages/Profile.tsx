import { useState } from 'react';
import { Eye, EyeOff, User } from 'lucide-react';
import { getStoredAuthSession, signInCustomer, signOutCustomer, signUpCustomer } from '../lib/supabase';

export default function Profile() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPass, setShowPass] = useState(false);
  const [acceptedPersonalData, setAcceptedPersonalData] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [session, setSession] = useState(getStoredAuthSession());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setMessage(null);
    setError(null);

    if (!form.email.trim() || !form.password.trim()) {
      setError('Введите email и пароль');
      return;
    }

    if (mode === 'register') {
      if (!form.name.trim() || !form.phone.trim()) {
        setError('Введите имя, телефон, email и пароль');
        return;
      }
      if (!acceptedPersonalData) {
        setError('Подтвердите согласие на обработку персональных данных');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        const result = await signUpCustomer({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
        });
        setSession(getStoredAuthSession());
        setMessage(result.hasSession ? 'Аккаунт создан. Вы вошли в профиль.' : 'Аккаунт создан. Подтвердите email, если Supabase попросит подтверждение.');
      } else {
        const result = await signInCustomer({ email: form.email.trim(), password: form.password });
        setSession(result);
        setMessage('Вы вошли в аккаунт.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось выполнить действие');
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6fb', padding: '40px 20px' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '34px 32px', width: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.10)', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, background: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <User size={28} color="#2e7d32" />
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>Профиль создан</h1>
          <p style={{ color: '#666', fontSize: '0.92rem', marginBottom: 18 }}>{session.user?.email || form.email}</p>
          <button onClick={() => { signOutCustomer(); setSession(null); setMessage(null); }} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 22px', fontWeight: 800, cursor: 'pointer' }}>
            Выйти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6fb', padding: '40px 20px' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '40px 36px', width: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, background: '#fce4e4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <User size={28} color="#e53935" />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a1a2e' }}>
            {mode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
          </h1>
        </div>

        <div style={{ display: 'flex', background: '#f4f6fb', borderRadius: 8, marginBottom: 24, padding: 4 }}>
          {(['login', 'register'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(null); setMessage(null); }}
              style={{ flex: 1, padding: '8px', border: 'none', borderRadius: 6, background: mode === m ? '#fff' : 'transparent', fontWeight: mode === m ? 700 : 400, color: mode === m ? '#e53935' : '#666', cursor: 'pointer', fontSize: '0.88rem', boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>
              {m === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: 5 }}>Имя и фамилия</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Имя Фамилия"
                style={{ width: '100%', border: '1.5px solid #e5e5e5', borderRadius: 8, padding: '10px 14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: 5 }}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com"
              style={{ width: '100%', border: '1.5px solid #e5e5e5', borderRadius: 8, padding: '10px 14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: 5 }}>Телефон</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+7 700 000-00-00"
                style={{ width: '100%', border: '1.5px solid #e5e5e5', borderRadius: 8, padding: '10px 14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: 5 }}>Пароль</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••"
                style={{ width: '100%', border: '1.5px solid #e5e5e5', borderRadius: 8, padding: '10px 42px 10px 14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
              <button onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.78rem', lineHeight: 1.45, color: '#666', cursor: 'pointer' }}>
              <input type="checkbox" checked={acceptedPersonalData} onChange={e => setAcceptedPersonalData(e.target.checked)} style={{ marginTop: 2, accentColor: '#e53935' }} />
              <span>Согласен(на) на обработку персональных данных для регистрации, обработки заказа и связи с магазином.</span>
            </label>
          )}

          {error && <div style={{ background: '#fce4e4', color: '#c62828', borderRadius: 8, padding: '10px 12px', fontSize: '0.82rem', lineHeight: 1.45 }}>{error}</div>}
          {message && <div style={{ background: '#e8f5e9', color: '#2e7d32', borderRadius: 8, padding: '10px 12px', fontSize: '0.82rem', lineHeight: 1.45 }}>{message}</div>}

          <button onClick={() => void submit()} disabled={loading || (mode === 'register' && !acceptedPersonalData)}
            style={{ background: mode === 'register' && !acceptedPersonalData ? '#f0a3a1' : '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 700, fontSize: '1rem', cursor: loading || (mode === 'register' && !acceptedPersonalData) ? 'not-allowed' : 'pointer', marginTop: 8, transition: 'background 0.2s' }}>
            {loading ? 'Подождите...' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </div>
      </div>
    </div>
  );
}
