import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    title: 'Турецкий текстиль премиум качества',
    sub: 'Скидки до 30% на постельное белье',
    btn: 'Смотреть коллекцию',
    bg: 'linear-gradient(120deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
    img: 'https://images.unsplash.com/photo-1606855637183-ea2a00b6f15f?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Шторы и ткани для любого интерьера',
    sub: 'Готовые комплекты, тюль и ткани метражом с подбором под комнату.',
    btn: 'Открыть раздел',
    bg: 'linear-gradient(120deg, #1b5e20 0%, #2e7d32 60%, #43a047 100%)',
    img: 'https://images.unsplash.com/photo-1775662039200-44ec3a6c5061?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Банный текстиль. Мягкость каждый день.',
    sub: 'Полотенца, халаты, коврики — от 3 500 ₸',
    btn: 'В каталог',
    bg: 'linear-gradient(120deg, #4a148c 0%, #6a1b9a 60%, #8e24aa 100%)',
    img: 'https://images.unsplash.com/photo-1653762238785-a3d9f435603a?auto=format&fit=crop&w=1400&q=80',
  },
];

export default function HeroSlider() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setIdx(i => (i + 1) % SLIDES.length);
  const s = SLIDES[idx];

  return (
    <div style={{ position: 'relative', minHeight: 420, overflow: 'hidden', borderRadius: 16, background: s.bg, display: 'flex', alignItems: 'center' }}>
      {/* BG image */}
      <img src={s.img} alt="" style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '55%', objectFit: 'cover', opacity: 0.35 }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, padding: '56px clamp(24px, 5vw, 64px)', maxWidth: 560 }}>
        <div style={{ color: '#e53935', fontWeight: 700, fontSize: '0.9rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 2 }}>
          GOOD HOME — Текстиль для дома
        </div>
        <h1 style={{ color: '#fff', fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.2, marginBottom: 12 }}>{s.title}</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', marginBottom: 28 }}>{s.sub}</p>
        <button style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 32px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>{s.btn}</button>
      </div>

      {/* Arrows */}
      {[{ fn: prev, icon: <ChevronLeft />, side: '16px' }, { fn: next, icon: <ChevronRight />, side: undefined }].map((a, i) => (
        <button key={i} onClick={a.fn} style={{ position: 'absolute', [i === 0 ? 'left' : 'right']: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', zIndex: 3 }}>
          {a.icon}
        </button>
      ))}

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 3 }}>
        {SLIDES.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 24 : 8, height: 8, borderRadius: 4, background: i === idx ? '#e53935' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.3s' }} />
        ))}
      </div>
    </div>
  );
}
