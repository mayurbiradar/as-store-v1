import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getProducts } from '../api/productApi';
import { API_BASE_URL } from '../constants';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  stock: number;
  category?: string;
  material?: string;
  description?: string;
}

export default function Collection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { cart, addToCart, updateQuantity } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        const data = res.data;
        const productList = Array.isArray(data) ? data : data?.products || [];
        setProducts(productList);
        setFilteredProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
        addToast('Failed to load products', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [addToast]);

  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    addToast(`${product.name} added to cart! 🎁`, 'success', 2500);
  };

  const getProductQuantity = (productId: number) => {
    return cart.find(item => item.id === productId)?.quantity || 0;
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading exquisite pieces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Our Collection
          </h1>
          <p className="text-lg sm:text-xl text-purple-200 max-w-2xl mx-auto">
            Discover timeless pieces crafted with passion and precision
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for jewelry, materials, or styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-12 bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all text-base shadow-lg"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400">
                  🔍
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 transition"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                </label>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 transition"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              {/* View Mode */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">View</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-3 rounded-lg border-2 transition ${
                      viewMode === 'grid'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-purple-400'
                    }`}
                  >
                    ⊞ Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-3 rounded-lg border-2 transition ${
                      viewMode === 'list'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-purple-400'
                    }`}
                  >
                    ☰ List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-6"
            }>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  onAddToCart={handleAddToCart}
                  quantity={getProductQuantity(product.id)}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💎</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? `No products match "${searchQuery}"`
                  : 'Try adjusting your filters'
                }
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setPriceRange([0, 10000]);
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onAddToCart: (product: Product) => void;
  quantity: number;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

function ProductCard({ product, viewMode, onAddToCart, quantity, onUpdateQuantity }: ProductCardProps) {
  const imageUrl = product.image.startsWith('/images/')
    ? `${API_BASE_URL}${product.image}`
    : product.image;

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="flex">
          <div className="w-48 h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400 text-lg mr-1">⭐</span>
                  <span className="text-gray-700 font-semibold">{product.rating}</span>
                </div>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              </div>
              <Link
                to={`/product/${product.id}`}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
              >
                View Details
              </Link>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {product.stock > 0 ? (
                  <span className="text-green-600">✓ In Stock ({product.stock})</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </div>
              {quantity > 0 ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock === 0}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden border border-gray-100">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 h-64 flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                Out of Stock
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
            <div className="flex items-center">
              <span className="text-yellow-400 text-sm">⭐</span>
              <span className="ml-1 text-gray-800 font-semibold text-sm">{product.rating}</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <div className="text-sm text-gray-600">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        </div>

        {quantity > 0 ? (
          <div className="flex items-center justify-center gap-2 mb-3">
            <button
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              className="w-10 h-10 flex items-center justify-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold"
            >
              −
            </button>
            <span className="w-12 text-center font-bold text-lg">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              className="w-10 h-10 flex items-center justify-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
