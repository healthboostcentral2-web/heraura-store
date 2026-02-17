import React from 'react';
import { View, Order } from '../types';
import { Button } from '../components/Button';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';

interface OrderSuccessProps {
  order: Order | null;
  onNavigate: (view: View) => void;
}

export const OrderSuccess: React.FC<OrderSuccessProps> = ({ order, onNavigate }) => {
  if (!order) return null;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 animate-fade-in text-center pb-24">
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm animate-bounce-slow">
        <CheckCircle size={48} className="text-emerald-500" />
      </div>
      
      <h1 className="font-serif text-3xl text-stone-900 mb-2">Thank You!</h1>
      <p className="text-stone-500 mb-8">Your order has been placed successfully.</p>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 w-full max-w-sm mb-8 text-left relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200"></div>
        
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1">Order ID</p>
                <p className="text-lg font-bold text-stone-900">#{order.id}</p>
            </div>
            <div className="bg-stone-50 p-2 rounded-lg">
                <Package size={20} className="text-stone-400"/>
            </div>
        </div>
        
        <div className="space-y-3 border-t border-stone-100 pt-4">
             <div className="flex justify-between text-sm">
                <span className="text-stone-600">Amount Paid</span>
                <span className="font-bold text-stone-900">${order.totalAmount.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-stone-600">Payment Method</span>
                <span className="font-medium text-stone-900 capitalize">{order.paymentMethod.replace('_', ' ')}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-stone-600">Estimated Delivery</span>
                <span className="font-bold text-emerald-600">3-5 Business Days</span>
             </div>
        </div>

        <div className="mt-6 bg-stone-50 p-3 rounded-xl">
            <p className="text-xs text-stone-500 leading-relaxed">
                A confirmation email has been sent to <span className="font-bold text-stone-900">{order.shippingDetails.email}</span>
            </p>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <Button fullWidth onClick={() => onNavigate(View.ORDER_TRACKING)}>
          Track Order
        </Button>
        <Button variant="ghost" fullWidth onClick={() => onNavigate(View.HOME)}>
          <Home size={18} className="mr-2 inline" />
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};