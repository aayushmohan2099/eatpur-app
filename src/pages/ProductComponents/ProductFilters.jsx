// src/pages/ProductComponents/ProductFilters.jsx
import React from "react";
import { FaSearch } from "react-icons/fa";

export default function ProductFilters({ filters, setFilters, categories }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFilters({
      q: "",
      category: "",
      size: "",
      min_price: "",
      max_price: "",
      min_weight: "",
      max_weight: "",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-eatpur-gray-light p-5 space-y-6">
      <div className="flex justify-between items-center border-b border-eatpur-gray-light pb-4">
        <h3 className="font-display font-semibold text-eatpur-dark text-lg">
          Filters
        </h3>
        <button
          onClick={handleClear}
          className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-eatpur-text uppercase tracking-wider">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            name="q"
            value={filters.q}
            onChange={handleChange}
            placeholder="Search products, tags..."
            className="w-full pl-9 pr-3 py-2 bg-eatpur-white-warm border border-eatpur-yellow-light rounded-lg text-sm focus:outline-none focus:border-eatpur-green-dark transition-colors"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-eatpur-text-light" />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-eatpur-text uppercase tracking-wider">
          Category
        </label>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-eatpur-white-warm border border-eatpur-yellow-light rounded-lg text-sm focus:outline-none focus:border-eatpur-green-dark transition-colors"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Size */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-eatpur-text uppercase tracking-wider">
          Size
        </label>
        <select
          name="size"
          value={filters.size}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-eatpur-white-warm border border-eatpur-yellow-light rounded-lg text-sm focus:outline-none focus:border-eatpur-green-dark transition-colors"
        >
          <option value="">All Sizes</option>
          <option value="SMALL">Small</option>
          <option value="MEDIUM">Medium</option>
          <option value="LARGE">Large</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-eatpur-text uppercase tracking-wider">
          Price Range (₹)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="min_price"
            value={filters.min_price}
            onChange={handleChange}
            placeholder="Min"
            className="w-1/2 px-3 py-2 bg-eatpur-white-warm border border-eatpur-yellow-light rounded-lg text-sm focus:outline-none focus:border-eatpur-green-dark"
          />
          <span className="text-eatpur-text-light">-</span>
          <input
            type="number"
            name="max_price"
            value={filters.max_price}
            onChange={handleChange}
            placeholder="Max"
            className="w-1/2 px-3 py-2 bg-eatpur-white-warm border border-eatpur-yellow-light rounded-lg text-sm focus:outline-none focus:border-eatpur-green-dark"
          />
        </div>
      </div>

      {/* Weight Range */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-eatpur-text uppercase tracking-wider">
          Weight / Vol
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="min_weight"
            value={filters.min_weight}
            onChange={handleChange}
            placeholder="Min"
            className="w-1/2 px-3 py-2 bg-eatpur-white-warm border border-eatpur-yellow-light rounded-lg text-sm focus:outline-none focus:border-eatpur-green-dark"
          />
          <span className="text-eatpur-text-light">-</span>
          <input
            type="number"
            name="max_weight"
            value={filters.max_weight}
            onChange={handleChange}
            placeholder="Max"
            className="w-1/2 px-3 py-2 bg-eatpur-white-warm border border-eatpur-yellow-light rounded-lg text-sm focus:outline-none focus:border-eatpur-green-dark"
          />
        </div>
      </div>
    </div>
  );
}
