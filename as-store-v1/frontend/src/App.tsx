import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { AdminProvider } from './context/AdminContext'
import { UserProvider } from './context/UserContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import MyAccount from './pages/MyAccount'
import Orders from './pages/Orders'
import AdminDashboard from './pages/AdminDashboard'
import UserDetail from './pages/UserDetail'
import ProductDetail from './pages/ProductDetail'
import OrderDetail from './pages/OrderDetail'
import FAQ from './pages/FAQ';
import Support from './pages/Support';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import ShippingPolicy from './pages/ShippingPolicy';
import './App.css'

function App() {
  return (
    <ToastProvider>
      <AdminProvider>
        <CartProvider>
          <UserProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/collection" element={<Collection />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/my-account" element={<MyAccount />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/user/:userId" element={<UserDetail />} />
                    <Route path="/admin/product/:productId" element={<ProductDetail />} />
                    <Route path="/admin/order/:orderId" element={<OrderDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                    <Route path="/termsconditions" element={<TermsConditions />} />
                    <Route path="/shippingpolicy" element={<ShippingPolicy />} />
                    <Route path="*" element={<Home />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </UserProvider>
        </CartProvider>
      </AdminProvider>
    </ToastProvider>
  )
}

export default App
