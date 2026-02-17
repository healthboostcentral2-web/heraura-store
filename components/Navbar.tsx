import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, ChevronRight, User, Heart, Zap, TrendingUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Product, Category } from '../types';

interface NavbarProps {
  cartCount: number;
  products: Product[];
  categories: Category[];
}

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount,
  products = [],
  categories = []
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lock body scroll only for menu
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const handleNavigateAndClose = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-100 px-6 py-4 flex items-center justify-between transition-all">
        <div className="flex items-center gap-4">
          {isHome ? (
            <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-2 -ml-2 text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
            >
               <Menu size={24} strokeWidth={1.5} />
            </button>
          ) : (
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-stone-600 hover:text-stone-900"
            >
              <span className="font-serif italic">Back</span>
            </button>
          )}
        </div>

        <div 
          className="absolute left-1/2 -translate-x-1/2 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <h1 className="font-serif text-2xl font-semibold text-stone-900 tracking-tight">
            HerAura
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/search')}
            className="p-2 text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
          >
            <Search size={24} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => navigate('/cart')}
            className="p-2 text-stone-600 hover:text-stone-900 relative rounded-full hover:bg-stone-100 transition-colors"
          >
            <ShoppingBag size={24} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-400 text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* --- Side Menu Drawer --- */}
      <div className={`fixed inset-0 z-[60] pointer-events-none`}>
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity duration-500 pointer-events-auto ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div className={`absolute top-0 left-0 h-full w-[80%] max-w-sm bg-stone-50 shadow-2xl transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) pointer-events-auto flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className="p-6 flex justify-between items-center border-b border-stone-100">
                  <h2 className="font-serif text-2xl font-bold text-stone-900">HerAura</h2>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2 text-stone-400 hover:text-stone-900">
                      <X size={24} />
                  </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-4">
                  <nav className="px-6 space-y-2">
                      <button onClick={() => handleNavigateAndClose('/')} className="w-full text-left py-4 text-lg font-serif text-stone-900 border-b border-stone-100 hover:text-rose-500 transition-colors">
                          Home
                      </button>
                      <button onClick={() => handleNavigateAndClose('/categories')} className="w-full text-left py-4 text-lg font-serif text-stone-900 border-b border-stone-100 hover:text-rose-500 transition-colors">
                          Shop All Categories
                      </button>
                      
                      {/* Featured Links */}
                      <button onClick={() => handleNavigateAndClose('/categories')} className="w-full flex items-center justify-between py-4 text-stone-600 border-b border-stone-100 group">
                          <span className="flex items-center gap-3"><Zap size={18} className="text-stone-400 group-hover:text-rose-500"/> New Arrivals</span>
                          <ChevronRight size={16} className="text-stone-300 group-hover:text-rose-500" />
                      </button>
                      <button onClick={() => handleNavigateAndClose('/categories')} className="w-full flex items-center justify-between py-4 text-stone-600 border-b border-stone-100 group">
                          <span className="flex items-center gap-3"><TrendingUp size={18} className="text-stone-400 group-hover:text-rose-500"/> Best Sellers</span>
                          <ChevronRight size={16} className="text-stone-300 group-hover:text-rose-500" />
                      </button>
                  </nav>

                  {/* Categories Grid */}
                  <div className="px-6 mt-8">
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Collections</p>
                      <div className="grid grid-cols-2 gap-3">
                          {categories.slice(0, 4).map(cat => (
                              <button 
                                key={cat.id}
                                onClick={() => handleNavigateAndClose('/categories')}
                                className="bg-white p-3 rounded-xl border border-stone-100 shadow-sm text-center hover:border-rose-200 transition-colors"
                              >
                                  <span className="text-sm font-bold text-stone-700">{cat.name}</span>
                              </button>
                          ))}
                      </div>
                  </div>
              </div>

              <div className="p-6 border-t border-stone-100 bg-white">
                   <button onClick={() => handleNavigateAndClose('/profile')} className="flex items-center gap-3 text-stone-900 font-bold hover:text-rose-600 transition-colors mb-4">
                       <User size={20} /> My Profile
                   </button>
                   <button onClick={() => handleNavigateAndClose('/wishlist')} className="flex items-center gap-3 text-stone-900 font-bold hover:text-rose-600 transition-colors">
                       <Heart size={20} /> My Wishlist
                   </button>
              </div>
          </div>
      </div>
    </>
  );
};