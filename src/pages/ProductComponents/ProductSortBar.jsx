// src/pages/ProductComponents/ProductSortBar.jsx
import React from "react";
import { FaSortAmountDown } from "react-icons/fa";

export default function ProductSortBar({ sort, setSort, totalCount }) {
  const sortOptions = [
    { value: "", label: "Trending & Recommended" },
    { value: "discount_max", label: "Biggest Discounts" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "protein_desc", label: "Highest Protein" },
    { value: "calories_asc", label: "Lowest Calories" },
    { value: "carbs_asc", label: "Lowest Carbs" },
    { value: "fibre_desc", label: "Highest Fibre" },
    { value: "fats_asc", label: "Lowest Fats" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div className="text-eatpur-text text-sm">
        Showing <span className="font-bold text-eatpur-dark">{totalCount}</span>{" "}
        products
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <label className="text-eatpur-text-light text-sm flex items-center gap-2 whitespace-nowrap">
          <FaSortAmountDown /> Sort by:
        </label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full md:w-64 px-3 py-2 bg-eatpur-white-warm border border-eatpur-yellow-light rounded-lg text-sm text-eatpur-dark font-medium focus:outline-none focus:border-eatpur-green-dark transition-colors cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
