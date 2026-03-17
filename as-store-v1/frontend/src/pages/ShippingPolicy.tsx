export default function ShippingPolicy() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6 text-purple-800">Shipping Policy</h1>
      <p className="text-lg text-gray-700 mb-4">We strive to deliver your order quickly and safely. Here’s what you need to know about our shipping process:</p>
      <ul className="list-disc pl-6 text-gray-700 mb-4">
        <li>Orders are processed within 1-2 business days.</li>
        <li>Standard delivery time is 3-7 business days across India.</li>
        <li>Tracking information will be provided via email and SMS once your order is shipped.</li>
        <li>Free shipping on all orders above ₹999.</li>
        <li>Returns and exchanges are easy—just contact our support team within 30 days of delivery.</li>
      </ul>
      <p className="text-lg text-gray-700">For shipping questions, contact us at <a href="mailto:mr.mayurbiradar@gmail.com" className="text-blue-600 underline">mr.mayurbiradar@gmail.com</a>.</p>
    </div>
  );
}