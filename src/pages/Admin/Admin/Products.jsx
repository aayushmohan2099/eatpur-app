// src/pages/Admin/Admin/Products.jsx
import React from "react";
import ProdList from "./ProdComps/ProdList";
import ProductAddScreen from "./ProdComps/ProductAddScreen";

export default function ProductsWorkspace({ activeSubTab }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200">
      {activeSubTab === "All Products" && <ProdList />}
      {activeSubTab === "Add New Product" && <ProductAddScreen />}
      {activeSubTab === "Categories" && (
        <div className="text-center text-slate-400 py-12">
          Categories Module Construction
        </div>
      )}
      {activeSubTab === "Discounts" && (
        <div className="text-center text-slate-400 py-12">
          Discounts Module Construction
        </div>
      )}
    </div>
  );
}
