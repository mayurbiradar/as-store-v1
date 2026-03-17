import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import { useCart } from '../context/CartContext'

export default function UserDetail() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { users, updateUser } = useAdmin()
  const { orders } = useCart()
  
  const user = users.find(u => u.id === userId)

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<{
    firstName: string
    lastName: string
    phone: string
    email: string
    role: 'customer' | 'admin'
  }>(user ? {
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    email: user.email,
    role: user.role || 'customer',
  } : {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    role: 'customer',
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800 mb-4">User not found</p>
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

  const handleSave = () => {
    updateUser(userId!, editData)
    setIsEditing(false)
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
          <h1 className="text-4xl font-bold">User Details</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* User Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Profile Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={editData.firstName}
                        onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={editData.lastName}
                        onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                    <select
                      value={editData.role}
                      onChange={(e) => setEditData({ ...editData, role: e.target.value as 'customer' | 'admin' })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 bg-white"
                    >
                      <option value="customer">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-gray-400 text-white font-bold rounded-lg hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">First Name</p>
                      <p className="text-xl font-bold text-gray-800">{user.firstName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Last Name</p>
                      <p className="text-xl font-bold text-gray-800">{user.lastName}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Email</p>
                    <p className="text-lg font-bold text-gray-800">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Phone</p>
                    <p className="text-lg font-bold text-gray-800">{user.phone}</p>
                  </div>
                  <div className="md:col-span-2 border-t border-gray-200 pt-4">
                    <p className="text-gray-600 text-sm mb-2">Role</p>
                    <span className={`inline-block px-4 py-2 rounded-lg font-bold text-white ${
                      user.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-gray-600 text-sm mb-2">Account Info</p>
                    <div className="flex gap-8">
                      <div>
                        <p className="text-gray-600 text-xs">Join Date</p>
                        <p className="font-bold text-lg">{user.joinDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Total Orders</p>
                        <p className="font-bold text-lg">{user.orders}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Stats */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
              <div className="border-b pb-4">
                <p className="text-gray-600 text-sm mb-1">Account Status</p>
                <div className={`inline-block px-4 py-2 rounded-full font-bold text-white ${user.role === 'admin' ? 'bg-red-600' : 'bg-green-600'}`}>
                  {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                </div>
              </div>
              <div className="border-b pb-4">
                <p className="text-gray-600 text-sm mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-indigo-600">{user.orders}</p>
              </div>
              <div className="border-b pb-4">
                <p className="text-gray-600 text-sm mb-1">Account Created</p>
                <p className="font-bold text-gray-800">{user.joinDate}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-2">Quick Actions</p>
                <button className="w-full px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition">
                  🗑️ Delete User
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Orders */}
        <div className="mt-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">User's Orders</h2>
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-xl text-gray-600">This user has no orders yet</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {orders.map(order => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/admin/order/${order.id}`)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer border-l-4 border-indigo-600"
                >
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Order ID</p>
                      <p className="text-lg font-bold text-gray-800">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Date</p>
                      <p className="font-bold">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Total</p>
                      <p className="text-lg font-bold text-indigo-600">₹{order.total.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Status</p>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 font-bold rounded-full capitalize text-sm">
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
