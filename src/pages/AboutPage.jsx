import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaBullseye,
  FaEye,
  FaGem,
  FaLeaf,
  FaHeartPulse,
  FaAward,
} from "react-icons/fa6";

const TEAM = [
  {
    name: "Lovelesh Kumar Srivastava",
    role: "Founder",
    pic: "/team/lovelesh.png",
  },
  {
    name: "Ankit Srivastava",
    role: "Co-Founder",
    pic: "/team/ankit.png",
  },
  {
    name: "Sunita Srivastava",
    role: "Co-Founder",
    pic: "/team/sunita.png",
  },
  {
    name: "Shivani Srivastava",
    role: "Co-Founder",
    pic: "/team/shivani.png",
  },
  {
    name: "Bhawana Srivastava",
    role: "Co-Founder",
    pic: "/team/bhawana.png",
  },
  {
    name: "Devesh Srivastava",
    role: "Co-Founder",
    pic: "/team/devesh.png",
  },
];
const founder = TEAM[0];
const others = TEAM.slice(1);

// Fallback image function
const getFallbackAvatar = (name, size = 200) => {
  const [first, last] = name.split(" ");
  const initials = `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`;
  return `https://ui-avatars.com/api/?name=${initials}&background=D4C4A8&color=FFFDF8&size=${size}&font-size=0.35&bold=true`;
};

export default function AboutPage() {
  const [carouselWidth, setCarouselWidth] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (carouselRef.current) {
      setCarouselWidth(
        carouselRef.current.scrollWidth - carouselRef.current.offsetWidth,
      );
    }
    // Optional: Recalculate on window resize
    const handleResize = () => {
      if (carouselRef.current) {
        setCarouselWidth(
          carouselRef.current.scrollWidth - carouselRef.current.offsetWidth,
        );
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full relative z-10 overflow-hidden bg-[#FFFDF8]">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 relative flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#A8C686]/20 to-transparent pointer-events-none -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/icons/flourish-top.png"
            alt=""
            className="h-6 mx-auto mb-4 opacity-50"
            onError={(e) => (e.target.style.display = "none")}
          />
          <h1 className="text-6xl md:text-8xl font-serif text-[#2E2410] mb-6 leading-[1.1] tracking-tight">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl font-serif italic text-[#5C4F3A] max-w-2xl mx-auto">
            Rediscovering the ancient power of millets.
          </p>
        </motion.div>
      </section>

      {/* MVV Cards */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-[#D4C4A8]/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaBullseye />,
              title: "Mission",
              text: "To make millet-based nutrition accessible, delicious, and convenient for every Indian household.",
            },
            {
              icon: <FaEye />,
              title: "Vision",
              text: "To become India's most trusted millet brand, leading the revolution towards sustainable and healthy eating.",
            },
            {
              icon: <FaGem />,
              title: "Values",
              text: "Health First, Natural Goodness, Complete Transparency, and Uncompromising Quality Promise.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-10 flex flex-col items-center text-center group bg-white/60 border border-[#D4C4A8]/40 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-[#A8C686]/20 text-[#6B8E23] flex items-center justify-center text-2xl mb-6 shadow-inner group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-2xl font-serif font-semibold text-[#2E2410] mb-4">
                {item.title}
              </h3>
              <p className="text-[#5C4F3A] font-sans leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story & Origins */}
      <section className="py-24 px-6 bg-[#F4EEE0]/50 max-w-7xl mx-auto sm:rounded-[2rem] border border-[#D4C4A8]/30 my-12 shadow-sm">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl text-[#2E2410] font-serif mb-6 leading-tight">
              Message from the Founder
            </h2>
            <div className="w-16 h-1 bg-[#6B8E23] rounded-full mb-6"></div>
            <p className="text-[#5C4F3A] font-sans leading-relaxed text-lg mb-6">
              EatPur was born from a simple belief: healthy food should never
              compromise on taste. As a family, we were frustrated by the lack
              of nutritious yet delicious options in the market.
            </p>
            <p className="text-[#5C4F3A] font-sans leading-relaxed text-lg">
              That's when we turned to millets – the ancient supergrains our
              grandparents thrived on. By blending traditional wisdom with
              modern culinary techniques, we created a range of products that
              nourish the body without sacrificing the joy of eating.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 rounded-2xl overflow-hidden bg-white p-2 border border-[#D4C4A8]/40 shadow-sm"
          >
            <img
              src="/home/prods.jpg"
              alt="Millet origin"
              className="w-full h-auto rounded-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="py-24 px-6 border-y border-[#D4C4A8]/30 bg-[#FFFDF8] relative">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-[#2E2410] mb-16 leading-[1] py-2">
            The EatPur Promise
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaLeaf />,
                title: "Natural Goodness",
              },
              {
                icon: <FaHeartPulse />,
                title: "Health First",
              },
              {
                icon: <FaAward />,
                title: "Quality Promise",
              },
              {
                icon: <FaEye />,
                title: "Transparency",
              },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-8 flex flex-col items-center justify-center bg-white border border-[#D4C4A8]/20 rounded-xl shadow-sm"
              >
                <div className={`text-4xl mb-4 text-[#6B8E23]`}>{v.icon}</div>
                <h4 className="text-lg font-serif font-semibold text-[#2E2410] tracking-wide">
                  {v.title}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 🌿 Meet the Team Section (Founder Top + Draggable Carousel) */}
      {/* ========================================================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <h2 className="text-4xl md:text-5xl font-serif text-[#2E2410] mb-4 text-center leading-[1] py-2">
          Meet Our Team
        </h2>
        <div className="leaf-divider mx-auto mb-16">
          <span></span>
        </div>

        {/* 🌟 Founder (TOP CENTER) */}
        <div className="flex justify-center mb-16">
          <div className="pt-10 pb-8 px-12 text-center border border-[#D4C4A8]/40 bg-white rounded-2xl shadow-lg relative flex flex-col items-center">
            {/* Pista glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#A8C686]/20 to-transparent pointer-events-none rounded-2xl" />

            <div className="relative flex justify-center mb-6 z-10">
              <div className="w-48 h-48 rounded-full bg-[#F4EEE0] overflow-hidden shadow-inner flex items-end border-2 border-white">
                <img
                  src={founder.pic}
                  alt={founder.name}
                  onError={(e) => {
                    e.target.src = getFallbackAvatar(founder.name, 200);
                  }}
                  className="h-[100%] w-full object-cover object-top"
                />
              </div>
            </div>

            <div className="text-center z-10 relative">
              <h3 className="text-3xl font-serif font-semibold text-[#2E2410] mb-1">
                {founder.name}
              </h3>
              <p className="text-[#6B8E23] text-[11px] tracking-[0.2em] uppercase font-bold">
                {founder.role}
              </p>
            </div>
          </div>
        </div>

        {/* 👥 Co-Founders (DRAGGABLE CAROUSEL) */}
        <div className="w-full">
          <p className="text-center font-sans text-sm text-[#5C4F3A] mb-4 italic opacity-70">
            ← Drag to view more →
          </p>

          <motion.div
            ref={carouselRef}
            className="cursor-grab active:cursor-grabbing overflow-hidden w-full py-4"
          >
            <motion.div
              drag="x"
              dragConstraints={{ right: 0, left: -carouselWidth }}
              dragElastic={0.1}
              animate={{ x: [0, -carouselWidth] }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="flex gap-6 w-max px-4"
            >
              {others.map((member) => (
                <div
                  key={member.name}
                  className="w-64 pt-8 pb-6 px-4 text-center bg-white border border-[#D4C4A8]/30 rounded-2xl shadow-sm relative flex flex-col items-center pointer-events-none select-none"
                >
                  <div className="relative flex justify-center mb-4">
                    <div className="w-32 h-32 rounded-full bg-[#F4EEE0] overflow-hidden shadow-inner flex items-end border-2 border-white">
                      <img
                        src={member.pic}
                        alt={member.name}
                        onError={(e) => {
                          e.target.src = getFallbackAvatar(member.name, 150);
                        }}
                        className="h-[95%] w-full object-cover object-[center_top]"
                      />
                    </div>
                  </div>

                  <div className="text-center px-2 z-10 relative mt-2">
                    <h3 className="text-xl font-serif font-semibold text-[#2E2410] leading-tight mb-1">
                      {member.name}
                    </h3>
                    <p className="text-[#6B8E23] text-[10px] tracking-[0.15em] uppercase font-bold">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* ========================================================= */}

      {/* Stats */}
      <section className="py-24 px-6 border-y border-[#D4C4A8]/30 bg-[#F4EEE0]/40 relative">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-2xl md:text-3xl text-[#2E2410] font-serif max-w-3xl mx-auto mb-16 leading-relaxed italic">
            "Millets are not just a food trend – they're a return to our roots.
            Sustaining both the body and the earth."
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#D4C4A8]/60">
            {[
              { num: "100+", text: "Products" },
              { num: "5k+", text: "Happy Customers" },
              { num: "20+", text: "Tasty Recipes" },
              { num: "ZERO", text: "Preservatives" },
            ].map((stat, i) => (
              <motion.div
                key={stat.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="text-4xl md:text-5xl font-serif text-[#2E2410] mb-2 font-bold">
                  {stat.num}
                </div>
                <div className="text-[#5C4F3A] font-sans font-medium text-[11px] uppercase tracking-widest">
                  {stat.text}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
