// src/pages/Admin/Admin/Workspaces/BlogsList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBlogs, reviewBlog, toggleBlogPublish } from "../../../../api/blogs";
import EatpurTable from "../UniComps/Table";

export default function BlogsList({ status }) {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State for Rejection
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [blogToReject, setBlogToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State for Publishing
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [blogToPublish, setBlogToPublish] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false); // Indicates actual action state

  // Define table structures matching your API layout
  const blogColumns = [
    { header: "ID", accessor: "displayId" },
    { header: "Title", accessor: "title" },
    { header: "Author", accessor: "authorName" },
    { header: "Status", accessor: "statusText" },
    { header: "Date Created", accessor: "formattedDate" },
    { header: "Actions", accessor: "customActions" },
  ];

  // Fetch blogs from API on mount
  const fetchBlogsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Dynamically build params based on the injected tab status
      const params = status ? { approval_status: status } : {};
      const response = await getBlogs(params);

      // Handle array data regardless of if your backend passes a direct list
      // or wraps it inside a paginated object structure (e.g., response.data.results)
      const rawBlogs = Array.isArray(response.data)
        ? response.data
        : response.data?.results || response.data?.data || [];

      // Clean up and flatten data strings so EatpurTable consumes them flawlessly
      // Inside your fetchBlogsData block in BlogsList.jsx, update your map() processing logic:
      const processedBlogs = rawBlogs.map((blog) => {
        // Map out visual indicator status tags based on backend responses
        let statusBadge = "🟡 Draft";
        if (blog.approval_status === "PENDING")
          statusBadge = "🟠 Pending Review";
        if (blog.approval_status === "APPROVED") statusBadge = "🟢 Approved";
        if (blog.approval_status === "REJECTED") statusBadge = "🔴 Rejected";

        return {
          ...blog,
          displayId: blog.id ? `#BLG-${blog.id}` : "—",
          title: blog.title || "Untitled Blog",
          authorName: blog.display_author || "Eatpur Admin",
          statusText: statusBadge,
          formattedDate: blog.created_at
            ? new Date(blog.created_at).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—",
          customActions: (
            <div className="flex flex-col gap-2 py-1 items-end pr-4">
              <button
                className="magic-action-btn view-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/blogs/${blog.id}`);
                }}
              >
                View
              </button>

              {blog.approval_status === "PENDING" && (
                <>
                  <button
                    className="magic-action-btn approve-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(blog.id);
                    }}
                  >
                    Approve
                  </button>
                  <button
                    className="magic-action-btn reject-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBlogToReject(blog.id);
                      setRejectModalOpen(true);
                    }}
                  >
                    Reject
                  </button>
                </>
              )}

              {blog.approval_status === "APPROVED" && (
                <button
                  className={`magic-action-btn ${blog.is_published ? "unpublish-btn" : "publish-btn"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setBlogToPublish({
                      id: blog.id,
                      is_published: blog.is_published,
                    });
                    setPublishModalOpen(true);
                  }}
                >
                  {blog.is_published ? "Unpublish" : "Publish"}
                </button>
              )}
            </div>
          ),
        };
      });

      setBlogs(processedBlogs);
      setCurrentPage(1); // Reset pagination on data load
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(
        "Failed to load your articles. Please verify your network connections or try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogsData();
  }, [status]);

  // Action Handlers
  const handleApprove = async (blogId) => {
    try {
      await reviewBlog({ blog: blogId, status: "APPROVED" });
      fetchBlogsData(); // Refresh table
    } catch (err) {
      console.error("Error approving blog:", err);
      alert("Failed to approve the blog.");
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) return;
    setIsSubmitting(true);
    try {
      await reviewBlog({
        blog: blogToReject,
        status: "REJECTED",
        rejection_reason: rejectionReason,
      });
      setRejectModalOpen(false);
      setBlogToReject(null);
      setRejectionReason("");
      fetchBlogsData(); // Refresh table
    } catch (err) {
      console.error("Error rejecting blog:", err);
      alert("Failed to reject the blog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishSubmit = async () => {
    setIsSubmitting(true);
    try {
      await toggleBlogPublish(blogToPublish.id);
      setPublishModalOpen(false);
      setBlogToPublish(null);
      fetchBlogsData(); // Refresh table to reflect updated `is_published` state
    } catch (err) {
      console.error("Error toggling publish state:", err);
      alert("Failed to change publish status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Action button clicks from your Eatpur custom animation button
  const handleViewBlog = (blogItem) => {
    // Navigates directly to your Preview routing pattern setup in AppRoutes
    navigate(`/blogs/${blogItem.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-medium text-[--color-eatpur-dark]"
            style={{ fontFamily: "var(--font-display, serif)" }}
          >
            Articles & Stories
          </h2>
          <p className="text-sm text-[--color-eatpur-text-light] mt-1">
            Manage, organize, and inspect all blog content published to Eatpur.
          </p>
        </div>
      </div>

      {/* ERROR FEEDBACK STATE */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-100 bg-rose-50 text-rose-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
          <button
            onClick={fetchBlogsData}
            className="text-xs font-semibold underline uppercase tracking-wider hover:text-rose-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* LOADING CONTROLLER LAYOUT */}
      {loading ? (
        <div className="w-full rounded-xl border border-[--color-eatpur-yellow-light] bg-white overflow-hidden shadow-sm">
          <div className="h-12 bg-[--color-eatpur-white-warm] border-b border-[--color-eatpur-yellow-light] flex items-center px-6">
            <div className="h-4 w-1/4 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((skeletonIdx) => (
              <div
                key={skeletonIdx}
                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-none"
              >
                <div className="h-4 w-2/5 bg-slate-100 rounded animate-pulse"></div>
                <div className="h-4 w-1/6 bg-slate-100 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-slate-200 rounded-md animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* RENDER SYSTEM WITH PAGINATION AND CUSTOM ACTIONS CSS */
        <div className="w-full">
          <style>{`
            .magic-action-btn {
              font-family: var(--font-sans, inherit);
              display: inline-block;
              width: 8em;
              height: 2.2em;
              line-height: 2.1em;
              overflow: hidden;
              cursor: pointer;
              font-size: 13px;
              font-weight: 500;
              z-index: 1;
              color: var(--color);
              border: 1.5px solid var(--color);
              border-radius: 6px;
              position: relative;
              background: transparent;
              transition: 0.3s all;
              text-align: center;
            }
            .magic-action-btn::before {
              position: absolute;
              content: "";
              background: var(--color);
              width: 150px;
              height: 200px;
              z-index: -1;
              border-radius: 50%;
              top: 100%;
              left: 100%;
              transition: 0.3s all;
            }
            .magic-action-btn:hover {
              color: white;
            }
            .magic-action-btn:hover::before {
              top: -30px;
              left: -30px;
            }
            /* Colors match exactly the original View Button styling */
            .view-btn {
              --color: var(--color-eatpur-green-dark, #4C7A4F);
            }
            .approve-btn {
              --color: #10b981; 
            }
            .reject-btn {
              --color: #ef4444; 
            }
            .publish-btn {
              --color: #3b82f6; /* Blue for publish */
            }
            .unpublish-btn {
              --color: #f59e0b; /* Amber/Orange for unpublish */
            }
          `}</style>

          <EatpurTable
            columns={blogColumns}
            data={blogs.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage,
            )}
            showActions={
              false
            } /* Disabled native actions to use our custom column */
          />

          {/* Pagination UI */}
          {blogs.length > 0 && (
            <div className="flex items-center justify-between px-5 py-4 bg-white border border-[--color-eatpur-yellow-light] rounded-xl mt-4 shadow-sm">
              <div className="flex justify-between flex-1 sm:hidden">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(Math.ceil(blogs.length / itemsPerPage), p + 1),
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(blogs.length / itemsPerPage)
                  }
                  className="px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <p className="text-sm text-[--color-eatpur-text]">
                  Showing{" "}
                  <span className="font-medium text-[--color-eatpur-green-dark]">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-[--color-eatpur-green-dark]">
                    {Math.min(currentPage * itemsPerPage, blogs.length)}
                  </span>{" "}
                  of <span className="font-medium">{blogs.length}</span> results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm font-medium border border-[--color-eatpur-yellow-light] text-[--color-eatpur-dark] rounded hover:bg-slate-50 disabled:opacity-50 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 text-sm font-medium bg-[--color-eatpur-white-warm] border border-[--color-eatpur-yellow-light] text-[--color-eatpur-green-dark] rounded shadow-inner">
                    Page {currentPage} of{" "}
                    {Math.ceil(blogs.length / itemsPerPage) || 1}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(Math.ceil(blogs.length / itemsPerPage), p + 1),
                      )
                    }
                    disabled={
                      currentPage === Math.ceil(blogs.length / itemsPerPage)
                    }
                    className="px-3 py-1.5 text-sm font-medium border border-[--color-eatpur-yellow-light] text-[--color-eatpur-dark] rounded hover:bg-slate-50 disabled:opacity-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-[--color-eatpur-yellow-light]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "var(--font-display, serif)" }}
            >
              Reject Blog
            </h3>
            <p
              className="text-sm text-gray-600 mb-4"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Please provide a reason for rejecting this blog article. This will
              be recorded.
            </p>

            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-[--color-eatpur-green-dark] focus:ring-1 focus:ring-[--color-eatpur-green-dark] transition-all min-h-[100px] resize-y mb-5"
              placeholder="E.g., Inappropriate content, poor formatting..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              style={{ fontFamily: "var(--font-sans)" }}
            ></textarea>

            <div
              className="flex justify-end gap-3"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <button
                onClick={() => {
                  setRejectModalOpen(false);
                  setBlogToReject(null);
                  setRejectionReason("");
                }}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectionReason.trim() || isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PUBLISH CONFIRMATION MODAL */}
      {publishModalOpen && blogToPublish && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-[--color-eatpur-yellow-light]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "var(--font-display, serif)" }}
            >
              {blogToPublish.is_published ? "Unpublish Blog?" : "Publish Blog?"}
            </h3>
            <p
              className="text-sm text-gray-600 mb-6"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {blogToPublish.is_published
                ? "Are you sure you want to unpublish this blog? It will no longer be visible to users on the homepage or articles page."
                : "Are you sure you want to publish this blog to the homepage? It will instantly become visible to all users."}
            </p>

            <div
              className="flex justify-end gap-3"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <button
                onClick={() => {
                  setPublishModalOpen(false);
                  setBlogToPublish(null);
                }}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishSubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ${
                  blogToPublish.is_published
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isSubmitting
                  ? blogToPublish.is_published
                    ? "Unpublishing..."
                    : "Publishing..."
                  : blogToPublish.is_published
                    ? "Confirm Unpublish"
                    : "Confirm Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
