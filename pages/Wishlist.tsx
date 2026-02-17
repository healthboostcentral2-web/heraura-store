import React from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { Heart } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useNavigate } from 'react-router-dom';

interface WishlistProps {
  products: Product[];
}

export const Wishlist: React.FC<WishlistProps> = ({ products }) => {
  const navigate = useNavigate();
  // Mock wishlist items (take first 3 available products for visual demo)
  const wishlistItems = products.length > 0 ? [products[0], products[2], products[3]].filter(Boolean) : [];

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-stone-400 p-6 animate-fade-in bg-stone-50">
        <SEO title="My Wishlist" />
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 border border-rose-100">
            <Heart size={32} className="text-rose-400" />
        </div>
        <h2 className="font-serif text-2xl text-stone-900 mb-2">Your Wishlist is Empty</h2>
        <p className="text-sm text-stone-500 mb-8 text-center max-w-xs">Save your favorite styles to track them here.</p>
        <Button variant="primary" onClick={() => navigate('/categories')}>Explore Collection</Button>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 bg-stone-50 min-h-screen animate-fade-in">
      <SEO title="My Wishlist" />
      <div className="px-6 mb-6">
        <h2 className="font-serif text-3xl text-stone-900">Wishlist</h2>
        <p className="text-stone-500 text-xs mt-1">{wishlistItems.length} items saved</p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 px-6">
        {wishlistItems.map(product => (
            <ProductCard 
                key={product.id} 
                product={product} 
                onClick={handleProductClick}
            />
        ))}
      </div>
    </div>
  );
};