import { Mail, MapPin, Phone } from 'lucide-react';
import { useShopData } from '../data/shopDataStore';

const CATALOG_LINKS = [
  { title: 'Постельное белье', href: '/catalog/bedding' },
  { title: 'Подушки', href: '/catalog/pillows' },
  { title: 'Одеяла', href: '/catalog/blankets' },
  { title: 'Простыни', href: '/catalog/sheets' },
  { title: 'Покрывала', href: '/catalog/bedspreads' },
  { title: 'Полотенца', href: '/catalog/towels' },
];

const SOCIAL_ICONS: Record<string, string> = {
  instagram: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
  youtube: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
  tiktok: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png',
  whatsapp: 'https://cdn-icons-png.flaticon.com/512/733/733585.png',
  '2gis': 'https://cdn-icons-png.flaticon.com/512/535/535239.png',
  other: 'https://cdn-icons-png.flaticon.com/512/545/545682.png',
};

export default function Footer() {
  const { settings } = useShopData();

  return (
    <footer style={{ background: '#1a1a2e', color: '#fff', marginTop: 60 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '50px 20px 30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40 }}>
        <div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 8 }}>
            <span style={{ color: '#fff' }}>GOOD</span><span style={{ color: '#e53935' }}> HOME</span>
          </div>
          <p style={{ color: '#888', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 16 }}>
            Магазин качественного домашнего текстиля. Постельное белье, полотенца, подушки и одеяла из Турции.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {settings.socialLinks.map((s, i) => (
              <a key={`${s.type}-${i}`} href={s.href || '#'} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" title={s.label} style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
              >
                <img src={SOCIAL_ICONS[s.type] || SOCIAL_ICONS.other} alt={s.label} style={{ width: 18, height: 18, objectFit: 'contain', display: 'block' }} />
              </a>
            ))}
          </div>
        </div>

        {[
          { title: 'Каталог', links: CATALOG_LINKS },
          { title: 'Информация', links: settings.infoLinks.map(link => ({ title: link.label, href: link.href })) },
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
          <a href={settings.whatsapp} target="_blank" rel="noreferrer" style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#888', fontSize: '0.85rem', marginBottom: 10, textDecoration: 'none' }}>
            <span style={{ color: '#e53935' }}><Phone size={14}/></span>{settings.phone}
          </a>
          <a href={`mailto:${settings.email}`} style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#888', fontSize: '0.85rem', marginBottom: 10, textDecoration: 'none' }}>
            <span style={{ color: '#e53935' }}><Mail size={14}/></span>{settings.email}
          </a>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#888', fontSize: '0.85rem', marginBottom: 10 }}>
            <span style={{ color: '#e53935' }}><MapPin size={14}/></span>{settings.city}
          </div>
          <div style={{ marginTop: 12, fontSize: '0.75rem', color: '#666' }}>{settings.workHours}</div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', maxWidth: 1280, margin: '0 auto', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', fontSize: '0.8rem', color: '#555' }}>
        <span>© 2026 GOOD HOME. Все права защищены.</span>
        <span>Принимаем: Visa, Mastercard, Kaspi</span>
      </div>
    </footer>
  );
}
