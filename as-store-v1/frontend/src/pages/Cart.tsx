import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../constants";
import { useToast } from "../context/ToastContext";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Select all items by default
  useEffect(() => {
    if (cart.length > 0) {
      setSelectedItems(new Set(cart.map(item => item.id)));
    }
  }, [cart]);

  const handleSelectItem = (itemId: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.map(item => item.id)));
    }
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach(id => removeFromCart(id));
    setSelectedItems(new Set());
    addToast(`${selectedItems.size} items removed from cart`, 'success');
  };

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'welcome10') {
      setDiscount(Math.round(getSelectedTotal() * 0.1));
      addToast('Promo code applied! 10% discount added.', 'success');
    } else if (promoCode.toLowerCase() === 'jewelry20') {
      setDiscount(Math.round(getSelectedTotal() * 0.2));
      addToast('Promo code applied! 20% discount added.', 'success');
    } else {
      addToast('Invalid promo code', 'error');
    }
  };

  const getSelectedTotal = () => {
    return cart
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const subtotal = getSelectedTotal();
  const shipping = 0; // Always free shipping
  const tax = Math.round((subtotal + shipping - discount) * 0.03); // GST 3%
  const total = subtotal + shipping + tax - discount;

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      addToast('Please select items to checkout', 'error');
      return;
    }
    const selectedCartItems = cart.filter(item => selectedItems.has(item.id));
    navigate('/checkout', { state: { selectedItems: selectedCartItems } });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Your Shopping Cart
            </h1>
            <p className="text-lg sm:text-xl text-purple-200 max-w-2xl mx-auto">
              Your cart is waiting for some beautiful pieces
            </p>
          </div>
        </section>

        {/* Empty Cart */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/20">
              <div className="text-8xl mb-6 animate-bounce">🛒</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Your cart is feeling lonely
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Discover our exquisite collection of jewelry and add some sparkle to your life
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/collection"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  🛍️ Start Shopping
                </Link>
                <Link
                  to="/"
                  className="px-8 py-4 border-2 border-purple-600 text-purple-600 font-bold text-lg rounded-2xl hover:bg-purple-50 transition-all duration-300"
                >
                  Browse Home
                </Link>
              </div>
            </div>

            {/* Suggestions */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Popular Categories</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: 'Necklaces', emoji: '📿', link: '/collection?category=necklaces' },
                  { name: 'Earrings', emoji: '💎', link: '/collection?category=earrings' },
                  { name: 'Bracelets', emoji: '💍', link: '/collection?category=bracelets' },
                  { name: 'Rings', emoji: '💍', link: '/collection?category=rings' }
                ].map((category) => (
                  <Link
                    key={category.name}
                    to={category.link}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl border border-white/20 transform hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {category.emoji}
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">{category.name}</h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Shopping Cart
              </h1>
              <p className="text-lg text-purple-200">
                {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>
            <Link
              to="/collection"
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bulk Actions */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedItems.size === cart.length && cart.length > 0}
                        onChange={handleSelectAll}
                        className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-gray-700 font-semibold">
                        Select All ({cart.length} items)
                      </span>
                    </label>
                  </div>
                  {selectedItems.size > 0 && (
                    <button
                      onClick={handleRemoveSelected}
                      className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                    >
                      🗑️ Remove Selected ({selectedItems.size})
                    </button>
                  )}
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.has(item.id)}
                    onSelect={() => handleSelectItem(item.id)}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg sticky top-20">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  💳 Order Summary
                </h2>

                {/* Selected Items Count */}
                <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {selectedItems.size} of {cart.length} items selected
                  </p>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 transition"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-4 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Try: WELCOME10 or JEWELRY20
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({selectedItems.size} items)</span>
                    <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className={`font-bold ${shipping === 0 ? 'text-green-600' : ''}`}>
                      {shipping === 0 ? 'Free' : 'Free'}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-500">
                      Add ₹{(5000 - subtotal).toLocaleString('en-IN')} more for free shipping
                    </p>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (3%)</span>
                    <span className="font-bold">₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-bold">-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold text-gray-800">Total</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={selectedItems.size === 0}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-3"
                >
                  {`🛒 Checkout (${selectedItems.size} items)`}
                </button>

                {/* Continue Shopping */}
                <Link
                  to="/collection"
                  className="w-full py-3 px-4 border-2 border-purple-600 text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all duration-300 block text-center"
                >
                  Continue Shopping
                </Link>

                {/* Security Badge */}
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <span className="text-green-600">🔒</span>
                    <span>Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface CartItemCardProps {
  item: CartItem;
  isSelected: boolean;
  onSelect: () => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

function CartItemCard({ item, isSelected, onSelect, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const imageUrl = item.image.startsWith('/images/')
    ? `${API_BASE_URL}${item.image}`
    : item.image;

  return (
    <div className={`bg-white/60 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 shadow-lg hover:shadow-xl ${
      isSelected ? 'border-purple-400 bg-white/80' : 'border-white/20'
    }`}>
      <div className="flex gap-6">
        {/* Selection Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
          />
        </div>

        {/* Product Image */}
        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <Link
            to={`/product/${item.id}`}
            className="text-xl font-bold text-gray-800 hover:text-purple-700 transition-colors line-clamp-2"
          >
            {item.name}
          </Link>

          <div className="flex items-center gap-4 mt-2 mb-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ₹{item.price.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-gray-500">per item</span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center bg-white text-purple-600 font-bold rounded hover:bg-purple-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <span className="w-10 text-center font-bold text-lg">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white text-purple-600 font-bold rounded hover:bg-purple-600 hover:text-white transition"
                >
                  +
                </button>
              </div>
              <span className="text-lg font-bold text-gray-700">
                Subtotal: ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => onRemove(item.id)}
              className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
