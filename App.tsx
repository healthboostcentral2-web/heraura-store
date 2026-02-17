import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Product, Category } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { db } from './lib/db';
import { Button } from './components/Button';
import { WifiOff } from 'lucide-react';

// Lazy Load Pages
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const CategoryPage = React.lazy(() => import('./pages/Category').then(module => ({ default: module.CategoryPage })));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail').then(module => ({ default: module.ProductDetail })));
const Cart = React.lazy(() => import('./pages/Cart').then(module => ({ default: module.Cart })));
const Checkout = React.lazy(() => import('./pages/Checkout').then(module => ({ default: module.Checkout })));
const Login = React.lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const OrderTracking = React.lazy(() => import('./pages/OrderTracking').then(module => ({ default: module.OrderTracking })));
const OrderSuccess = React.lazy(() => import('./pages/OrderSuccess').then(module => ({ default: module.OrderSuccess })));
const Admin = React.lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })));
const Wishlist = React.lazy(() => import('./pages/Wishlist').then(module => ({ default: module.Wishlist })));
const Search = React.lazy(() => import('./pages/Search').then(module => ({ default: module.Search })));

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 gap-4">
     <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
     <p className="text-stone-400 text-xs font-bold uppercase tracking-widest animate-pulse">HerAura</p>
  </div>
);

const App: React.FC = () => {
  const location = useLocation();
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize DB and Fetch Data
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        db.getProducts(),
        db.getCategories()
      ]);
      setProducts(fetchedProducts || []);
      setCategories(fetchedCategories || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Unable to load application data. Please check your connection.");
    }
  }, []);

  useEffect(() => {
    const init = async () => {
        setIsLoading(true);
        await fetchData();
        setIsLoading(false);
    }
    init();
  }, [fetchData]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-6 text-center">
              <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mb-6 text-stone-500">
                  <WifiOff size={32} />
              </div>
              <h2 className="font-serif text-2xl text-stone-900 mb-2">Connection Error</h2>
              <p className="text-stone-500 mb-8 max-w-xs">{error}</p>
              <Button onClick={() => { setIsLoading(true); fetchData().then(() => setIsLoading(false)); }}>
                  Try Again
              </Button>
          </div>
      );
  }

  const hideBottomNav = 
    location.pathname.startsWith('/product/') || 
    location.pathname === '/cart' || 
    location.pathname === '/checkout' || 
    location.pathname === '/success' ||
    location.pathname === '/login' || 
    location.pathname === '/admin';

  return (
    <div className="min-h-screen bg-stone-100 font-sans flex justify-center">
      <div className="w-full max-w-md bg-stone-50 min-h-screen shadow-2xl relative overflow-hidden">
        {location.pathname !== '/login' && location.pathname !== '/admin' && location.pathname !== '/success' && (
            <Navbar 
                products={products}
                categories={categories}
            />
        )}
        <main className="relative z-0">
          <Suspense fallback={<LoadingScreen />}>
             <Routes>
                <Route path="/" element={<Home products={products} categories={categories} />} />
                <Route path="/categories" element={<CategoryPage products={products} categories={categories} />} />
                <Route path="/product/:id" element={<ProductDetail allProducts={products} />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/success" element={<OrderSuccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Dashboard />} />
                <Route path="/tracking" element={<OrderTracking />} />
                <Route path="/admin" element={<Admin onDataChange={fetchData} />} />
                <Route path="/wishlist" element={<Wishlist products={products} />} />
                <Route path="/search" element={<Search products={products} />} />
                <Route path="*" element={<Home products={products} categories={categories} />} />
             </Routes>
          </Suspense>
        </main>
        {!hideBottomNav && (
          <BottomNav />
        )}
      </div>
    </div>
  );
};

export default App;