// src/pages/News/NewsPage.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaXmark } from "react-icons/fa6";

const newsArticles = [
  {
    id: 1,
    title: "EatPur Expands Organic Delivery to 5 New Cities Across North India",
    date: "July 18, 2026",
    category: "Expansion",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    snippet:
      "We are thrilled to bring farm-fresh, chemical-free goodness directly to your doorsteps in Lucknow, Kanpur, Varanasi, and more.",
    content: `EatPur is taking a massive leap forward in its mission to make healthy living accessible to everyone. Starting this month, our farm-to-table organic delivery network is officially launching in 5 new cities across North India. 

    Over the past year, our team has worked relentlessly with local organic farmers, ethical dairy producers, and sustainable growers to build a robust supply chain that guarantees zero chemical usage, zero artificial preservatives, and 100% nutritional integrity.
    
    "Our vision has always been to bridge the gap between conscientious farmers and mindful consumers," said the Founder of EatPur. "This expansion is a testament to our community's trust in clean food."
    
    Customers in the newly added regions can now pre-order fresh seasonal vegetables, cold-pressed oils, hand-churned dairy, and organic grains directly through the EatPur app and website. Special introductory discounts and free organic welcome hampers are available for early subscribers.`,
  },
  {
    id: 2,
    title: "The Rise of Chemical-Free Living: Why Your Kitchen Needs a Reset",
    date: "July 10, 2026",
    category: "Health & Wellness",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
    snippet:
      "Discover how hidden preservatives in daily packaged foods affect your metabolism and how switching to clean ingredients transforms your health.",
    content: `In today’s fast-paced world, convenience foods have quietly crept into our pantries. But convenience often comes at a steep price—our long-term health. Processed foods laden with hidden sugars, refined oils, and chemical stabilizers are major contributors to lethargy, hormonal imbalances, and lifestyle diseases.
    
    Switching to a chemical-free lifestyle isn't just a trend; it's a return to our roots. When you consume whole foods grown in nutrient-dense soil without synthetic fertilizers:
    * Your gut microbiome flourishes, improving digestion and immunity.
    * Natural energy levels stabilize, eliminating afternoon slumps.
    * Your skin and hair reflect the deep nourishment of pure vitamins and minerals.
    
    At EatPur, every item on our catalog is rigorously vetted to ensure it passes the purity test. No shortcuts, no hidden labels—just wholesome nutrition as nature intended.`,
  },
  {
    id: 3,
    title:
      "EatPur Partners with Local Farmers to Promote Sustainable Soil Health",
    date: "June 29, 2026",
    category: "Sustainability",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    snippet:
      "Our new regenerative agriculture initiative aims to help regional farmers transition from chemical farming to ancient organic techniques.",
    content: `Healthy food can only come from healthy soil. This month, EatPur launched its flagship 'Green Roots' initiative, committing a portion of its revenue to train and support local farmers in regenerative agriculture practices.
    
    Decades of heavy chemical fertilizer use have degraded topsoil quality across many agricultural belts. Through this program, EatPur provides farmers with bio-fertilizers, seeds for cover cropping, and financial safety nets during the transition phase (which typically takes 2-3 seasons for soil to fully detoxify).
    
    This partnership not only ensures superior nutritional value in every EatPur product but also secures fair, ethical wages for our hardworking farming communities. When you buy from EatPur, you aren't just feeding your family well—you are actively healing the earth.`,
  },
  {
    id: 4,
    title:
      "Monsoon Special: Top 5 Immunity-Boosting Superfoods You Must Include",
    date: "June 15, 2026",
    category: "Nutrition",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    snippet:
      "Beat seasonal infections naturally with these power-packed organic ingredients straight from the EatPur seasonal curation.",
    content: `Monsoon brings romantic weather, cool breezes, and unfortunately, a spike in seasonal infections, colds, and sluggish digestion. Instead of relying on synthetic supplements, nature provides powerful remedies right in our traditional kitchens.
    
    Here are the top 5 clean superfoods to include in your diet this monsoon:
    1. **A2 Desi Cow Ghee:** Enhances digestive fire (Agni) and strengthens joint health during humid weather.
    2. **Wild Forest Honey:** A natural antimicrobial that soothes sore throats and builds respiratory immunity.
    3. **Raw Turmeric & Ginger Roots:** Potent anti-inflammatory agents that protect against viral infections.
    4. **Millets (Jowar, Bajra, Ragi):** Nutrient-dense grains that provide sustained energy without bloating.
    5. **Cold-Pressed Mustard Oil:** Excellent for traditional cooking and external therapeutic massages.
    
    Explore our special Monsoon Wellness Curation live now on the EatPur platform!`,
  },
];

export default function NewsPage() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="w-full min-h-screen relative z-10 overflow-hidden bg-[#FFFDF8]">
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
            News & Stories
          </h1>
          <p className="text-xl md:text-2xl font-serif italic text-[#5C4F3A] max-w-2xl mx-auto">
            Updates, expansions, and behind-the-scenes purity measures.
          </p>
        </motion.div>
      </section>

      {/* Main Content / Cards Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/60 border border-[#D4C4A8]/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Image & Badge */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#6B8E23] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded border border-[#6B8E23]/20 shadow-sm">
                  {article.category}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-8 flex flex-col flex-1">
                <span className="text-[#A8C686] font-sans text-xs font-bold tracking-widest uppercase mb-3 block">
                  {article.date}
                </span>
                <h2 className="text-2xl font-serif font-semibold text-[#2E2410] mb-3 line-clamp-2 group-hover:text-[#6B8E23] transition-colors">
                  {article.title}
                </h2>
                <p className="text-[#5C4F3A] font-sans leading-relaxed text-sm mb-6 line-clamp-3">
                  {article.snippet}
                </p>

                {/* Action Button */}
                <div className="mt-auto pt-4 border-t border-[#D4C4A8]/20">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#F4EEE0] hover:bg-[#6B8E23] text-[#2E2410] hover:text-white font-sans font-medium rounded-xl transition-colors duration-300"
                  >
                    Read Full Story
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick View / Full Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2E2410]/60 backdrop-blur-sm"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FFFDF8] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl shadow-2xl border border-[#D4C4A8]/40 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 z-20 text-[#5C4F3A] hover:text-[#2E2410] p-2 bg-white/80 backdrop-blur-md rounded-full shadow-md transition-colors"
              >
                <FaXmark size={20} />
              </button>

              <div className="overflow-y-auto hide-scrollbar">
                {/* Hero Image inside Modal */}
                <div className="h-64 md:h-[400px] w-full relative">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient fade into the content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF8] to-transparent"></div>
                </div>

                {/* Body Content */}
                <div className="p-8 md:px-16 md:pb-16 -mt-32 relative z-10">
                  <div className="flex gap-3 mb-6">
                    <span className="text-[#6B8E23] font-sans font-bold text-[10px] tracking-widest uppercase px-3 py-1 bg-[#A8C686]/20 rounded border border-[#6B8E23]/10 backdrop-blur-sm">
                      {selectedArticle.category}
                    </span>
                    <span className="text-[#5C4F3A] font-sans font-bold text-[10px] tracking-widest uppercase px-3 py-1 bg-white rounded border border-[#D4C4A8]/40 shadow-sm">
                      {selectedArticle.date}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-serif text-[#2E2410] font-bold mb-10 leading-tight">
                    {selectedArticle.title}
                  </h2>

                  {/* The pre-line class preserves the paragraph breaks mapped in the content string */}
                  <div className="text-[#5C4F3A] font-sans leading-relaxed text-lg space-y-6 whitespace-pre-line">
                    {selectedArticle.content}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
