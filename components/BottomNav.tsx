import React from 'react';
import { Home, Grid, Heart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid, label: 'Shop', path: '/categories' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist' }, 
    { icon: User, label: 'Profile', path: '/profile' }, 
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 z-50 bg-white border-t border-stone-100 pb-safe">
      <div className="flex justify-around items-center px-2 py-3">
        {navItems.map((item) => {
          // Check for active state: exact match or sub-paths for Shop
          const isActive = location.pathname === item.path || (item.path === '/categories' && location.pathname.startsWith('/categories'));
          
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
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