import { useState } from 'react';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-4xl animate-bounce delay-300">💎</div>
        <div className="absolute top-20 right-20 text-3xl animate-bounce delay-700">✨</div>
        <div className="absolute bottom-20 left-1/3 text-4xl animate-bounce delay-1000">💍</div>
        <div className="absolute bottom-10 right-10 text-2xl animate-bounce delay-500">💎</div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Stay in the Sparkle Loop
          </h2>
          <p className="text-lg sm:text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
            Be the first to know about new collections, exclusive offers, and jewelry care tips delivered to your inbox
          </p>
        </div>

        {!isSubscribed ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 bg-white/95 backdrop-blur-sm border-2 border-white/20 rounded-xl focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 text-gray-800 placeholder-gray-500 text-base transition-all duration-300"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400">
                  📧
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105 transition-all duration-300 text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Subscribing...
                  </div>
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border-2 border-green-300 shadow-xl">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome to the Sparkle Family!</h3>
              <p className="text-gray-600">Thank you for subscribing. Check your inbox for a special welcome gift!</p>
            </div>
          </div>
        )}

        {/* Trust indicators */}
        <div className="mt-8 flex justify-center items-center gap-8 text-sm text-purple-200">
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>No spam, ever</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Unsubscribe anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Exclusive offers</span>
          </div>
        </div>
      </div>
    </section>
  );
};