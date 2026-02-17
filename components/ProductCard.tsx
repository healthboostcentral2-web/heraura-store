import React from 'react';
import { Heart, Plus, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onQuickAdd }) => {
  // Use DB calculated discount or fallback
  const discountPercentage = product.discountPercentage || (product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0);

  return (
    <div 
      className="group relative flex flex-col gap-3 cursor-pointer"
      onClick={() => onClick(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-200">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isNew && (
            <span className="self-start px-2 py-1 bg-stone-900/90 text-white text-[10px] uppercase tracking-wider font-bold rounded-md backdrop-blur-sm shadow-md">
              New
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="self-start px-2 py-1 bg-rose-500/90 text-white text-[10px] uppercase tracking-wider font-bold rounded-md backdrop-blur-sm shadow-md">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-stone-500 hover:text-rose-500 transition-colors shadow-sm z-10"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart size={16} strokeWidth={2} />
        </button>

        {/* Quick Add Button - Floating Action */}
        <button 
          className="absolute bottom-3 right-3 p-2.5 bg-white text-stone-900 rounded-full shadow-lg hover:bg-stone-900 hover:text-white transition-all duration-300 flex items-center justify-center z-10 active:scale-90"
          title="Quick Add"
          onClick={(e) => {
            e.stopPropagation();
            onQuickAdd?.(product);
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>
      </div>
      
      {/* Details */}
      <div className="space-y-1.5">
        <h3 className="font-serif text-base text-stone-900 line-clamp-2 leading-tight group-hover:text-rose-900 transition-colors">
          {product.name}
        </h3>
       
        <div className="flex items-center gap-1.5">
             <Star size={12} fill="currentColor" className="text-yellow-400" />
             <span className="text-xs text-stone-900 font-bold">{product.rating}</span>
             <span className="text-xs text-stone-400">({product.reviews || 0})</span>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-base font-bold text-stone-900">${product.price.toFixed(2)}</p>
          {product.originalPrice && (
            <p className="text-xs font-medium text-stone-400 line-through decoration-stone-400/50">
              ${product.originalPrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};