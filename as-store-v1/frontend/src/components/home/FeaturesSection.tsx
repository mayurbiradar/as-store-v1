import { FEATURES } from '../../constants/homeConstants';

export const FeaturesSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 bg-gradient-to-br from-gray-50 to-purple-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">💎</div>
        <div className="absolute top-20 right-20 text-4xl">✨</div>
        <div className="absolute bottom-20 left-1/3 text-5xl">💍</div>
        <div className="absolute bottom-10 right-10 text-3xl">💎</div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Why Choose Our Jewelry
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the perfect blend of craftsmanship, quality, and elegance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="group bg-white p-8 sm:p-10 rounded-2xl shadow-lg hover:shadow-2xl text-center transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 border border-gray-100 hover:border-purple-200 relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Hover background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Icon with animation */}
              <div className="relative z-10 mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-purple-200/50">
                  {feature.icon}
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Decorative corner element */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform rotate-45"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};