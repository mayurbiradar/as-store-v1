import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import type { CartItem } from '../context/CartContext'
import { API_BASE_URL } from "../constants";
import { useToast } from '../context/ToastContext';

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cart, clearCart, addOrder } = useCart()
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Get selected items from navigation state, fallback to all cart items
  const selectedItems = location.state?.selectedItems || cart;

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/collection');
    }
  }, [cart, navigate]);

  if (!cart || cart.length === 0) {
    return null;
  }

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Build order payload matching backend
      const userId = localStorage.getItem('userId') || '';
      const subtotal = selectedItems.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
      const shipping = 0; // Always free shipping
      const tax = Math.round((subtotal + shipping) * 0.03); // GST 3%
      const totalAmount = subtotal + shipping + tax;
      const orderItems = selectedItems.map((item: CartItem) => ({
        productId: item.id,
        sku: `SKU-${Math.random().toString(36).substring(2, 10)}`,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        image: item.image && item.image.startsWith('http')
          ? item.image.replace(API_BASE_URL, '')
          : item.image || ''
      }));
      const addressPayload = {
        ...formData,
        userId,
        isDeleted: false
      };
      const orderPayload = {
        userId,
        status: 'CREATED',
        totalAmount,
        currency: 'INR',
        items: orderItems,
        subtotal,
        shipping,
        tax,
        address: addressPayload
      };

      const orderResponse = await addOrder(orderPayload);
      clearCart();

      if (orderResponse) {
        addToast('Order placed successfully! 🎉', 'success', 5000);
        navigate('/order-success', { state: { order: orderResponse } });
      } else {
        addToast('Order placed successfully! 🎉', 'success', 5000);
        navigate('/order-success', { state: { orderId: 'ORD-UNKNOWN' } });
      }
    } catch (error) {
      console.error('Order submission error:', error);
      addToast('Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const subtotal = selectedItems.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
  const shipping = 0; // Always free shipping
  const tax = Math.round((subtotal + shipping) * 0.03); // GST 3%
  const total = subtotal + shipping + tax;

  const isFormValid = formData.firstName && formData.lastName && formData.email &&
                     formData.phone && formData.address && formData.city &&
                     formData.state && formData.pincode;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Secure Checkout
              </h1>
              <p className="text-lg text-purple-200">
                Complete your purchase with confidence
              </p>
            </div>
            <button
              onClick={() => navigate('/cart')}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              ← Back to Cart
            </button>
          </div>

              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all bg-white text-purple-900 border-white`}>
                    <span className="font-bold">1</span>
                  </div>
                  <div className={`h-1 w-16 transition-all bg-white/30`}></div>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all border-white/50 text-white/50`}>
                    <span className="font-bold">2</span>
                  </div>
                  <div className={`h-1 w-16 transition-all bg-white/30`}></div>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all border-white/50 text-white/50`}>
                    <span className="font-bold">✓</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="flex justify-center space-x-8 text-sm">
                  <span className={'text-white font-semibold'}>
                    Shipping Details
                  </span>
                  <span className={'text-white/70'}>
                    Payment & Review
                  </span>
                  <span className={'text-white/70'}>
                    Order Confirmed
                  </span>
                </div>
              </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Form (2/3) */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shipping Information */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    📦 Shipping Information
                  </h2>

                  {/* Personal Details */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="Enter your first name"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Enter your last name"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Delivery Address</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          placeholder="123 Main Street, Apartment 4B"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            placeholder="Mumbai"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            name="state"
                            placeholder="Maharashtra"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            PIN Code *
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            placeholder="400001"
                            value={formData.pincode}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    💳 Payment Method
                  </h2>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">💵</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-green-800">Cash on Delivery</h3>
                        <p className="text-green-700">Pay when you receive your order</p>
                      </div>
                    </div>
                    <div className="bg-green-100 rounded-lg p-4">
                      <p className="text-sm text-green-800">
                        <strong>✓ Safe & Secure:</strong> No online payment required. Pay in cash when your order arrives at your doorstep.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
                  <button
                    type="submit"
                    disabled={!isFormValid || loading}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing Order...
                      </>
                    ) : (
                      <>
                        🛒 Place Order - ₹{total.toLocaleString('en-IN')}
                      </>
                    )}
                  </button>

                  {!isFormValid && (
                    <p className="text-red-600 text-sm mt-2 text-center">
                      Please fill in all required fields to continue
                    </p>
                  )}
                </div>
              </form>
            </div>

            {/* Right: Order Summary (1/3) */}
            <div className="lg:col-span-1">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg sticky top-20">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  📋 Order Summary
                </h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {selectedItems.map((item: CartItem) => (
                    <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-200 last:border-b-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image.startsWith('/images/') ? `${API_BASE_URL}${item.image}` : item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm line-clamp-2">{item.name}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                          <span className="font-bold text-purple-600 text-sm">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({selectedItems.length} items)</span>
                    <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-bold text-green-600">
                      Free
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (3%)</span>
                    <span className="font-bold">₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-600">🚚</span>
                    <span className="font-semibold text-blue-800 text-sm">Estimated Delivery</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    3-5 business days after order confirmation
                  </p>
                </div>

                {/* Security Badge */}
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <span className="text-green-600">🔒</span>
                    <span>SSL Secured Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
