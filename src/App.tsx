
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import { FavoritesProvider } from './data/favoritesStore';
import { ShopDataProvider } from './data/ShopDataProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import InfoPage from './pages/InfoPage';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f4f6fb' }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <FavoritesProvider>
        <ShopDataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/catalog/:slug" element={<Catalog />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/about" element={<InfoPage path="/about" />} />
                    <Route path="/delivery-payment" element={<InfoPage path="/delivery-payment" />} />
                    <Route path="/exchange-return" element={<InfoPage path="/exchange-return" />} />
                    <Route path="/quality-guarantee" element={<InfoPage path="/quality-guarantee" />} />
                    <Route path="/contacts" element={<InfoPage path="/contacts" />} />
                  </Routes>
                </Layout>
              } />
            </Routes>
          </BrowserRouter>
        </ShopDataProvider>
      </FavoritesProvider>
    </CartProvider>
  );
}
