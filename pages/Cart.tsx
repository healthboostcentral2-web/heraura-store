import React from 'react';
import { Button } from '../components/Button';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  
  const subtotal = cartTotal;
  const shipping = subtotal > 200 ? 0 : 15.00;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-stone-400 p-6 animate-fade-in">
        <SEO title="Shopping Bag" />
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={32} className="text-stone-300" />
        </div>
        <h2 className="font-serif text-2xl text-stone-900 mb-2">Your Bag is Empty</h2>
        <p className="text-sm text-stone-500 mb-8 text-center max-w-xs">Looks like you haven't found your perfect match yet.</p>
        <Button variant="primary" onClick={() => navigate('/categories')}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-stone-50 min-h-screen animate-fade-in pt-4">
      <SEO title="Shopping Bag" />
      <div className="px-6 mb-6 flex justify-between items-end">
        <div>
            <h2 className="font-serif text-3xl text-stone-900">My Bag</h2>
            <p className="text-stone-500 text-xs mt-1">{cart.length} items</p>
        </div>
        <span className="text-xs font-bold text-rose-500 uppercase tracking-wide">
            {shipping === 0 ? 'Free Shipping Applied' : 'Spend $200 for Free Shipping'}
        </span>
      </div>

      <div className="px-6 space-y-4">
        {cart.map((item) => (
            <div key={`${item.id}-${item.selectedSize}-${item.selectedColor.name}`} className="bg-white p-4 rounded-2xl flex gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-stone-100">
                <div className="w-24 h-32 bg-stone-200 rounded-xl overflow-hidden flex-shrink-0 relative group">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-serif text-base text-stone-900 leading-tight pr-2 line-clamp-2">{item.name}</h3>
                            <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-stone-300 hover:text-rose-400 transition-colors p-1 -mr-2"
                            >
                                <Trash2 size={16}/>
                            </button>
                        </div>
                        <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                           {item.selectedColor.name} 
                           <span className="w-2 h-2 rounded-full border border-stone-200" style={{backgroundColor: item.selectedColor.hex}}></span>
                           / {item.selectedSize}
                        </p>
                    </div>
                    
                    <div className="flex justify-between items-end">
                        <span className="font-bold text-stone-900 text-lg">${item.price.toFixed(2)}</span>
                        
                        <div className="flex items-center bg-stone-50 rounded-full px-1 py-1 gap-2 border border-stone-200">
                            <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 rounded-full bg-white text-stone-600 flex items-center justify-center shadow-sm hover:text-stone-900 disabled:opacity-50"
                                disabled={item.quantity <= 1}
                            >
                                <Minus size={12}/>
                            </button>
                            <span className="text-xs font-bold text-stone-900 w-4 text-center">{item.quantity}</span>
                            <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 rounded-full bg-white text-stone-600 flex items-center justify-center shadow-sm hover:text-stone-900"
                            >
                                <Plus size={12}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Promo Code */}
      <div className="px-6 mt-8">
        <label className="text-xs font-bold text-stone-900 uppercase tracking-wide mb-3 block ml-1">Promo Code</label>
        <div className="flex gap-2">
            <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                    <Tag size={16} />
                </div>
                <input 
                    type="text" 
                    placeholder="Enter code" 
                    className="w-full bg-white border border-stone-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-200 transition-all placeholder:text-stone-400"
                />
            </div>
            <button className="bg-stone-900 text-white px-5 rounded-xl text-sm font-bold hover:bg-stone-800 transition-colors">
                Apply
            </button>
        </div>
      </div>

      {/* Summary */}
      <div className="px-6 mt-8 space-y-3">
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex justify-between text-sm text-stone-600">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-stone-600">
                <span>Shipping</span>
                <span className="font-medium text-stone-900">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="h-px bg-stone-100 my-2"></div>
            <div className="flex justify-between items-end">
                <span className="font-serif text-lg font-bold text-stone-900">Total</span>
                <div className="text-right">
                    <span className="block text-2xl font-serif font-bold text-stone-900">${total.toFixed(2)}</span>
                    <span className="text-[10px] text-stone-400">Including Tax</span>
                </div>
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-stone-100 p-6 pb-safe z-40 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto">
            <Button fullWidth onClick={() => navigate('/checkout')}>
                Proceed to Checkout <ArrowRight size={16} className="inline ml-2" />
            </Button>
        </div>
      </div>
    </div>
  );
};