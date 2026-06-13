// src/pages/Admin/Admin/ProdComps/ProdList.jsx
import React, { useState, useEffect } from "react";
import {
    getProducts,
    getCategories,
    toggleTrending
} from "../../../../api/inventory";
import EatpurTable from "../UniComps/Table";
import Badge from "../UniComps/Badge";
import MagicButton from "../UniComps/MagicButton";
import ProductEditorModal from "./ProductEditorModal";

export default function ProdList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination & Filters
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [tagSearch, setTagSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [onlyFeatured, setOnlyFeatured] = useState(false);

    // Selection state (persists across pages)
    const [selectedIds, setSelectedIds] = useState(new Set());

    // Modal state
    const [editorProduct, setEditorProduct] = useState(null);

    // ----------------------------------------------------------------
    // Fetch Initial Data
    // ----------------------------------------------------------------
    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage, selectedCategory, onlyFeatured, tagSearch]);

    const fetchCategories = async () => {
        try {
            const res = await getCategories();
            const data = res.data || res.results || res;
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const params = { page };
            if (selectedCategory) params.category = selectedCategory;
            if (tagSearch.trim()) params.tags = tagSearch;

            const res = await getProducts(params);
            let rawData = res.data || res;
            let items = [];

            if (Array.isArray(rawData)) {
                items = rawData;
                setTotalPages(1);
                setTotalRecords(rawData.length);
            } else if (rawData.results) {
                items = rawData.results;
                setTotalRecords(rawData.count);
                setTotalPages(Math.ceil(rawData.count / 15));
            }

            // Apply client-side "Featured Only" filter if backend doesn't support it natively in this query
            if (onlyFeatured) {
                items = items.filter(p => p.is_trending);
            }

            setProducts(items);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to load products. Please check your network.");
        } finally {
            setLoading(false);
        }
    };

    // ----------------------------------------------------------------
    // Selections & Bulk Actions
    // ----------------------------------------------------------------
    const toggleSelection = (id) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const handleBulkToggleTrending = async () => {
        if (selectedIds.size === 0) return;
        setLoading(true);
        try {
            const promises = Array.from(selectedIds).map(id => toggleTrending(id));
            await Promise.all(promises);
            setSelectedIds(new Set());
            fetchProducts(currentPage);
        } catch (err) {
            setError("Failed to apply bulk trending updates.");
            setLoading(false);
        }
    };

    // ----------------------------------------------------------------
    // Table Mapping
    // ----------------------------------------------------------------
    const columns = [
        { header: "Select", accessor: "checkbox" },
        { header: "Product", accessor: "productDetails" },
        { header: "Size/Variant", accessor: "size_display" },
        { header: "Price", accessor: "price_info" },
        { header: "Status", accessor: "status_badge" },
    ];

    const formattedData = products.map((prod) => ({
        ...prod,
        // Highlighted row simulation inside the first column wrapper
        checkbox: (
            <div className={`p-2 rounded ${prod.is_trending ? 'bg-amber-50 border border-amber-200' : ''}`}>
                <input
                    type="checkbox"
                    className="w-4 h-4 text-[--color-eatpur-green-dark] rounded border-gray-300 focus:ring-[--color-eatpur-green-dark]"
                    checked={selectedIds.has(prod.id)}
                    onChange={() => toggleSelection(prod.id)}
                />
            </div>
        ),
        productDetails: (
            <div className={`flex items-center gap-3 p-2 rounded ${prod.is_trending ? 'bg-amber-50/50' : ''}`}>
                {prod.cover_image ? (
                    <img src={prod.cover_image} alt={prod.name} className="w-12 h-12 rounded object-cover shadow-sm border border-slate-200" />
                ) : (
                    <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center text-slate-400 text-xs shadow-sm border border-slate-200">No Img</div>
                )}
                <div className="flex flex-col">
                    <span className="font-semibold text-[--color-eatpur-dark] flex items-center gap-2">
                        {prod.name}
                        {prod.is_trending && <Badge type="warning" text="Featured" icon="🔥" />}
                    </span>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">{prod.pid} • {prod.category_name}</span>
                </div>
            </div>
        ),
        price_info: (
            <div className="flex flex-col">
                <span className="font-medium text-[--color-eatpur-dark]">₹{prod.fixed_price}</span>
                {parseFloat(prod.discounted_price) > 0 && parseFloat(prod.discounted_price) !== parseFloat(prod.fixed_price) && (
                    <span className="text-xs text-rose-500 font-semibold line-through">₹{prod.discounted_price}</span>
                )}
            </div>
        ),
        status_badge: (
            <Badge
                text={prod.status_name}
                type={prod.status_name === "IN_STOCK" ? "success" : prod.status_name === "OUT_OF_STOCK" ? "danger" : "warning"}
            />
        ),
    }));

    return (
        <div className="space-y-6">
            {/* Top Action Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-[--color-eatpur-white-warm] p-4 rounded-xl border border-[--color-eatpur-yellow-light]">
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <input
                        type="text"
                        placeholder="Search by Tags..."
                        className="px-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[--color-eatpur-green-dark] w-full sm:w-48"
                        value={tagSearch}
                        onChange={(e) => setTagSearch(e.target.value)}
                    />
                    <select
                        className="px-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[--color-eatpur-green-dark] w-full sm:w-48 bg-white"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={onlyFeatured}
                            onChange={(e) => setOnlyFeatured(e.target.checked)}
                            className="w-4 h-4 text-[--color-eatpur-green-dark] rounded border-gray-300"
                        />
                        Featured Only
                    </label>
                </div>

                <div className="flex items-center gap-3">
                    {selectedIds.size > 0 && (
                        <MagicButton variant="warning" onClick={handleBulkToggleTrending}>
                            Toggle Trending ({selectedIds.size})
                        </MagicButton>
                    )}
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-12 text-slate-400 animate-pulse">Loading products...</div>
            ) : (
                <div className="flex flex-col gap-4">
                    <EatpurTable
                        columns={columns}
                        data={formattedData}
                        showActions={true}
                        onViewClick={(row) => setEditorProduct(products.find(p => p.id === row.id))}
                    />

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-[--color-eatpur-yellow-light] shadow-sm">
                            <span className="text-sm text-[--color-eatpur-text-light]">
                                Page <span className="font-semibold text-[--color-eatpur-dark]">{currentPage}</span> of {totalPages}
                            </span>
                            <div className="flex items-center gap-3">
                                <MagicButton
                                    variant="eatpur"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </MagicButton>
                                <MagicButton
                                    variant="eatpur"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </MagicButton>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <ProductEditorModal
                product={editorProduct}
                isOpen={!!editorProduct}
                onClose={() => setEditorProduct(null)}
                onRefresh={() => fetchProducts(currentPage)}
            />
        </div>
    );
}