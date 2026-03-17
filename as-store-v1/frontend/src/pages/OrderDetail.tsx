import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { orders } = useCart()
  
  const order = orders.find(o => o.id === orderId)
  const [orderStatus, setOrderStatus] = useState(order?.status || 'confirmed')

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800 mb-4">Order not found</p>
          <button
            onClick={() => navigate('/admin')}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
          >
            Back to Admin
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/admin')}
            className="text-indigo-200 hover:text-white transition mb-4"
          >
            ← Back to Admin
          </button>
          <h1 className="text-4xl font-bold">Order Details</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Order Number</p>
                    <p className="text-3xl font-bold text-gray-800">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Order Date</p>
                    <p className="text-2xl font-bold text-gray-800">{order.date}</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="border-b border-gray-200 pb-4 flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600">Price: ₹{item.price.toLocaleString('en-IN')}</p>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-indigo-600">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                  <div>
                    <p className="font-bold text-gray-800">Order Confirmed</p>
                    <p className="text-sm text-gray-600">{order.date}</p>
                  </div>
                </div>
                {(orderStatus === 'shipped' || orderStatus === 'delivered') && (
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                    <div>
                      <p className="font-bold text-gray-800">Shipped</p>
                      <p className="text-sm text-gray-600">In transit to customer</p>
                    </div>
                  </div>
                )}
                {orderStatus === 'delivered' && (
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                    <div>
                      <p className="font-bold text-gray-800">Delivered</p>
                      <p className="text-sm text-gray-600">Order delivered successfully</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Info Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 h-fit sticky top-20">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              <div>
                <p className="text-gray-600 text-sm">Order Status</p>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value as any)}
                  className="mt-2 w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white font-bold capitalize"
                >
                  <option value="confirmed">📋 Confirmed</option>
                  <option value="shipped">🚚 Shipped</option>
                  <option value="delivered">✅ Delivered</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold">₹{order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-bold text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (18%)</span>
                <span className="font-bold">₹{Math.round(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.18).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-2xl font-bold text-indigo-600">₹{order.total.toLocaleString('en-IN')}</span>
            </div>

            <button className="w-full px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">
              Send Tracking Update
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
