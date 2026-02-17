import React from 'react';
import { Home, Grid, Heart, User } from 'lucide-react';
import { View } from '../types';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { icon: Home, label: 'Home', view: View.HOME },
    { icon: Grid, label: 'Shop', view: View.CATEGORY },
    { icon: Heart, label: 'Wishlist', view: View.WISHLIST }, 
    { icon: User, label: 'Profile', view: View.DASHBOARD }, 
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 z-50 bg-white border-t border-stone-100 pb-safe">
      <div className="flex justify-around items-center px-2 py-3">
        {navItems.map((item) => {
          const isActive = currentView === item.view || (currentView === View.PRODUCT && item.view === View.CATEGORY);
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-16 ${
                isActive ? 'text-rose-900' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <item.icon 
                size={24} 
                strokeWidth={isActive ? 2 : 1.5} 
                fill={isActive && item.label === 'Wishlist' ? 'currentColor' : 'none'}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-0 scale-0'} transition-all duration-300`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};