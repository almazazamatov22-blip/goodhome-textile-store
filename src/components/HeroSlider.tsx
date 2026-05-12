import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    title: 'Постельное белье для спокойного сна',
    sub: 'Сатин, поплин и ранфорс с реальными фото и понятными размерами.',
    btn: 'Смотреть белье',
    bg: '#17202a',
    href: '/catalog/bedding',
    img: 'https://images.unsplash.com/photo-1606855637183-ea2a00b6f15f?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Шторы и ткани под ваш интерьер',
    sub: 'Готовые комплекты, тюль и ткани метражом с подбором под комнату.',
    btn: 'Открыть раздел',
    bg: '#243f37',
    href: '/catalog/curtains',
    img: 'https://images.unsplash.com/photo-1775662039200-44ec3a6c5061?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Полотенца и халаты для ванной',
    sub: 'Полотенца, халаты, коврики - от 3 500 ₸',
    btn: 'В каталог',
    bg: '#263447',
    href: '/catalog/towels',
    img: 'https://images.unsplash.com/photo-1653762238785-a3d9f435603a?auto=format&fit=crop&w=1400&q=80',
  },
];

export default function HeroSlider() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setIdx(i => (i + 1) % SLIDES.length);
  const s = SLIDES[idx];

  return (
    <div style={{ position: 'relative', minHeight: 400, overflow: 'hidden', borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center' }}>
      {/* BG image */}
      <img src={s.img} alt="" style={{ position: 'absolute', inset: 0, height: '100%', width: '100%', objectFit: 'cover', opacity: 0.62 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(18,24,32,0.96) 0%, rgba(18,24,32,0.82) 42%, rgba(18,24,32,0.22) 72%, rgba(18,24,32,0.08) 100%)' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, padding: '52px clamp(26px, 5vw, 64px)', maxWidth: 600 }}>
        <div style={{ color: '#ff6b5f', fontWeight: 800, fontSize: '0.78rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1.8 }}>
          GOOD HOME · Астана
        </div>
        <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 3vw, 2.85rem)', fontWeight: 900, lineHeight: 1.12, marginBottom: 14, letterSpacing: 0 }}>{s.title}</h1>
        <p style={{ color: 'rgba(255,255,255,0.84)', fontSize: '1rem', lineHeight: 1.55, maxWidth: 500, marginBottom: 28 }}>{s.sub}</p>
        <a href={s.href} style={{ display: 'inline-block', background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 32px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'none' }}>{s.btn}</a>
      </div>

      {/* Arrows */}
      {[{ fn: prev, icon: <ChevronLeft />, side: '16px' }, { fn: next, icon: <ChevronRight />, side: undefined }].map((a, i) => (
        <button key={i} onClick={a.fn} style={{ position: 'absolute', [i === 0 ? 'left' : 'right']: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '50%', width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', zIndex: 3 }}>
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
