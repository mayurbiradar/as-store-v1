import { useCarousel } from '../../hooks/useCarousel';
import { TESTIMONIALS, CAROUSEL_CONFIG, type Testimonial } from '../../constants/homeConstants';

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="group bg-white/95 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-500 min-w-[380px] max-w-[400px] h-[280px] flex-1 flex flex-col justify-between relative shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transform hover:scale-105 hover:-translate-y-2">
    {/* Decorative gradient border */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-200/20 via-pink-200/20 to-yellow-200/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div className="relative z-10">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-2xl mr-4 shadow-lg">
          {testimonial.icon}
        </div>
        <div className="flex space-x-1">
          {[...Array(testimonial.rating)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-lg drop-shadow-sm">⭐</span>
          ))}
        </div>
      </div>
      <p className="text-lg mb-6 italic text-gray-700 text-center leading-relaxed font-medium">
        "{testimonial.comment}"
      </p>
    </div>

    <div className="relative z-10 border-t border-gray-200 pt-4">
      <p className="font-bold text-gray-800 text-center">
        {testimonial.name}
        <span className="block text-sm text-purple-600 font-medium mt-1">
          {testimonial.city}
        </span>
      </p>
    </div>

    {/* Quote decoration */}
    <div className="absolute top-4 right-6 text-4xl text-purple-200 opacity-50 group-hover:opacity-70 transition-opacity duration-300">
      "
    </div>
  </div>
);

export const TestimonialsSection = () => {
  const { activeIndex, totalGroups, goToSlide } = useCarousel(TESTIMONIALS.length);

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">💎</div>
        <div className="absolute top-20 right-20 text-4xl">✨</div>
        <div className="absolute bottom-20 left-1/3 text-5xl">💍</div>
        <div className="absolute bottom-10 right-10 text-3xl">💎</div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            What Our Customers Say
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
            Real stories from our valued customers who trust us with their precious moments
          </p>
        </div>

        <div className="flex justify-center items-center">
          <div className="relative w-full max-w-6xl flex flex-col items-center">
            <div className="flex flex-row gap-8 transition-all duration-700 justify-center w-full mb-12">
              {TESTIMONIALS.slice(
                activeIndex * CAROUSEL_CONFIG.GROUP_SIZE,
                activeIndex * CAROUSEL_CONFIG.GROUP_SIZE + CAROUSEL_CONFIG.GROUP_SIZE
              ).map((testimonial, idx) => (
                <TestimonialCard key={`${activeIndex}-${idx}`} testimonial={testimonial} />
              ))}
            </div>

            {/* Enhanced carousel indicators */}
            <div className="flex justify-center space-x-3">
              {Array.from({ length: totalGroups }).map((_, idx) => (
                <button
                  key={idx}
                  className={`relative w-4 h-4 rounded-full transition-all duration-500 ${
                    activeIndex === idx
                      ? 'bg-white shadow-lg shadow-white/30 scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to testimonial group ${idx + 1}`}
                >
                  {activeIndex === idx && (
                    <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};