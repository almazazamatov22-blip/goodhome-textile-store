import { ShoppingCart, Star, Heart } from 'lucide-react';
import { type Product } from '../data/products';
import { useCart } from '../cartStore';
import { useFavorites } from '../data/favoritesContext';
import { useState } from 'react';
import { useShopData } from '../data/shopDataStore';

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { createReview } = useShopData();
  const favorite = isFavorite(product.id);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [review, setReview] = useState({ customerName: '', customerContact: '', rating: 5, text: '' });
  const [reviewSaving, setReviewSaving] = useState(false);

  const submitReview = async () => {
    if (!review.customerName.trim() || !review.customerContact.trim() || !review.text.trim()) {
      alert('Заполните имя, контакт и текст отзыва');
      return;
    }

    setReviewSaving(true);
    try {
      await createReview({
        productId: product.id,
        customerName: review.customerName.trim(),
        customerContact: review.customerContact.trim(),
        rating: review.rating,
        text: review.text.trim(),
      });
      setReviewOpen(false);
      setReview({ customerName: '', customerContact: '', rating: 5, text: '' });
      alert('Спасибо. Отзыв появится после проверки администратором.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Не удалось отправить отзыв');
    } finally {
      setReviewSaving(false);
    }
  };

  return (
    <>
    <div style={{
      background: '#fff', borderRadius: 12, overflow: 'hidden',
      border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column',
      transition: 'all 0.25s', cursor: 'pointer', position: 'relative'
    }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Badge */}
      {product.badge && (
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 2,
          background: product.badge === 'sale' ? '#e53935' : product.badge === 'new' ? '#43a047' : '#1565c0',
          color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase'
        }}>
          {product.badge === 'sale' ? 'Скидка' : product.badge === 'new' ? 'Новинка' : 'Хит'}
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(product.id);
        }}
        title={favorite ? 'Убрать из избранного' : 'Добавить в избранное'}
        aria-label={favorite ? 'Убрать из избранного' : 'Добавить в избранное'}
        style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, background: 'rgba(255,255,255,0.95)', border: favorite ? '1px solid #ffcdd2' : 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        <Heart size={16} color={favorite ? '#e53935' : '#999'} fill={favorite ? '#e53935' : 'none'} />
      </button>

      {/* Image */}
      <div style={{ height: 200, overflow: 'hidden', background: '#f9f9f9' }}>
        <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </div>

      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {product.reviews > 0 ? (
            <>
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={12} fill={s <= Math.round(product.rating) ? '#FFC107' : 'none'} color={s <= Math.round(product.rating) ? '#FFC107' : '#ddd'} />
              ))}
              <span style={{ fontSize: '0.72rem', color: '#999', marginLeft: 2 }}>{product.reviews}</span>
            </>
          ) : (
            <span style={{ fontSize: '0.72rem', color: '#999' }}>Нет отзывов</span>
          )}
        </div>

        {/* Title */}
        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1a1a2e', lineHeight: 1.3 }}>{product.title}</div>

        {/* Prices */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#e53935' }}>{product.price.toLocaleString()} ₸</span>
          {product.oldPrice && <span style={{ fontSize: '0.8rem', color: '#bbb', textDecoration: 'line-through' }}>{product.oldPrice.toLocaleString()} ₸</span>}
        </div>

        {/* Installment */}
        {product.installment && (
          <div style={{ fontSize: '0.72rem', color: '#43a047', fontWeight: 600 }}>
            Рассрочка: {product.installment.toLocaleString()} ₸/мес
          </div>
        )}

        {/* Add to cart */}
        <button onClick={(e) => { e.stopPropagation(); add(product); }}
          style={{ marginTop: 8, background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 0', width: '100%', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#c62828')}
          onMouseLeave={e => (e.currentTarget.style.background = '#e53935')}
        >
          <ShoppingCart size={16} /> В корзину
        </button>
        <button onClick={(e) => { e.stopPropagation(); setReviewOpen(true); }}
          style={{ background: 'transparent', border: 'none', color: '#1565c0', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: '2px 0 0' }}>
          Оставить отзыв
        </button>
      </div>
    </div>
    {reviewOpen && (
      <div onClick={() => setReviewOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div onClick={e => e.stopPropagation()} style={{ width: 420, maxWidth: '100%', background: '#fff', borderRadius: 12, padding: 22, boxShadow: '0 12px 40px rgba(0,0,0,0.18)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>Отзыв о товаре</h2>
          <p style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.45, marginBottom: 14 }}>{product.title}</p>
          <div style={{ display: 'grid', gap: 10 }}>
            <input value={review.customerName} onChange={e => setReview(v => ({ ...v, customerName: e.target.value }))} placeholder="Ваше имя"
              style={{ border: '1px solid #ddd', borderRadius: 8, padding: '10px 12px', outline: 'none' }} />
            <input value={review.customerContact} onChange={e => setReview(v => ({ ...v, customerContact: e.target.value }))} placeholder="Телефон или email для проверки"
              style={{ border: '1px solid #ddd', borderRadius: 8, padding: '10px 12px', outline: 'none' }} />
            <select value={review.rating} onChange={e => setReview(v => ({ ...v, rating: Number(e.target.value) }))}
              style={{ border: '1px solid #ddd', borderRadius: 8, padding: '10px 12px', outline: 'none' }}>
              {[5,4,3,2,1].map(value => <option key={value} value={value}>{value} из 5</option>)}
            </select>
            <textarea value={review.text} onChange={e => setReview(v => ({ ...v, text: e.target.value }))} rows={4} placeholder="Напишите отзыв"
              style={{ border: '1px solid #ddd', borderRadius: 8, padding: '10px 12px', outline: 'none', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button disabled={reviewSaving} onClick={() => void submitReview()} style={{ flex: 1, background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '11px', fontWeight: 800, cursor: reviewSaving ? 'not-allowed' : 'pointer' }}>
              {reviewSaving ? 'Отправляем...' : 'Отправить'}
            </button>
            <button onClick={() => setReviewOpen(false)} style={{ flex: 1, background: '#f4f6fb', color: '#555', border: 'none', borderRadius: 8, padding: '11px', fontWeight: 800, cursor: 'pointer' }}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
