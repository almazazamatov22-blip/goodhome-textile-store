import { Instagram, Phone, Mail, MapPin, Youtube } from 'lucide-react';
import { INFO_LINKS } from '../data/infoLinks';

const CATALOG_LINKS = [
  { title: 'Постельное белье', href: '/catalog/bedding' },
  { title: 'Подушки', href: '/catalog/pillows' },
  { title: 'Одеяла', href: '/catalog/blankets' },
  { title: 'Простыни', href: '/catalog/sheets' },
  { title: 'Покрывала', href: '/catalog/bedspreads' },
  { title: 'Полотенца', href: '/catalog/towels' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#1a1a2e', color: '#fff', marginTop: 60 }}>
      {/* Main footer */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '50px 20px 30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40 }}>
        <div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 8 }}>
            <span style={{ color: '#fff' }}>GOOD</span><span style={{ color: '#e53935' }}> HOME</span>
          </div>
          <p style={{ color: '#888', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 16 }}>
            Магазин качественного домашнего текстиля. Постельное белье, полотенца, подушки и одеяла из Турции.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ icon: <Instagram size={18}/>, href: 'https://instagram.com/goodhomekz' }, { icon: <Youtube size={18}/> }].map((s, i) => (
              <a key={i} href={s.href || '#'} style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#e53935')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
              >{s.icon}</a>
            ))}
          </div>
        </div>

        {[
          { title: 'Каталог', links: CATALOG_LINKS },
          { title: 'Информация', links: INFO_LINKS.map(link => ({ title: link.title, href: link.path })) },
        ].map(col => (
          <div key={col.title}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: 1 }}>{col.title}</div>
            {col.links.map(l => (
              <a key={l.title} href={l.href} style={{ display: 'block', color: '#888', textDecoration: 'none', fontSize: '0.85rem', marginBottom: 8, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}
              >{l.title}</a>
            ))}
          </div>
        ))}

        <div>
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: 1 }}>Контакты</div>
          <a href="https://wa.me/77023797233" target="_blank" rel="noreferrer" style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#888', fontSize: '0.85rem', marginBottom: 10, textDecoration: 'none' }}>
            <span style={{ color: '#e53935' }}><Phone size={14}/></span>+7 702 379 72 33
          </a>
          <a href="mailto:info@goodhome.kz" style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#888', fontSize: '0.85rem', marginBottom: 10, textDecoration: 'none' }}>
            <span style={{ color: '#e53935' }}><Mail size={14}/></span>info@goodhome.kz
          </a>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#888', fontSize: '0.85rem', marginBottom: 10 }}>
            <span style={{ color: '#e53935' }}><MapPin size={14}/></span>г. Астана, Казахстан
          </div>
          <div style={{ marginTop: 12, fontSize: '0.75rem', color: '#666' }}>ПН-ВС: 10:00 – 20:00</div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', maxWidth: 1280, margin: '0 auto', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', fontSize: '0.8rem', color: '#555' }}>
        <span>© 2026 GOOD HOME. Все права защищены.</span>
        <span>Принимаем: Visa, Mastercard, Kaspi</span>
      </div>
    </footer>
  );
}
