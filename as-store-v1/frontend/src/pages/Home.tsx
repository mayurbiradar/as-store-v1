import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  HeroSection,
  FeaturesSection,
  TestimonialsSection,
  CTASection,
  NewsletterSection
} from '../components/home';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    if (location.state && location.state.scrollToFeatured) {
      setTimeout(() => {
        const el = document.getElementById('featured-collections');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [location]);

  return (
    <div className="w-full">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <NewsletterSection />
    </div>
  );
}
