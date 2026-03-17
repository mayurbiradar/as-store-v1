import { API_BASE_URL } from '../constants';
import { useEffect, useState } from 'react';
import { getMyOrders } from '../api/orderApi';

interface Order {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  currency: string;
  items: any[];
  subtotal: number;
  tax: number;
  address: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod?: string;
  createdAt?: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const res = await getMyOrders(accessToken || undefined);
        setOrders(res.data || []);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
            My Orders
          </h1>
          
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="text-6xl mb-6">📦</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Loading...</h2>
            <p className="text-xl text-gray-600 mb-8">Please wait while we fetch your orders.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 px-3 sm:px-4 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 sm:mb-12">
          My Orders
        </h1>
        {loading ? (
          <div className="text-center text-lg text-gray-600">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-lg text-gray-600">No orders found.</div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-gradient-to-b from-purple-600 to-pink-400">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-bold text-purple-700 text-lg">Order #{order.id}</span>
                    <span className="ml-4 text-gray-600">Status: <span className="font-bold capitalize">{order.status}</span></span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 text-sm">Date: {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</span>
                  </div>
                </div>
                {/* Shipping Address Summary */}
                {order.address && (
                  <div className="mb-4">
                    <div className="text-sm font-bold text-gray-800 mb-1">Shipping Address</div>
                    <div className="text-xs text-gray-700">
                      {order.address.firstName} {order.address.lastName}, {order.address.address}, {order.address.city}, {order.address.state} - {order.address.pincode}
                      <span className="ml-2">Phone: {order.address.phone}</span>
                    </div>
                  </div>
                )}
                <div className="mb-2 text-lg font-bold text-gray-800">Order Items</div>
                <div className="flex flex-wrap gap-6 items-center mb-4">
                  {order.items && order.items.map(item => (
                    <div key={item.productId} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 shadow-sm">
                      {item.image && (
                        <img
                          src={item.image.startsWith('/images/') ? `${API_BASE_URL}${item.image}` : item.image}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-bold text-gray-800 text-base">Product: {item.productName}</div>
                        <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                        <div className="text-sm text-purple-600 font-bold">Item Price: ₹{item.price}</div>
                        <div className="text-sm text-gray-500">Subtotal: ₹{item.subtotal}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <div className="text-gray-700">Total: <span className="font-bold text-lg">₹{order.totalAmount}</span></div>
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg transition duration-200 text-sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Order Details Modal */}
        {selectedOrder && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={e => {
              if (e.target === e.currentTarget) setSelectedOrder(null);
            }}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full relative" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl" onClick={() => setSelectedOrder(null)}>&times;</button>
              <h2 className="text-2xl font-bold mb-6 text-purple-800">Order #{selectedOrder.id} Details</h2>
              {/* Order Summary and Order Details at Top */}
              <div className="flex flex-col md:flex-row gap-8 border-b border-gray-200 pb-4 mb-6">
                {/* Order Summary Left */}
                <div className="md:w-1/2 w-full">
                  <div className="mb-2 text-lg font-bold text-gray-800">Order Summary</div>
                  <div className="mb-1 text-gray-700">Status: <span className="font-bold capitalize">{selectedOrder.status}</span></div>
                  <div className="mb-1 text-gray-700">Order Date: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}</div>
                  <div className="mb-1 text-gray-700">Total Amount: <span className="font-bold text-purple-600">₹{selectedOrder.totalAmount}</span> <span className="text-xs text-gray-500">(Inclusive of 18% tax)</span></div>
                  <div className="mb-1 text-gray-700">Payment Method: <span className="font-bold">{selectedOrder.paymentMethod || 'COD'}</span></div>
                </div>
                {/* Order Item Images and Info Right */}
                <div className="md:w-1/2 w-full flex flex-col gap-4">
                  <div className="mb-2 text-lg font-bold text-gray-800">Order Items</div>
                  {selectedOrder.items && selectedOrder.items.map(item => (
                    <div key={item.productId} className="flex items-center gap-4 p-3">
                      {item.image && (
                        <img
                          src={item.image.startsWith('/images/') ? `${API_BASE_URL}${item.image}` : item.image}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-bold text-gray-800 text-base">Product: {item.productName}</div>
                        <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                        <div className="text-sm text-purple-600 font-bold">Item Price: ₹{item.price}</div>
                        <div className="text-sm text-gray-500">Subtotal: ₹{item.subtotal}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Shipping Address Left */}
                {selectedOrder.address && (
                  <div className="md:w-1/3 w-full mb-6 md:mb-0">
                    <div className="text-lg font-bold text-gray-800 mb-2">Shipping Address</div>
                    <div className="p-4">
                      <div className="text-gray-700 mb-1">{selectedOrder.address.firstName} {selectedOrder.address.lastName}</div>
                      <div className="text-gray-700 mb-1">{selectedOrder.address.address}</div>
                      <div className="text-gray-700 mb-1">{selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}</div>
                      <div className="text-gray-700 mb-1">Phone: {selectedOrder.address.phone}</div>
                      <div className="text-gray-700 mb-1">Email: {selectedOrder.address.email}</div>
                    </div>
                  </div>
                )}
                {/* Order Items Right */}
                {/* Removed: Order Items from bottom section */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
