import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white py-20 sm:py-28 md:py-36 px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-400 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-300 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-purple-300 rounded-full blur-md animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-rose-400 rounded-full blur-sm animate-pulse delay-1500"></div>
      </div>

      {/* Floating jewelry icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-16 text-4xl animate-bounce delay-300 opacity-20">💎</div>
        <div className="absolute top-32 right-24 text-3xl animate-bounce delay-700 opacity-15">💍</div>
        <div className="absolute bottom-24 left-20 text-2xl animate-bounce delay-1000 opacity-25">✨</div>
        <div className="absolute bottom-16 right-32 text-3xl animate-bounce delay-500 opacity-20">💎</div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight bg-gradient-to-r from-white via-pink-200 to-yellow-200 bg-clip-text text-transparent drop-shadow-lg">
            Timeless Beauty{' '}
            <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-yellow-300 bg-clip-text text-transparent animate-pulse">
              Redefined
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-purple-100 mb-8 max-w-3xl mx-auto px-4 leading-relaxed font-light">
            Discover our exquisite collection of handcrafted jewelry that celebrates your unique elegance and tells your story
          </p>
        </div>

        <div className="flex gap-4 justify-center flex-wrap animate-fade-in-up delay-300">
          <Link to="/collection">
            <button className="group relative px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105 transition-all duration-300 text-base sm:text-lg lg:text-xl overflow-hidden">
              <span className="relative z-10">Shop Collection</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
            </button>
          </Link>
          <Link to="/about">
            <button className="px-8 sm:px-10 py-4 sm:py-5 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300 text-base sm:text-lg lg:text-xl">
              Our Story
            </button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex justify-center items-center gap-8 text-sm text-purple-200 animate-fade-in-up delay-500">
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Lifetime Warranty</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>30-Day Returns</span>
          </div>
        </div>
      </div>
    </section>
  );
};