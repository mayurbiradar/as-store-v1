export interface Testimonial {
  name: string;
  city: string;
  comment: string;
  rating: number;
  icon: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Priya Sharma',
    city: 'Pune',
    comment: 'The craftsmanship is amazing. I love my new necklace, it sparkles beautifully!',
    rating: 5,
    icon: '👩'
  },
  {
    name: 'Rohit Patil',
    city: 'Pune',
    comment: 'Bought a ring for my wife. She absolutely loved it! Great quality and fast delivery.',
    rating: 5,
    icon: '👨'
  },
  {
    name: 'Sneha Kulkarni',
    city: 'Pune',
    comment: 'The earrings are gorgeous and lightweight. Will definitely buy again!',
    rating: 4,
    icon: '👩'
  },
  {
    name: 'Amit Deshmukh',
    city: 'Pune',
    comment: 'Excellent customer service and beautiful designs. Highly recommended!',
    rating: 5,
    icon: '👨'
  },
  {
    name: 'Meera Joshi',
    city: 'Pune',
    comment: 'The bracelet is stunning and fits perfectly. Thank you for the quick delivery!',
    rating: 5,
    icon: '👩'
  },
  {
    name: 'Vikas More',
    city: 'Pune',
    comment: 'Beautiful packaging and amazing product. My mom loved her birthday gift!',
    rating: 5,
    icon: '👨'
  },
  {
    name: 'Neha Singh',
    city: 'Pune',
    comment: 'Fast shipping and the product exceeded my expectations!',
    rating: 4,
    icon: '👩'
  },
  {
    name: 'Suresh Pawar',
    city: 'Pune',
    comment: 'The pendant is elegant and matches my style perfectly.',
    rating: 5,
    icon: '👨'
  },
  {
    name: 'Anjali Mehta',
    city: 'Pune',
    comment: 'Amazing quality and affordable prices. Will recommend to friends.',
    rating: 5,
    icon: '👩'
  },
  {
    name: 'Kiran Chavan',
    city: 'Pune',
    comment: 'The ring is so pretty and fits just right. Love it!',
    rating: 4,
    icon: '👨'
  },
  {
    name: 'Ritika Jain',
    city: 'Pune',
    comment: 'Customer support was very helpful and responsive.',
    rating: 5,
    icon: '👩'
  },
  {
    name: 'Manoj Bhosale',
    city: 'Pune',
    comment: 'The jewelry is unique and gets lots of compliments.',
    rating: 5,
    icon: '👨'
  }
];

export const FEATURES: Feature[] = [
  {
    icon: '✨',
    title: 'Premium Quality',
    description: 'Handpicked gemstones and authentic materials'
  },
  {
    icon: '🎁',
    title: 'Perfect Gifts',
    description: 'Beautifully packaged for every occasion'
  },
  {
    icon: '🛡️',
    title: 'Lifetime Guarantee',
    description: 'Expert craftsmanship with full warranty'
  }
];

export const CAROUSEL_CONFIG = {
  GROUP_SIZE: 4,
  INTERVAL_MS: 5000
} as const;