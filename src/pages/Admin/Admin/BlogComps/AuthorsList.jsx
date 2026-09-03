// src\pages\Admin\Admin\BlogComps\AuthorsList.jsx
import React, { useState, useEffect } from "react";
import { getBlogAuthors } from "../../../../api/blogs";

// Adjust these relative imports based on your actual folder structure
import EatpurTable from "../UniComps/Table";
import Badge from "../UniComps/Badge";
import MagicButton from "../UniComps/MagicButton";

export default function AuthorsList() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchAuthorsData = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Note: If you haven't updated getBlogAuthors in blogs.js to accept params,
      // you may need to update it to: export const getBlogAuthors = (params) => API.get("/blog/authors/", { params })
      const response = await getBlogAuthors({ page });

      const rawData = response.data || response;

      // Handle both flat arrays and DRF Paginated objects cleanly
      if (Array.isArray(rawData)) {
        setAuthors(rawData);
        setTotalPages(1);
        setTotalRecords(rawData.length);
      } else if (rawData.results) {
        setAuthors(rawData.results);
        setTotalRecords(rawData.count);
        // Assuming your DRF PAGE_SIZE is set to 12 based on your settings
        setTotalPages(Math.ceil(rawData.count / 12));
      } else {
        setAuthors([]);
      }
    } catch (err) {
      console.error("Error fetching author analytics:", err);
      setError(
        "Failed to load author analytics. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthorsData(currentPage);
  }, [currentPage]);

  // Define Table Columns
  const columns = [
    { header: "Author Details", accessor: "authorProfile" },
    { header: "Total Blogs", accessor: "total_blogs" },
    { header: "Total Views", accessor: "total_views" },
    { header: "Avg. Likes / Blog", accessor: "avgLikes" },
    { header: "Avg. Comments / Blog", accessor: "avgComments" },
  ];

  // Inject beautiful UI elements (Avatars, Badges) directly into the table rows
  const formattedData = authors.map((author) => ({
    ...author,

    // Rich profile column with Avatar and Email
    authorProfile: (
      <div className="flex items-center gap-3 py-1">
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.username}
            className="w-10 h-10 rounded-full object-cover border border-[--color-eatpur-yellow-light] shadow-sm"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full bg-[--color-eatpur-green-light] flex items-center justify-center text-white font-bold shadow-sm"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {author.username ? author.username.charAt(0).toUpperCase() : "?"}
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-semibold text-[--color-eatpur-dark]">
            {author.username}
          </span>
          <span className="text-xs text-[--color-eatpur-text-light]">
            {author.email}
          </span>
        </div>
      </div>
    ),

    // Standard numbers
    total_blogs: (
      <span className="font-medium text-[--color-eatpur-dark]">
        {author.total_blogs}
      </span>
    ),

    total_views: (
      <span className="font-medium text-[--color-eatpur-dark]">
        {author.total_views.toLocaleString()}
      </span>
    ),

    // Visual Badges for Analytics
    avgLikes: (
      <Badge
        text={`${author.avg_likes} Likes`}
        type={author.avg_likes > 10 ? "success" : "eatpur"}
        icon="👍"
      />
    ),

    avgComments: (
      <Badge text={`${author.avg_comments} Comments`} type="info" icon="💬" />
    ),
  }));

  const handleActionIntercept = (authorData) => {
    alert(
      `Viewing detailed analytics for ${authorData.username} (ID: ${authorData.id})`,
    );
    // In the future, navigate to a detailed author view: navigate(`/admin/authors/${authorData.id}`)
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-medium text-[--color-eatpur-dark]"
            style={{ fontFamily: "var(--font-display, serif)" }}
          >
            Author Analytics
          </h2>
          <p className="text-sm text-[--color-eatpur-text-light] mt-1">
            Performance metrics for users who have published blogs.
          </p>
        </div>
        <div className="text-sm font-medium text-[--color-eatpur-green-dark] bg-[--color-eatpur-white-warm] px-4 py-2 rounded-lg border border-[--color-eatpur-yellow-light]">
          Total Active Authors: {totalRecords}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-sm flex items-center gap-3 shadow-sm">
          <span>⚠️</span>
          <p className="flex-1">{error}</p>
          <button
            onClick={() => fetchAuthorsData(currentPage)}
            className="text-xs font-bold uppercase tracking-wider hover:text-rose-900 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="w-full rounded-xl border border-[--color-eatpur-yellow-light] bg-white overflow-hidden shadow-sm">
          <div className="h-12 bg-[--color-eatpur-white-warm] border-b border-[--color-eatpur-yellow-light] flex items-center px-6">
            <div className="h-4 w-1/4 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((skeletonIdx) => (
              <div
                key={skeletonIdx}
                className="flex items-center justify-between py-3 border-b border-slate-50 last:border-none"
              >
                <div className="flex items-center gap-3 w-1/3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-3 w-3/4 bg-slate-100 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Data Table */
        <div className="flex flex-col gap-4">
          <EatpurTable
            columns={columns}
            data={formattedData}
            showActions={true}
            onViewClick={handleActionIntercept}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-[--color-eatpur-yellow-light] shadow-sm">
              <span className="text-sm text-[--color-eatpur-text-light]">
                Showing Page{" "}
                <span className="font-semibold text-[--color-eatpur-dark]">
                  {currentPage}
                </span>{" "}
                of {totalPages}
              </span>
              <div className="flex items-center gap-3">
                <MagicButton
                  variant="eatpur"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="!min-w-[5rem]"
                >
                  Previous
                </MagicButton>

                <MagicButton
                  variant="eatpur"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="!min-w-[5rem]"
                >
                  Next
                </MagicButton>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
