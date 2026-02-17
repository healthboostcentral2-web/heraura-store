import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { ArrowLeft, Check, Truck, Package, Home, Search } from 'lucide-react';
import { db } from '../lib/db';
import { useNavigate } from 'react-router-dom';

export const OrderTracking: React.FC = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLastOrder = async () => {
        setLoading(true);
        const orders = await db.getOrders();
        // Just grab the most recent order for demonstration
        if (orders.length > 0) {
            setOrder(orders[0]);
        }
        setLoading(false);
    };
    fetchLastOrder();
  }, []);

  if (loading) {
     return <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-400">Loading...</div>;
  }

  if (!order) {
      return (
        <div className="pb-12 bg-stone-50 min-h-screen animate-fade-in flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-stone-500"/>
            </div>
            <h2 className="font-serif text-xl text-stone-900 mb-2">No Active Orders</h2>
            <p className="text-stone-500 text-sm mb-6">You haven't placed any orders yet.</p>
            <button 
                onClick={() => navigate('/')}
                className="text-rose-600 font-bold hover:underline"
            >
                Start Shopping
            </button>
        </div>
      );
  }

  // Determine steps based on order status
  const steps = [
    { icon: Check, label: 'Order Placed', completed: true, active: false },
    { icon: Package, label: 'Packed', completed: order.status !== 'PENDING', active: order.status === 'PROCESSING' },
    { icon: Truck, label: 'Shipped', completed: order.status === 'SHIPPED' || order.status === 'DELIVERED', active: order.status === 'SHIPPED' },
    { icon: Home, label: 'Delivered', completed: order.status === 'DELIVERED', active: false },
  ];

  return (
    <div className="pb-12 bg-stone-50 min-h-screen animate-fade-in">
       {/* Header */}
       <div className="bg-white px-6 pt-safe py-4 shadow-sm border-b border-stone-100 flex items-center gap-4 sticky top-0 z-20">
          <button 
            onClick={() => navigate('/profile')}
            className="p-2 -ml-2 text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
              <h2 className="font-serif text-lg text-stone-900">Track Order</h2>
              <p className="text-xs text-stone-500">ID: #{order.id}</p>
          </div>
       </div>

       {/* Map Placeholder */}
       <div className="h-64 bg-stone-200 w-full relative">
           <div className="absolute inset-0 bg-stone-300 opacity-20"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 rounded-full bg-rose-500/20 animate-ping absolute inset-0"></div>
                <div className="relative w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-rose-500 border-4 border-white">
                    <Truck size={24} />
                </div>
           </div>
           
           <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50">
               <div className="flex justify-between items-center">
                   <div>
                       <p className="text-xs text-stone-500 uppercase font-bold tracking-wide">Status</p>
                       <p className="font-serif text-lg text-stone-900 capitalize">{order.status.toLowerCase()}</p>
                   </div>
                   <div className="text-right">
                       <p className="text-xs text-stone-500">Total</p>
                       <p className="font-bold text-stone-900 text-sm">${order.totalAmount.toFixed(2)}</p>
                   </div>
               </div>
           </div>
       </div>

       {/* Timeline */}
       <div className="px-6 py-8">
           <div className="relative">
               {/* Connecting Line */}
               <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-stone-200"></div>
               
               <div className="space-y-8 relative">
                   {steps.map((step, index) => (
                       <div key={index} className="flex gap-4 items-start">
                           <div className={`relative z-10 w-12 h-12 rounded-full border-4 flex items-center justify-center transition-colors ${step.completed ? 'bg-stone-900 border-stone-100 text-white' : step.active ? 'bg-rose-500 border-rose-100 text-white' : 'bg-white border-stone-100 text-stone-300'}`}>
                               <step.icon size={18} />
                           </div>
                           <div className="pt-1">
                               <p className={`text-sm font-bold ${step.active || step.completed ? 'text-stone-900' : 'text-stone-400'}`}>{step.label}</p>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
       </div>

       {/* Order Items Summary */}
       <div className="px-6">
           <h3 className="text-sm font-bold text-stone-900 mb-4 uppercase tracking-wide">Items in this shipment</h3>
           {order.items.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-stone-100 flex gap-4 mb-3">
                        <div className="w-16 h-20 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={item.images[0]} className="w-full h-full object-cover" alt={item.name} />
                        </div>
                        <div>
                            <h4 className="font-serif text-stone-900 line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-stone-500">Size: {item.selectedSize} • Qty: {item.quantity}</p>
                            <p className="text-sm font-bold text-stone-900 mt-1">${item.price.toFixed(2)}</p>
                        </div>
                </div>
           ))}
       </div>
    </div>
  );
};