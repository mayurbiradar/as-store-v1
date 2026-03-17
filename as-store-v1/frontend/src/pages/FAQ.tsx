export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6 text-purple-800">Frequently Asked Questions</h1>
      <ul className="space-y-6">
        <li>
          <h2 className="text-xl font-semibold mb-2">How do I place an order?</h2>
          <p className="text-gray-700">Browse our collection, add items to your cart, and proceed to checkout. Follow the instructions to complete your purchase securely.</p>
        </li>
        <li>
          <h2 className="text-xl font-semibold mb-2">What payment methods are accepted?</h2>
          <p className="text-gray-700">We accept all major credit/debit cards, UPI, net banking, and PayPal.</p>
        </li>
        <li>
          <h2 className="text-xl font-semibold mb-2">Can I return or exchange my order?</h2>
          <p className="text-gray-700">Yes, we offer easy returns and exchanges within 30 days of delivery. Please visit our Shipping Policy page for details.</p>
        </li>
        <li>
          <h2 className="text-xl font-semibold mb-2">How can I track my order?</h2>
          <p className="text-gray-700">Once your order is shipped, you will receive a tracking link via email and SMS.</p>
        </li>
        <li>
          <h2 className="text-xl font-semibold mb-2">Is my personal information safe?</h2>
          <p className="text-gray-700">Absolutely. We use industry-standard encryption and never share your data with third parties. See our Privacy Policy for more info.</p>
        </li>
      </ul>
    </div>
  );
}