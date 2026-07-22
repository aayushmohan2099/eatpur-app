// src/pages/Admin/Admin/StockMgmnt.jsx
import React, { useState, useMemo } from "react";
// import TablePagination from "../CommonUiComp/TablePagination"; // Assuming path consistency with your setup

// Live product inventory data mapped from catalog feed
const INITIAL_STOCK_DATA = [
    {
        id: 1,
        sku: "MUL-READ-VJBKPB",
        productName: "Multi Millets Hakka Noodles",
        warehouse: "Central Hub - Patna",
        currentStock: 120,
        minThreshold: 40,
        maxCapacity: 250,
        unit: "packets",
        category: "Ready to Cook",
        size: "SMALL - 200.000g",
        price: 129.00
    },
    {
        id: 2,
        sku: "MUL-READ-ZW4GMP",
        productName: "Multi Millets Pasta",
        warehouse: "Central Hub - Patna",
        currentStock: 95,
        minThreshold: 35,
        maxCapacity: 200,
        unit: "packets",
        category: "Ready to Cook",
        size: "SMALL - 200.000g",
        price: 129.00
    },
    {
        id: 3,
        sku: "MUL-READ-QLYDW5",
        productName: "Multi Millets Soya Chips Chatpata Masala",
        warehouse: "South Hub - Gaya",
        currentStock: 140,
        minThreshold: 50,
        maxCapacity: 300,
        unit: "packets",
        category: "Ready to Eat",
        size: "SMALL - 80.000g",
        price: 50.00
    },
    {
        id: 4,
        sku: "CHO-READ-ALW7MA",
        productName: "Chocolate Almond Cookies",
        warehouse: "North Hub - Muzaffarpur",
        currentStock: 22,
        minThreshold: 30,
        maxCapacity: 150,
        unit: "packets",
        category: "Ready to Eat",
        size: "SMALL - 150.000g",
        price: 179.00
    },
    {
        id: 5,
        sku: "MIL-READ-OEFNXP",
        productName: "Millets Butter Kaju Cookies",
        warehouse: "East Hub - Bhagalpur",
        currentStock: 85,
        minThreshold: 30,
        maxCapacity: 180,
        unit: "packets",
        category: "Ready to Eat",
        size: "SMALL - 150.000g",
        price: 199.00
    },
    {
        id: 6,
        sku: "MIL-READ-BO08N5",
        productName: "Millet Energy Bar Chocolate Light",
        warehouse: "Central Hub - Patna",
        currentStock: 110,
        minThreshold: 40,
        maxCapacity: 220,
        unit: "units",
        category: "Ready to Eat",
        size: "SMALL - 80.000g",
        price: 99.00
    },
    {
        id: 7,
        sku: "MIL-READ-2MZL5M",
        productName: "Millet Energy Bar Chocolate with Nuts",
        warehouse: "South Hub - Gaya",
        currentStock: 18,
        minThreshold: 35,
        maxCapacity: 150,
        unit: "units",
        category: "Ready to Eat",
        size: "SMALL - 80.000g",
        price: 119.00
    },
    {
        id: 8,
        sku: "MIL-READ-98MVON",
        productName: "Millet Granola Muesli Chocolate",
        warehouse: "North Hub - Muzaffarpur",
        currentStock: 75,
        minThreshold: 25,
        maxCapacity: 120,
        unit: "packets",
        category: "Ready to Eat",
        size: "MEDIUM - 400.000g",
        price: 299.00
    },
    {
        id: 9,
        sku: "MUL-READ-2R1TRZ",
        productName: "Multi Millets Namkeen Mixture",
        warehouse: "Central Hub - Patna",
        currentStock: 130,
        minThreshold: 45,
        maxCapacity: 250,
        unit: "packets",
        category: "Ready to Eat",
        size: "SMALL - 150.000g",
        price: 85.00
    },
];

export default function StockMgmnt({ activeSubTab }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'low', 'medium', 'high'
    const [warehouseFilter, setWarehouseFilter] = useState("all");

    // Pagination states
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    // Derive unique warehouses for filter dropdown
    const uniqueWarehouses = useMemo(() => {
        return [...new Set(INITIAL_STOCK_DATA.map((item) => item.warehouse))];
    }, []);

    // Helper function to calculate stock level status
    const getStockStatus = (current, min) => {
        if (current <= min) return "low";
        if (current <= min * 2) return "medium";
        return "high";
    };

    // Filter logic
    const filteredStock = useMemo(() => {
        return INITIAL_STOCK_DATA.filter((item) => {
            const matchesSearch =
                item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.sku.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesWarehouse = warehouseFilter === "all" || item.warehouse === warehouseFilter;

            const status = getStockStatus(item.currentStock, item.minThreshold);
            const matchesStatus = statusFilter === "all" || status === statusFilter;

            return matchesSearch && matchesWarehouse && matchesStatus;
        });
    }, [searchQuery, warehouseFilter, statusFilter]);

    // Pagination processing
    const totalPages = useMemo(() => {
        const pages = Math.ceil(filteredStock.length / rowsPerPage);
        return pages === 0 ? 1 : pages;
    }, [filteredStock.length, rowsPerPage]);

    const paginatedStock = useMemo(() => {
        const startIndex = (page - 1) * rowsPerPage;
        return filteredStock.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredStock, page, rowsPerPage]);

    return (
        <div className="space-y-6">
            {/* Workspace Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Inventory Stock Levels</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Monitor real-time warehouse inventory quantities, thresholds, and color-coded stock statuses.
                    </p>
                </div>
                <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#3A5A1C]/10 text-[#3A5A1C] border border-[#3A5A1C]/20 uppercase tracking-wider">
                    Active View: {activeSubTab}
                </div>
            </div>

            {/* Filter and Search Bar Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                    {/* Search Input */}
                    <div className="min-w-[240px] flex-1">
                        <input
                            type="text"
                            placeholder="Search by product name or SKU..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#3A5A1C] transition-colors"
                        />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#3A5A1C] cursor-pointer"
                        >
                            <option value="all">All Stock Status</option>
                            <option value="low">Low Stock (≤ Min)</option>
                            <option value="medium">Medium Stock</option>
                            <option value="high">High Stock (Optimal)</option>
                        </select>
                    </div>

                    {/* Warehouse Filter */}
                    <div>
                        <select
                            value={warehouseFilter}
                            onChange={(e) => { setWarehouseFilter(e.target.value); setPage(1); }}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#3A5A1C] cursor-pointer"
                        >
                            <option value="all">All Warehouses</option>
                            {uniqueWarehouses.map((wh) => (
                                <option key={wh} value={wh}>{wh}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {(searchQuery || statusFilter !== "all" || warehouseFilter !== "all") && (
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                            setWarehouseFilter("all");
                            setPage(1);
                        }}
                        className="text-xs font-medium text-slate-500 hover:text-slate-800 border border-dashed border-slate-300 px-3 py-2 rounded-lg transition-colors"
                    >
                        Reset Filters
                    </button>
                )}
            </div>

            {/* Stock Table Grid */}
            <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="py-3.5 px-6">SKU / Product</th>
                                <th className="py-3.5 px-6">Warehouse Location</th>
                                <th className="py-3.5 px-6 text-right">Current Stock</th>
                                <th className="py-3.5 px-6 text-right">Min Threshold</th>
                                <th className="py-3.5 px-6 text-center">Status Level</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {paginatedStock.length > 0 ? (
                                paginatedStock.map((item) => {
                                    const status = getStockStatus(item.currentStock, item.minThreshold);
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="font-semibold text-slate-800 flex items-center gap-2">
                                                    {item.productName}
                                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <div className="text-xs font-mono text-slate-400 mt-0.5">
                                                    {item.sku} • <span className="text-slate-500">{item.size}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-slate-600 font-medium">
                                                {item.warehouse}
                                            </td>
                                            <td className="py-4 px-6 text-right font-bold text-slate-800">
                                                {item.currentStock} <span className="text-xs font-normal text-slate-400">{item.unit}</span>
                                            </td>
                                            <td className="py-4 px-6 text-right text-slate-500 font-medium">
                                                {item.minThreshold} {item.unit}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {status === "low" && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                                                        Low Stock
                                                    </span>
                                                )}
                                                {status === "medium" && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                                                        Medium Stock
                                                    </span>
                                                )}
                                                {status === "high" && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                                        High / Optimal
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-slate-400 text-sm">
                                        No inventory metrics found matching your search filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Integration */}
                {/* <TablePagination
                    page={page}
                    totalPages={totalPages}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    setPage={setPage}
                    totalRecords={filteredStock.length}
                /> */}
            </div>
        </div>
    );
}