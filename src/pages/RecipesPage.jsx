import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaClock, FaUsers, FaHeart, FaComment } from 'react-icons/fa6';

const RECIPES = [
  { id: 1, title: 'Millet Lemon Rice', author: 'Sunita SR', time: '20 min', servings: 2, likes: 245, comments: 12, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=400' },
  { id: 2, title: 'Sprouted Ragi Dosa', author: 'Ankit SR', time: '15 min', servings: 4, likes: 412, comments: 34, image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&q=80&w=400' },
  { id: 3, title: 'Bajra Khichdi', author: 'Shivani', time: '40 min', servings: 3, likes: 189, comments: 8, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400' },
  { id: 4, title: 'Proso Millet Salad', author: 'Bhawana', time: '10 min', servings: 2, likes: 156, comments: 5, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400' },
];

export default function RecipesPage() {
  return (
    <div className="w-full min-h-screen pt-24 pb-32 px-6 relative z-10 bg-eatpur-white-warm">
      <div className="max-w-7xl mx-auto rounded-[1rem] overflow-hidden mb-16 relative bg-white p-12 md:p-16 text-center flex flex-col items-center justify-center border border-black/5 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-eatpur-green-light/10 to-transparent pointer-events-none" />
        <h1 className="text-4xl md:text-6xl font-display text-eatpur-dark mb-4 relative z-10 tracking-tight">Recipes</h1>
        <p className="text-lg md:text-xl text-eatpur-text font-serif italic relative z-10 mb-8">Discover healthy millet recipes from our community.</p>
        <Link to="/recipes/new" className="btn-primary relative z-10 font-medium tracking-wide">Publish Your Recipe</Link>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {RECIPES.map((recipe, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1 }}
            key={recipe.id}
            className="vintage-card bg-white border border-black/5 rounded-2xl overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform shadow-sm"
          >
            <Link to={`/recipes/${recipe.id}`} className="block h-48 overflow-hidden relative border-b border-black/5">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-full object-cover mix-blend-multiply"
                loading="lazy"
              />
            </Link>
            <div className="p-6 flex flex-col flex-1">
              <Link to={`/recipes/${recipe.id}`} className="block">
                <h3 className="text-xl font-display font-medium text-eatpur-dark mb-2 group-hover:text-eatpur-green-dark transition-colors">{recipe.title}</h3>
              </Link>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-eatpur-white-warm flex items-center justify-center text-eatpur-green-dark font-medium font-display text-xs border border-black/5 shadow-inner">
                  {recipe.author.charAt(0)}
                </div>
                <span className="text-sm font-serif italic text-eatpur-text-light">{recipe.author}</span>
              </div>
              <div className="mt-auto pt-4 border-t border-black/5 flex items-center justify-between text-[11px] font-sans tracking-widest uppercase font-semibold text-eatpur-text/60">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1.5"><FaClock className="text-eatpur-green-dark/70" /> {recipe.time}</span>
                  <span className="flex items-center gap-1.5"><FaUsers className="text-eatpur-green-dark/70" /> {recipe.servings}</span>
                </div>
                <div className="flex gap-3">
                  <span className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer"><FaHeart className="text-red-400/70" /> {recipe.likes}</span>
                  <span className="flex items-center gap-1"><FaComment className="text-eatpur-text-light" /> {recipe.comments}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
