import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaXmark, FaPaperPlane, FaRobot } from "react-icons/fa6";

export default function Chatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hi! I am the EatPur Assistant. How can I help you discover our premium millets today?",
    },
  ]);
  const messagesEndRef = useRef(null);

  const quickReplies = [
    "Where can I find products?",
    "Show recipes",
    "Contact support",
  ];

  const handleQuickReply = (text) => {
    // Add user message
    setMessages((prev) => [...prev, { type: "user", text }]);

    // Simulate thinking delay then add bot response
    setTimeout(() => {
      let reply =
        "Thanks for asking! You can explore our site using the navigation menu.";
      if (text === "Where can I find products?")
        reply =
          "You can find all our amazing premium millet products right in the 'Products' section!";
      if (text === "Show recipes")
        reply =
          "Check out our 'Recipes' page for delicious and healthy ways to incorporate EatPur millets into your daily meals.";
      if (text === "Contact support")
        reply =
          "Head over to the 'Contact' page to get in touch with our dedicated support team.";

      setMessages((prev) => [...prev, { type: "bot", text: reply }]);
    }, 600);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            y: 30,
            transformOrigin: "bottom right",
          }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="fixed bottom-6 right-6 z-[70] w-[340px] rounded-3xl overflow-hidden shadow-sm border border-black/5 bg-eatpur-white-warm backdrop-blur-xl flex flex-col font-sans"
          style={{ height: "480px", maxHeight: "80vh" }}
        >
          {/* Header */}
          <div className="bg-white border-b border-black/5 px-5 py-4 flex justify-between items-center shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="bg-eatpur-white-warm p-2.5 rounded-full text-eatpur-green-dark border border-black/5 shadow-inner">
                <FaRobot size={18} />
              </div>
              <h3
                className="text-eatpur-dark font-display font-medium text-lg tracking-tight"
              >
                EatPur Assistant
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-eatpur-text-light hover:text-eatpur-dark bg-white hover:bg-eatpur-white-warm p-2 rounded-full transition-colors border border-black/5 shadow-sm"
              aria-label="Close Chat"
            >
              <FaXmark size={16} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 custom-scrollbar relative bg-eatpur-white-warm/50">
            {messages.map((msg, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm font-serif ${
                  msg.type === "user"
                    ? "bg-eatpur-green-dark text-white self-end rounded-br-sm border border-eatpur-green-dark"
                    : "bg-white text-eatpur-text self-start rounded-bl-sm border border-black/5 font-medium"
                }`}
              >
                {msg.text}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Footer */}
          <div className="p-4 border-t border-black/5 bg-white shrink-0 flex flex-wrap gap-2.5 z-10 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleQuickReply(reply)}
                className="text-[13px] bg-eatpur-white-warm hover:bg-eatpur-green-light/10 text-eatpur-dark border border-black/10 hover:border-eatpur-green-dark/30 px-3.5 py-2 rounded-full transition-all duration-200 truncate max-w-full text-left font-medium shadow-sm hover:shadow"
              >
                {reply}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
