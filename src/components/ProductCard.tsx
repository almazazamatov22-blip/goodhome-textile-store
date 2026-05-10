import { ShoppingCart, Star, Heart } from 'lucide-react';
import { type Product } from '../data/products';
import { useCart } from '../cartStore';

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
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
      <button style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <Heart size={16} color="#999" />
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
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={12} fill={s <= Math.round(product.rating) ? '#FFC107' : 'none'} color={s <= Math.round(product.rating) ? '#FFC107' : '#ddd'} />
          ))}
          <span style={{ fontSize: '0.72rem', color: '#999', marginLeft: 2 }}>{product.reviews}</span>
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
      </div>
    </div>
  );
}
