export default function About() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6 text-purple-800">About AS Store</h1>
      <p className="text-lg text-gray-700 mb-4">
        AS Store is a premier destination for exquisite handcrafted jewelry, blending timeless elegance with modern design. Our collection features ethically sourced gemstones, precious metals, and unique pieces crafted by skilled artisans.
      </p>
      <p className="text-lg text-gray-700 mb-4">
        Founded in 2026 we are committed to quality, authenticity, and customer satisfaction. Whether you are celebrating a special occasion or simply treating yourself, our jewelry is designed to make every moment memorable.
      </p>
      <ul className="list-disc pl-6 text-gray-700 mb-4">
        <li>Ethically sourced materials</li>
        <li>Lifetime guarantee on all products</li>
        <li>Custom design services available</li>
        <li>Free shipping and easy returns</li>
      </ul>
      <p className="text-lg text-gray-700">
        Discover the beauty and craftsmanship that set AS Store apart. Thank you for choosing us to be a part of your story.
      </p>
      <p className="text-lg text-gray-700 mt-4">
        Contact us: <a href={`mailto:${import.meta.env.VITE_EMAIL}`} className="text-blue-600 underline">{import.meta.env.VITE_EMAIL}</a><br />
        Mobile: <a href={`tel:${import.meta.env.VITE_MOBILE}`} className="text-blue-600 underline">{import.meta.env.VITE_MOBILE}</a>
      </p>
    </div>
  );
}
