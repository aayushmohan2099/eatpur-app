import React from 'react';
import { motion } from 'framer-motion';
import { FaBullseye, FaEye, FaGem, FaLeaf, FaHeartPulse, FaAward } from 'react-icons/fa6';

const TEAM = [
  { name: 'Lovelesh Kumar Srivastava', role: 'Founder' },
  { name: 'Ankit Srivastava', role: 'Co-Founder' },
  { name: 'Sunita Srivastava', role: 'Co-Founder' },
  { name: 'Shivani Srivastava', role: 'Co-Founder' },
  { name: 'Bhawana Srivastava', role: 'Co-Founder' },
  { name: 'Devesh Srivastava', role: 'Co-Founder' }
];

export default function AboutPage() {
  return (
    <div className="w-full relative z-10 overflow-hidden">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative bg-eatpur-dark flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,201,51,0.05)_0%,transparent_60%)] pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-6xl md:text-8xl font-display text-gradient-gold mb-6 drop-shadow-[0_0_30px_rgba(255,201,51,0.2)]">Our Story</h1>
          <p className="text-xl md:text-2xl text-eatpur-text-light max-w-2xl mx-auto">
            Rediscovering the ancient power of millets.
          </p>
        </motion.div>
      </section>

      {/* Story & Origins */}
      <section className="py-24 px-6 bg-eatpur-green-dark/60 max-w-7xl mx-auto md:rounded-[3rem] shadow-[0_30px_60px_rgba(4,7,4,0.6)] border border-eatpur-gold/5 my-12 backdrop-blur-3xl">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <h2 className="text-4xl text-eatpur-yellow font-display mb-6">Rooted in Tradition</h2>
            <p className="text-eatpur-text leading-relaxed text-lg mb-6">
              EatPur was born from a simple belief: healthy food should never compromise on taste. As a family, we were frustrated by the lack of nutritious yet delicious options in the market. 
            </p>
            <p className="text-eatpur-text leading-relaxed text-lg">
              That's when we turned to millets – the ancient supergrains our grandparents thrived on. By blending traditional wisdom with modern culinary techniques, we created a range of products that nourish the body without sacrificing the joy of eating.
            </p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 rounded-3xl overflow-hidden glass-card p-2 shadow-2xl"
          >
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" alt="Millet origin" className="w-full h-auto rounded-2xl" />
          </motion.div>
        </div>
      </section>

      {/* MVV Cards */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <FaBullseye />, title: 'Mission', text: "To make millet-based nutrition accessible, delicious, and convenient for every Indian household." },
            { icon: <FaEye />, title: 'Vision', text: "To become India's most trusted millet brand, leading the revolution towards sustainable and healthy eating." },
            { icon: <FaGem />, title: 'Values', text: "Health First, Natural Goodness, Complete Transparency, and Uncompromising Quality Promise." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="glass-card p-10 rounded-3xl flex flex-col items-center text-center glow-hover"
            >
              <div className="w-16 h-16 rounded-full bg-eatpur-dark border border-eatpur-gold/20 text-eatpur-gold flex items-center justify-center text-2xl mb-6 shadow-lg shadow-eatpur-gold/5">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-eatpur-white-warm mb-4">{item.title}</h3>
              <p className="text-eatpur-text leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="py-24 px-6 bg-eatpur-green-dark/40 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-eatpur-gold/20 to-transparent" />
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display text-gradient-gold mb-16">The EatPur Promise</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FaLeaf />, color: 'text-eatpur-green-light', title: 'Natural Goodness' },
              { icon: <FaHeartPulse />, color: 'text-red-400', title: 'Health First' },
              { icon: <FaAward />, color: 'text-eatpur-gold', title: 'Quality Promise' },
              { icon: <FaEye />, color: 'text-eatpur-yellow-light', title: 'Transparency' },
            ].map((v, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center"
              >
                <div className={`text-4xl mb-4 ${v.color}`}>{v.icon}</div>
                <h4 className="text-lg font-bold text-eatpur-white-warm">{v.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-display text-gradient-gold mb-16 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM.map((member, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-3xl text-center glow-hover group"
            >
              <div className="w-24 h-24 mx-auto bg-eatpur-green-dark rounded-full border border-eatpur-gold/20 flex items-center justify-center text-eatpur-gold text-3xl font-bold mb-6 group-hover:bg-eatpur-gold group-hover:text-eatpur-dark transition-all duration-300 shadow-[0_0_20px_rgba(255,201,51,0.1)]">
                {member.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-eatpur-white-warm mb-1">{member.name}</h3>
              <p className="text-eatpur-yellow text-sm tracking-wider uppercase">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-6 bg-eatpur-dark relative border-t border-eatpur-gold/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-2xl text-eatpur-text-light font-light mb-16 max-w-3xl mx-auto">
            "Millets are not just a food trend – they're a return to our roots. Sustaining both the body and the earth."
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-eatpur-gold/10">
            {[
              { num: '10+', text: 'Products' },
              { num: '5000+', text: 'Happy Customers' },
              { num: '100%', text: 'Natural' },
              { num: '0', text: 'Preservatives' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="text-4xl md:text-5xl font-display text-eatpur-yellow mb-2">{stat.num}</div>
                <div className="text-eatpur-text text-sm uppercase tracking-widest">{stat.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
