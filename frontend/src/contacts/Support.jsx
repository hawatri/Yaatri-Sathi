// src/pages/Support.js
import React, { useState } from "react";

export default function Support() {
  const [faqOpen, setFaqOpen] = useState(null);

  const faqs = [
    {
      question: "How do I register my journey?",
      answer:
        "Go to the 'Journeys' page after signing up, and fill in your travel details. You can update or edit anytime before starting your trip.",
    },
    {
      question: "How are Safe Zones decided?",
      answer:
        "Safe Zones are determined using live crowd density, official advisories, and real-time incident reports collected from public APIs.",
    },
    {
      question: "What should I do if I forget my password?",
      answer:
        "Click on the 'Forgot Password' link on the login page. You’ll receive an OTP/email to reset it securely.",
    },
    {
      question: "Can I use the app offline?",
      answer:
        "Yes, you can still access saved journeys and emergency contacts offline. However, live Safe Zone updates need internet access.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-gray-900 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">
        Support Center
      </h1>

      {/* FAQs Section */}
      <section className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">FAQs</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-blue-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <button
                onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                className="flex justify-between items-center w-full text-left font-medium text-blue-900"
              >
                {faq.question}
                <span>{faqOpen === index ? "−" : "+"}</span>
              </button>
              {faqOpen === index && (
                <p className="mt-2 text-gray-700">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Options */}
      <section className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">
          Contact Support
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-blue-200 rounded-xl shadow-sm text-center">
            <h3 className="text-lg font-semibold text-blue-900">Email</h3>
            <p className="text-gray-700">support@touristsafety.com</p>
          </div>
          <div className="p-6 bg-white border border-blue-200 rounded-xl shadow-sm text-center">
            <h3 className="text-lg font-semibold text-blue-900">Phone</h3>
            <p className="text-gray-700">+91 1800-123-456</p>
          </div>
          <div className="p-6 bg-white border border-blue-200 rounded-xl shadow-sm text-center">
            <h3 className="text-lg font-semibold text-blue-900">Live Chat</h3>
            <p className="text-gray-700">Available 9AM - 9PM IST</p>
          </div>
        </div>
      </section>

      {/* Feedback Form */}
      <section className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">
          Send Feedback
        </h2>
        <form className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            placeholder="Your Message"
            rows="4"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          ></textarea>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
            Submit
          </button>
        </form>
      </section>

      {/* Resources Section */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">
          Helpful Resources
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            <a
              href="https://www.incredibleindia.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline"
            >
              Incredible India – Travel Advisory
            </a>
          </li>
          <li>
            <a
              href="https://www.mea.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline"
            >
              Ministry of External Affairs
            </a>
          </li>
          <li>
            <a
              href="https://tourism.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline"
            >
              Ministry of Tourism
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
