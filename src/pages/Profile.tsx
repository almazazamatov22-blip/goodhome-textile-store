import { useState } from 'react';
import { User, Eye, EyeOff } from 'lucide-react';

export default function Profile() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

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

        {/* Toggle */}
        <div style={{ display: 'flex', background: '#f4f6fb', borderRadius: 8, marginBottom: 24, padding: 4 }}>
          {(['login', 'register'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ flex: 1, padding: '8px', border: 'none', borderRadius: 6, background: mode === m ? '#fff' : 'transparent', fontWeight: mode === m ? 700 : 400, color: mode === m ? '#e53935' : '#666', cursor: 'pointer', fontSize: '0.88rem', boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>
              {m === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: 5 }}>Имя и фамилия</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Айгерим Касымова"
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

          <button style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: 8, transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#c62828')}
            onMouseLeave={e => (e.currentTarget.style.background = '#e53935')}>
            {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>

          {mode === 'login' && (
            <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#999', marginTop: 4 }}>
              <a href="#" style={{ color: '#e53935', textDecoration: 'none' }}>Забыли пароль?</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
