// src/pages/Admin/Admin/BlogComps/BlogAnalytics.jsx
import React, { useState, useEffect } from "react";
import { getBlogAnalytics } from "../../../../api/blogs";

import EatpurKpiCard from "../UniComps/EatpurKpiCard";
import RadarMetricCard from "../UniComps/RadarMetricCard";
import AnimatedBarChart from "../UniComps/AnimatedBarChart";
import EatpurTable from "../UniComps/Table";
import HotBadge from "../UniComps/HotBadge";
import AlertToast from "../UniComps/AlertToast";
import Badge from "../UniComps/Badge";

export default function BlogAnalytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getBlogAnalytics();
            setData(res); // apiFetch automatically decrypts and returns JSON payload
        } catch (err) {
            console.error("Failed to load analytics", err);
            setError("Unable to sync latest analytics. Please verify your connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    // --- Loading State ---
    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl"></div>)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="h-64 bg-slate-100 rounded-2xl lg:col-span-2"></div>
                    <div className="h-64 bg-slate-100 rounded-2xl lg:col-span-1"></div>
                </div>
            </div>
        );
    }

    // --- Error State ---
    if (error && !data) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <AlertToast type="error" message={error} />
                <button
                    onClick={fetchAnalytics}
                    className="mt-4 text-sm font-semibold text-[--color-eatpur-green-dark] underline"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // --- Data Mapping ---
    const { kpis, top_blogs, status_distribution } = data;

    // 1. Chart Data Mapping (Extracting from status_distribution)
    const chartData = [
        { label: "Approved", value: status_distribution.APPROVED || 0 },
        { label: "Pending", value: status_distribution.PENDING || 0 },
        { label: "Drafts", value: status_distribution.DRAFT || 0 },
        { label: "Rejected", value: status_distribution.REJECTED || 0 },
    ];

    // Ensure the chart doesn't break if all values are exactly 0
    const maxChartVal = Math.max(...chartData.map(d => d.value));
    if (maxChartVal === 0) {
        chartData[0].value = 0.1; // Invisible micro-value to prevent NaN rendering issues in child
    }

    // 2. Table Data Mapping
    const topBlogColumns = [
        { header: "Article", accessor: "formattedTitle" },
        { header: "Author", accessor: "authorBadge" },
        { header: "Views", accessor: "views" },
        { header: "Likes", accessor: "likes" },
        { header: "Comments", accessor: "comments" },
        { header: "Published", accessor: "formattedDate" },
    ];

    const processedTopBlogs = top_blogs.map((blog, index) => ({
        ...blog,
        formattedTitle: (
            <div className="flex items-center gap-3">
                <span className="font-medium text-[--color-eatpur-dark] max-w-[200px] truncate" title={blog.title}>
                    {blog.title}
                </span>
                {index === 0 && <HotBadge text="Top Article" />}
            </div>
        ),
        authorBadge: <Badge text={blog.author} type="eatpur" />,
        formattedDate: blog.published_at
            ? new Date(blog.published_at).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric"
            })
            : "—",
    }));

    // --- Render ---
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-medium text-[--color-eatpur-dark]" style={{ fontFamily: "var(--font-display, serif)" }}>
                    Blog Analytics Overview
                </h2>
                <p className="text-sm text-[--color-eatpur-text-light] mt-1">
                    Real-time insights into your readership, engagement, and publishing pipeline.
                </p>
            </div>

            {/* Optional Silent Error Recovery */}
            {error && data && (
                <div className="mb-4">
                    <AlertToast type="warning" message="Using cached data. Live sync failed." />
                </div>
            )}

            {/* 1. KPIs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <EatpurKpiCard
                    title="Total Published"
                    value={kpis.published_blogs}
                    percent={100} // Assuming 100% since it's an absolute metric, or replace with actual growth
                    color="eatpur"
                />
                <EatpurKpiCard
                    title="Total Likes"
                    value={kpis.total_likes}
                    percent={0}
                    color="gold"
                />
                <EatpurKpiCard
                    title="Total Comments"
                    value={kpis.total_comments}
                    percent={0}
                    color="info"
                />
                <EatpurKpiCard
                    title="Pending Review"
                    value={status_distribution.PENDING || 0}
                    percent={0}
                    color="warning"
                />
            </div>

            {/* 2. Visuals Row (Charts) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart mapping the Publishing Pipeline */}
                <div className="lg:col-span-2">
                    <AnimatedBarChart
                        title="Publishing Pipeline Status"
                        data={chartData}
                    />
                </div>

                {/* Radar Scanner for Global Readership */}
                <div className="lg:col-span-1">
                    <RadarMetricCard
                        title="Global Readership"
                        value={kpis.total_views > 1000 ? kpis.total_views / 1000 : kpis.total_views}
                        suffix={kpis.total_views >= 1000 ? "k" : ""}
                    />
                </div>
            </div>

            {/* 3. Top Performers Table */}
            <div className="flex flex-col">
                <div className="bg-white rounded-2xl border border-[--color-eatpur-yellow-light] shadow-sm flex-1 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-display, serif)" }}>
                            Top Performing Articles
                        </h3>
                        <Badge text="Highest Engagement" type="success" />
                    </div>

                    {processedTopBlogs.length > 0 ? (
                        <EatpurTable
                            columns={topBlogColumns}
                            data={processedTopBlogs}
                            showActions={false} // Clean data-only table
                        />
                    ) : (
                        <div className="py-12 text-center text-sm text-[--color-eatpur-text-light]">
                            No published articles with engagement data available yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}