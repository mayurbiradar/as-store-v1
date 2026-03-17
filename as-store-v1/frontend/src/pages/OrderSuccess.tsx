import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import { API_BASE_URL } from '../constants';
export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order || null;
  const orderId = order?.id || location.state?.orderId || 'ORD-UNKNOWN';

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-5xl font-bold text-green-600 mb-4">Order Confirmed! 🎉</h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-8 mb-8 text-left">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Order Number</p>
              <p className="text-3xl font-bold text-gray-800">{orderId}</p>
              {order && (
                <>
                  <p className="text-gray-600 text-sm mt-2">Placed on</p>
                  <p className="font-bold">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                  <p className="text-gray-600 text-sm mt-2">Status</p>
                  <p className="font-bold capitalize">{order.status}</p>
                  <p className="text-gray-600 text-sm mt-2">Total Amount</p>
                  <p className="font-bold text-green-600 text-2xl">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                  <p className="text-gray-600 text-sm mt-2">Items</p>
                  <ul className="mt-2 space-y-2">
                    {order.items?.map((item: any) => (
                      <li key={item.id} className="flex items-center gap-3">
                        {item.image && <img src={item.image.startsWith('/images/') ? `${API_BASE_URL}${item.image}` : item.image} alt={item.productName} className="w-10 h-10 object-cover rounded" />}
                        <span className="font-bold">{item.productName}</span>
                        <span>× {item.quantity}</span>
                        <span>₹{item.subtotal?.toLocaleString('en-IN')}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            {/* What's Next section remains unchanged */}
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">What's Next?</p>
                <ul className="mt-2 space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    We'll verify your payment
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Your order will be processed
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Items will be shipped within 2-3 business days
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    You'll receive tracking information via email
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation Email */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded mb-8 text-left">
            <p className="text-gray-700">
              <span className="font-bold">📧 Confirmation Email:</span> A detailed order confirmation has been sent to your email address.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Link
              to="/collection"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg transition duration-200"
            >
              Continue Shopping
            </Link>
            <Link
              to="/orders"
              className="px-8 py-4 border-2 border-purple-600 text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition duration-200"
            >
              View My Orders
            </Link>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">Need help? Contact us at</p>
          <p className="font-bold text-gray-800">support@akshatasjewelbox.com | +91-1234-567-890</p>
        </div>
      </div>
    </div>
  )
}
