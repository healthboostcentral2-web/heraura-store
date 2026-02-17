import React from 'react';
import { Button } from '../components/Button';
import { ArrowLeft, Package, Heart, MapPin, Settings, LogOut, ChevronRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
      logout();
      navigate('/');
  };

  const MENU_ITEMS = [
    { icon: Package, label: 'My Orders', desc: 'Track, return, or buy things again', action: () => navigate('/tracking') },
    { icon: Heart, label: 'Wishlist', desc: 'Your favorite items saved for later', action: () => navigate('/wishlist') },
    { icon: MapPin, label: 'Addresses', desc: 'Manage your shipping addresses', action: () => {} },
    { icon: Settings, label: 'Settings', desc: 'Notifications, password, and preferences', action: () => {} },
  ];

  return (
    <div className="pb-24 bg-stone-50 min-h-screen animate-fade-in">
        {/* Header Profile Card */}
        <div className="bg-white px-6 pt-safe pb-8 rounded-b-3xl shadow-sm border-b border-stone-100">
             <div className="flex justify-between items-center mb-6 pt-4">
                <h2 className="font-serif text-2xl text-stone-900">My Account</h2>
                <button className="text-stone-400 hover:text-stone-600">
                    <Settings size={20} />
                </button>
             </div>
             
             <div className="flex items-center gap-4">
                 <div className="w-20 h-20 rounded-full bg-stone-100 overflow-hidden ring-4 ring-stone-50 flex items-center justify-center text-stone-300">
                     <User size={40} />
                 </div>
                 <div>
                     <h3 className="font-serif text-xl text-stone-900">{user?.name || 'Guest User'}</h3>
                     <p className="text-sm text-stone-500">{user?.email || 'guest@example.com'}</p>
                     {!user && (
                        <button onClick={() => navigate('/login')} className="text-xs font-bold text-rose-500 mt-1">Sign In / Create Account</button>
                     )}
                 </div>
             </div>
        </div>

        {/* Menu Grid */}
        <div className="px-6 py-8 space-y-4">
            {MENU_ITEMS.map((item) => (
                <button 
                    key={item.label} 
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-100 shadow-sm hover:border-rose-100 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-stone-50 text-stone-600 flex items-center justify-center group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                            <item.icon size={20} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-stone-900">{item.label}</p>
                            <p className="text-[10px] text-stone-400">{item.desc}</p>
                        </div>
                    </div>
                    <ChevronRight size={16} className="text-stone-300 group-hover:text-rose-400" />
                </button>
            ))}
            
            <button 
                onClick={() => navigate('/admin')}
                className="w-full flex items-center justify-between p-4 bg-stone-900 rounded-2xl shadow-lg group"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-stone-800 text-white flex items-center justify-center">
                        <Settings size={20} />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-white">Admin Panel</p>
                        <p className="text--[10px] text-stone-400">Manage products & orders</p>
                    </div>
                </div>
                <ChevronRight size={16} className="text-stone-500 group-hover:text-white" />
            </button>
        </div>

        {/* Sign Out */}
        {user && (
            <div className="px-6">
                <button 
                    onClick={handleLogout}
                    className="w-full p-4 flex items-center justify-center gap-2 text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors text-sm font-bold"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        )}
    </div>
  );
};