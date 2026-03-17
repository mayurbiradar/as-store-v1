import { Link } from 'react-router-dom';
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-yellow-300 bg-clip-text text-transparent mb-4">
              Akshata's Store
            </h3>
            <p className="text-purple-200">
              Premium jewelry crafted with elegance and authenticity.
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2 text-purple-200">
              <li><Link to="/faq" className="hover:text-pink-300 transition">FAQ</Link></li>
              <li><Link to="/support" className="hover:text-pink-300 transition">Support</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="md:col-span-1 md:flex md:justify-end">
            <div>
              <h4 className="font-bold text-lg mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/saaj_sakhicha_by_akshata" target="_blank" className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition">
                  I
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-purple-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-purple-200 text-sm">
            <div className="flex flex-col items-center md:items-start">
              <p>&copy; {currentYear} Akshata's Store. All rights reserved.</p>
              <p className="mt-2">Designed and developed by <span className="font-semibold">Mayur Biradar</span> (<a href="mailto:mr.mayurbiradar@gmail.com" className="text-blue-300 underline">mr.mayurbiradar@gmail.com</a>)</p>
              <p className="mt-2">Made in <span role="img" aria-label="love">❤️</span> India</p>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacypolicy" className="hover:text-pink-300 transition">Privacy Policy</Link>
              <Link to="/termsconditions" className="hover:text-pink-300 transition">Terms & Conditions</Link>
              <Link to="/shippingpolicy" className="hover:text-pink-300 transition">Shipping Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
