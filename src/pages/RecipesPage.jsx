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
    <div className="w-full min-h-screen pt-24 pb-32 px-6 relative z-10">
      <div className="max-w-7xl mx-auto rounded-[2rem] overflow-hidden mb-16 relative bg-eatpur-green-dark p-12 md:p-20 text-center flex flex-col items-center justify-center shadow-[0_0_40px_rgba(4,7,4,0.5)] border border-eatpur-gold/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(111,175,58,0.1)_0%,transparent_70%)] pointer-events-none" />
        <h1 className="text-5xl md:text-6xl font-display text-gradient-gold mb-4 relative z-10">Recipes</h1>
        <p className="text-xl text-eatpur-text relative z-10 mb-8">Discover healthy millet recipes from our community.</p>
        <Link to="/recipes/new" className="btn-primary relative z-10">Publish Your Recipe</Link>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {RECIPES.map((recipe, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1 }}
            key={recipe.id}
            className="glass-card rounded-2xl overflow-hidden flex flex-col group glow-hover"
          >
            <Link to={`/recipes/${recipe.id}`} className="block h-48 overflow-hidden relative">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Link>
            <div className="p-6 flex flex-col flex-1">
              <Link to={`/recipes/${recipe.id}`} className="block">
                <h3 className="text-xl font-bold text-eatpur-white-warm mb-2 group-hover:text-eatpur-yellow transition-colors">{recipe.title}</h3>
              </Link>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-eatpur-gold flex items-center justify-center text-eatpur-dark font-bold text-xs">
                  {recipe.author.charAt(0)}
                </div>
                <span className="text-sm text-eatpur-text-light">{recipe.author}</span>
              </div>
              <div className="mt-auto pt-4 border-t border-eatpur-gold/10 flex items-center justify-between text-xs text-eatpur-text/80">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><FaClock /> {recipe.time}</span>
                  <span className="flex items-center gap-1"><FaUsers /> {recipe.servings}</span>
                </div>
                <div className="flex gap-3">
                  <span className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer"><FaHeart /> {recipe.likes}</span>
                  <span className="flex items-center gap-1"><FaComment /> {recipe.comments}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
