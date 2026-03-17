export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6 text-purple-800">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-4">
        We love hearing from our customers! Whether you have a question, need assistance, or want to share your experience, our team is here to help.
      </p>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Customer Support</h2>
        <p className="text-gray-700">Email: <a href="mailto:mr.mayurbiradar@gmail.com" className="text-purple-600 underline">mr.mayurbiradar@gmail.com</a></p>
        <p className="text-gray-700">Mobile: <a href="tel:9021901050" className="text-purple-600 underline">9021901050</a></p>
        <p className="text-gray-700">Hours: Mon-Fri, 9am-6pm IST</p>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Visit Our Store</h2>
        <p className="text-gray-700">AS Store, Kalewadi Pachpir Chowk, Vijay Nagar, Kalewadi, Pimpri-Chinchwad, Maharashtra 411017, India</p>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-2">Connect With Us</h2>
        <p className="text-gray-700">Follow us on <a href="https://www.instagram.com/saaj_sakhicha_by_akshata" target="_blank" rel="noopener noreferrer" className="text-pink-600 underline">Instagram</a>  for the latest updates and offers.</p>
      </div>
    </div>
  );
}
