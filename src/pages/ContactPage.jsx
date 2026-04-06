import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaUser,
  FaChevronDown,
  FaPaperPlane,
  FaCheck,
} from "react-icons/fa6";

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  return (
    <div className="w-full relative z-10 overflow-hidden">
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-eatpur-green-light/10 to-transparent pointer-events-none -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src="/icons/flourish-top.png" alt="" className="h-6 mx-auto mb-4 opacity-50" onError={(e)=> e.target.style.display='none'} />
          <h1 className="text-6xl md:text-7xl font-display text-eatpur-dark mb-6 leading-[1.2] tracking-tight">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl font-serif italic text-eatpur-text max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </motion.div>
      </section>

      <section className="py-12 px-6 max-w-7xl mx-auto pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Contact Info */}
          <div className="space-y-6">
            <h2 className="text-3xl text-eatpur-dark font-display mb-8">
              Reach Out directly
            </h2>

            {[
              {
                icon: <FaPhone />,
                title: "Call Us",
                text: "+91 90440 48080",
                link: "tel:+919044048080",
              },
              {
                icon: <FaEnvelope />,
                title: "Email Us",
                text: "lovelesh@eatpur.com",
                link: "mailto:lovelesh@eatpur.com",
              },
              {
                icon: <FaLocationDot />,
                title: "Location",
                text: "New Delhi, India",
                link: "#",
              },
              {
                icon: <FaWhatsapp />,
                title: "WhatsApp",
                text: "Chat with us directly",
                link: "https://wa.me/919044048080",
                color: "text-green-600",
              },
            ].map((info, i) => (
              <motion.a
                href={info.link}
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="vintage-card bg-white p-6 flex items-center gap-6 group hover:-translate-y-1 transition-transform border border-black/5"
              >
                <div
                  className={`w-14 h-14 rounded-full bg-eatpur-white-warm flex items-center justify-center text-xl shadow-inner border border-black/5 group-hover:scale-110 transition-transform ${info.color || "text-eatpur-green-dark"}`}
                >
                  {info.icon}
                </div>
                <div>
                  <h4 className="text-eatpur-dark font-display font-medium text-lg">
                    {info.title}
                  </h4>
                  <p className="text-eatpur-text group-hover:text-eatpur-green-dark transition-colors">
                    {info.text}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="vintage-card bg-white p-8 md:p-12 border border-black/5 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-eatpur-white-warm/50 blur-3xl pointer-events-none" />

            <h2 className="text-3xl text-eatpur-dark font-display mb-8 relative z-10">
              Send a Message
            </h2>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center relative z-10"
              >
                <div className="w-20 h-20 bg-eatpur-green-light/20 rounded-full flex items-center justify-center mb-6 text-eatpur-green-dark border border-eatpur-green-dark/20 shadow-inner">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <FaCheck size={40} />
                  </motion.div>
                </div>
                <h3 className="text-2xl text-eatpur-dark mb-2 font-display font-medium">
                  Thank You!
                </h3>
                <p className="text-eatpur-text">
                  Your message has been received. We'll get back to you shortly.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 btn-ghost text-sm"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-eatpur-dark text-sm mb-2 flex items-center gap-2 font-medium">
                      <FaUser className="text-eatpur-green-dark/70" /> Your Name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-eatpur-dark text-sm mb-2 flex items-center gap-2 font-medium">
                      <FaEnvelope className="text-eatpur-green-dark/70" /> Email
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-eatpur-dark text-sm mb-2 flex items-center gap-2 font-medium">
                      <FaPhone className="text-eatpur-green-dark/70" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-eatpur-dark text-sm mb-2 font-medium">
                      Subject
                    </label>
                    <div className="relative">
                      <select className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors appearance-none cursor-pointer shadow-inner">
                        <option>General Inquiry</option>
                        <option>Order Support</option>
                        <option>Wholesale</option>
                        <option>Feedback</option>
                      </select>
                      <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-eatpur-green-dark pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-eatpur-dark text-sm mb-2 font-medium">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows="4"
                    className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors resize-none shadow-inner"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="btn-primary w-full py-4 text-base flex justify-center items-center gap-3 group font-medium"
                  >
                    Send Message{" "}
                    <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
