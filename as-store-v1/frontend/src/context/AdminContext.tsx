import { createContext, useContext, useState, type ReactNode } from 'react'
import * as productApi from '../api/productApi'
import * as userApi from '../api/userApi'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'customer' | 'admin'
  joinDate: string
  orders: number
  enabled?: boolean
}

export interface Product {
  id: number
  name: string
  price: number
  image: string
  rating: number
  stock: number
}

interface AdminContextType {
  users: User[]
  products: Product[]
  addUser: (user: Omit<User, 'id' | 'joinDate'>) => void
  updateUser: (id: string, user: Partial<User>) => void
  deleteUser: (id: string) => void
  changeUserRole: (id: string, role: 'customer' | 'admin') => void
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: number, product: Partial<Product>) => void
  deleteProduct: (id: number) => void
  getUser: (id: string) => User | undefined
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const addUser = async (user: Omit<User, 'id' | 'joinDate'>) => {
    const token = localStorage.getItem('accessToken') || ''
    try {
      const res = await userApi.createUser(user, token)
      setUsers(prev => [...prev, res.data])
    } catch {}
  }

  const updateUser = async (id: string, updatedData: Partial<User>) => {
    const token = localStorage.getItem('accessToken') || ''
    try {
      const res = await userApi.updateUser(id, updatedData, token)
      setUsers(prev => prev.map(user => (user.id === id ? res.data : user)))
    } catch {}
  }

  const deleteUser = async (id: string) => {
    const token = localStorage.getItem('accessToken') || ''
    try {
      await userApi.deleteUser(id, token)
      setUsers(prev => prev.filter(user => user.id !== id))
    } catch {}
  }

  const changeUserRole = async (id: string, role: 'customer' | 'admin') => {
    const token = localStorage.getItem('accessToken') || ''
    try {
      await userApi.changeUserRole(id, role, token)
      setUsers(prev => prev.map(user => (user.id === id ? { ...user, role } : user)))
    } catch {}
  }

  const addProduct = async (product: any) => {
    const token = localStorage.getItem('accessToken') || ''
    try {
      const res = await productApi.createProductWithImage(product, token)
      setProducts(prev => [...prev, res.data])
    } catch {}
  }

  const updateProduct = async (id: number, updatedData: Partial<Product>) => {
    const token = localStorage.getItem('accessToken') || ''
    try {
      const res = await productApi.updateProduct(id, updatedData, token)
      setProducts(prev => prev.map(product => (product.id === id ? res.data : product)))
    } catch {}
  }

  const deleteProduct = async (id: number) => {
    const token = localStorage.getItem('accessToken') || ''
    try {
      await productApi.deleteProduct(id, token)
      setProducts(prev => prev.filter(product => product.id !== id))
    } catch {}
  }

  const getUser = (id: string) => {
    return users.find(user => user.id === id)
  }

  return (
    <AdminContext.Provider
      value={{
        users,
        products,
        addUser,
        updateUser,
        deleteUser,
        changeUserRole,
        addProduct,
        updateProduct,
        deleteProduct,
        getUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
