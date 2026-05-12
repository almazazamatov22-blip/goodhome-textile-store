import { useState } from 'react';
import { ShoppingCart, Heart, Search, User } from 'lucide-react';
import { useCart } from '../cartStore';
import { useShopData } from '../data/shopDataStore';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { items } = useCart();
  const { categories } = useShopData();
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => { if (q.trim()) navigate(`/catalog?q=${encodeURIComponent(q)}`); };

  return (
    <header style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top promo bar */}
      <div style={{ background: '#1a1a2e', color: '#fff', textAlign: 'center', fontSize: '0.8rem', padding: '6px 0' }}>
        🚚 Бесплатная доставка по Казахстану при заказе от 20 000 ₸
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
        {/* Main header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '12px 0', flexWrap: 'wrap' }}>
          {/* Logo */}
          <a href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1 }}>
              <span style={{ color: '#1a1a2e' }}>GOOD</span>
              <span style={{ color: '#e53935' }}> HOME</span>
            </div>
            <div style={{ fontSize: '0.58rem', color: '#999', letterSpacing: 2, textTransform: 'uppercase' }}>Текстиль для дома</div>
          </a>

          {/* Search */}
          <div style={{ flex: '1 1 320px', position: 'relative' }}>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Поиск товаров..."
              style={{ width: '100%', padding: '9px 48px 9px 14px', border: '1.5px solid #e53935', borderRadius: 6, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
            />
            <button onClick={handleSearch} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: 46, background: '#e53935', border: 'none', borderRadius: '0 6px 6px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={18} color="#fff" />
            </button>
          </div>

          {/* Phone */}
          <div style={{ flexShrink: 0, textAlign: 'right' }}>
            <div style={{ fontSize: '0.62rem', color: '#999' }}>Звонок бесплатный</div>
            <a href="tel:+77023797233" style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', textDecoration: 'none' }}>+7 702 379 72 33</a>
          </div>

          {/* Icons */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexShrink: 0 }}>
            {/* Profile -> goes to /profile, NOT /admin */}
            <a href="/profile" style={{ color: '#1a1a2e', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.58rem', gap: 2, textDecoration: 'none' }}>
              <User size={22} />Профиль
            </a>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a2e', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.58rem', gap: 2 }}>
              <Heart size={22} />Избранное
            </button>
            <a href="/cart" style={{ position: 'relative', color: '#1a1a2e', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.58rem', gap: 2, textDecoration: 'none' }}>
              <ShoppingCart size={22} />Корзина
              {items.length > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -6, background: '#e53935', color: '#fff', borderRadius: '50%', width: 17, height: 17, fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {items.length}
                </span>
              )}
            </a>
          </div>
        </div>

        {/* Navigation - all categories */}
        <nav style={{ borderTop: '1px solid #f0f0f0', display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <a key={cat.id} href={`/catalog/${cat.slug}`}
              style={{ padding: '10px 14px', fontSize: '0.82rem', fontWeight: 500, color: '#333', textDecoration: 'none', borderBottom: '2px solid transparent', transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0 }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.color = '#e53935'; el.style.borderBottomColor = '#e53935'; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.color = '#333'; el.style.borderBottomColor = 'transparent'; }}
            >{cat.name}</a>
          ))}
        </nav>
      </div>
    </header>
  );
}
