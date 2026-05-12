import { useState } from 'react';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import { Truck, Shield, RotateCcw, CreditCard } from 'lucide-react';
import { useShopData } from '../data/shopDataStore';

const BENEFITS = [
  { icon: <Truck size={28} color="#e53935" />, title: 'Бесплатная доставка', sub: 'При заказе от 20 000 ₸' },
  { icon: <Shield size={28} color="#e53935" />, title: 'Гарантия качества', sub: 'Сертифицированная продукция' },
  { icon: <RotateCcw size={28} color="#e53935" />, title: 'Обмен и возврат', sub: '14 дней по закону РК' },
  { icon: <CreditCard size={28} color="#e53935" />, title: 'Рассрочка 0%', sub: 'До 12 месяцев без переплат' },
];

export default function Home() {
  const { products: allProducts, categories, loading, error } = useShopData();
  const [tab, setTab] = useState<'hit' | 'new' | 'sale'>('hit');

  const tabProducts = allProducts.filter(p => p.badge === tab).slice(0, 8);
  const showProducts = tabProducts.length ? tabProducts : allProducts.slice(0, 8);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '30px 20px' }}>
      {/* Hero */}
      <HeroSlider />
      {error && (
        <div style={{ marginTop: 16, padding: '10px 14px', background: '#fff8e1', border: '1px solid #ffe0a3', borderRadius: 8, color: '#8a5a00', fontSize: '0.85rem' }}>
          Данные временно показаны из локального кеша: {error}
        </div>
      )}

      {/* Benefits */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, margin: '30px 0' }}>
        {BENEFITS.map(b => (
          <div key={b.title} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12, padding: '20px 16px', display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            {b.icon}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a2e' }}>{b.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#999', marginTop: 2 }}>{b.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a1a2e', marginBottom: 20 }}>Категории товаров</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 40 }}>
        {categories.map(cat => (
          <a key={cat.id} href={`/catalog/${cat.slug}`} style={{ textDecoration: 'none', textAlign: 'center' }}>
            <div style={{ borderRadius: 12, overflow: 'hidden', height: 110, marginBottom: 8, position: 'relative' }}>
              <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                onError={e => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://loremflickr.com/900/900/home,textile?lock=${cat.id + 80000}`;
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,46,0.35)' }} />
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a1a2e', lineHeight: 1.3 }}>{cat.name}</div>
          </a>
        ))}
      </div>

      {/* Tabs + Products */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24, borderBottom: '2px solid #f0f0f0' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a1a2e', marginRight: 32 }}>Товары</h2>
        {(['hit', 'new', 'sale'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 24px', border: 'none', background: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', color: tab === t ? '#e53935' : '#999', borderBottom: `2px solid ${tab === t ? '#e53935' : 'transparent'}`, marginBottom: -2, transition: 'all 0.2s' }}>
            {t === 'hit' ? 'Хиты продаж' : t === 'new' ? 'Новинки' : 'Акции'}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
        {loading && !showProducts.length && <div style={{ color: '#999' }}>Загружаем товары...</div>}
        {showProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {/* Banner strip */}
      <div style={{ background: 'linear-gradient(120deg, #1a1a2e, #e53935)', borderRadius: 16, padding: '40px clamp(22px, 4vw, 48px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 40 }}>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: 8 }}>Специальное предложение</div>
          <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>Рассрочка 0% на 12 месяцев</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>На весь ассортимент без переплат. Оформление за 5 минут.</p>
        </div>
        <button style={{ background: '#fff', color: '#e53935', border: 'none', borderRadius: 8, padding: '14px 32px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', flexShrink: 0 }}>Оформить рассрочку</button>
      </div>
    </div>
  );
}
