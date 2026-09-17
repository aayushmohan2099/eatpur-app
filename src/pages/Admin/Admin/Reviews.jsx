// src\pages\Admin\Admin\Reviews.jsx
import React, { useCallback, useEffect, useState } from "react";
import { getAllReviews } from "../../../api/userApi";
import EatpurTable from "./UniComps/Table";

const normalizeReviews = (response) => {
  const payload =
    response?.data && !Array.isArray(response.data) ? response.data : response;
  const reviews = Array.isArray(payload)
    ? payload
    : payload?.results || payload?.reviews || payload?.data || [];

  return {
    reviews: Array.isArray(reviews) ? reviews : [],
    total: Number(payload?.count || payload?.total || reviews.length),
    hasNext: Boolean(payload?.next),
    hasPrevious: Boolean(payload?.previous),
  };
};

function ReviewsList({
  reviews,
  loading,
  error,
  onRetry,
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}) {
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Mobile Number", accessor: "mobileNumber" },
    { header: "Email", accessor: "email" },
    { header: "Stars", accessor: "stars" },
    { header: "Response Description", accessor: "responseDescription" },
  ];

  const rows = reviews.map((review) => {
    return {
      ...review,
      name: review.name || "-",
      mobileNumber: review.mobile_number || review.mobile || "-",
      email: review.email || "-",
      stars: review.stars ?? review.rating ?? "-",
      responseDescription: review.response_description || "-",
    };
  });

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-800">
          <span>{error}</span>
          <button onClick={onRetry} className="font-semibold underline">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-[--color-eatpur-yellow-light] bg-white p-8 text-center text-sm text-slate-500">
          Loading reviews...
        </div>
      ) : (
        <>
          <EatpurTable columns={columns} data={rows} showActions={false} />
          {(totalPages > 1 || hasNext || hasPrevious) && (
            <div className="flex items-center justify-between rounded-xl border border-[--color-eatpur-yellow-light] bg-white px-5 py-4 shadow-sm">
              <p className="text-sm text-[--color-eatpur-text]">
                Page <span className="font-semibold">{currentPage}</span>
                {totalPages > 0 && ` of ${totalPages}`}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={!hasPrevious && currentPage === 1}
                  className="rounded border border-[--color-eatpur-yellow-light] px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={!hasNext && currentPage >= totalPages}
                  className="rounded border border-[--color-eatpur-yellow-light] px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ReviewsWorkspace() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllReviews(currentPage);
      const normalized = normalizeReviews(response);
      setReviews(normalized.reviews);
      setTotalReviews(normalized.total);
      setHasNext(normalized.hasNext);
      setHasPrevious(normalized.hasPrevious || currentPage > 1);
    } catch (requestError) {
      console.error("Error fetching reviews:", requestError);
      setError("Failed to load reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const totalPages = Math.max(1, Math.ceil(totalReviews / 10));

  return (
    <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
      <div>
        <h2
          className="text-2xl font-medium text-[--color-eatpur-dark]"
          style={{ fontFamily: "var(--font-display, serif)" }}
        >
          Customer Reviews
        </h2>
        <p className="mt-1 text-sm text-[--color-eatpur-text-light]">
          Manage and inspect customer feedback from Eatpur products.
        </p>
      </div>

      <ReviewsList
        reviews={reviews}
        loading={loading}
        error={error}
        onRetry={fetchReviews}
        currentPage={currentPage}
        totalPages={totalPages}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        onPageChange={(page) => {
          if (page >= 1 && (hasNext || page <= totalPages)) {
            setCurrentPage(page);
          }
        }}
      />
    </div>
  );
}
