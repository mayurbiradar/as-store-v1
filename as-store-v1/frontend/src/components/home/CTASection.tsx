import { Link } from 'react-router-dom';

export const CTASection = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-gray-50 to-purple-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">💎</div>
        <div className="absolute top-20 right-20 text-4xl">✨</div>
        <div className="absolute bottom-20 left-1/3 text-5xl">💍</div>
        <div className="absolute bottom-10 right-10 text-3xl">💎</div>
      </div>

      <div className="max-w-5xl mx-auto bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-3xl p-12 sm:p-16 text-center text-white relative shadow-2xl overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-pink-200 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-purple-200 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-10 right-10 w-8 h-8 bg-yellow-200 rounded-full animate-pulse delay-1500"></div>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-pink-100 to-yellow-100 bg-clip-text text-transparent drop-shadow-lg">
            Ready to Add Sparkle to Your Life?
          </h2>
          <p className="text-xl sm:text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed font-light">
            Browse our complete collection or get personalized styling advice from our expert jewelers
          </p>

          <div className="flex gap-6 justify-center flex-wrap">
            <Link to="/collection">
              <button className="group relative px-10 py-5 bg-white text-purple-600 font-bold rounded-xl hover:shadow-2xl hover:shadow-white/25 transform hover:scale-105 transition-all duration-300 text-lg overflow-hidden">
                <span className="relative z-10">Start Shopping</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
            <Link to="/contact">
              <button className="px-10 py-5 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/60 backdrop-blur-sm transition-all duration-300 text-lg">
                Get Expert Advice
              </button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">🚚</span>
              </div>
              <h4 className="font-semibold mb-1">Free Shipping</h4>
              <p className="text-sm opacity-80">On orders over ₹999</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">🔒</span>
              </div>
              <h4 className="font-semibold mb-1">Secure Payment</h4>
              <p className="text-sm opacity-80">100% secure checkout</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">💎</span>
              </div>
              <h4 className="font-semibold mb-1">Authentic Gems</h4>
              <p className="text-sm opacity-80">Certified & genuine</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};