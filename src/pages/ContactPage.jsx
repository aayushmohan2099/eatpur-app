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
      <section className="pt-32 pb-24 px-6 relative bg-eatpur-dark flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(111,175,58,0.1)_0%,transparent_60%)] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            className="text-6xl md:text-7xl font-display text-gradient-gold mb-6 leading-[1.4] py-2"
            style={{ fontFamily: "var(--font-hughes)" }}
          >
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-eatpur-text-light max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </motion.div>
      </section>

      <section className="py-12 px-6 max-w-7xl mx-auto pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Contact Info */}
          <div className="space-y-6">
            <h2
              className="text-3xl text-eatpur-white-warm font-display mb-8"
              style={{ fontFamily: "var(--font-hughes)" }}
            >
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
                color: "text-green-400",
              },
            ].map((info, i) => (
              <motion.a
                href={info.link}
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-2xl flex items-center gap-6 group hover:-translate-y-1 transition-transform border border-eatpur-gold/10 hover:border-eatpur-gold/30"
              >
                <div
                  className={`w-14 h-14 rounded-full bg-eatpur-dark border border-eatpur-gold/20 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(255,201,51,0.1)] group-hover:scale-110 transition-transform ${info.color || "text-eatpur-gold"}`}
                >
                  {info.icon}
                </div>
                <div>
                  <h4 className="text-eatpur-white-warm font-bold">
                    {info.title}
                  </h4>
                  <p className="text-eatpur-text group-hover:text-eatpur-yellow transition-colors">
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
            className="glass-card rounded-[2rem] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-eatpur-gold/5 blur-3xl pointer-events-none" />

            <h2
              className="text-3xl text-eatpur-yellow font-display mb-8 relative z-10"
              style={{ fontFamily: "var(--font-hughes)" }}
            >
              Send a Message
            </h2>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center relative z-10"
              >
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-400 border border-green-500/30">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <FaCheck size={40} />
                  </motion.div>
                </div>
                <h3
                  className="text-2xl text-eatpur-white-warm mb-2 font-bold"
                  style={{ fontFamily: "var(--font-hughes)" }}
                >
                  Thank You!
                </h3>
                <p className="text-eatpur-text">
                  Your message has been received. We'll get back to you shortly.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 btn-ghost text-sm"
                  style={{ fontFamily: "var(--font-hughes)" }}
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-eatpur-text-light text-sm mb-2 flex items-center gap-2">
                      <FaUser className="text-eatpur-gold/70" /> Your Name{" "}
                      <span className="text-eatpur-gold">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-eatpur-dark/60 border border-eatpur-gold/20 rounded-xl px-4 py-3 text-eatpur-white-warm focus:outline-none focus:border-eatpur-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-eatpur-text-light text-sm mb-2 flex items-center gap-2">
                      <FaEnvelope className="text-eatpur-gold/70" /> Email
                      Address <span className="text-eatpur-gold">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full bg-eatpur-dark/60 border border-eatpur-gold/20 rounded-xl px-4 py-3 text-eatpur-white-warm focus:outline-none focus:border-eatpur-gold transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-eatpur-text-light text-sm mb-2 flex items-center gap-2">
                      <FaPhone className="text-eatpur-gold/70" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full bg-eatpur-dark/60 border border-eatpur-gold/20 rounded-xl px-4 py-3 text-eatpur-white-warm focus:outline-none focus:border-eatpur-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-eatpur-text-light text-sm mb-2">
                      Subject
                    </label>
                    <div className="relative">
                      <select className="w-full bg-eatpur-dark/60 border border-eatpur-gold/20 rounded-xl px-4 py-3 text-eatpur-white-warm focus:outline-none focus:border-eatpur-gold transition-colors appearance-none cursor-pointer">
                        <option>General Inquiry</option>
                        <option>Order Support</option>
                        <option>Wholesale</option>
                        <option>Feedback</option>
                      </select>
                      <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-eatpur-gold pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-eatpur-text-light text-sm mb-2">
                    Message <span className="text-eatpur-gold">*</span>
                  </label>
                  <textarea
                    required
                    rows="4"
                    className="w-full bg-eatpur-dark/60 border border-eatpur-gold/20 rounded-xl px-4 py-3 text-eatpur-white-warm focus:outline-none focus:border-eatpur-gold transition-colors resize-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="btn-primary w-full py-4 text-lg flex justify-center items-center gap-3 group"
                    style={{ fontFamily: "var(--font-hughes)" }}
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
