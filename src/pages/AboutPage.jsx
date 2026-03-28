import React from "react";
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
  {
    name: "Shishir Srivastava",
    role: "Co-Founder",
    pic: "/team/shishir.png",
  },
];
const founder = TEAM[0];
const others = TEAM.slice(1);

export default function AboutPage() {
  return (
    <div className="w-full relative z-10 overflow-hidden">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative bg-eatpur-dark flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,201,51,0.05)_0%,transparent_60%)] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            className="text-6xl md:text-8xl font-display text-gradient-gold mb-6 drop-shadow-[0_0_30px_rgba(255,201,51,0.2)] leading-[1.5] py-2"
            style={{ fontFamily: "var(--font-hughes)" }}
          >
            Our Story
          </h1>
          <p className="text-xl md:text-2xl text-eatpur-text-light max-w-2xl mx-auto">
            Rediscovering the ancient power of millets.
          </p>
        </motion.div>
      </section>

      {/* MVV Cards */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
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
              className="glass-card p-10 rounded-3xl flex flex-col items-center text-center glow-hover"
            >
              <div className="w-16 h-16 rounded-full bg-eatpur-dark border border-eatpur-gold/20 text-eatpur-gold flex items-center justify-center text-2xl mb-6 shadow-lg shadow-eatpur-gold/5">
                {item.icon}
              </div>
              <h3
                className="text-2xl font-bold text-eatpur-white-warm mb-4"
                style={{ fontFamily: "var(--font-hughes)" }}
              >
                {item.title}
              </h3>
              <p className="text-eatpur-text leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story & Origins */}
      <section className="py-24 px-6 bg-eatpur-green-dark/60 max-w-7xl mx-auto md:rounded-[3rem] shadow-[0_30px_60px_rgba(4,7,4,0.6)] border border-eatpur-gold/5 my-12 backdrop-blur-3xl">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <h2
              className="text-4xl text-eatpur-yellow font-display mb-6"
              style={{ fontFamily: "var(--font-hughes)" }}
            >
              Rooted in Tradition
            </h2>
            <p className="text-eatpur-text leading-relaxed text-lg mb-6">
              EatPur was born from a simple belief: healthy food should never
              compromise on taste. As a family, we were frustrated by the lack
              of nutritious yet delicious options in the market.
            </p>
            <p className="text-eatpur-text leading-relaxed text-lg">
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
            className="md:w-1/2 rounded-3xl overflow-hidden glass-card p-2 shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
              alt="Millet origin"
              className="w-full h-auto rounded-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="py-24 px-6 bg-eatpur-green-dark/40 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-eatpur-gold/20 to-transparent" />
        <div className="max-w-7xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-display text-gradient-gold mb-16 leading-[1] py-2"
            style={{ fontFamily: "var(--font-hughes)" }}
          >
            The EatPur Promise
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaLeaf />,
                color: "text-eatpur-green-light",
                title: "Natural Goodness",
              },
              {
                icon: <FaHeartPulse />,
                color: "text-red-400",
                title: "Health First",
              },
              {
                icon: <FaAward />,
                color: "text-eatpur-gold",
                title: "Quality Promise",
              },
              {
                icon: <FaEye />,
                color: "text-eatpur-yellow-light",
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
                className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center"
              >
                <div className={`text-4xl mb-4 ${v.color}`}>{v.icon}</div>
                <h4
                  className="text-lg font-bold text-eatpur-white-warm"
                  style={{ fontFamily: "var(--font-hughes)" }}
                >
                  {v.title}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-display text-gradient-gold mb-16 text-center leading-[1] py-2"
          style={{ fontFamily: "var(--font-hughes)" }}
        >
          Meet Our Team
        </h2>

        {/* 🌟 Founder (CENTER HERO) */}
        <div className="flex justify-center mb-16">
          <div className="glass-card pt-10 pb-15 px-10 rounded-3xl text-center glow-hover group border border-eatpur-gold/30 relative overflow-hidden">
            {/* Image */}
            <div className="relative flex justify-center">
              {/* GOLD GLOW */}
              <div className="absolute bottom-6 flex justify-center w-full z-0">
                {/* Core glow */}
                <div className="w-44 h-26 bg-eatpur-gold/60 blur-xl rounded-full" />

                {/* Outer soft glow */}
                <div className="absolute w-64 h-24 bg-eatpur-gold/30 blur-2xl rounded-full" />
              </div>
              <img
                src={founder.pic}
                alt={founder.name}
                className="h-64 object-contain relative z-10"
              />
            </div>

            {/* TEXT OVER IMAGE */}
            <div className="absolute bottom-7 left-0 w-full z-30 text-center">
              <h3
                className="text-2xl font-bold text-eatpur-white-warm"
                style={{ fontFamily: "var(--font-hughes)" }}
              >
                {founder.name}
              </h3>
              <p className="text-eatpur-gold text-sm tracking-wider uppercase">
                {founder.role}
              </p>
            </div>
            {/* Bottom gradient for readability */}
            <div className="absolute bottom-0 left-0 w-full h-[45%] bg-gradient-to-t from-[#040704] via-[#040704]/90 to-transparent z-20 pointer-events-none" />
          </div>
        </div>

        {/* 👥 Team Around */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {others.map((member) => (
            <div
              key={member.name}
              className="glass-card pt-8 pb-12 px-6 rounded-3xl text-center glow-hover group relative overflow-hidden"
            >
              {/* IMAGE + GLOW */}
              <div className="relative flex justify-center">
                {/* GOLD GLOW (same system as founder, scaled down) */}
                <div className="absolute bottom-4 flex justify-center w-full z-0">
                  <div className="w-30 h-34 bg-eatpur-gold/60 blur-lg rounded-full" />
                  <div className="absolute w-40 h-20 bg-eatpur-gold/30 blur-2xl rounded-full" />
                </div>

                {/* IMAGE */}
                <img
                  src={member.pic}
                  alt={member.name}
                  className="h-52 object-contain relative z-10 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* TEXT OVER IMAGE */}
              <div className="absolute bottom-6 left-0 w-full z-30 text-center px-2">
                <h3
                  className="text-lg font-bold text-eatpur-white-warm leading-tight"
                  style={{ fontFamily: "var(--font-hughes)" }}
                >
                  {member.name}
                </h3>
                <p className="text-eatpur-gold text-xs tracking-wider uppercase">
                  {member.role}
                </p>
              </div>

              {/* MATCHED GRADIENT */}
              <div className="absolute bottom-0 left-0 w-full h-[45%] bg-gradient-to-t from-[#040704] via-[#040704]/90 to-transparent z-20 pointer-events-none" />
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-6 bg-eatpur-dark relative border-t border-eatpur-gold/10">
        <div className="max-w-7xl mx-auto text-center">
          <p
            className="text-2xl text-eatpur-text-light font-light mb-16 max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-hughes)" }}
          >
            "Millets are not just a food trend – they're a return to our roots.
            Sustaining both the body and the earth."
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-eatpur-gold/10">
            {[
              { num: "100+", text: "Products" },
              { num: "5k+", text: "Happy Customers" },
              { num: "20+", text: "Tasty Recipies" },
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
                <div className="text-4xl md:text-5xl font-display text-eatpur-yellow mb-2">
                  {stat.num}
                </div>
                <div className="text-eatpur-text text-sm uppercase tracking-widest">
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
