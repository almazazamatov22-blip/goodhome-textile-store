import { Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../data/favoritesContext';
import { useShopData } from '../data/shopDataStore';

export default function Favorites() {
  const { favoriteIds, clearFavorites } = useFavorites();
  const { products, loading } = useShopData();
  const favorites = products.filter((product) => favoriteIds.includes(product.id));

  if (!favorites.length) {
    return (
      <div style={{ maxWidth: 1280, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <Heart size={64} color="#e5e5e5" style={{ marginBottom: 16 }} />
        <h1 style={{ color: '#1a1a2e', fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>Избранное пусто</h1>
        <p style={{ color: '#777', fontSize: '0.95rem', marginBottom: 22 }}>
          {loading ? 'Загружаем товары...' : 'Нажмите на сердечко в карточке товара, чтобы сохранить его здесь.'}
        </p>
        <a href="/catalog" style={{ display: 'inline-block', background: '#e53935', color: '#fff', padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>
          Перейти в каталог
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '30px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1a1a2e', marginBottom: 6 }}>Избранное</h1>
          <p style={{ color: '#777', fontSize: '0.92rem' }}>Сохранено товаров: {favorites.length}</p>
        </div>
        <button onClick={clearFavorites} style={{ border: '1px solid #ddd', background: '#fff', color: '#555', borderRadius: 8, padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}>
          Очистить
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {favorites.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}
