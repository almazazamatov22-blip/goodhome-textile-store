import { useState } from 'react';
import { useCart } from '../cartStore';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useShopData } from '../data/shopDataStore';

export default function Cart() {
  const { items, remove, clear, total } = useCart();
  const { createOrder } = useShopData();
  const [form, setForm] = useState({ name: '', phone: '', address: 'Астана, ' });
  const [saving, setSaving] = useState(false);

  const submitOrder = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      alert('Заполните имя, телефон и адрес доставки');
      return;
    }

    setSaving(true);
    try {
      const id = `ORD-${Date.now()}`;
      await createOrder({
        id,
        userId: null,
        userName: form.name.trim(),
        items: items.map(item => ({ title: item.title, qty: item.qty, price: item.price })),
        total,
        status: 'pending',
        date: new Date().toISOString().slice(0, 10),
        address: `${form.address.trim()}; тел. ${form.phone.trim()}`,
      });
      clear();
      alert(`Заказ ${id} создан`);
    } finally {
      setSaving(false);
    }
  };

  if (!items.length) return (
    <div style={{ maxWidth: 1280, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
      <ShoppingBag size={64} color="#ddd" style={{ marginBottom: 16 }} />
      <h2 style={{ color: '#999', fontWeight: 600 }}>Корзина пуста</h2>
      <a href="/" style={{ display: 'inline-block', marginTop: 20, background: '#e53935', color: '#fff', padding: '12px 32px', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>Перейти в каталог</a>
    </div>
  );
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '30px 20px', display: 'flex', gap: 30, flexWrap: 'wrap' }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ fontWeight: 800, color: '#1a1a2e', marginBottom: 24 }}>Корзина ({items.length})</h1>
        {items.map(item => (
          <div key={item.id} style={{ background: '#fff', borderRadius: 12, padding: 20, display: 'flex', gap: 16, marginBottom: 12, border: '1px solid #f0f0f0' }}>
            <img src={item.image} alt={item.title} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
              <div style={{ color: '#e53935', fontWeight: 800, fontSize: '1.1rem' }}>{item.price.toLocaleString()} ₸</div>
            </div>
            <button onClick={() => remove(item.id)} style={{ background: '#fce4e4', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', color: '#e53935' }}><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
      <div style={{ width: 320, flex: '1 1 320px', maxWidth: 420 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #f0f0f0', position: 'sticky', top: 100 }}>
          <h2 style={{ fontWeight: 800, marginBottom: 20 }}>Итого</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: '1.1rem' }}>
            <span>Сумма:</span><span style={{ fontWeight: 800, color: '#e53935' }}>{total.toLocaleString()} ₸</span>
          </div>
          <div style={{ display: 'grid', gap: 10, marginBottom: 14 }}>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Имя"
              style={{ border:'1px solid #ddd', borderRadius:8, padding:'10px 12px', fontSize:'0.9rem', outline:'none' }} />
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+7 702 379 72 33"
              style={{ border:'1px solid #ddd', borderRadius:8, padding:'10px 12px', fontSize:'0.9rem', outline:'none' }} />
            <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Адрес доставки"
              style={{ border:'1px solid #ddd', borderRadius:8, padding:'10px 12px', fontSize:'0.9rem', outline:'none' }} />
          </div>
          <button disabled={saving} onClick={() => void submitOrder()} style={{ width: '100%', background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '14px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginBottom: 10 }}>
            {saving ? 'Создаем заказ...' : 'Оформить заказ'}
          </button>
          <button onClick={clear} style={{ width: '100%', background: '#f4f4f4', color: '#666', border: 'none', borderRadius: 8, padding: '10px', fontWeight: 600, cursor: 'pointer' }}>Очистить корзину</button>
        </div>
      </div>
    </div>
  );
}
