import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { View, Product, CartItem, Category, Order } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { db } from './lib/db';
import { Button } from './components/Button';
import { WifiOff } from 'lucide-react';

// Lazy Load Pages for Performance
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

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 gap-4">
     <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
     <p className="text-stone-400 text-xs font-bold uppercase tracking-widest animate-pulse">HerAura</p>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
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
      setCart(db.getCart() || []);
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

  const handleNavigate = (view: View) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    handleNavigate(View.PRODUCT);
  };

  const handleAddToCart = async (newItem: CartItem) => {
    const existingItemIndex = cart.findIndex(
      item => 
        item.id === newItem.id && 
        item.selectedSize === newItem.selectedSize && 
        item.selectedColor.name === newItem.selectedColor.name
    );

    let updatedCart;
    if (existingItemIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + newItem.quantity
      };
    } else {
      updatedCart = [...cart, newItem];
    }
    
    setCart(updatedCart);
    await db.saveCart(updatedCart);
  };

  const handleUpdateQuantity = async (id: string, delta: number) => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
    await db.saveCart(updatedCart);
  };

  const handleRemoveItem = async (id: string) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    await db.saveCart(updatedCart);
  };

  const handleOrderComplete = (order: Order) => {
    setLastOrder(order);
    setCart([]);
    handleNavigate(View.ORDER_SUCCESS);
  };

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

  const renderView = () => {
    switch (currentView) {
      case View.HOME:
        return <Home onNavigate={handleNavigate} onProductClick={handleProductClick} products={products} categories={categories} />;
      case View.CATEGORY:
        return <CategoryPage onProductClick={handleProductClick} products={products} categories={categories} />;
      case View.PRODUCT:
        return (
          <ProductDetail 
            product={selectedProduct} 
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
            allProducts={products}
            onProductClick={handleProductClick}
          />
        );
      case View.CART:
        return (
          <Cart 
            cart={cart} 
            onNavigate={handleNavigate} 
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        );
      case View.CHECKOUT:
        return <Checkout onNavigate={handleNavigate} onOrderComplete={handleOrderComplete} />;
      case View.ORDER_SUCCESS:
        return <OrderSuccess order={lastOrder} onNavigate={handleNavigate} />;
      case View.LOGIN:
        return <Login onNavigate={handleNavigate} />;
      case View.DASHBOARD:
        return <Dashboard onNavigate={handleNavigate} />;
      case View.ORDER_TRACKING:
        return <OrderTracking onNavigate={handleNavigate} />;
      case View.ADMIN:
        return <Admin onNavigate={handleNavigate} onDataChange={fetchData} />;
      default:
        return <Home onNavigate={handleNavigate} onProductClick={handleProductClick} products={products} categories={categories} />;
    }
  };

  const hideBottomNav = 
    currentView === View.PRODUCT || 
    currentView === View.CART || 
    currentView === View.CHECKOUT || 
    currentView === View.ORDER_SUCCESS ||
    currentView === View.LOGIN || 
    currentView === View.ADMIN;

  return (
    <div className="min-h-screen bg-stone-100 font-sans flex justify-center">
      <div className="w-full max-w-md bg-stone-50 min-h-screen shadow-2xl relative overflow-hidden">
        {currentView !== View.LOGIN && currentView !== View.ADMIN && currentView !== View.ORDER_SUCCESS && (
            <Navbar 
            currentView={currentView} 
            onNavigate={handleNavigate} 
            cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
            />
        )}
        <main className="relative z-0">
          <Suspense fallback={<LoadingScreen />}>
             {renderView()}
          </Suspense>
        </main>
        {!hideBottomNav && (
          <BottomNav currentView={currentView} onNavigate={handleNavigate} />
        )}
      </div>
    </div>
  );
};

export default App;