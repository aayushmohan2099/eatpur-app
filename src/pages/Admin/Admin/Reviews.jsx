// src/pages/Admin/Admin/Reviews.jsx
import React, { useCallback, useEffect, useState } from "react";
import { getAllReviews } from "../../../api/userApi";
import EatpurTable from "./UniComps/Table";
import { FaEye, FaTimes, FaBoxOpen, FaWhatsapp, FaCheck } from "react-icons/fa";

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
  // Yeh state track karegi ki kis-kis ko message bhej diya gaya hai
  const [sentWhatsApp, setSentWhatsApp] = useState(new Set());

  const handlePushToWhatsapp = (review, uniqueId) => {
    let number = review.mobile_number || review.mobile;

    if (!number || number === "-") {
      alert("Customer Mobile Number Not Available.");
      return;
    }

    number = number.toString().replace(/\D/g, "");
    if (number.length === 10) {
      number = `91${number}`;
    }

    const customerName = review.name && review.name !== "-" ? review.name : "Customer";
    
    // WhatsApp par bhejne wala message
    const message = `Hello ${customerName},\n\nThank you for choosing Eatpur! Please share your feedback with us on WhatsApp:\nhttps://eatpur.in/feedback\n\nRegards,\nEatpur Team`;

    // Open the customer's WhatsApp chat with the feedback message pre-filled.
    const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    
    // Naye tab me WhatsApp open karein
    window.open(whatsappUrl, '_blank');

    // Button ko "Sent" state me badalne ke liye ID save karein
    setSentWhatsApp((prev) => new Set(prev).add(uniqueId));
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Mobile Number", accessor: "mobileNumber" },
    { header: "Email", accessor: "email" },
    { header: "Stars", accessor: "stars" },
    { header: "Response Description", accessor: "responseDescription" },
    { header: "Actions", accessor: "actions" },
  ];

  const rows = reviews.map((review, index) => {
    const uniqueId = review.id || index; // Use review ID, fallback to index
    const isSent = sentWhatsApp.has(uniqueId);

    return {
      ...review,
      name: review.name || "-",
      mobileNumber: review.mobile_number || review.mobile || "-",
      email: review.email || "-",
      stars: review.stars ?? review.rating ?? "-",
      responseDescription: review.response_description || "-",
      actions: (
        <button
          onClick={() => handlePushToWhatsapp(review, uniqueId)}
          disabled={isSent}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm ${
            isSent
              ? "bg-gray-100 text-gray-500 cursor-default"
              : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white active:scale-95 cursor-pointer"
          }`}
        >
          {isSent ? (
            <>
              <FaCheck className="text-gray-500" /> Sent
            </>
          ) : (
            <>
              <FaWhatsapp className="text-lg" /> Push To Whatsapp
            </>
          )}
        </button>
      ),
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