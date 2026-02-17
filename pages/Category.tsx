import React, { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { Product, Category } from '../types';
import { SlidersHorizontal, ChevronRight, Search, X, History, TrendingUp, Check } from 'lucide-react';
import { SIZES, COLORS } from '../constants';
import { SEO } from '../components/SEO';

interface CategoryProps {
  onProductClick: (product: Product) => void;
  products: Product[];
  categories: Category[];
}

export const CategoryPage: React.FC<CategoryProps> = ({ onProductClick, products, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Filter States
  const [priceRange, setPriceRange] = useState([50, 350]);
  const [selectedFilters, setSelectedFilters] = useState<{
    colors: string[];
    sizes: string[];
    occasions: string[];
    fabrics: string[];
  }>({
    colors: [],
    sizes: [],
    occasions: [],
    fabrics: []
  });

  const toggleFilter = (type: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value) 
        ? prev[type].filter(i => i !== value)
        : [...prev[type], value]
    }));
  };

  const currentCategoryData = categories.find(c => c.name === selectedCategory);
  const subcategories = currentCategoryData ? ['All', ...currentCategoryData.subcategories] : [];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const OCCASIONS = ['Casual', 'Party', 'Wedding', 'Office', 'Vacation', 'Formal'];
  const FABRICS = ['Cotton', 'Silk', 'Georgette', 'Linen', 'Velvet', 'Chiffon'];

  return (
    <div className="pb-24 pt-2 min-h-screen bg-stone-50 animate-fade-in relative">
      <SEO title="Shop Collection" description="Explore our latest collection of dresses, tops, and accessories." />
      
      {/* Search & Filter Header */}
      <div className="sticky top-[73px] z-40 bg-stone-50/95 backdrop-blur-md shadow-sm border-b border-stone-100">
        <div className="px-6 py-4 flex gap-3 items-center">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dresses, tops..." 
                    className="w-full bg-white border border-stone-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-200 transition-all placeholder:text-stone-400"
                    onFocus={() => setIsSearchActive(true)}
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>
            <button 
                onClick={() => setShowFilters(true)}
                className="p-3 bg-white border border-stone-200 rounded-xl shadow-sm active:scale-95 transition-transform hover:border-stone-400 text-stone-900 relative"
            >
                <SlidersHorizontal size={20} />
                {(selectedFilters.colors.length > 0 || selectedFilters.sizes.length > 0) && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
                )}
            </button>
        </div>

        {/* Categories Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-6 pb-3">
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedSubcategory('All'); }}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
              selectedCategory === 'All'
                ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.name); setSelectedSubcategory('All'); }}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                selectedCategory === cat.name
                  ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Subcategories */}
        {selectedCategory !== 'All' && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-6 pb-4 animate-fade-in border-t border-stone-100 pt-3 bg-stone-50">
             {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedSubcategory === sub
                    ? 'bg-rose-100 text-rose-900 border border-rose-200'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Suggestions Overlay */}
      {isSearchActive && (
        <div className="fixed inset-0 z-30 top-[140px] bg-white/95 backdrop-blur-xl animate-fade-in">
             <div className="p-6 space-y-8 h-full overflow-y-auto pb-32">
                 {/* ... Search suggestions logic (same as before) ... */}
                 <div>
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-3">Popular Products</h3>
                    <div className="space-y-3">
                         {products.slice(0, 3).map(p => (
                             <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-stone-50 rounded-xl cursor-pointer" onClick={() => onProductClick(p)}>
                                 {p.images && p.images.length > 0 ? (
                                     <img src={p.images[0]} className="w-12 h-12 rounded-lg object-cover" alt={p.name} />
                                 ) : (
                                     <div className="w-12 h-12 rounded-lg bg-stone-200"></div>
                                 )}
                                 <div>
                                     <p className="text-sm font-bold text-stone-900">{p.name}</p>
                                     <p className="text-xs text-stone-500">${p.price}</p>
                                 </div>
                             </div>
                         ))}
                    </div>
                 </div>
                 
                 <Button variant="ghost" fullWidth onClick={() => setIsSearchActive(false)}>Close Search</Button>
             </div>
        </div>
      )}

      {/* Filter Drawer Overlay */}
      <div className={`fixed inset-0 z-[60] ${showFilters ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div 
                className={`absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity duration-300 ${showFilters ? 'opacity-100' : 'opacity-0'}`} 
                onClick={() => setShowFilters(false)} 
            />
            
            <div className={`absolute bottom-0 left-0 w-full bg-white rounded-t-3xl h-[85vh] flex flex-col transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${showFilters ? 'translate-y-0' : 'translate-y-full'}`}>
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-stone-100">
                    <h3 className="font-serif text-2xl text-stone-900">Filters</h3>
                    <button onClick={() => setShowFilters(false)} className="p-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors text-stone-600">
                        <X size={20}/>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* ... Same filter sections using generic SIZES/COLORS constants ... */}
                    {/* Colors */}
                    <section>
                        <h4 className="font-bold text-stone-900 mb-4">Color</h4>
                        <div className="flex flex-wrap gap-4">
                            {COLORS.map(c => (
                                <button 
                                    key={c.name}
                                    onClick={() => toggleFilter('colors', c.name)}
                                    className={`flex flex-col items-center gap-2 group`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${selectedFilters.colors.includes(c.name) ? 'border-stone-900 scale-110' : 'border-stone-200'}`}>
                                        <div className="w-8 h-8 rounded-full border border-stone-100 shadow-sm" style={{ backgroundColor: c.hex }}>
                                            {selectedFilters.colors.includes(c.name) && (
                                                <div className="w-full h-full flex items-center justify-center text-stone-500 drop-shadow-md">
                                                    <Check size={14} color={c.name === 'Black' ? 'white' : 'currentColor'} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-stone-500 group-hover:text-stone-900">{c.name}</span>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 border-t border-stone-100 flex gap-4 bg-white pb-safe">
                    <Button variant="ghost" onClick={() => setSelectedFilters({colors: [], sizes: [], occasions: [], fabrics: []})}>
                        Reset
                    </Button>
                    <Button fullWidth onClick={() => setShowFilters(false)}>
                        Apply Filters ({filteredProducts.length})
                    </Button>
                </div>
            </div>
      </div>

      {/* Product List Content */}
      <div className="px-6 mt-6">
        {selectedCategory !== 'All' && !isSearchActive && (
            <div className="mb-6 bg-white p-4 rounded-2xl border border-stone-100 flex items-center gap-4 animate-fade-in">
                {currentCategoryData?.image ? (
                     <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0">
                        <img src={currentCategoryData.image} alt={selectedCategory} className="w-full h-full object-cover" />
                     </div>
                ) : (
                    <div className="w-16 h-16 rounded-xl bg-stone-100 flex-shrink-0 flex items-center justify-center">
                        <Search size={20} className="text-stone-400" />
                    </div>
                )}
                <div>
                    <h3 className="font-serif text-xl text-stone-900">{selectedCategory}</h3>
                    <p className="text-xs text-stone-500">Explore our latest collection of {selectedCategory.toLowerCase()}.</p>
                </div>
            </div>
        )}

        {!isSearchActive && (
            <>
                <div className="flex items-center justify-between mb-4">
                    <p className="text-stone-500 text-sm">{filteredProducts.length} items found</p>
                    <div className="flex items-center gap-1 text-xs font-bold text-stone-900 cursor-pointer">
                        <span>Sort by: Newest</span>
                        <ChevronRight size={14} className="rotate-90" />
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                {filteredProducts.map(product => (
                    <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={onProductClick}
                    />
                ))}
                </div>
            </>
        )}
      </div>
    </div>
  );
};