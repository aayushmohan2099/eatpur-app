import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaImage, FaCheckCircle } from 'react-icons/fa6';

export default function PublishRecipePage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const addIngredient = () => setIngredients([...ingredients, '']);
  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };
  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const addStep = () => setSteps([...steps, '']);
  const updateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };
  const removeStep = (index) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full min-h-screen pt-24 pb-32 px-6 flex items-center justify-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-modal max-w-lg w-full p-12 rounded-3xl text-center flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-eatpur-green-light/20 rounded-full flex items-center justify-center mb-6 border border-eatpur-green-light text-eatpur-green-light">
            <FaCheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-display text-gradient-gold mb-4">Recipe Published!</h2>
          <p className="text-eatpur-text mb-8">Thank you for sharing with the EatPur community.</p>
          <Link to="/recipes" className="btn-primary">View Recipes</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-24 pb-32 px-6 relative z-10">
      <div className="max-w-3xl mx-auto glass-card p-8 md:p-12 rounded-3xl">
        <h1 className="text-4xl font-display text-gradient-gold mb-2 text-center">Publish Recipe</h1>
        <p className="text-eatpur-text text-center mb-10">Share your favorite healthy millet creations.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-eatpur-text-light text-sm mb-2">Recipe Title *</label>
            <input required type="text" placeholder="e.g. Sprouted Ragi Pancakes" className="w-full bg-eatpur-dark/50 border border-eatpur-gold/20 rounded-xl px-4 py-3 text-eatpur-white-warm focus:outline-none focus:border-eatpur-gold transition-colors" />
          </div>

          <div>
            <label className="block text-eatpur-text-light text-sm mb-2">Description *</label>
            <textarea required placeholder="Tell us about this recipe..." className="w-full bg-eatpur-dark/50 border border-eatpur-gold/20 rounded-xl px-4 py-3 text-eatpur-white-warm focus:outline-none focus:border-eatpur-gold transition-colors h-24 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-eatpur-text-light text-sm mb-2">Cook Time *</label>
              <input required type="text" placeholder="e.g. 30 mins" className="w-full bg-eatpur-dark/50 border border-eatpur-gold/20 rounded-xl px-4 py-3 text-eatpur-white-warm focus:outline-none focus:border-eatpur-gold transition-colors" />
            </div>
            <div>
              <label className="block text-eatpur-text-light text-sm mb-2">Servings *</label>
              <input required type="number" min="1" placeholder="e.g. 2" className="w-full bg-eatpur-dark/50 border border-eatpur-gold/20 rounded-xl px-4 py-3 text-eatpur-white-warm focus:outline-none focus:border-eatpur-gold transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-eatpur-text-light text-sm mb-4">Ingredients *</label>
            <div className="space-y-3">
              <AnimatePresence>
                {ingredients.map((ing, i) => (
                  <motion.div key={i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex gap-3">
                    <input 
                      required 
                      type="text" 
                      value={ing}
                      onChange={(e) => updateIngredient(i, e.target.value)}
                      placeholder={`Ingredient ${i + 1}`} 
                      className="flex-1 bg-eatpur-dark/50 border border-eatpur-gold/20 rounded-xl px-4 py-3 text-eatpur-white-warm focus:outline-none focus:border-eatpur-gold transition-colors" 
                    />
                    <button type="button" onClick={() => removeIngredient(i)} className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
                      <FaTrash />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button type="button" onClick={addIngredient} className="flex items-center gap-2 text-eatpur-gold hover:text-eatpur-yellow transition-colors text-sm py-2">
                <FaPlus /> Add Ingredient
              </button>
            </div>
          </div>

          <div>
            <label className="block text-eatpur-text-light text-sm mb-4">Steps *</label>
            <div className="space-y-3">
              <AnimatePresence>
                {steps.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex gap-3">
                    <div className="w-12 h-12 flex-shrink-0 rounded-xl border border-eatpur-gold/20 bg-eatpur-gold/5 flex items-center justify-center text-eatpur-yellow font-bold">
                      {i + 1}
                    </div>
                    <textarea 
                      required 
                      value={step}
                      onChange={(e) => updateStep(i, e.target.value)}
                      placeholder={`Step ${i + 1} instructions...`} 
                      className="flex-1 bg-eatpur-dark/50 border border-eatpur-gold/20 rounded-xl px-4 py-3 text-eatpur-white-warm focus:outline-none focus:border-eatpur-gold transition-colors h-12 min-h-[48px] resize-y" 
                    />
                    <button type="button" onClick={() => removeStep(i)} className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
                      <FaTrash />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button type="button" onClick={addStep} className="flex items-center gap-2 text-eatpur-gold hover:text-eatpur-yellow transition-colors text-sm py-2 border-t border-transparent">
                <FaPlus /> Add Step
              </button>
            </div>
          </div>

          <div>
            <label className="block text-eatpur-text-light text-sm mb-2">Cover Image (Optional)</label>
            <div className="w-full h-32 border-2 border-dashed border-eatpur-gold/30 rounded-xl bg-eatpur-dark/30 flex flex-col items-center justify-center text-eatpur-text/60 hover:text-eatpur-yellow transition-colors cursor-pointer hover:border-eatpur-gold/60 hover:bg-eatpur-gold/5">
              <FaImage size={24} className="mb-2" />
              <span>Click to upload image</span>
            </div>
          </div>

          <div className="pt-6 border-t border-eatpur-gold/10">
            <button type="submit" className="btn-primary w-full py-4 text-lg">Publish Recipe</button>
          </div>
        </form>
      </div>
    </div>
  );
}
