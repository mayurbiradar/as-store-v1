import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getMyOrders } from '../api/orderApi';
import { API_BASE_URL } from '../constants';

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email?: string;
}

export default function MyAccount() {
  const { user, logout } = useUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'edit' | 'addresses' | 'orders'>('profile');
  const [editData, setEditData] = useState(user || {});

  // Update editData whenever user changes
  useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchAddresses = async () => {
    if (!user?.id || loadingAddresses) return;

    setLoadingAddresses(true);
    try {
      const token = localStorage.getItem('accessToken') || '';
      const res = await fetch(`${import.meta.env.VITE_API_GATEWAY_ENDPOINT || ''}/api/orders/users/${user.id}/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setAddresses(data);
    } catch {
      setAddresses([]);
    }
    setLoadingAddresses(false);
  };

  const fetchOrders = async () => {
    if (!user?.email || loadingOrders) return;

    setLoadingOrders(true);
    try {
      const token = localStorage.getItem('accessToken') || undefined;
      const res = await getMyOrders(token);
      setOrders(res.data || []);
    } catch {
      setOrders([]);
    }
    setLoadingOrders(false);
  };

  const deleteAddress = async (addressId: string) => {
    if (!user?.id) return;

    try {
      const token = localStorage.getItem('accessToken') || '';
      const res = await fetch(`${import.meta.env.VITE_API_GATEWAY_ENDPOINT || ''}/api/orders/users/${user.id}/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Remove the deleted address from the local state
        setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      } else {
        console.error('Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  if (!user || !user.email) return <div className="p-8">Not logged in</div>;

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    console.log('handleSave called');
    console.log('user:', user);
    console.log('editData:', editData);
    console.log('user?.id:', user?.id);

    try {
      const token = localStorage.getItem('accessToken') || '';
      console.log('token:', token);
      console.log('API URL:', `${import.meta.env.VITE_API_GATEWAY_ENDPOINT || ''}/api/auth/users/update/${user?.id}`);

      const response = await fetch(`${import.meta.env.VITE_API_GATEWAY_ENDPOINT || ''}/api/auth/users/update/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      console.log('Response status:', response.status);
      console.log('Response:', await response.text());

      if (response.ok) {
        setActiveTab('profile');
        window.location.reload();
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            My Account
          </h1>
          <p className="text-gray-600 text-lg">Manage your profile and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {/* User Info Card */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">{user!.firstName?.[0]}{user!.lastName?.[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user!.firstName} {user!.lastName}</h3>
                    <p className="text-blue-100">{user!.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  <span className="text-xl">👤</span>
                  <span className="font-medium">Profile</span>
                </button>

                <button
                  onClick={() => {
                    if (user) {
                      setEditData({
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        email: user.email || '',
                        phone: user.phone || '',
                      });
                    }
                    setActiveTab('edit');
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 mt-2 ${
                    activeTab === 'edit'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  <span className="text-xl">✏️</span>
                  <span className="font-medium">Edit Profile</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('addresses');
                    fetchAddresses();
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 mt-2 ${
                    activeTab === 'addresses'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  <span className="text-xl">📍</span>
                  <span className="font-medium">Addresses</span>
                </button>

              <button
                onClick={() => {
                  setActiveTab('orders');
                  fetchOrders();
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 mt-2 ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
                }`}
              >
                <span className="text-xl">📦</span>
                <span className="font-medium">My Orders</span>
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 mt-4 bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-md"
              >
                <span className="text-xl">🚪</span>
                <span className="font-medium">Logout</span>
              </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Welcome back, {user!.firstName}!</h2>
                      <p className="text-blue-100">Here's your account overview</p>
                    </div>
                    <div className="text-6xl opacity-20">👋</div>
                  </div>
                </div>

                {/* Profile Info Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Personal Information</h3>
                        <p className="text-sm text-gray-500">Your basic details</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-gray-600">First Name</span>
                        <span className="font-semibold text-gray-800">{user!.firstName}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-gray-600">Last Name</span>
                        <span className="font-semibold text-gray-800">{user!.lastName}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-gray-600">Email</span>
                        <span className="font-semibold text-gray-800">{user!.email}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Phone</span>
                        <span className="font-semibold text-gray-800">{user!.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📊</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Account Stats</h3>
                        <p className="text-sm text-gray-500">Your activity summary</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Member since</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">2024</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Account Status</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="text-center">
                    <button
                      onClick={() => {
                        if (user) {
                          setEditData({
                            firstName: user.firstName || '',
                            lastName: user.lastName || '',
                            email: user.email || '',
                            phone: user.phone || '',
                          });
                        }
                        setActiveTab('edit');
                      }}
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <span>✏️</span>
                      <span>Edit Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'edit' && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Edit Your Profile</h2>
                  <p className="text-gray-600">Update your personal information</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="firstName"
                          placeholder="Enter your first name"
                          value={editData.firstName || ''}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                        />
                        <span className="absolute left-4 top-3.5 text-gray-400 text-xl">👤</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Enter your last name"
                          value={editData.lastName || ''}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                        />
                        <span className="absolute left-4 top-3.5 text-gray-400 text-xl">👤</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={editData.email || ''}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                        />
                        <span className="absolute left-4 top-3.5 text-gray-400 text-xl">📧</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Enter your phone number"
                          value={editData.phone || ''}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                        />
                        <span className="absolute left-4 top-3.5 text-gray-400 text-xl">📱</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>💾</span>
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={() => {
                      if (user) setEditData(user);
                      setActiveTab('profile');
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>❌</span>
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Addresses</h2>
                  <p className="text-gray-600">Manage your delivery addresses</p>
                </div>

                {loadingAddresses ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">Loading addresses...</span>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📍</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No addresses found</h3>
                    <p className="text-gray-600">Add your first delivery address to get started</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {addresses.map((addr, index) => (
                      <div key={addr.id} className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          #{index + 1}
                        </div>

                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">🏠</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-gray-800 mb-2">
                              {addr.firstName} {addr.lastName}
                            </h3>

                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-start space-x-2">
                                <span className="text-gray-400 mt-0.5">📍</span>
                                <span className="leading-relaxed">{addr.address}</span>
                              </div>

                              <div className="flex items-center space-x-2">
                                <span className="text-gray-400">🏙️</span>
                                <span>{addr.city}, {addr.state} - {addr.pincode}</span>
                              </div>

                              <div className="flex items-center space-x-2">
                                <span className="text-gray-400">📱</span>
                                <span>{addr.phone}</span>
                              </div>

                              {addr.email && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-400">📧</span>
                                  <span>{addr.email}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-blue-100">
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="w-full bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-200"
                          >
                            Delete Address
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h2>
                  <p className="text-gray-600">Track and manage your order history</p>
                </div>

                {loadingOrders ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">Loading your orders...</span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
                    <Link
                      to="/"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <span>🛒</span>
                      <span>Start Shopping</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                        {/* Order Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                              <span className="text-2xl">📦</span>
                            </div>
                            <div>
                              <h3 className="font-bold text-xl text-gray-800">Order #{order.id}</h3>
                              <p className="text-gray-600 text-sm">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : 'Date not available'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              <span className="mr-2">
                                {order.status === 'delivered' ? '✅' :
                                 order.status === 'shipped' ? '🚚' :
                                 order.status === 'confirmed' ? '📋' : '⏳'}
                              </span>
                              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-800 mb-4">Order Items</h4>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {order.items && order.items.map((item: any) => (
                              <div key={item.productId} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                {item.image && (
                                  <img
                                    src={item.image.startsWith('/images/') ? `${API_BASE_URL}${item.image}` : item.image}
                                    alt={item.productName}
                                    className="w-full h-24 object-cover rounded-lg mb-3"
                                  />
                                )}
                                <h5 className="font-semibold text-gray-800 text-sm mb-1">{item.productName}</h5>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600">Qty: {item.quantity}</span>
                                  <span className="font-bold text-blue-600">₹{item.price}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Address */}
                        {order.address && (
                          <div className="mb-6 p-4 bg-white rounded-xl border border-gray-100">
                            <h4 className="font-semibold text-gray-800 mb-2">Shipping Address</h4>
                            <div className="text-sm text-gray-600">
                              <div className="font-medium text-gray-800">{order.address.firstName} {order.address.lastName}</div>
                              <div>{order.address.address}</div>
                              <div>{order.address.city}, {order.address.state} - {order.address.pincode}</div>
                              <div className="mt-1">📱 {order.address.phone}</div>
                            </div>
                          </div>
                        )}

                        {/* Order Total */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <span className="font-semibold text-gray-800">Order Total:</span>
                          <span className="text-2xl font-bold text-blue-600">
                            ₹{order.items ? order.items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0) : 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
