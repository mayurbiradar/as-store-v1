// TypeScript interfaces for dashboard data
interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
  active?: boolean;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: string;
  orders?: number;
  joinDate?: string;
}

interface Address {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email?: string;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  image?: string;
}

interface Order {
  id: string;
  status: string;
  createdAt?: string;
  address?: Address;
  items?: OrderItem[];
  totalAmount?: number;
  paymentMethod?: string;
}
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import * as productApi from '../api/productApi';
import * as userApi from '../api/userApi';
import * as orderApi from '../api/orderApi';
import { API_BASE_URL } from '../constants';
import { checkAdminAndProceed } from '../utils/authUtils';

export default function AdminDashboard() {
      const [totalRevenue, setTotalRevenue] = useState<number>(0);
      const [editingUserId, setEditingUserId] = useState<string | null>(null);
      const [editUserData, setEditUserData] = useState<any>({});
      const [savingUserId, setSavingUserId] = useState<string | null>(null);
      const [userCount, setUserCount] = useState<number>(0);
      const [productCount, setProductCount] = useState<number>(0);
      const [orderCount, setOrderCount] = useState<number>(0);
      const navigate = useNavigate();
      const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'users' | 'orders'>('dashboard');
      const [showAddProductForm, setShowAddProductForm] = useState<boolean>(false);
      const [newProduct, setNewProduct] = useState<{ name: string; price: string; image: string; rating: number; stock: number }>({ name: '', price: '', image: '', rating: 4.5, stock: 10 });
      const [uploading, setUploading] = useState<boolean>(false);
      const fileInputRef = useRef<HTMLInputElement>(null);
      const [users, setUsers] = useState<User[]>([]);
      const [products, setProducts] = useState<Product[]>([]);
      const [orders, setOrders] = useState<Order[]>([]);
      const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  useEffect(() => {
    checkAdminAndProceed(
      () => {
        const token = localStorage.getItem('accessToken') || '';
        if (activeTab === 'users') {
          userApi.getUsers(token)
            .then(res => setUsers(res.data))
            .catch(() => setUsers([]));
        } else if (activeTab === 'products') {
          productApi.getProducts()
            .then(res => setProducts(res.data))
            .catch(() => setProducts([]));
        } else if (activeTab === 'orders') {
          orderApi.getOrders(token)
            .then(res => setOrders(res.data))
            .catch(() => setOrders([]));
        } else if (activeTab === 'dashboard') {
          userApi.getUserCount(token).then(res => setUserCount(res.data)).catch(() => setUserCount(0));
          productApi.getProductCount(token).then(res => setProductCount(res.data)).catch(() => setProductCount(0));
          orderApi.getOrderCount(token).then(res => setOrderCount(res.data)).catch(() => setOrderCount(0));
          orderApi.getTotalRevenue(token).then(res => setTotalRevenue(res.data)).catch(() => setTotalRevenue(0));
        }
      },
      (path: string) => navigate(path)
    );
  }, [activeTab]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    const token = localStorage.getItem('accessToken') || '';
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('price', parseFloat(newProduct.price as string).toString());
      formData.append('stock', newProduct.stock.toString());
      if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
        formData.append('file', fileInputRef.current.files[0]);
      }
      await productApi.createProductWithImage(formData, token);
      setNewProduct({ name: '', price: '', image: '', rating: 4.5, stock: 10 });
      if (fileInputRef.current) fileInputRef.current.value = '';
      setShowAddProductForm(false);
      // Refresh products if on products tab
      if (activeTab === 'products') {
        productApi.getProducts()
          .then(res => setProducts(res.data))
          .catch(() => setProducts([]));
      }
    } catch {
      alert('Product creation failed');
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-4 sm:p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-indigo-200 mt-1 text-sm sm:text-base">Manage products, users, and orders</p>
            </div>
            <Link
              to="/"
              className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-indigo-900 font-bold rounded-lg hover:shadow-lg transition text-sm sm:text-base w-full sm:w-auto text-center"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="bg-white shadow-lg sticky top-0 z-10 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex gap-0 sm:gap-1 min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 sm:px-6 py-3 sm:py-4 font-bold border-b-4 transition text-xs sm:text-base whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 sm:px-6 py-3 sm:py-4 font-bold border-b-4 transition text-xs sm:text-base whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              📦 Products
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 sm:px-6 py-3 sm:py-4 font-bold border-b-4 transition text-xs sm:text-base whitespace-nowrap ${
                activeTab === 'users'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              👥 Users
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 sm:px-6 py-3 sm:py-4 font-bold border-b-4 transition text-xs sm:text-base whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              📋 Orders
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div 
              onClick={() => setActiveTab('users')}
              className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-blue-600 hover:shadow-lg hover:scale-105 transition cursor-pointer"
            >
              <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Total Users</p>
              <p className="text-2xl sm:text-4xl font-bold text-blue-600">{userCount}</p>
            </div>
            <div 
              onClick={() => setActiveTab('products')}
              className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-green-600 hover:shadow-lg hover:scale-105 transition cursor-pointer"
            >
              <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Total Products</p>
              <p className="text-2xl sm:text-4xl font-bold text-green-600">{productCount}</p>
            </div>
            <div 
              onClick={() => setActiveTab('orders')}
              className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-purple-600 hover:shadow-lg hover:scale-105 transition cursor-pointer"
            >
              <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Total Orders</p>
              <p className="text-2xl sm:text-4xl font-bold text-purple-600">{orderCount}</p>
            </div>
            <div 
              className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-yellow-600 hover:shadow-lg hover:scale-105 transition cursor-pointer"
            >
              <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Total Revenue</p>
              <p className="text-2xl sm:text-4xl font-bold text-yellow-600">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Manage Products</h2>
              <button
                onClick={() => setShowAddProductForm(!showAddProductForm)}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg transition"
              >
                {showAddProductForm ? '✕ Cancel' : '+ Add Product'}
              </button>
            </div>

            {/* Add Product Form */}
            {showAddProductForm && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                      className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                      required
                    />
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Add Product'}
                  </button>
                </form>
              </div>
            )}

            {/* Products List */}
            <div className="grid gap-6">
              {products.map(product => (
                <div 
                  key={product.id} 
                  onClick={() => navigate(`/admin/product/${product.id}`)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex gap-6 cursor-pointer border-l-4 border-indigo-600"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    {product.image ? (
                      <img src={product.image.startsWith('/images/') ? `${API_BASE_URL}${product.image}` : product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg" />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">No Image</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                    <p className="text-lg font-bold text-indigo-600">₹{product.price.toLocaleString('en-IN')}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>Qty: {product.stock ?? 0}</span>
                      <span>{product.active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-col h-fit">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/admin/product/${product.id}`)
                      }}
                      className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        const token = localStorage.getItem('accessToken') || '';
                        await productApi.deleteProduct(product.id, token);
                        productApi.getProducts()
                          .then(res => setProducts(res.data))
                          .catch(() => setProducts([]));
                      }}
                      className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold">First Name</th>
                      <th className="px-4 py-3 text-left font-bold">Last Name</th>
                      <th className="px-4 py-3 text-left font-bold">Email</th>
                      <th className="px-4 py-3 text-left font-bold">Mobile</th>
                      <th className="px-4 py-3 text-left font-bold">Password</th>
                      <th className="px-4 py-3 text-left font-bold">Role</th>
                      <th className="px-4 py-3 text-left font-bold">Status</th>
                      <th className="px-4 py-3 text-left font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => {
                      const isEditing = editingUserId === user.id;
                      return (
                        <tr key={user.id} className="border-t hover:bg-indigo-50 transition">
                          <td className="px-4 py-2">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editUserData.firstName ?? user.firstName}
                                onChange={e => setEditUserData({ ...editUserData, firstName: e.target.value })}
                                className="border rounded px-2 py-1 w-full"
                              />
                            ) : (
                              user.firstName
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editUserData.lastName ?? user.lastName}
                                onChange={e => setEditUserData({ ...editUserData, lastName: e.target.value })}
                                className="border rounded px-2 py-1 w-full"
                              />
                            ) : (
                              user.lastName
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {isEditing ? (
                              <input
                                type="email"
                                value={editUserData.email ?? user.email}
                                onChange={e => setEditUserData({ ...editUserData, email: e.target.value })}
                                className="border rounded px-2 py-1 w-full"
                              />
                            ) : (
                              user.email
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editUserData.phone ?? user.phone}
                                onChange={e => setEditUserData({ ...editUserData, phone: e.target.value })}
                                className="border rounded px-2 py-1 w-full"
                              />
                            ) : (
                              user.phone
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {isEditing ? (
                              <input
                                type="password"
                                value={editUserData.password ?? ''}
                                onChange={e => setEditUserData({ ...editUserData, password: e.target.value })}
                                className="border rounded px-2 py-1 w-full"
                                placeholder="••••••••"
                              />
                            ) : (
                              <span>••••••••</span>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {isEditing ? (
                              <select
                                value={editUserData.role ?? user.role}
                                onChange={e => setEditUserData({ ...editUserData, role: e.target.value })}
                                className="border rounded px-2 py-1 w-full"
                              >
                                <option value="ROLE_ADMIN">Admin</option>
                                <option value="ROLE_USER">User</option>
                              </select>
                            ) : (
                              <span className={`inline-block px-3 py-1 rounded-lg font-semibold text-white text-sm ${
                                (user.role && user.role.toLowerCase() === 'admin') ? 'bg-red-500' : 'bg-blue-500'
                              }`}>
                                {user.role === 'ROLE_ADMIN' ? 'Admin' : user.role === 'ROLE_USER' ? 'User' : 'User'}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {isEditing ? (
                              <select
                                value={'active'}
                                onChange={() => {}}
                                className="border rounded px-2 py-1 w-full"
                                disabled
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            ) : (
                              <span className={`inline-block px-3 py-1 rounded-lg font-semibold text-white text-sm bg-green-500`}>Active</span>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    className="px-3 py-1 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition text-sm"
                                    disabled={savingUserId === user.id}
                                    onClick={async e => {
                                      e.stopPropagation();
                                      setSavingUserId(user.id);
                                      const token = localStorage.getItem('accessToken') || '';
                                      try {
                                        await userApi.updateUser(user.id, editUserData, token);
                                        userApi.getUsers(token)
                                          .then(res => setUsers(res.data))
                                          .catch(() => setUsers([]));
                                        setEditingUserId(null);
                                        setEditUserData({});
                                      } catch {
                                        alert('Failed to update user');
                                      }
                                      setSavingUserId(null);
                                    }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="px-3 py-1 bg-gray-400 text-white font-bold rounded-lg hover:bg-gray-500 transition text-sm"
                                    onClick={e => {
                                      e.stopPropagation();
                                      setEditingUserId(null);
                                      setEditUserData({});
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="px-3 py-1 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition text-sm"
                                    onClick={e => {
                                      e.stopPropagation();
                                      setEditingUserId(user.id);
                                      setEditUserData({
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        email: user.email,
                                        phone: user.phone,
                                        role: user.role,
                                      });
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="px-3 py-1 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition text-sm"
                                    onClick={e => {
                                      e.stopPropagation();
                                      userApi.deleteUser(user.id);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Orders</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-xl text-gray-600">No orders yet</p>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {orders.map(order => (
                    <div 
                      key={order.id} 
                      className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-gradient-to-b from-purple-600 to-pink-400 cursor-pointer"
                    >
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
                          onClick={e => { e.stopPropagation(); setSelectedOrder(order); }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Order Details Modal Popup */}
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
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
