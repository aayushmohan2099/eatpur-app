import React, { useState } from 'react';

// Sample News Data tailored for EatPur
const newsArticles = [
    {
        id: 1,
        title: "EatPur Expands Organic Delivery to 5 New Cities Across North India",
        date: "July 18, 2026",
        category: "Expansion",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
        snippet: "We are thrilled to bring farm-fresh, chemical-free goodness directly to your doorsteps in Lucknow, Kanpur, Varanasi, and more.",
        content: `EatPur is taking a massive leap forward in its mission to make healthy living accessible to everyone. Starting this month, our farm-to-table organic delivery network is officially launching in 5 new cities across North India. 

    Over the past year, our team has worked relentlessly with local organic farmers, ethical dairy producers, and sustainable growers to build a robust supply chain that guarantees zero chemical usage, zero artificial preservatives, and 100% nutritional integrity.
    
    "Our vision has always been to bridge the gap between conscientious farmers and mindful consumers," said the Founder of EatPur. "This expansion is a testament to our community's trust in clean food."
    
    Customers in the newly added regions can now pre-order fresh seasonal vegetables, cold-pressed oils, hand-churned dairy, and organic grains directly through the EatPur app and website. Special introductory discounts and free organic welcome hampers are available for early subscribers.`
    },
    {
        id: 2,
        title: "The Rise of Chemical-Free Living: Why Your Kitchen Needs a Reset",
        date: "July 10, 2026",
        category: "Health & Wellness",
        image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
        snippet: "Discover how hidden preservatives in daily packaged foods affect your metabolism and how switching to clean ingredients transforms your health.",
        content: `In today’s fast-paced world, convenience foods have quietly crept into our pantries. But convenience often comes at a steep price—our long-term health. Processed foods laden with hidden sugars, refined oils, and chemical stabilizers are major contributors to lethargy, hormonal imbalances, and lifestyle diseases.
    
    Switching to a chemical-free lifestyle isn't just a trend; it's a return to our roots. When you consume whole foods grown in nutrient-dense soil without synthetic fertilizers:
    * Your gut microbiome flourishes, improving digestion and immunity.
    * Natural energy levels stabilize, eliminating afternoon slumps.
    * Your skin and hair reflect the deep nourishment of pure vitamins and minerals.
    
    At EatPur, every item on our catalog is rigorously vetted to ensure it passes the purity test. No shortcuts, no hidden labels—just wholesome nutrition as nature intended.`
    },
    {
        id: 3,
        title: "EatPur Partners with Local Farmers to Promote Sustainable Soil Health",
        date: "June 29, 2026",
        category: "Sustainability",
        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
        snippet: "Our new regenerative agriculture initiative aims to help regional farmers transition from chemical farming to ancient organic techniques.",
        content: `Healthy food can only come from healthy soil. This month, EatPur launched its flagship 'Green Roots' initiative, committing a portion of its revenue to train and support local farmers in regenerative agriculture practices.
    
    Decades of heavy chemical fertilizer use have degraded topsoil quality across many agricultural belts. Through this program, EatPur provides farmers with bio-fertilizers, seeds for cover cropping, and financial safety nets during the transition phase (which typically takes 2-3 seasons for soil to fully detoxify).
    
    This partnership not only ensures superior nutritional value in every EatPur product but also secures fair, ethical wages for our hardworking farming communities. When you buy from EatPur, you aren't just feeding your family well—you are actively healing the earth.`
    },
    {
        id: 4,
        title: "Monsoon Special: Top 5 Immunity-Boosting Superfoods You Must Include",
        date: "June 15, 2026",
        category: "Nutrition",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
        snippet: "Beat seasonal infections naturally with these power-packed organic ingredients straight from the EatPur seasonal curation.",
        content: `Monsoon brings romantic weather, cool breezes, and unfortunately, a spike in seasonal infections, colds, and sluggish digestion. Instead of relying on synthetic supplements, nature provides powerful remedies right in our traditional kitchens.
    
    Here are the top 5 clean superfoods to include in your diet this monsoon:
    1. **A2 Desi Cow Ghee:** Enhances digestive fire (Agni) and strengthens joint health during humid weather.
    2. **Wild Forest Honey:** A natural antimicrobial that soothes sore throats and builds respiratory immunity.
    3. **Raw Turmeric & Ginger Roots:** Potent anti-inflammatory agents that protect against viral infections.
    4. **Millets (Jowar, Bajra, Ragi):** Nutrient-dense grains that provide sustained energy without bloating.
    5. **Cold-Pressed Mustard Oil:** Excellent for traditional cooking and external therapeutic massages.
    
    Explore our special Monsoon Wellness Curation live now on the EatPur platform!`
    },
];

export default function NewsPage() {
    const [selectedArticle, setSelectedArticle] = useState(null);

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#2C221E] font-sans">

            {/* Header Section */}
            <header className="bg-[#2D5A27] text-white py-12 px-6 shadow-md">
                <div className="max-w-6xl mx-auto text-center">
                    <span className="bg-[#E67E22] text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full inline-block mb-3">
                        EatPur Updates
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#E67E22]">
                        News & Stories
                    </h1>
                    <p className="mt-3 text-lg text-[#EAE4D9] max-w-2xl mx-auto">
                        Stay updated with our latest expansions, health tips, sustainability initiatives, and behind-the-scenes purity measures.
                    </p>
                </div>
            </header>

            {/* Main Content / Cards Grid */}
            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {newsArticles.map((article) => (
                        <div
                            key={article.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#EAE4D9] flex flex-col justify-between group"
                        >
                            <div>
                                {/* Image & Badge */}
                                <div className="relative h-52 overflow-hidden">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-3 left-3 bg-[#2D5A27] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                                        {article.category}
                                    </span>
                                </div>

                                {/* Card Content */}
                                <div className="p-6">
                                    <span className="text-xs text-[#7A6E65] font-medium block mb-1">
                                        {article.date}
                                    </span>
                                    <h2 className="text-xl font-bold text-[#2C221E] line-clamp-2 group-hover:text-[#2D5A27] transition-colors">
                                        {article.title}
                                    </h2>
                                    <p className="mt-2 text-sm text-[#5C5046] line-clamp-3">
                                        {article.snippet}
                                    </p>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="px-6 pb-6 pt-0">
                                <button
                                    onClick={() => setSelectedArticle(article)}
                                    className="w-full py-2.5 px-4 bg-[#F4EFE6] hover:bg-[#2D5A27] hover:text-white text-[#2D5A27] font-semibold rounded-xl transition-colors duration-200 text-sm flex items-center justify-center gap-2"
                                >
                                    View Full Article
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Modal Popup: Positioned cleanly BELOW the website navigation header */}
            {selectedArticle && (
                <div className="fixed inset-x-0 bottom-0 top-20 md:top-24 z-40 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
                    <div className="bg-white w-full max-w-3xl max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-scaleUp my-auto">

                        {/* Modal Header Bar */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4D9] bg-[#FDFBF7]">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A27] bg-[#2D5A27]/10 px-3 py-1 rounded-full">
                                {selectedArticle.category}
                            </span>
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="w-9 h-9 rounded-full bg-[#EAE4D9] hover:bg-[#2D5A27] hover:text-white flex items-center justify-center text-[#2C221E] transition-colors"
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Scrollable Modal Body */}
                        <div className="overflow-y-auto p-6 md:p-8 space-y-6">
                            <div>
                                <span className="text-sm text-[#7A6E65] font-medium">{selectedArticle.date}</span>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-[#2C221E] mt-1">
                                    {selectedArticle.title}
                                </h1>
                            </div>

                            {/* Featured Image inside Modal */}
                            <div className="h-64 md:h-80 rounded-2xl overflow-hidden shadow-inner">
                                <img
                                    src={selectedArticle.image}
                                    alt={selectedArticle.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Article Content formatted with paragraphs */}
                            <div className="text-[#4A3F38] text-base leading-relaxed space-y-4 whitespace-pre-line">
                                {selectedArticle.content}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-[#EAE4D9] bg-[#FDFBF7] flex justify-end">
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="px-6 py-2.5 bg-[#2D5A27] text-white font-semibold rounded-xl hover:bg-[#244820] transition-colors"
                            >
                                Close Article
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}