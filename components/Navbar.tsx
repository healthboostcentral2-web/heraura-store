import React from 'react';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, cartCount }) => {
  const isHome = currentView === View.HOME;

  return (
    <nav className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-100 px-6 py-4 flex items-center justify-between transition-all">
      <div className="flex items-center gap-4">
        {isHome ? (
          <button className="p-2 -ml-2 text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-100">
             <Menu size={24} strokeWidth={1.5} />
          </button>
        ) : (
          <button 
            onClick={() => onNavigate(View.HOME)}
            className="p-2 -ml-2 text-stone-600 hover:text-stone-900"
          >
            <span className="font-serif italic">Back</span>
          </button>
        )}
      </div>

      <div 
        className="absolute left-1/2 -translate-x-1/2 cursor-pointer" 
        onClick={() => onNavigate(View.HOME)}
      >
        <h1 className="font-serif text-2xl font-semibold text-stone-900 tracking-tight">
          HerAura
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-100">
          <Search size={24} strokeWidth={1.5} />
        </button>
        <button 
          onClick={() => onNavigate(View.CART)}
          className="p-2 text-stone-600 hover:text-stone-900 relative rounded-full hover:bg-stone-100"
        >
          <ShoppingBag size={24} strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-400 text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};