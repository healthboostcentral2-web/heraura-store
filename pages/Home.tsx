import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { Product, Category } from '../types';
import { ArrowRight, Clock, ShieldCheck, Truck, RefreshCcw, Eye, ShoppingBag } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  products: Product[];
  categories: Category[];
}

export const Home: React.FC<HomeProps> = ({ products, categories }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  // Empty State Handling
  if (products.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-stone-50 text-center animate-fade-in">
        <SEO title="Coming Soon" />
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-rose-300" />
        </div>
        <h1 className="font-serif text-3xl text-stone-900 mb-3">Our Collection is Arriving Soon</h1>
        <p className="text-stone-500 max-w-sm mb-8">
          We are currently stocking our shelves with the finest fashion. Please check back later for our grand opening.
        </p>
        <Button onClick={() => navigate('/admin')} variant="outline">
           Access Admin Panel
        </Button>
      </div>
    );
  }

  const BEST_SELLERS = products.slice(0, 4);
  const NEW_ARRIVALS = products.slice(0, 4);
  const RECENTLY_VIEWED = products.slice(0, 4);

  return (
    <div className="pb-24 animate-fade-in bg-stone-50">
      <SEO title="HerAura" description="Discover the new season's most coveted styles, designed for the modern muse." />
      
      {/* Hero Slider */}
      <section className="relative h-[600px] w-full overflow-hidden bg-stone-200">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-stone-300 flex items-center justify-center">
             <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000" 
                alt="Hero" 
                className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 pb-12 text-white space-y-5">
          <div className="flex gap-2 mb-2">
            <span className="h-1 w-8 bg-white rounded-full transition-all"></span>
            <span className="h-1 w-2 bg-white/50 rounded-full transition-all"></span>
            <span className="h-1 w-2 bg-white/50 rounded-full transition-all"></span>
          </div>
          
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest border border-white/30">
            New Collection
          </span>
          
          <h2 className="font-serif text-5xl leading-tight">
            Bloom in <br/><span className="italic font-light text-rose-200">Confidence</span>
          </h2>
          
          <p className="text-stone-200 max-w-xs text-sm font-light">
            Discover the new season's most coveted styles, designed for the modern muse.
          </p>
          
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => navigate('/categories')}>Shop New In</Button>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-6 px-6 border-b border-stone-100 overflow-x-auto no-scrollbar">
        <div className="flex justify-between min-w-max gap-8 text-stone-600">
          <div className="flex items-center gap-2">
            <Truck size={20} className="text-rose-400" />
            <span className="text-xs font-bold uppercase tracking-wide">Free Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-rose-400" />
            <span className="text-xs font-bold uppercase tracking-wide">Secure Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCcw size={20} className="text-rose-400" />
            <span className="text-xs font-bold uppercase tracking-wide">Free Returns</span>
          </div>
        </div>
      </section>

      {/* Trending Categories (Icons) */}
      {categories.length > 0 && (
          <section className="py-10">
            <div className="px-6 mb-6 flex justify-between items-end">
              <h3 className="font-serif text-2xl text-stone-900">Trending Now</h3>
            </div>
            <div className="flex gap-6 overflow-x-auto no-scrollbar px-6 pb-2">
              {categories.map(cat => (
                <button 
                    key={cat.id} 
                    className="flex-shrink-0 flex flex-col items-center gap-3 group cursor-pointer focus:outline-none" 
                    onClick={() => navigate('/categories')}
                >
                  <div className="w-20 h-20 rounded-full p-[2px] border border-rose-200 group-hover:border-rose-400 transition-all">
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                       <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors" />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">{cat.name}</span>
                </button>
              ))}
            </div>
          </section>
      )}

      {/* Flash Sale */}
      <section className="mx-4 mb-12 bg-stone-900 rounded-3xl overflow-hidden relative text-white shadow-xl shadow-rose-900/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 p-8">
            <div className="flex items-center gap-2 text-rose-300 mb-2">
                <Clock size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Flash Sale Ends In</span>
            </div>
            
            <div className="flex gap-3 my-6">
                {['Hours', 'Minutes', 'Seconds'].map((label, i) => {
                    const val = i === 0 ? timeLeft.hours : i === 1 ? timeLeft.minutes : timeLeft.seconds;
                    return (
                        <div key={label} className="text-center">
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 mb-1">
                                <span className="font-serif text-2xl">{String(val).padStart(2, '0')}</span>
                            </div>
                            <span className="text-[10px] text-stone-400 uppercase">{label}</span>
                        </div>
                    );
                })}
            </div>

            <h3 className="font-serif text-3xl mb-4 leading-tight">Up to 50% Off<br/>Selected Items</h3>
            <Button variant="secondary" className="w-full shadow-none" onClick={() => navigate('/categories')}>Shop The Sale</Button>
        </div>
      </section>

      {/* New Arrivals */}
      {NEW_ARRIVALS.length > 0 && (
          <section className="px-6 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl text-stone-900">New Arrivals</h3>
              <button className="p-2 bg-white border border-stone-200 rounded-full hover:bg-stone-50 transition-colors shadow-sm" onClick={() => navigate('/categories')}>
                 <ArrowRight size={18} className="text-stone-600" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              {NEW_ARRIVALS.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={handleProductClick}
                />
              ))}
            </div>
          </section>
      )}

      {/* Best Sellers Scroll */}
      {BEST_SELLERS.length > 0 && (
          <section className="mb-12 bg-rose-50/50 py-10 border-y border-rose-100/50">
            <div className="px-6 mb-6">
                <h3 className="font-serif text-2xl text-stone-900 mb-1">Best Sellers</h3>
                <p className="text-sm text-stone-500">Loved by women everywhere</p>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-6">
                {BEST_SELLERS.map(product => (
                    <div key={product.id} className="w-[160px] flex-shrink-0">
                        <ProductCard product={product} onClick={handleProductClick} />
                    </div>
                ))}
            </div>
          </section>
      )}

      {/* Recently Viewed */}
      {RECENTLY_VIEWED.length > 0 && (
          <section className="mb-12 px-6">
            <div className="flex items-center gap-2 mb-6">
                <Eye size={20} className="text-rose-400" />
                <h3 className="font-serif text-2xl text-stone-900">Recently Viewed</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                {RECENTLY_VIEWED.map(product => (
                     <div key={product.id} className="flex-shrink-0 w-[140px] group cursor-pointer" onClick={() => handleProductClick(product)}>
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2 bg-stone-100">
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <h4 className="text-xs font-bold text-stone-900 truncate">{product.name}</h4>
                        <p className="text-xs text-stone-500">${product.price}</p>
                     </div>
                ))}
            </div>
          </section>
      )}
      
      {/* Footer */}
      <footer className="px-6 py-10 bg-white border-t border-stone-100 text-center">
        <h1 className="font-serif text-2xl font-bold text-stone-900 mb-6">HerAura</h1>
        <p className="text-stone-300 text-xs">© 2024 HerAura Fashion. All rights reserved.</p>
      </footer>
    </div>
  );
};