import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

import { API_BASE_URL } from '../constants';

import { getProducts } from '../api/productApi';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const { cart, addToCart, updateQuantity } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    getProducts().then(res => {
      const data = res.data;
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    });
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    addToast(`${product.name} added to cart! 🎁`, 'success', 2500);
  };

  const getProductQuantity = (productId: number) => {
    return cart.find(item => item.id === productId)?.quantity || 0;
  };

  return (
    <section id="featured-collections" className="py-12 sm:py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Featured Collections
          </h2>
          <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8">
            Explore our carefully curated selection of stunning pieces
          </p>
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
            <input
              type="text"
              placeholder="Search for jewelry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 sm:px-6 py-2 sm:py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-600 transition text-sm sm:text-base"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105 flex flex-col"
              >
                <div className="bg-gradient-to-br from-purple-200 to-pink-200 h-48 sm:h-56 md:h-64 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={product.image.startsWith('/images/') ? `${API_BASE_URL}${product.image}` : product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition duration-300 hover:scale-110 rounded-xl"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <div className="p-4 sm:p-6 flex flex-col flex-1">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 min-h-12 sm:min-h-14 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between mb-3 sm:mb-4 flex-1">
                    <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-lg">⭐</span>
                      <span className="ml-1 text-gray-700 font-semibold text-sm">4.5</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-2 sm:py-3 rounded-lg font-bold transition duration-200 text-sm sm:text-base ${
                      getProductQuantity(product.id) > 0
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                    }`}
                  >
                    {getProductQuantity(product.id) > 0 ? (
                      <div className="flex items-center justify-between px-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(product.id, getProductQuantity(product.id) - 1);
                          }}
                          className="w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-white hover:text-purple-600 rounded transition"
                        >
                          −
                        </button>
                        <span className="text-base font-bold">{getProductQuantity(product.id)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(product.id, getProductQuantity(product.id) + 1);
                          }}
                          className="w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-white hover:text-purple-600 rounded transition"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 sm:py-12">
              <p className="text-xl sm:text-2xl text-gray-600">No products found matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 sm:mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg transition text-sm sm:text-base"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
