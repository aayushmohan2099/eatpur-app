import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FaClock, FaUsers, FaHeart, FaComment, FaFire } from 'react-icons/fa6';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(245);
  const [comments, setComments] = useState([
    { id: 1, name: 'Devesh', text: 'This looks amazing! Trying it tonight.', time: '2 hours ago' }
  ]);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([...comments, { id: Date.now(), name: 'Guest', text: newComment, time: 'Just now' }]);
    setNewComment('');
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-32 px-6 relative z-10 bg-eatpur-white-warm">
      <div className="max-w-4xl mx-auto vintage-card rounded-2xl overflow-hidden bg-white border border-black/5 shadow-sm">
        {/* Hero Image */}
        <div className="w-full h-[40vh] md:h-[50vh] relative border-b border-black/5">
          <img src="https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" alt="Recipe" className="w-full h-full object-cover mix-blend-multiply opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12">
            <h1 className="text-4xl md:text-5xl font-display text-white mb-4 drop-shadow-md">Millet Lemon Rice</h1>
            <div className="flex items-center gap-4 text-sm md:text-base text-white/90">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-eatpur-white-warm flex items-center justify-center text-eatpur-dark font-medium shadow-inner text-sm font-display">S</div>
                <span className="font-serif italic drop-shadow-md">Sunita SR</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-white/50"></span>
              <span className="font-serif italic drop-shadow-md">Oct 14, 2024</span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-12">
          {/* Meta Bar */}
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-black/5 mb-8 text-eatpur-text font-serif italic text-sm md:text-base">
            <div className="flex items-center gap-2"><FaClock className="text-eatpur-green-dark" /> Prep: 10m  |  Cook: 20m</div>
            <div className="flex items-center gap-2"><FaUsers className="text-eatpur-green-dark" /> Serves 2</div>
            <div className="flex items-center gap-2"><FaFire className="text-eatpur-green-light" /> Difficulty: Easy</div>
            <div className="ml-auto flex items-center gap-4">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors font-sans not-italic text-sm font-medium ${liked ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-white border-black/10 hover:border-black/30 text-eatpur-dark'}`}
              >
                <FaHeart /> {likes}
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Ingredients */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-display text-eatpur-dark mb-6 tracking-wide">Ingredients</h3>
              <ul className="space-y-4">
                {['1 cup Foxtail Millet (cooked)', '2 tbsp Peanuts', '1 tsp Mustard Seeds', '1/2 tsp Turmeric', '2 Green Chilies', 'Curry Leaves', '2 tbsp Lemon Juice', 'Salt to taste', '1 tbsp Oil'].map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 text-eatpur-text font-serif text-[15px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-eatpur-green-dark mt-2.5 flex-shrink-0 opacity-70" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-display text-eatpur-dark mb-6 tracking-wide">Instructions</h3>
              <div className="space-y-8">
                {[
                  'Heat oil in a pan. Add peanuts and fry until golden. Remove and set aside.',
                  'In the same oil, add mustard seeds. Once they splutter, add green chilies and curry leaves.',
                  'Add turmeric powder and salt, mix quickly to avoid burning.',
                  'Add the cooked foxtail millet and mix gently until uniformly yellow.',
                  'Turn off the heat, add lemon juice and the fried peanuts. Mix well and serve hot.'
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-eatpur-white-warm border border-black/5 text-eatpur-green-dark flex items-center justify-center font-display font-medium shadow-inner">
                      {i + 1}
                    </div>
                    <p className="text-eatpur-text leading-relaxed pt-1 font-serif text-[15px]">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="mt-16 pt-12 border-t border-black/5">
            <h3 className="text-2xl font-display text-eatpur-dark mb-8 flex items-center gap-3 tracking-wide">
              <FaComment className="text-eatpur-green-dark/70" /> Comments ({comments.length})
            </h3>
            
            <form onSubmit={handleComment} className="mb-10 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-eatpur-white-warm border border-black/5 flex items-center justify-center text-eatpur-dark font-medium font-display shadow-inner">G</div>
              <div className="flex-1 flex flex-col gap-3">
                <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors resize-none h-24 shadow-inner placeholder:text-eatpur-text-light font-serif"
                />
                <button type="submit" disabled={!newComment.trim()} className="btn-primary self-end py-2 px-6 font-medium">Post Comment</button>
              </div>
            </form>

            <div className="space-y-6">
              {comments.map(c => (
                <div key={c.id} className="flex gap-4 p-4 rounded-xl bg-white border border-black/5 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-eatpur-white-warm border border-black/5 flex items-center justify-center text-eatpur-green-dark font-display font-medium shadow-inner flex-shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3 mb-1">
                      <h5 className="text-eatpur-dark font-display font-medium">{c.name}</h5>
                      <span className="text-[10px] text-eatpur-text-light font-sans tracking-widest uppercase">{c.time}</span>
                    </div>
                    <p className="text-eatpur-text font-serif text-[15px] leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
