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
      <div className="w-full min-h-screen pt-24 pb-32 px-6 flex items-center justify-center relative z-10 bg-eatpur-white-warm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="vintage-card bg-white max-w-lg w-full p-12 rounded-3xl text-center flex flex-col items-center border border-black/5 shadow-sm"
        >
          <div className="w-24 h-24 bg-eatpur-green-light/20 rounded-full flex items-center justify-center mb-6 border border-eatpur-green-dark text-eatpur-green-dark shadow-inner">
            <FaCheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-display text-eatpur-dark mb-4 tracking-wide">Recipe Published!</h2>
          <p className="text-eatpur-text font-serif italic mb-8">Thank you for sharing with the EatPur community.</p>
          <Link to="/recipes" className="btn-primary font-medium tracking-wide">View Recipes</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-24 pb-32 px-6 relative z-10 bg-eatpur-white-warm">
      <div className="max-w-3xl mx-auto vintage-card bg-white border border-black/5 p-8 md:p-12 rounded-2xl shadow-sm">
        <h1 className="text-4xl font-display text-eatpur-dark mb-2 text-center tracking-tight">Publish Recipe</h1>
        <p className="text-eatpur-text text-center mb-10 font-serif italic">Share your favorite healthy millet creations.</p>

        <form onSubmit={handleSubmit} className="space-y-8 font-sans">
          <div>
            <label className="block text-eatpur-dark text-sm mb-2 font-medium">Recipe Title <span className="text-red-500">*</span></label>
            <input required type="text" placeholder="e.g. Sprouted Ragi Pancakes" className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-inner placeholder:text-eatpur-text-light font-serif" />
          </div>

          <div>
            <label className="block text-eatpur-dark text-sm mb-2 font-medium">Description <span className="text-red-500">*</span></label>
            <textarea required placeholder="Tell us about this recipe..." className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors h-24 resize-none shadow-inner placeholder:text-eatpur-text-light font-serif" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-eatpur-dark text-sm mb-2 font-medium">Cook Time <span className="text-red-500">*</span></label>
              <input required type="text" placeholder="e.g. 30 mins" className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-inner placeholder:text-eatpur-text-light font-serif" />
            </div>
            <div>
              <label className="block text-eatpur-dark text-sm mb-2 font-medium">Servings <span className="text-red-500">*</span></label>
              <input required type="number" min="1" placeholder="e.g. 2" className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-inner placeholder:text-eatpur-text-light font-serif" />
            </div>
          </div>

          <div>
            <label className="block text-eatpur-dark text-sm mb-4 font-medium">Ingredients <span className="text-red-500">*</span></label>
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
                      className="flex-1 bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-inner placeholder:text-eatpur-text-light font-serif" 
                    />
                    <button type="button" onClick={() => removeIngredient(i)} className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl border border-red-500/30 text-red-500 hover:bg-red-50 transition-colors shadow-sm bg-white">
                      <FaTrash />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button type="button" onClick={addIngredient} className="flex items-center gap-2 text-eatpur-green-dark hover:text-eatpur-green-light transition-colors text-sm py-2 font-medium">
                <FaPlus /> Add Ingredient
              </button>
            </div>
          </div>

          <div>
            <label className="block text-eatpur-dark text-sm mb-4 font-medium">Steps <span className="text-red-500">*</span></label>
            <div className="space-y-3">
              <AnimatePresence>
                {steps.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex gap-3">
                    <div className="w-12 h-12 flex-shrink-0 rounded-xl border border-black/5 bg-eatpur-white-warm flex items-center justify-center text-eatpur-green-dark font-display font-medium shadow-inner">
                      {i + 1}
                    </div>
                    <textarea 
                      required 
                      value={step}
                      onChange={(e) => updateStep(i, e.target.value)}
                      placeholder={`Step ${i + 1} instructions...`} 
                      className="flex-1 bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors h-12 min-h-[48px] resize-y shadow-inner placeholder:text-eatpur-text-light font-serif" 
                    />
                    <button type="button" onClick={() => removeStep(i)} className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl border border-red-500/30 text-red-500 hover:bg-red-50 transition-colors shadow-sm bg-white">
                      <FaTrash />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button type="button" onClick={addStep} className="flex items-center gap-2 text-eatpur-green-dark hover:text-eatpur-green-light transition-colors text-sm py-2 font-medium border-t border-transparent">
                <FaPlus /> Add Step
              </button>
            </div>
          </div>

          <div>
            <label className="block text-eatpur-dark text-sm mb-2 font-medium">Cover Image (Optional)</label>
            <div className="w-full h-32 border border-dashed border-black/20 rounded-xl bg-eatpur-white-warm flex flex-col items-center justify-center text-eatpur-text-light hover:text-eatpur-green-dark transition-colors cursor-pointer hover:border-eatpur-green-dark/30 hover:bg-eatpur-green-light/10">
              <FaImage size={24} className="mb-2 opacity-50" />
              <span className="font-medium text-sm">Click to upload image</span>
            </div>
          </div>

          <div className="pt-6 border-t border-black/5">
            <button type="submit" className="btn-primary w-full py-4 text-lg font-medium tracking-wide">Publish Recipe</button>
          </div>
        </form>
      </div>
    </div>
  );
}
