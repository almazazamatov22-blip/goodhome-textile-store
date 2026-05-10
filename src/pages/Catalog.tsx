import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../data/products';
import { CATEGORY_FILTERS } from '../data/filters';
import ProductCard from '../components/ProductCard';
import { ChevronRight } from 'lucide-react';

export default function Catalog() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const allProducts = getProducts();
  const categories = getCategories();
  const currentCat = categories.find(c => c.slug === slug);

  const [activeSubCat, setActiveSubCat] = useState<string>('');
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(200000);
  const [sort, setSort] = useState('popular');

  // Dynamic filter state: key -> array of selected values
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[key] || [];
      const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const currentFilterDefs = currentCat ? CATEGORY_FILTERS[currentCat.slug] || [] : [];

  const filtered = allProducts
    .filter(p => !currentCat || p.category === currentCat.name)
    .filter(p => !activeSubCat || p.subCategory === activeSubCat)
    .filter(p => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => p.price >= priceFrom && p.price <= priceTo)
    .filter(p => {
      for (const [key, selectedValues] of Object.entries(activeFilters)) {
        if (selectedValues.length === 0) continue;

        const pAttr = p.attributes?.[key];
        if (!pAttr) return false;

        if (Array.isArray(pAttr)) {
          if (!selectedValues.some(val => pAttr.includes(val))) return false;
        } else {
          if (!selectedValues.includes(pAttr)) return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  const pageTitle = searchQuery ? `Поиск: "${searchQuery}"` : currentCat ? currentCat.name : 'Все товары';

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#999', marginBottom: 20 }}>
        <a href="/" style={{ color: '#e53935', textDecoration: 'none' }}>Главная</a>
        <ChevronRight size={14} />
        {currentCat && <span style={{ color: '#333' }}>{currentCat.name}</span>}
        {searchQuery && <span style={{ color: '#333' }}>Результаты поиска</span>}
      </div>

      {/* Page title */}
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1a1a2e', marginBottom: 16 }}>{pageTitle}</h1>

      {/* SubCategory chips */}
      {currentCat && currentCat.subCategories.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          <button
            onClick={() => setActiveSubCat('')}
            style={{ padding: '6px 16px', borderRadius: 20, border: `1px solid ${!activeSubCat ? '#e53935' : '#ddd'}`, background: !activeSubCat ? '#e53935' : '#fff', color: !activeSubCat ? '#fff' : '#333', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s' }}
          >Все</button>
          {currentCat.subCategories.map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubCat(activeSubCat === sub ? '' : sub)}
              style={{ padding: '6px 16px', borderRadius: 20, border: `1px solid ${activeSubCat === sub ? '#e53935' : '#ddd'}`, background: activeSubCat === sub ? '#e53935' : '#fff', color: activeSubCat === sub ? '#fff' : '#333', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s' }}
            >{sub}</button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Left Sidebar Filters */}
        <aside style={{ width: 220, flex: '1 1 220px', maxWidth: 280 }}>
          {/* Price filter */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid #f0f0f0', marginBottom: 12 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.95rem', color: '#1a1a2e' }}>Цена (₸)</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input type="number" value={priceFrom} onChange={e => setPriceFrom(+e.target.value)} placeholder="от"
                style={{ width: '50%', border: '1px solid #ddd', borderRadius: 6, padding: '5px 8px', fontSize: '0.82rem', outline: 'none' }} />
              <input type="number" value={priceTo} onChange={e => setPriceTo(+e.target.value)} placeholder="до"
                style={{ width: '50%', border: '1px solid #ddd', borderRadius: 6, padding: '5px 8px', fontSize: '0.82rem', outline: 'none' }} />
            </div>
            <input type="range" min={0} max={200000} value={priceTo} onChange={e => setPriceTo(+e.target.value)}
              style={{ width: '100%', accentColor: '#e53935' }} />
          </div>

          {/* Dynamic Attributes Filters */}
          {currentFilterDefs.map(filter => (
            <div key={filter.key} style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid #f0f0f0', marginBottom: 12 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.95rem', color: '#1a1a2e' }}>{filter.label}</h3>
              {filter.type === 'chips' ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {filter.options?.map(opt => {
                    const isActive = (activeFilters[filter.key] || []).includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => toggleFilter(filter.key, opt.value)}
                        style={{
                          padding: '4px 10px', borderRadius: 16, fontSize: '0.75rem', cursor: 'pointer',
                          background: isActive ? '#e53935' : '#f5f5f5', color: isActive ? '#fff' : '#333',
                          border: `1px solid ${isActive ? '#e53935' : '#eee'}`,
                        }}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div style={{ maxHeight: 150, overflowY: 'auto' }}>
                  {filter.options?.map(opt => {
                    const isActive = (activeFilters[filter.key] || []).includes(opt.value);
                    return (
                      <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: '0.85rem' }}>
                        <input type="checkbox" checked={isActive} onChange={() => toggleFilter(filter.key, opt.value)}
                          style={{ accentColor: '#e53935', width: 15, height: 15 }} />
                        {opt.label}
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Categories Nav (fallback if no category selected) */}
          {!currentCat && (
            <div style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid #f0f0f0' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.95rem', color: '#1a1a2e' }}>Категории</h3>
              {categories.map(c => (
                <a key={c.id} href={`/catalog/${c.slug}`}
                  style={{ display: 'block', padding: '5px 0', fontSize: '0.85rem', color: '#333', textDecoration: 'none', borderBottom: '1px solid #f5f5f5' }}>
                  {c.name}
                </a>
              ))}
            </div>
          )}
        </aside>

        {/* Products */}
        <div style={{ flex: '999 1 620px', minWidth: 0 }}>
          {/* Sort row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ color: '#666', fontSize: '0.88rem' }}>Найдено: <b style={{ color: '#1a1a2e' }}>{filtered.length}</b> товаров</span>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ border: '1px solid #ddd', borderRadius: 8, padding: '6px 12px', fontSize: '0.82rem', outline: 'none', cursor: 'pointer' }}>
              <option value="popular">По популярности</option>
              <option value="rating">По рейтингу</option>
              <option value="price_asc">Сначала дешевле</option>
              <option value="price_desc">Сначала дороже</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Ничего не найдено</div>
              <div style={{ fontSize: '0.85rem', marginTop: 6 }}>Попробуйте изменить фильтры</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
