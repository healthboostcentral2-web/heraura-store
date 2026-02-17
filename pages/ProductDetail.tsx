import React, { useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { Star, Minus, Plus, Share2, Heart, ShieldCheck, Truck, Ruler, ChevronRight, MessageCircle, Bell, Search } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductDetailProps {
  allProducts: Product[];
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ allProducts }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const product = allProducts.find(p => p.id === id) || null;

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (product) {
      if (product.sizes?.length > 0) setSelectedSize(product.sizes[0]);
      if (product.colors?.length > 0) setSelectedColor(product.colors[0]);
      setActiveImageIndex(0);
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
      return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in pb-20">
             <SEO title="Product Not Found" />
             <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                <Search size={32} className="text-stone-300" />
            </div>
            <h2 className="font-serif text-2xl text-stone-900 mb-2">Product Not Found</h2>
            <p className="text-stone-500 mb-8 max-w-xs mx-auto">The item you are looking for might have been removed or is currently unavailable.</p>
            <Button onClick={() => navigate('/')}>
                Return to Shop
            </Button>
        </div>
      );
  }

  // Safe access to images
  const galleryImages = product.images && product.images.length > 0 ? product.images : [];
  
  // Recommendations logic
  const similarProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const completeLookProducts = allProducts.filter(p => p.id !== product.id).slice(0, 3);

  const isOutOfStock = product.stock === 0;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCartClick = () => {
    if (!product || isOutOfStock) return;
    
    const cartItem: CartItem = {
      ...product,
      quantity,
      selectedSize,
      selectedColor: selectedColor || product.colors?.[0]
    };
    
    addToCart(cartItem);
    navigate('/cart');
  };

  const handleToggleWishlist = () => {
      if (isWishlisted) {
          removeFromWishlist(product.id);
      } else {
          addToWishlist(product);
      }
  };

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this ${product.name} on HerAura!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleWhatsAppOrder = () => {
    const message = `Hi, I'm interested in ${product.name} (${window.location.href}). Is it available in size ${selectedSize}?`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="pb-32 bg-white min-h-screen animate-fade-in relative">
      <SEO 
        title={product.name} 
        description={product.description || `Buy ${product.name} for $${product.price}.`}
        image={galleryImages[0]}
        type="product"
      />
      
      {/* 1. Image Gallery */}
      <div className="relative bg-stone-100">
        <div className="aspect-[3/4] overflow-hidden bg-stone-200 relative">
             {galleryImages.length > 0 ? (
                 <img 
                    src={galleryImages[activeImageIndex]} 
                    alt={product.name} 
                    className={`w-full h-full object-cover animate-fade-in transition-opacity duration-300 ${isOutOfStock ? 'grayscale-[0.5]' : ''}`} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000'; // Fallback
                    }}
                />
             ) : (
                 <div className="w-full h-full flex items-center justify-center text-stone-300 bg-stone-100">
                     <div className="flex flex-col items-center gap-2">
                        <Search size={24} />
                        <span className="text-xs font-bold uppercase tracking-widest">No Image</span>
                     </div>
                 </div>
             )}
            {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                    <div className="bg-stone-900/90 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                        Out of Stock
                    </div>
                </div>
            )}
            
            {/* Back Button Overlay */}
            <div className="absolute top-4 left-4 z-10">
                 <button 
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-stone-600 hover:text-stone-900 transition-all active:scale-90"
                    aria-label="Go Back"
                 >
                    <ChevronRight size={20} className="rotate-180" />
                 </button>
            </div>
        </div>
        
        {/* Floating Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-3">
            <button 
                className={`p-3 backdrop-blur-md rounded-full shadow-lg transition-all active:scale-90 ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 text-stone-600 hover:text-rose-500'}`}
                onClick={handleToggleWishlist}
                aria-label="Add to Wishlist"
            >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            <button 
                className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-stone-600 hover:text-blue-500 transition-all active:scale-90" 
                onClick={handleShare}
                aria-label="Share Product"
            >
                <Share2 size={20} />
            </button>
        </div>

        {/* Thumbnails Overlay */}
        {galleryImages.length > 1 && (
            <div className="absolute bottom-6 left-0 w-full px-4 overflow-x-auto no-scrollbar">
                <div className="flex gap-3 justify-center">
                    {galleryImages.map((img, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImageIndex === idx ? 'border-white ring-2 ring-stone-900/20' : 'border-transparent opacity-70'}`}
                        >
                            <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>
        )}
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* 2. Product Header */}
        <div>
            <div className="flex justify-between items-start mb-2">
                <h1 className="font-serif text-3xl text-stone-900 max-w-[75%] leading-tight">{product.name}</h1>
                <div className="flex flex-col items-end">
                    <span className="font-serif text-2xl text-stone-900">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                        <span className="text-sm text-stone-400 line-through">${product.originalPrice.toFixed(2)}</span>
                    )}
                </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
                 <div className="flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-md">
                    <Star size={14} fill="currentColor" className="text-yellow-500" />
                    <span className="text-xs font-bold text-stone-900">{product.rating}</span>
                    <span className="text-xs text-stone-500 ml-1">({product.reviews || 0} reviews)</span>
                </div>
                {product.isNew && (
                    <span className="text-xs font-bold text-rose-500 uppercase tracking-wide">New Arrival</span>
                )}
            </div>
        </div>

        {/* 3. Selectors */}
        <div className="space-y-6">
            {product.colors && product.colors.length > 0 && (
            <div>
                <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-bold text-stone-900">Select Color</label>
                    <span className="text-xs text-stone-500">{selectedColor?.name}</span>
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                    {product.colors.map(c => (
                        <button 
                            key={c.name}
                            onClick={() => setSelectedColor(c)}
                            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${selectedColor?.name === c.name ? 'border-stone-900 scale-105' : 'border-transparent'}`}
                            aria-label={`Select Color ${c.name}`}
                        >
                            <div className="w-10 h-10 rounded-full border border-stone-200 shadow-sm" style={{ backgroundColor: c.hex }}></div>
                        </button>
                    ))}
                </div>
            </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
            <div>
                <div className="flex justify-between items-center mb-3">
                     <label className="text-sm font-bold text-stone-900">Select Size</label>
                     <button className="flex items-center gap-1 text-xs text-stone-500 underline">
                        <Ruler size={12} /> Size Guide
                     </button>
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                    {product.sizes.map(s => {
                        return (
                            <button 
                                key={s}
                                onClick={() => setSelectedSize(s)}
                                className={`min-w-[48px] h-12 rounded-xl border flex items-center justify-center font-medium transition-all flex-shrink-0 relative ${
                                    selectedSize === s 
                                        ? 'bg-stone-900 text-white border-stone-900 shadow-md transform scale-105' 
                                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                                }`}
                            >
                                {s}
                            </button>
                        );
                    })}
                </div>
            </div>
            )}
        </div>

        {/* Smart Action: WhatsApp Order */}
        <button 
            onClick={handleWhatsAppOrder}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors"
        >
            <MessageCircle size={18} />
            <span className="text-sm font-bold">Order via WhatsApp</span>
        </button>

        {/* 4. Product Description */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
            <h3 className="font-serif text-lg text-stone-900">Description</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
                {product.description || "No description available."}
            </p>
            <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                    <Truck size={16} className="text-stone-800" />
                    <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                    <ShieldCheck size={16} className="text-stone-800" />
                    <span>2 Year Warranty</span>
                </div>
            </div>
        </div>

        {/* 5. Fabric Details */}
        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100 space-y-3">
             <h3 className="font-serif text-lg text-stone-900">Fabric & Care</h3>
             <ul className="space-y-2 text-sm text-stone-600">
                <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-300"></div>
                    Premium Quality Material
                </li>
                <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-300"></div>
                    Breathable and durable
                </li>
                 <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-300"></div>
                    Dry clean only recommended
                </li>
             </ul>
        </div>

        {/* 6. Stylist's Pick / Complete The Look */}
        {completeLookProducts.length > 0 && (
            <div className="pt-4">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <span className="text-xs font-bold text-rose-500 uppercase tracking-wide">Stylist's Edit</span>
                        <h3 className="font-serif text-xl text-stone-900">Complete The Look</h3>
                    </div>
                </div>
                <p className="text-xs text-stone-500 mb-4 italic">"Pair this with minimal gold accessories for a chic evening look."</p>
                
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
                    {completeLookProducts.map(item => (
                        <div key={item.id} className="w-[140px] flex-shrink-0">
                            <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2 bg-stone-100">
                                {item.images && item.images.length > 0 ? (
                                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-stone-200 flex items-center justify-center text-xs text-stone-400">No Image</div>
                                )}
                                <button 
                                    onClick={() => handleProductClick(item)}
                                    className="absolute bottom-2 right-2 p-1.5 bg-white rounded-full shadow-sm text-stone-900 hover:bg-stone-900 hover:text-white transition-colors"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                            <h4 className="text-xs font-bold text-stone-900 truncate">{item.name}</h4>
                            <p className="text-xs text-stone-500">${item.price}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* 7. Reviews Area */}
        <div className="pt-4 border-t border-stone-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl text-stone-900">Reviews ({product.reviews || 0})</h3>
                <button className="text-rose-500 text-sm font-bold flex items-center gap-1">
                    View All <ChevronRight size={14} />
                </button>
            </div>
            
            {/* Review Summary Card */}
            <div className="bg-white border border-stone-200 p-4 rounded-xl mb-4 shadow-sm">
                <div className="flex gap-4 items-center">
                    <div className="text-center px-4 border-r border-stone-100">
                        <span className="block text-3xl font-serif text-stone-900">{product.rating}</span>
                        <div className="flex text-yellow-400 text-[10px] gap-0.5 justify-center">
                            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />)}
                        </div>
                    </div>
                    <div className="flex-1 space-y-1">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center gap-2 text-xs text-stone-500">
                                <span className="w-2">{star}</span>
                                <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-stone-800 rounded-full" 
                                        style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '5%' }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* 8. Similar Products */}
        {similarProducts.length > 0 && (
            <div className="pt-4 border-t border-stone-100 mb-6">
                <h3 className="font-serif text-xl text-stone-900 mb-6">You May Also Like</h3>
                <div className="grid grid-cols-2 gap-4">
                    {similarProducts.map(p => (
                        <ProductCard 
                            key={p.id} 
                            product={p} 
                            onClick={handleProductClick}
                        />
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-stone-100 p-6 pb-safe z-40 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex gap-4 items-center">
             {!isOutOfStock && (
                <div className="flex items-center border border-stone-200 rounded-full px-4 py-3 gap-4">
                    <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="text-stone-500 hover:text-stone-900"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="font-bold text-stone-900 w-4 text-center">{quantity}</span>
                    <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="text-stone-500 hover:text-stone-900"
                    >
                        <Plus size={16} />
                    </button>
                </div>
             )}
            
            <Button 
                fullWidth 
                onClick={isOutOfStock ? () => alert("Notification subscribed!") : handleAddToCartClick}
                disabled={false} // Always clickable to allow "Notify Me" action
                className={isOutOfStock ? 'bg-stone-800' : ''}
            >
                {isOutOfStock ? (
                    <>
                        <Bell size={18} className="mr-2 inline" /> Notify Me
                    </>
                ) : (
                    `Add to Cart - $${(product.price * quantity).toFixed(2)}`
                )}
            </Button>
        </div>
      </div>
    </div>
  );
};