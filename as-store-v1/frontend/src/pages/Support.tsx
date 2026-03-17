export default function Support() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6 text-purple-800">Customer Support</h1>
      <p className="text-lg text-gray-700 mb-4">Our team is here to help you with any questions or issues. Reach out to us and we’ll respond as quickly as possible.</p>
      <ul className="list-disc pl-6 text-gray-700 mb-4">
        <li>Email: <a href="mailto:mr.mayurbiradar@gmail.com" className="text-blue-600 underline">mr.mayurbiradar@gmail.com</a></li>
        <li>Mobile: <a href="tel:9021901050" className="text-blue-600 underline">9021901050</a></li>
        <li>Hours: Mon-Fri, 9am-6pm IST</li>
      </ul>
      <p className="text-lg text-gray-700">For urgent queries, please mention “URGENT” in your email subject line.</p>
    </div>
  );
}