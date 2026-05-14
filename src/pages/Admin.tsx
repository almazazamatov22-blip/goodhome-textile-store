import { useCallback, useState, type ReactNode } from 'react';
import { cleanProductTitle, DEFAULT_SITE_SETTINGS, type Product, type Category, type Order, type Review, type SiteSettings } from '../data/products';
import { CATEGORY_FILTERS } from '../data/filters';
import { BarChart2, ShoppingBag, Tag, LogOut, Users, ShoppingCart, Package, Plus, Pencil, Trash2, X, Save, TrendingUp, Clock, CheckCircle, Truck, XCircle, Settings, MessageSquare, Star } from 'lucide-react';

interface AdminData {
  products: Product[];
  categories: Category[];
  orders: Order[];
  users: {
    id: string;
    name: string;
    email: string;
    phone: string;
    registeredAt: string;
    cartItems: number;
    totalOrders: number;
    totalSpent: number;
  }[];
  reviews: Review[];
  settings: SiteSettings;
}

const ADMIN_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin`;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const NAV = [
  { id: 'dashboard', label: 'Дашборд', icon: <BarChart2 size={18}/> },
  { id: 'orders', label: 'Заказы', icon: <Package size={18}/> },
  { id: 'users', label: 'Пользователи', icon: <Users size={18}/> },
  { id: 'products', label: 'Товары', icon: <ShoppingBag size={18}/> },
  { id: 'categories', label: 'Категории', icon: <Tag size={18}/> },
  { id: 'reviews', label: 'Отзывы', icon: <MessageSquare size={18}/> },
  { id: 'settings', label: 'Настройки', icon: <Settings size={18}/> },
];

const ADMIN_ROLES = [
  { id: 'manager', label: 'Менеджер', pages: ['dashboard', 'orders', 'products', 'categories', 'reviews'] },
  { id: 'courier', label: 'Курьер', pages: ['orders'] },
  { id: 'director', label: 'Директор', pages: ['dashboard', 'orders', 'users', 'products', 'categories', 'reviews', 'settings'] },
  { id: 'admin', label: 'Админ', pages: ['dashboard', 'orders', 'users', 'products', 'categories', 'reviews', 'settings'] },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: ReactNode }> = {
  pending:   { label: 'Ожидает',    color: '#f57c00', bg: '#fff8e1', icon: <Clock size={12}/> },
  confirmed: { label: 'Подтвержден',color: '#1565c0', bg: '#e3f2fd', icon: <CheckCircle size={12}/> },
  shipping:  { label: 'В пути',     color: '#7b1fa2', bg: '#f3e5f5', icon: <Truck size={12}/> },
  delivered: { label: 'Доставлен',  color: '#2e7d32', bg: '#e8f5e9', icon: <CheckCircle size={12}/> },
  cancelled: { label: 'Отменён',    color: '#c62828', bg: '#fce4e4', icon: <XCircle size={12}/> },
};

function StatCard({ label, value, color, icon, sub }: { label: string; value: string | number; color: string; icon: ReactNode; sub?: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '20px 22px', borderLeft: `4px solid ${color}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: '0.78rem', color: '#999', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
        <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#1a1a2e', lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: '0.75rem', color: '#999', marginTop: 6 }}>{sub}</div>}
      </div>
      <div style={{ background: `${color}22`, borderRadius: 10, padding: 10, color }}>{icon}</div>
    </div>
  );
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      resolve(result.includes(',') ? result.split(',')[1] : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ProductModal({ product, categories, saving, onSave, onClose, onUpload }: { product: Partial<Product>|null; categories: Category[]; saving: boolean; onSave:(p:Product)=>Promise<void>; onClose:()=>void; onUpload:(file: File, folder: string)=>Promise<string> }) {
  const [form, setForm] = useState<Partial<Product>>(product || { title:'', category:'', subCategory:'', price:0, image:'', description:'', rating:0, reviews:0, stock:0, attributes: {} });
  const [uploading, setUploading] = useState(false);
  
  const set = (k: keyof Product, v: Product[keyof Product] | undefined) => setForm(f => ({...f, [k]: v}));
  
  const handleAttrChange = (key: string, val: string | string[]) => {
    setForm(f => ({ ...f, attributes: { ...(f.attributes || {}), [key]: val } }));
  };

  const selectedCat = categories.find(c => c.name === form.category);
  const activeFilters = selectedCat ? CATEGORY_FILTERS[selectedCat.slug] || [] : [];

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fff', borderRadius:16, padding:32, width:680, maxHeight:'90vh', overflowY:'auto', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, background:'none', border:'none', cursor:'pointer' }}><X size={22}/></button>
        <h2 style={{ marginBottom:22, color:'#1a1a2e', fontWeight:800 }}>{product?.id ? 'Редактировать товар' : 'Новый товар'}</h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          {[{l:'Название',k:'title',t:'text'},{l:'URL изображения',k:'image',t:'text'},{l:'Цена (₸)',k:'price',t:'number'},{l:'Старая цена (₸)',k:'oldPrice',t:'number'},{l:'Наличие (шт)',k:'stock',t:'number'},{l:'Рассрочка (₸/мес)',k:'installment',t:'number'}].map(f => (
            <div key={f.k}>
              <label style={{ fontSize:'0.78rem', fontWeight:600, color:'#555', display:'block', marginBottom:4 }}>{f.l}</label>
              <input type={f.t} value={String(form[f.k as keyof Product] ?? '')} onChange={e => set(f.k as keyof Product, f.t==='number' ? +e.target.value : e.target.value)}
                style={{ width:'100%', border:'1px solid #ddd', borderRadius:7, padding:'7px 11px', fontSize:'0.88rem', outline:'none', boxSizing:'border-box' }}/>
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1', background:'#f8fafc', border:'1px solid #edf0f5', borderRadius:8, padding:12 }}>
            <label style={{ fontSize:'0.78rem', fontWeight:700, color:'#1a1a2e', display:'block', marginBottom:6 }}>Загрузить свое фото</label>
            <input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} onChange={async e => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              try {
                const url = await onUpload(file, 'products');
                setForm(f => ({ ...f, image: url, images: [url, ...(f.images || []).filter(img => img !== url)] }));
              } finally {
                setUploading(false);
                e.currentTarget.value = '';
              }
            }} />
            <div style={{ marginTop:6, fontSize:'0.76rem', color:'#777' }}>{uploading ? 'Загружаем...' : 'Фото сохраняется в Supabase Storage и сразу подставляется в товар.'}</div>
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize:'0.78rem', fontWeight:600, color:'#555', display:'block', marginBottom:4 }}>Категория</label>
              <select value={form.category||''} onChange={e => set('category', e.target.value)} style={{ width:'100%', border:'1px solid #ddd', borderRadius:7, padding:'7px 11px', fontSize:'0.88rem' }}>
                <option value="">Выберите...</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize:'0.78rem', fontWeight:600, color:'#555', display:'block', marginBottom:4 }}>Бейдж</label>
              <select value={form.badge||''} onChange={e => set('badge', e.target.value||undefined)} style={{ width:'100%', border:'1px solid #ddd', borderRadius:7, padding:'7px 11px', fontSize:'0.88rem' }}>
                <option value="">Нет</option>
                <option value="new">Новинка</option>
                <option value="hit">Хит</option>
                <option value="sale">Скидка</option>
              </select>
            </div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize:'0.78rem', fontWeight:600, color:'#555', display:'block', marginBottom:4 }}>Подкатегория</label>
            <select value={form.subCategory||''} onChange={e => set('subCategory', e.target.value)} style={{ width:'100%', border:'1px solid #ddd', borderRadius:7, padding:'7px 11px', fontSize:'0.88rem' }}>
              <option value="">Выберите...</option>
              {selectedCat?.subCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
          </div>
        </div>

        {/* Dynamic Attributes Based on Category */}
        {activeFilters.length > 0 && (
          <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid #eee' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 14 }}>Характеристики ({selectedCat?.name})</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {activeFilters.map(filter => {
                const isMulti = filter.type === 'multicheck';
                const currentVal = form.attributes?.[filter.key] || (isMulti ? [] : '');
                
                return (
                  <div key={filter.key}>
                    <label style={{ fontSize:'0.78rem', fontWeight:600, color:'#555', display:'block', marginBottom:4 }}>{filter.label}</label>
                    {isMulti ? (
                      <div style={{ maxHeight: 100, overflowY: 'auto', border: '1px solid #ddd', borderRadius: 7, padding: 8 }}>
                        {filter.options?.map(opt => {
                          const arr = (currentVal as string[]) || [];
                          const checked = arr.includes(opt.value);
                          return (
                            <label key={opt.value} style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.82rem', marginBottom:4 }}>
                              <input type="checkbox" checked={checked} onChange={(e) => {
                                const nextArr = e.target.checked ? [...arr, opt.value] : arr.filter(x => x !== opt.value);
                                handleAttrChange(filter.key, nextArr);
                              }} />
                              {opt.label}
                            </label>
                          )
                        })}
                      </div>
                    ) : (
                      <select value={currentVal as string} onChange={e => handleAttrChange(filter.key, e.target.value)} style={{ width:'100%', border:'1px solid #ddd', borderRadius:7, padding:'7px 11px', fontSize:'0.88rem' }}>
                        <option value="">Выберите...</option>
                        {filter.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div style={{ marginTop:14 }}>
          <label style={{ fontSize:'0.78rem', fontWeight:600, color:'#555', display:'block', marginBottom:4 }}>Описание</label>
          <textarea value={form.description||''} onChange={e => set('description', e.target.value)} rows={3}
            style={{ width:'100%', border:'1px solid #ddd', borderRadius:7, padding:'7px 11px', fontSize:'0.88rem', outline:'none', resize:'vertical', boxSizing:'border-box' }}/>
        </div>
        <div style={{ marginTop:14, padding:'10px 12px', background:'#fff8e1', border:'1px solid #ffe0a3', borderRadius:8, fontSize:'0.8rem', color:'#795200' }}>
          Рейтинг и количество отзывов не редактируются вручную. Они пересчитываются автоматически только по одобренным отзывам покупателей.
        </div>
        {form.image && <img src={form.image} alt="" style={{ width:'100%', height:100, objectFit:'cover', borderRadius:8, marginTop:10 }}/>}
        <button disabled={saving || uploading || !form.image} onClick={() => onSave({...form, id:product?.id||Date.now(), subCategory: form.subCategory || selectedCat?.subCategories[0] || 'Разное', rating: product?.rating || 0, reviews: product?.reviews || 0, images: form.image ? [form.image, ...(form.images || []).filter(img => img !== form.image)] : []} as Product)}
          style={{ marginTop:18, width:'100%', background:'#e53935', color:'#fff', border:'none', borderRadius:8, padding:'11px', fontWeight:700, fontSize:'0.95rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <Save size={17}/> {saving ? 'Сохраняем...' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}

function CategoryModal({ category, saving, onSave, onClose, onUpload }: { category: Partial<Category>|null; saving: boolean; onSave:(c:Category)=>Promise<void>; onClose:()=>void; onUpload:(file: File, folder: string)=>Promise<string> }) {
  const [form, setForm] = useState<Partial<Category>>(category || { name:'', slug:'', image:'', subCategories: [] });
  const [uploading, setUploading] = useState(false);
  const slug = form.slug || (form.name || '').toLowerCase().trim().replace(/\s+/g, '-');

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:28, width:560, maxHeight:'90vh', overflowY:'auto', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, background:'none', border:'none', cursor:'pointer' }}><X size={22}/></button>
        <h2 style={{ marginBottom:20, color:'#1a1a2e', fontWeight:800 }}>{category?.id ? 'Редактировать категорию' : 'Новая категория'}</h2>
        <div style={{ display:'grid', gap:12 }}>
          <div>
            <label style={{ fontSize:'0.78rem', fontWeight:700, color:'#555', display:'block', marginBottom:4 }}>Название</label>
            <input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ width:'100%', border:'1px solid #ddd', borderRadius:8, padding:'9px 12px' }} />
          </div>
          <div>
            <label style={{ fontSize:'0.78rem', fontWeight:700, color:'#555', display:'block', marginBottom:4 }}>Slug для URL</label>
            <input value={slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={{ width:'100%', border:'1px solid #ddd', borderRadius:8, padding:'9px 12px' }} />
          </div>
          <div>
            <label style={{ fontSize:'0.78rem', fontWeight:700, color:'#555', display:'block', marginBottom:4 }}>URL фото</label>
            <input value={form.image || ''} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} style={{ width:'100%', border:'1px solid #ddd', borderRadius:8, padding:'9px 12px' }} />
          </div>
          <div style={{ background:'#f8fafc', border:'1px solid #edf0f5', borderRadius:8, padding:12 }}>
            <label style={{ fontSize:'0.78rem', fontWeight:700, color:'#1a1a2e', display:'block', marginBottom:6 }}>Загрузить фото категории</label>
            <input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} onChange={async e => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              try {
                const url = await onUpload(file, 'categories');
                setForm(f => ({ ...f, image: url }));
              } finally {
                setUploading(false);
                e.currentTarget.value = '';
              }
            }} />
            <div style={{ marginTop:6, fontSize:'0.76rem', color:'#777' }}>{uploading ? 'Загружаем...' : 'Фото сохраняется в Supabase Storage.'}</div>
          </div>
          {form.image && <img src={form.image} alt="" style={{ width:'100%', height:140, objectFit:'cover', borderRadius:8 }} />}
          <div>
            <label style={{ fontSize:'0.78rem', fontWeight:700, color:'#555', display:'block', marginBottom:4 }}>Подкатегории, каждая с новой строки</label>
            <textarea value={(form.subCategories || []).join('\n')} onChange={e => setForm(f => ({ ...f, subCategories: e.target.value.split('\n').map(v => v.trim()).filter(Boolean) }))} rows={5} style={{ width:'100%', border:'1px solid #ddd', borderRadius:8, padding:'9px 12px', resize:'vertical' }} />
          </div>
        </div>
        <button disabled={saving || uploading || !form.name?.trim() || !form.image?.trim()} onClick={() => onSave({ id: category?.id || Date.now(), name: form.name!.trim(), slug: slug.trim(), image: form.image!.trim(), subCategories: form.subCategories || [] })}
          style={{ marginTop:18, width:'100%', background:'#e53935', color:'#fff', border:'none', borderRadius:8, padding:'11px', fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <Save size={17}/> {saving ? 'Сохраняем...' : 'Сохранить категорию'}
        </button>
      </div>
    </div>
  );
}

function SettingsEditor({ settings, saving, onSave }: { settings: SiteSettings; saving: boolean; onSave:(settings:SiteSettings)=>Promise<void> }) {
  const [form, setForm] = useState<SiteSettings>(settings || DEFAULT_SITE_SETTINGS);
  const updateSocial = (index: number, key: keyof SiteSettings['socialLinks'][number], value: string) => {
    setForm(current => ({
      ...current,
      socialLinks: current.socialLinks.map((link, i) => i === index ? { ...link, [key]: value } : link),
    }));
  };
  const updateInfo = (index: number, key: 'label' | 'href', value: string) => {
    setForm(current => ({
      ...current,
      infoLinks: current.infoLinks.map((link, i) => i === index ? { ...link, [key]: value } : link),
    }));
  };

  return (
    <div>
      <h1 style={{ fontWeight:800, fontSize:'1.5rem', color:'#1a1a2e', marginBottom:22 }}>Настройки сайта</h1>
      <div style={{ background:'#fff', borderRadius:12, padding:20, boxShadow:'0 2px 8px rgba(0,0,0,0.06)', display:'grid', gap:18 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2, minmax(220px, 1fr))', gap:12 }}>
          {[
            ['phone', 'Телефон'],
            ['whatsapp', 'WhatsApp ссылка'],
            ['email', 'Email'],
            ['city', 'Город'],
            ['workHours', 'Режим работы'],
          ].map(([key, label]) => (
            <div key={key}>
              <label style={{ fontSize:'0.78rem', fontWeight:700, color:'#555', display:'block', marginBottom:4 }}>{label}</label>
              <input value={String(form[key as keyof SiteSettings] || '')} onChange={e => setForm(current => ({ ...current, [key]: e.target.value }))}
                style={{ width:'100%', border:'1px solid #ddd', borderRadius:8, padding:'9px 12px' }} />
            </div>
          ))}
        </div>

        <section>
          <h2 style={{ fontSize:'1rem', fontWeight:800, marginBottom:10 }}>Информационные ссылки в футере</h2>
          <div style={{ display:'grid', gap:8 }}>
            {form.infoLinks.map((link, index) => (
              <div key={index} style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr 36px', gap:8 }}>
                <input value={link.label} onChange={e => updateInfo(index, 'label', e.target.value)} placeholder="Название" style={{ border:'1px solid #ddd', borderRadius:8, padding:'9px 12px' }} />
                <input value={link.href} onChange={e => updateInfo(index, 'href', e.target.value)} placeholder="/contacts" style={{ border:'1px solid #ddd', borderRadius:8, padding:'9px 12px' }} />
                <button onClick={() => setForm(current => ({ ...current, infoLinks: current.infoLinks.filter((_, i) => i !== index) }))} style={{ border:'none', borderRadius:8, background:'#fce4e4', color:'#e53935', cursor:'pointer' }}><Trash2 size={15}/></button>
              </div>
            ))}
          </div>
          <button onClick={() => setForm(current => ({ ...current, infoLinks: [...current.infoLinks, { label:'Новая ссылка', href:'#' }] }))} style={{ marginTop:10, border:'none', borderRadius:8, background:'#e3f2fd', color:'#1565c0', padding:'8px 12px', fontWeight:700, cursor:'pointer' }}>Добавить ссылку</button>
        </section>

        <section>
          <h2 style={{ fontSize:'1rem', fontWeight:800, marginBottom:10 }}>Соцсети и карты</h2>
          <div style={{ display:'grid', gap:8 }}>
            {form.socialLinks.map((link, index) => (
              <div key={index} style={{ display:'grid', gridTemplateColumns:'140px 1fr 1.7fr 36px', gap:8 }}>
                <select value={link.type} onChange={e => updateSocial(index, 'type', e.target.value)} style={{ border:'1px solid #ddd', borderRadius:8, padding:'9px 12px' }}>
                  {['instagram','youtube','tiktok','whatsapp','2gis','other'].map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                <input value={link.label} onChange={e => updateSocial(index, 'label', e.target.value)} placeholder="Название" style={{ border:'1px solid #ddd', borderRadius:8, padding:'9px 12px' }} />
                <input value={link.href} onChange={e => updateSocial(index, 'href', e.target.value)} placeholder="https://..." style={{ border:'1px solid #ddd', borderRadius:8, padding:'9px 12px' }} />
                <button onClick={() => setForm(current => ({ ...current, socialLinks: current.socialLinks.filter((_, i) => i !== index) }))} style={{ border:'none', borderRadius:8, background:'#fce4e4', color:'#e53935', cursor:'pointer' }}><Trash2 size={15}/></button>
              </div>
            ))}
          </div>
          <button onClick={() => setForm(current => ({ ...current, socialLinks: [...current.socialLinks, { type:'other', label:'Новая ссылка', href:'https://' }] }))} style={{ marginTop:10, border:'none', borderRadius:8, background:'#e3f2fd', color:'#1565c0', padding:'8px 12px', fontWeight:700, cursor:'pointer' }}>Добавить соцсеть</button>
        </section>

        <button disabled={saving} onClick={() => onSave(form)} style={{ background:'#e53935', color:'#fff', border:'none', borderRadius:8, padding:'12px 18px', fontWeight:800, cursor:saving?'not-allowed':'pointer', justifySelf:'start' }}>
          {saving ? 'Сохраняем...' : 'Сохранить настройки'}
        </button>
      </div>
    </div>
  );
}

export default function Admin() {
  const [page, setPage] = useState('dashboard');
  const [adminKey, setAdminKey] = useState('');
  const [adminRole, setAdminRole] = useState(() => sessionStorage.getItem('goodhome_admin_role') || 'admin');
  const [data, setData] = useState<AdminData>({ products: [], categories: [], orders: [], users: [], reviews: [], settings: DEFAULT_SITE_SETTINGS });
  const [editProduct, setEditProduct] = useState<Partial<Product>|null|undefined>(undefined);
  const [editCategory, setEditCategory] = useState<Partial<Category>|null|undefined>(undefined);
  const [orderFilter, setOrderFilter] = useState('all');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { products, categories, orders, users, reviews, settings } = data;

  const adminRequest = useCallback(async <T,>(resource: string, options: RequestInit = {}) => {
    const response = await fetch(`${ADMIN_ENDPOINT}?resource=${resource}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'x-admin-key': adminKey,
        'x-admin-role': adminRole,
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      throw new Error(detail.error || `Admin API error ${response.status}`);
    }

    return response.json() as Promise<T>;
  }, [adminKey, adminRole]);

  const loadAdminData = useCallback(async () => {
    if (!adminKey.trim()) return;
    setLoading(true);
    setError(null);
    try {
      sessionStorage.setItem('goodhome_admin_role', adminRole);
      const nextData = await adminRequest<AdminData>('all');
      setData({
        ...nextData,
        products: nextData.products.map(product => ({ ...product, title: cleanProductTitle(product.title) })),
        settings: nextData.settings || DEFAULT_SITE_SETTINGS,
        reviews: nextData.reviews || [],
      });
      setAuthenticated(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось загрузить админ-данные';
      if (message === 'Invalid admin key') {
        setAuthenticated(false);
        sessionStorage.removeItem('goodhome_admin_key');
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [adminKey, adminRole, adminRequest]);

  const uploadImage = useCallback(async (file: File, folder: string) => {
    const base64 = await fileToBase64(file);
    const result = await adminRequest<{ url: string }>('upload-image', {
      method: 'POST',
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        base64,
        folder,
      }),
    });
    return result.url;
  }, [adminRequest]);

  const handleSaveProduct = async (product: Product) => {
    setSaving(true);
    try {
      const exists = products.some(item => item.id === product.id);
      const saved = await adminRequest<Product[]>(`products&id=${product.id}`, {
        method: exists ? 'PATCH' : 'POST',
        body: JSON.stringify({ ...product, rating: product.rating || 0, reviews: product.reviews || 0 }),
      });
      setData(prev => ({
        ...prev,
        products: exists
          ? prev.products.map(item => item.id === saved[0].id ? saved[0] : item)
          : [...prev.products, saved[0]],
      }));
      setEditProduct(undefined);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCategory = async (category: Category) => {
    setSaving(true);
    try {
      const exists = categories.some(item => item.id === category.id);
      const saved = await adminRequest<Category[]>(`categories&id=${category.id}`, {
        method: exists ? 'PATCH' : 'POST',
        body: JSON.stringify(category),
      });
      setData(prev => ({
        ...prev,
        categories: exists
          ? prev.categories.map(item => item.id === saved[0].id ? saved[0] : item)
          : [...prev.categories, saved[0]],
      }));
      setEditCategory(undefined);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateOrder = async (order: Order, patch: Partial<Order>) => {
    const saved = await adminRequest<Order[]>(`orders&id=${order.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...order, ...patch }),
    });
    setData(prev => ({ ...prev, orders: prev.orders.map(item => item.id === order.id ? saved[0] : item) }));
  };

  const handleUpdateReview = async (review: Review, patch: Partial<Review>) => {
    await adminRequest<Review[]>(`reviews&id=${review.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...review, ...patch }),
    });
    await loadAdminData();
  };

  const handleDeleteReview = async (review: Review) => {
    await adminRequest<Review[]>(`reviews&id=${review.id}`, { method: 'DELETE' });
    await loadAdminData();
  };

  const handleSaveSettings = async (nextSettings: SiteSettings) => {
    setSaving(true);
    try {
      const saved = await adminRequest<{ value: SiteSettings }[]>('settings', {
        method: 'PATCH',
        body: JSON.stringify(nextSettings),
      });
      setData(prev => ({ ...prev, settings: saved[0]?.value || nextSettings }));
    } finally {
      setSaving(false);
    }
  };

  const totalRevenue = orders.filter(o => o.status==='delivered').reduce((s,o) => s+o.total, 0);
  const inCart = users.reduce((s,u) => s+u.cartItems, 0);
  const inShipping = orders.filter(o => o.status==='shipping').length;
  const delivered = orders.filter(o => o.status==='delivered').length;
  const pending = orders.filter(o => o.status==='pending').length;

  const filteredOrders = orderFilter==='all' ? orders : orders.filter(o => o.status===orderFilter);
  const currentRole = ADMIN_ROLES.find(role => role.id === adminRole) || ADMIN_ROLES[3];
  const visibleNav = NAV.filter(item => currentRole.pages.includes(item.id));
  const activePage = currentRole.pages.includes(page) ? page : currentRole.pages[0];

  const sideStyle = (id: string) => ({
    width:'100%', background: activePage===id ? 'rgba(229,57,53,0.12)' : 'none', border:'none',
    borderLeft: activePage===id ? '3px solid #e53935' : '3px solid transparent',
    color: activePage===id ? '#e53935' : '#aaa', padding:'11px 20px',
    display:'flex', gap:12, alignItems:'center', fontSize:'0.88rem',
    fontWeight: activePage===id ? 700 : 400, cursor:'pointer', textAlign:'left' as const, transition:'all 0.2s'
  });

  if (!authenticated) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f4f6fb', fontFamily:'Roboto,sans-serif', padding:20 }}>
        <div style={{ width:380, background:'#fff', borderRadius:14, padding:28, boxShadow:'0 10px 35px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize:'1.25rem', fontWeight:800, color:'#1a1a2e', marginBottom:10 }}>Админская Панель</h1>
          <p style={{ color:'#777', fontSize:'0.88rem', lineHeight:1.5, marginBottom:18 }}>Выберите роль и введите пароль администратора.</p>
          <select value={adminRole} onChange={e => { setAdminRole(e.target.value); setError(null); }}
            style={{ width:'100%', border:'1px solid #ddd', borderRadius:8, padding:'11px 12px', fontSize:'0.95rem', outline:'none', boxSizing:'border-box', marginBottom:12 }}>
            {ADMIN_ROLES.map(role => <option key={role.id} value={role.id}>{role.label}</option>)}
          </select>
          <input type="password" value={adminKey} onChange={e => { setAdminKey(e.target.value); setError(null); }} onKeyDown={e => e.key === 'Enter' && void loadAdminData()} placeholder="Пароль"
            style={{ width:'100%', border:'1px solid #ddd', borderRadius:8, padding:'11px 12px', fontSize:'0.95rem', outline:'none', boxSizing:'border-box', marginBottom:12 }} />
          {error && <div style={{ color:'#c62828', fontSize:'0.82rem', marginBottom:12 }}>{error}</div>}
          <button onClick={() => void loadAdminData()} disabled={loading || !adminKey.trim()}
            style={{ width:'100%', background:'#e53935', color:'#fff', border:'none', borderRadius:8, padding:'12px', fontWeight:700, cursor:'pointer' }}>
            {loading ? 'Проверяем...' : 'Войти'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:'Roboto,sans-serif', background:'#f4f6fb' }}>
      {editProduct !== undefined && (
        <ProductModal product={editProduct} categories={categories} saving={saving} onSave={handleSaveProduct} onClose={() => setEditProduct(undefined)} onUpload={uploadImage}/>
      )}
      {editCategory !== undefined && (
        <CategoryModal category={editCategory} saving={saving} onSave={handleSaveCategory} onClose={() => setEditCategory(undefined)} onUpload={uploadImage}/>
      )}

      {/* Sidebar */}
      <aside style={{ width:230, background:'#1a1a2e', color:'#fff', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'22px 18px 18px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize:'1.3rem', fontWeight:900 }}>GOOD<span style={{ color:'#e53935' }}> HOME</span></div>
          <div style={{ fontSize:'0.68rem', color:'#888', marginTop:2 }}>Админская Панель · {currentRole.label}</div>
        </div>
        <nav style={{ flex:1, padding:'12px 0' }}>
          {visibleNav.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={sideStyle(n.id)}>
              {n.icon}{n.label}
            </button>
          ))}
        </nav>
        <a href="/" style={{ padding:'14px 18px', display:'flex', gap:9, alignItems:'center', color:'#555', fontSize:'0.82rem', textDecoration:'none', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          <LogOut size={15}/> На сайт
        </a>
      </aside>

      {/* Main */}
      <main style={{ flex:1, padding:28, overflow:'auto' }}>
        {(loading || error) && (
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: error ? '#fff8e1' : '#e3f2fd', border: `1px solid ${error ? '#ffe0a3' : '#bbdefb'}`, borderRadius: 10, padding: '10px 14px', color: error ? '#8a5a00' : '#1565c0', fontSize: '0.85rem' }}>
            <span>{loading ? 'Загружаем данные из Supabase...' : `Ошибка Supabase: ${error}`}</span>
            <button onClick={() => void loadAdminData()} style={{ border:'none', background:'transparent', color:'inherit', fontWeight:700, cursor:'pointer' }}>Обновить</button>
          </div>
        )}

        {/* DASHBOARD */}
        {activePage==='dashboard' && (
          <div>
            <h1 style={{ fontWeight:800, fontSize:'1.5rem', color:'#1a1a2e', marginBottom:22 }}>Дашборд</h1>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:28 }}>
              <StatCard label="Зарегистрировано" value={users.length} color="#e53935" icon={<Users size={22}/>} sub="пользователей"/>
              <StatCard label="Всего заказов" value={orders.length} color="#1565c0" icon={<Package size={22}/>} sub={`Выручка: ${totalRevenue.toLocaleString()} ₸`}/>
              <StatCard label="В корзинах" value={inCart} color="#f57c00" icon={<ShoppingCart size={22}/>} sub="товаров ожидают оплаты"/>
              <StatCard label="Доставлено" value={delivered} color="#2e7d32" icon={<CheckCircle size={22}/>} sub={`В пути: ${inShipping} • Ожидают: ${pending}`}/>
            </div>

            {/* Order status summary */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:28 }}>
              {Object.entries(STATUS_MAP).map(([key, s]) => (
                <div key={key} style={{ background:s.bg, borderRadius:10, padding:'14px 16px', textAlign:'center' }}>
                  <div style={{ color:s.color, fontWeight:700, fontSize:'1.5rem' }}>{orders.filter(o=>o.status===key).length}</div>
                  <div style={{ color:s.color, fontSize:'0.78rem', fontWeight:600, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <h2 style={{ fontWeight:700, fontSize:'1.05rem', marginBottom:12, color:'#1a1a2e' }}>Последние заказы</h2>
            <div style={{ background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead><tr style={{ background:'#f4f6fb' }}>
                  {['ID','Покупатель','Сумма','Статус','Дата'].map(h => (
                    <th key={h} style={{ padding:'11px 14px', textAlign:'left', fontSize:'0.76rem', fontWeight:700, color:'#666', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {orders.slice(0,6).map(o => {
                    const s = STATUS_MAP[o.status];
                    return (
                      <tr key={o.id} style={{ borderTop:'1px solid #f0f0f0' }}>
                        <td style={{ padding:'10px 14px', fontSize:'0.82rem', fontWeight:600, color:'#1565c0' }}>{o.id}</td>
                        <td style={{ padding:'10px 14px', fontSize:'0.85rem' }}>{o.userName}</td>
                        <td style={{ padding:'10px 14px', fontWeight:700, color:'#e53935', fontSize:'0.88rem' }}>{o.total.toLocaleString()} ₸</td>
                        <td style={{ padding:'10px 14px' }}>
                          <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:s.bg, color:s.color, fontSize:'0.72rem', fontWeight:700, padding:'3px 9px', borderRadius:20 }}>
                            {s.icon}{s.label}
                          </span>
                        </td>
                        <td style={{ padding:'10px 14px', fontSize:'0.82rem', color:'#888' }}>{o.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activePage==='orders' && (
          <div>
            <h1 style={{ fontWeight:800, fontSize:'1.5rem', color:'#1a1a2e', marginBottom:22 }}>Заказы ({orders.length})</h1>
            <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
              {[['all','Все'],['pending','Ожидают'],['confirmed','Подтверждены'],['shipping','В пути'],['delivered','Доставлены'],['cancelled','Отменены']].map(([val,lbl]) => (
                <button key={val} onClick={() => setOrderFilter(val)}
                  style={{ padding:'6px 14px', borderRadius:20, border:`1px solid ${orderFilter===val?'#e53935':'#ddd'}`, background:orderFilter===val?'#e53935':'#fff', color:orderFilter===val?'#fff':'#555', fontSize:'0.82rem', cursor:'pointer', fontWeight:500 }}>
                  {lbl} ({val==='all'?orders.length:orders.filter(o=>o.status===val).length})
                </button>
              ))}
            </div>
            <div style={{ background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead><tr style={{ background:'#f4f6fb' }}>
                  {['ID','Покупатель','Товары','Сумма','Статус','Доставка','Адрес','Дата'].map(h => (
                    <th key={h} style={{ padding:'11px 14px', textAlign:'left', fontSize:'0.76rem', fontWeight:700, color:'#666', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filteredOrders.map(o => {
                    const s = STATUS_MAP[o.status];
                    return (
                      <tr key={o.id} style={{ borderTop:'1px solid #f0f0f0' }}>
                        <td style={{ padding:'10px 14px', fontSize:'0.8rem', fontWeight:700, color:'#1565c0' }}>{o.id}</td>
                        <td style={{ padding:'10px 14px', fontSize:'0.85rem', fontWeight:600 }}>{o.userName}</td>
                        <td style={{ padding:'10px 14px', fontSize:'0.78rem', color:'#666', maxWidth:160 }}>{o.items.map(i=>`${i.title} x${i.qty}`).join(', ')}</td>
                        <td style={{ padding:'10px 14px', fontWeight:700, color:'#e53935' }}>{o.total.toLocaleString()} ₸</td>
                        <td style={{ padding:'10px 14px', minWidth:150 }}>
                          <select value={o.status} onChange={e => void handleUpdateOrder(o, { status: e.target.value as Order['status'] })}
                            style={{ width:'100%', border:'1px solid #ddd', borderRadius:7, padding:'6px 8px', fontSize:'0.78rem', color:s.color, background:s.bg, fontWeight:700 }}>
                            {Object.entries(STATUS_MAP).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
                          </select>
                        </td>
                        <td style={{ padding:'10px 14px', minWidth:260 }}>
                          <div style={{ display:'grid', gap:6 }}>
                            <select value={o.deliveryStatus || 'not_started'} onChange={e => void handleUpdateOrder(o, { deliveryStatus: e.target.value as Order['deliveryStatus'] })}
                              style={{ border:'1px solid #ddd', borderRadius:7, padding:'6px 8px', fontSize:'0.76rem' }}>
                              <option value="not_started">Не начата</option>
                              <option value="courier_assigned">Курьер назначен</option>
                              <option value="shipped">Отправлен</option>
                              <option value="delivered">Доставлен</option>
                              <option value="returned">Возврат</option>
                            </select>
                            <input value={o.deliveryService || ''} onChange={e => void handleUpdateOrder(o, { deliveryService: e.target.value })} placeholder="Служба доставки"
                              style={{ border:'1px solid #ddd', borderRadius:7, padding:'6px 8px', fontSize:'0.76rem' }} />
                            <input value={o.trackingNumber || ''} onChange={e => void handleUpdateOrder(o, { trackingNumber: e.target.value })} placeholder="Трек-номер"
                              style={{ border:'1px solid #ddd', borderRadius:7, padding:'6px 8px', fontSize:'0.76rem' }} />
                            <input value={o.deliveryPrice ?? ''} onChange={e => void handleUpdateOrder(o, { deliveryPrice: e.target.value ? Number(e.target.value) : null })} placeholder="Цена доставки"
                              style={{ border:'1px solid #ddd', borderRadius:7, padding:'6px 8px', fontSize:'0.76rem' }} />
                            <textarea value={o.deliveryComment || ''} onChange={e => void handleUpdateOrder(o, { deliveryComment: e.target.value })} placeholder="Комментарий по доставке" rows={2}
                              style={{ border:'1px solid #ddd', borderRadius:7, padding:'6px 8px', fontSize:'0.76rem', resize:'vertical' }} />
                          </div>
                        </td>
                        <td style={{ padding:'10px 14px', fontSize:'0.78rem', color:'#888' }}>{o.address}</td>
                        <td style={{ padding:'10px 14px', fontSize:'0.78rem', color:'#888' }}>{o.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS */}
        {activePage==='users' && (
          <div>
            <h1 style={{ fontWeight:800, fontSize:'1.5rem', color:'#1a1a2e', marginBottom:22 }}>Пользователи ({users.length})</h1>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
              <StatCard label="Всего зарегистрировано" value={users.length} color="#e53935" icon={<Users size={22}/>}/>
              <StatCard label="Товаров в корзинах" value={users.reduce((s,u)=>s+u.cartItems,0)} color="#f57c00" icon={<ShoppingCart size={22}/>}/>
              <StatCard label="Общая выручка" value={users.reduce((s,u)=>s+u.totalSpent,0).toLocaleString()+' ₸'} color="#2e7d32" icon={<TrendingUp size={22}/>}/>
            </div>
            <div style={{ background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead><tr style={{ background:'#f4f6fb' }}>
                  {['Имя','Email','Телефон','В корзине','Заказов','Потрачено','Дата рег.'].map(h => (
                    <th key={h} style={{ padding:'11px 14px', textAlign:'left', fontSize:'0.76rem', fontWeight:700, color:'#666', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderTop:'1px solid #f0f0f0' }}>
                      <td style={{ padding:'10px 14px', fontWeight:600, fontSize:'0.88rem' }}>{u.name}</td>
                      <td style={{ padding:'10px 14px', fontSize:'0.82rem', color:'#666' }}>{u.email}</td>
                      <td style={{ padding:'10px 14px', fontSize:'0.82rem', color:'#666' }}>{u.phone}</td>
                      <td style={{ padding:'10px 14px', textAlign:'center' }}>
                        <span style={{ background: u.cartItems>0?'#fff8e1':'#f5f5f5', color: u.cartItems>0?'#f57c00':'#999', fontWeight:700, fontSize:'0.8rem', padding:'2px 10px', borderRadius:12 }}>{u.cartItems}</span>
                      </td>
                      <td style={{ padding:'10px 14px', textAlign:'center', fontWeight:700, color:'#1565c0' }}>{u.totalOrders}</td>
                      <td style={{ padding:'10px 14px', fontWeight:700, color:'#2e7d32', fontSize:'0.88rem' }}>{u.totalSpent.toLocaleString()} ₸</td>
                      <td style={{ padding:'10px 14px', fontSize:'0.8rem', color:'#888' }}>{u.registeredAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {activePage==='products' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
              <h1 style={{ fontWeight:800, fontSize:'1.5rem', color:'#1a1a2e' }}>Товары ({products.length})</h1>
              <button onClick={() => setEditProduct(null)} style={{ background:'#e53935', color:'#fff', border:'none', borderRadius:8, padding:'9px 18px', fontWeight:700, cursor:'pointer', display:'flex', gap:6, alignItems:'center' }}>
                <Plus size={17}/> Добавить товар
              </button>
            </div>
            <div style={{ background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead><tr style={{ background:'#f4f6fb' }}>
                  {['Фото','Название','Категория','Цена','Наличие','Отзывы','Бейдж',''].map(h => (
                    <th key={h} style={{ padding:'11px 14px', textAlign:'left', fontSize:'0.76rem', fontWeight:700, color:'#666', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderTop:'1px solid #f0f0f0' }}>
                      <td style={{ padding:'9px 14px' }}><img src={p.image} alt="" style={{ width:42, height:42, borderRadius:6, objectFit:'cover' }}/></td>
                      <td style={{ padding:'9px 14px', fontWeight:600, fontSize:'0.85rem', maxWidth:200 }}>{p.title}</td>
                      <td style={{ padding:'9px 14px', fontSize:'0.8rem', color:'#666' }}>{p.category}</td>
                      <td style={{ padding:'9px 14px', fontWeight:700, color:'#e53935' }}>{p.price.toLocaleString()} ₸</td>
                      <td style={{ padding:'9px 14px', fontSize:'0.83rem' }}>{p.stock} шт</td>
                      <td style={{ padding:'9px 14px', fontSize:'0.8rem', color:'#666' }}>{p.reviews ? `${p.rating.toFixed(1)} / ${p.reviews}` : 'нет'}</td>
                      <td style={{ padding:'9px 14px' }}>
                        {p.badge && <span style={{ fontSize:'0.7rem', fontWeight:700, padding:'2px 8px', borderRadius:4, background:'#f0f0f0', color:'#333' }}>{p.badge}</span>}
                      </td>
                      <td style={{ padding:'9px 14px' }}>
                        <div style={{ display:'flex', gap:7 }}>
                          <button onClick={() => setEditProduct(p)} style={{ background:'#e3f2fd', border:'none', borderRadius:6, padding:'5px 9px', cursor:'pointer', color:'#1565c0' }}><Pencil size={13}/></button>
                          <button onClick={async () => {
                            if (!confirm('Удалить?')) return;
                            await adminRequest<Product[]>(`products&id=${p.id}`, { method: 'DELETE' });
                            setData(prev => ({ ...prev, products: prev.products.filter(item => item.id !== p.id) }));
                          }} style={{ background:'#fce4e4', border:'none', borderRadius:6, padding:'5px 9px', cursor:'pointer', color:'#e53935' }}><Trash2 size={13}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CATEGORIES */}
        {activePage==='categories' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
              <h1 style={{ fontWeight:800, fontSize:'1.5rem', color:'#1a1a2e' }}>Категории</h1>
              <button onClick={() => setEditCategory(null)}
                style={{ background:'#e53935', color:'#fff', border:'none', borderRadius:8, padding:'9px 18px', fontWeight:700, cursor:'pointer', display:'flex', gap:6, alignItems:'center' }}>
                <Plus size={16}/> Добавить категорию
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
              {categories.map(cat => (
                <div key={cat.id} style={{ background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
                  <img src={cat.image} alt={cat.name} style={{ width:'100%', height:90, objectFit:'cover' }}/>
                  <div style={{ padding:'11px 14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <span style={{ fontWeight:700, fontSize:'0.9rem', color:'#1a1a2e', display:'block' }}>{cat.name}</span>
                      <span style={{ fontSize:'0.72rem', color:'#888' }}>{cat.subCategories.length} подкатегорий</span>
                    </div>
                    <div style={{ display:'flex', gap:7 }}>
                      <button onClick={() => setEditCategory(cat)} style={{ background:'#e3f2fd', border:'none', borderRadius:6, padding:'5px 9px', cursor:'pointer', color:'#1565c0' }}><Pencil size={13}/></button>
                      <button onClick={async () => {
                        if (!confirm('Удалить?')) return;
                        await adminRequest<Category[]>(`categories&id=${cat.id}`, { method: 'DELETE' });
                        setData(prev => ({ ...prev, categories: prev.categories.filter(item => item.id !== cat.id) }));
                      }}
                        style={{ background:'#fce4e4', border:'none', borderRadius:6, padding:'5px 9px', cursor:'pointer', color:'#e53935' }}><Trash2 size={13}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {activePage==='reviews' && (
          <div>
            <h1 style={{ fontWeight:800, fontSize:'1.5rem', color:'#1a1a2e', marginBottom:22 }}>Отзывы ({reviews.length})</h1>
            <div style={{ background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead><tr style={{ background:'#f4f6fb' }}>
                  {['Товар','Покупатель','Оценка','Отзыв','Статус','Дата',''].map(h => (
                    <th key={h} style={{ padding:'11px 14px', textAlign:'left', fontSize:'0.76rem', fontWeight:700, color:'#666', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {reviews.map(review => {
                    const product = products.find(item => item.id === review.productId);
                    return (
                      <tr key={review.id} style={{ borderTop:'1px solid #f0f0f0' }}>
                        <td style={{ padding:'10px 14px', fontSize:'0.82rem', fontWeight:600, maxWidth:180 }}>{product?.title || review.productId}</td>
                        <td style={{ padding:'10px 14px', fontSize:'0.82rem' }}>
                          <div style={{ fontWeight:700 }}>{review.customerName}</div>
                          <div style={{ color:'#888', fontSize:'0.75rem' }}>{review.customerContact}</div>
                        </td>
                        <td style={{ padding:'10px 14px', color:'#f57c00', fontWeight:800 }}><Star size={14} fill="#f57c00" color="#f57c00"/> {review.rating}</td>
                        <td style={{ padding:'10px 14px', fontSize:'0.82rem', color:'#555', maxWidth:260 }}>{review.text}</td>
                        <td style={{ padding:'10px 14px', fontSize:'0.82rem', fontWeight:700 }}>{review.status}</td>
                        <td style={{ padding:'10px 14px', fontSize:'0.78rem', color:'#888' }}>{new Date(review.createdAt).toLocaleDateString('ru-RU')}</td>
                        <td style={{ padding:'10px 14px' }}>
                          <div style={{ display:'flex', gap:7 }}>
                            <button onClick={() => void handleUpdateReview(review, { status:'approved' })} style={{ background:'#e8f5e9', border:'none', borderRadius:6, padding:'5px 9px', cursor:'pointer', color:'#2e7d32', fontWeight:700 }}>OK</button>
                            <button onClick={() => void handleUpdateReview(review, { status:'rejected' })} style={{ background:'#fff8e1', border:'none', borderRadius:6, padding:'5px 9px', cursor:'pointer', color:'#f57c00', fontWeight:700 }}>Откл.</button>
                            <button onClick={() => void handleDeleteReview(review)} style={{ background:'#fce4e4', border:'none', borderRadius:6, padding:'5px 9px', cursor:'pointer', color:'#e53935' }}><Trash2 size={13}/></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {!reviews.length && (
                    <tr><td colSpan={7} style={{ padding:24, color:'#888', textAlign:'center' }}>Отзывов пока нет. Рейтинг товаров будет нулевым, пока покупатели не оставят отзывы.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activePage==='settings' && (
          <SettingsEditor settings={settings} saving={saving} onSave={handleSaveSettings} />
        )}

      </main>
    </div>
  );
}

