import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { type Product, type Category } from '../data/products';
import { CATEGORY_FILTERS } from '../data/filters';
import { BarChart2, ShoppingBag, Tag, LogOut, Users, ShoppingCart, Package, Plus, Pencil, Trash2, X, Save, TrendingUp, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

interface AdminData {
  products: Product[];
  categories: Category[];
  orders: {
    id: string;
    userId: string | null;
    userName: string;
    items: { title: string; qty: number; price: number }[];
    total: number;
    status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
    date: string;
    address: string;
  }[];
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
}

const ADMIN_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin`;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const NAV = [
  { id: 'dashboard', label: 'Дашборд', icon: <BarChart2 size={18}/> },
  { id: 'orders', label: 'Заказы', icon: <Package size={18}/> },
  { id: 'users', label: 'Пользователи', icon: <Users size={18}/> },
  { id: 'products', label: 'Товары', icon: <ShoppingBag size={18}/> },
  { id: 'categories', label: 'Категории', icon: <Tag size={18}/> },
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

function ProductModal({ product, categories, saving, onSave, onClose }: { product: Partial<Product>|null; categories: Category[]; saving: boolean; onSave:(p:Product)=>Promise<void>; onClose:()=>void }) {
  const [form, setForm] = useState<Partial<Product>>(product || { title:'', category:'', subCategory:'', price:0, image:'', description:'', rating:5, reviews:0, stock:0, attributes: {} });
  
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
          {[{l:'Название',k:'title',t:'text'},{l:'URL изображения',k:'image',t:'text'},{l:'Цена (₸)',k:'price',t:'number'},{l:'Старая цена (₸)',k:'oldPrice',t:'number'},{l:'Наличие (шт)',k:'stock',t:'number'},{l:'Рейтинг',k:'rating',t:'number'},{l:'Отзывов',k:'reviews',t:'number'},{l:'Рассрочка (₸/мес)',k:'installment',t:'number'}].map(f => (
            <div key={f.k}>
              <label style={{ fontSize:'0.78rem', fontWeight:600, color:'#555', display:'block', marginBottom:4 }}>{f.l}</label>
              <input type={f.t} value={String(form[f.k as keyof Product] ?? '')} onChange={e => set(f.k as keyof Product, f.t==='number' ? +e.target.value : e.target.value)}
                style={{ width:'100%', border:'1px solid #ddd', borderRadius:7, padding:'7px 11px', fontSize:'0.88rem', outline:'none', boxSizing:'border-box' }}/>
            </div>
          ))}
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
        {form.image && <img src={form.image} alt="" onError={e => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = 'https://loremflickr.com/900/900/home,textile?lock=12002';
        }} style={{ width:'100%', height:100, objectFit:'cover', borderRadius:8, marginTop:10 }}/>}
        <button disabled={saving} onClick={() => onSave({...form, id:product?.id||Date.now(), subCategory: form.subCategory || selectedCat?.subCategories[0] || 'Разное', images:[form.image||'']} as Product)}
          style={{ marginTop:18, width:'100%', background:'#e53935', color:'#fff', border:'none', borderRadius:8, padding:'11px', fontWeight:700, fontSize:'0.95rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <Save size={17}/> {saving ? 'Сохраняем...' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}

export default function Admin() {
  const [page, setPage] = useState('dashboard');
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('goodhome_admin_key') || '');
  const [data, setData] = useState<AdminData>({ products: [], categories: [], orders: [], users: [] });
  const [editProduct, setEditProduct] = useState<Partial<Product>|null|undefined>(undefined);
  const [newCatName, setNewCatName] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { products, categories, orders, users } = data;

  const adminRequest = useCallback(async <T,>(resource: string, options: RequestInit = {}) => {
    const response = await fetch(`${ADMIN_ENDPOINT}?resource=${resource}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'x-admin-key': adminKey,
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      throw new Error(detail.error || `Admin API error ${response.status}`);
    }

    return response.json() as Promise<T>;
  }, [adminKey]);

  const loadAdminData = useCallback(async () => {
    if (!adminKey.trim()) return;
    setLoading(true);
    setError(null);
    try {
      sessionStorage.setItem('goodhome_admin_key', adminKey);
      setData(await adminRequest<AdminData>('all'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить админ-данные');
    } finally {
      setLoading(false);
    }
  }, [adminKey, adminRequest]);

  useEffect(() => {
    if (!adminKey) return;
    const timer = window.setTimeout(() => {
      void loadAdminData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [adminKey, loadAdminData]);

  const handleSaveProduct = async (product: Product) => {
    setSaving(true);
    try {
      const exists = products.some(item => item.id === product.id);
      const saved = await adminRequest<Product[]>(`products&id=${product.id}`, {
        method: exists ? 'PATCH' : 'POST',
        body: JSON.stringify(product),
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

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    const slug = newCatName.toLowerCase().trim().replace(/\s+/g, '-');
    const category = {
      id: Date.now(),
      name: newCatName.trim(),
      slug,
      image: 'https://loremflickr.com/900/900/home,textile?lock=12001',
      subCategories: [],
    };
    const saved = await adminRequest<Category[]>('categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
    setData(prev => ({ ...prev, categories: [...prev.categories, saved[0]] }));
    setNewCatName('');
  };

  const totalRevenue = orders.filter(o => o.status==='delivered').reduce((s,o) => s+o.total, 0);
  const inCart = users.reduce((s,u) => s+u.cartItems, 0);
  const inShipping = orders.filter(o => o.status==='shipping').length;
  const delivered = orders.filter(o => o.status==='delivered').length;
  const pending = orders.filter(o => o.status==='pending').length;

  const filteredOrders = orderFilter==='all' ? orders : orders.filter(o => o.status===orderFilter);

  const sideStyle = (id: string) => ({
    width:'100%', background: page===id ? 'rgba(229,57,53,0.12)' : 'none', border:'none',
    borderLeft: page===id ? '3px solid #e53935' : '3px solid transparent',
    color: page===id ? '#e53935' : '#aaa', padding:'11px 20px',
    display:'flex', gap:12, alignItems:'center', fontSize:'0.88rem',
    fontWeight: page===id ? 700 : 400, cursor:'pointer', textAlign:'left' as const, transition:'all 0.2s'
  });

  if (!adminKey || (error === 'Invalid admin key' && !products.length)) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f4f6fb', fontFamily:'Roboto,sans-serif', padding:20 }}>
        <div style={{ width:380, background:'#fff', borderRadius:14, padding:28, boxShadow:'0 10px 35px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize:'1.25rem', fontWeight:800, color:'#1a1a2e', marginBottom:10 }}>Админ-панель GOOD HOME</h1>
          <p style={{ color:'#777', fontSize:'0.88rem', lineHeight:1.5, marginBottom:18 }}>Введите ключ администратора. Все действия будут выполнены через Supabase на сервере.</p>
          <input type="password" value={adminKey} onChange={e => setAdminKey(e.target.value)} onKeyDown={e => e.key === 'Enter' && void loadAdminData()} placeholder="ADMIN_API_KEY"
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
        <ProductModal product={editProduct} categories={categories} saving={saving} onSave={handleSaveProduct} onClose={() => setEditProduct(undefined)}/>
      )}

      {/* Sidebar */}
      <aside style={{ width:230, background:'#1a1a2e', color:'#fff', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'22px 18px 18px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize:'1.3rem', fontWeight:900 }}>GOOD<span style={{ color:'#e53935' }}> HOME</span></div>
          <div style={{ fontSize:'0.68rem', color:'#555', marginTop:2 }}>Панель управления</div>
        </div>
        <nav style={{ flex:1, padding:'12px 0' }}>
          {NAV.map(n => (
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
        {page==='dashboard' && (
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
        {page==='orders' && (
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
                  {['ID','Покупатель','Товары','Сумма','Статус','Адрес','Дата'].map(h => (
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
                        <td style={{ padding:'10px 14px' }}>
                          <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:s.bg, color:s.color, fontSize:'0.72rem', fontWeight:700, padding:'3px 9px', borderRadius:20 }}>
                            {s.icon}{s.label}
                          </span>
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
        {page==='users' && (
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
        {page==='products' && (
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
                  {['Фото','Название','Категория','Цена','Наличие','Бейдж',''].map(h => (
                    <th key={h} style={{ padding:'11px 14px', textAlign:'left', fontSize:'0.76rem', fontWeight:700, color:'#666', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderTop:'1px solid #f0f0f0' }}>
                      <td style={{ padding:'9px 14px' }}><img src={p.image} alt="" onError={e => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://loremflickr.com/900/900/home,textile?lock=${p.id + 90000}`;
                      }} style={{ width:42, height:42, borderRadius:6, objectFit:'cover' }}/></td>
                      <td style={{ padding:'9px 14px', fontWeight:600, fontSize:'0.85rem', maxWidth:200 }}>{p.title}</td>
                      <td style={{ padding:'9px 14px', fontSize:'0.8rem', color:'#666' }}>{p.category}</td>
                      <td style={{ padding:'9px 14px', fontWeight:700, color:'#e53935' }}>{p.price.toLocaleString()} ₸</td>
                      <td style={{ padding:'9px 14px', fontSize:'0.83rem' }}>{p.stock} шт</td>
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
        {page==='categories' && (
          <div>
            <h1 style={{ fontWeight:800, fontSize:'1.5rem', color:'#1a1a2e', marginBottom:22 }}>Категории</h1>
            <div style={{ display:'flex', gap:10, marginBottom:22 }}>
              <input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Название новой категории"
                style={{ flex:1, border:'1px solid #ddd', borderRadius:8, padding:'9px 14px', fontSize:'0.9rem', outline:'none' }}/>
              <button onClick={() => void handleAddCategory()}
                style={{ background:'#e53935', color:'#fff', border:'none', borderRadius:8, padding:'9px 18px', fontWeight:700, cursor:'pointer', display:'flex', gap:6, alignItems:'center' }}>
                <Plus size={16}/> Добавить
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
              {categories.map(cat => (
                <div key={cat.id} style={{ background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
                  <img src={cat.image} alt={cat.name} onError={e => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://loremflickr.com/900/900/home,textile?lock=${cat.id + 80000}`;
                  }} style={{ width:'100%', height:90, objectFit:'cover' }}/>
                  <div style={{ padding:'11px 14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontWeight:700, fontSize:'0.9rem', color:'#1a1a2e' }}>{cat.name}</span>
                    <button onClick={async () => {
                      if (!confirm('Удалить?')) return;
                      await adminRequest<Category[]>(`categories&id=${cat.id}`, { method: 'DELETE' });
                      setData(prev => ({ ...prev, categories: prev.categories.filter(item => item.id !== cat.id) }));
                    }}
                      style={{ background:'#fce4e4', border:'none', borderRadius:6, padding:'5px 9px', cursor:'pointer', color:'#e53935' }}><Trash2 size={13}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
