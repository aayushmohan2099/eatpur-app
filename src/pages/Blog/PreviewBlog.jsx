import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogById, reactToBlog, commentOnBlog } from "../../api/blogs";
import { motion, AnimatePresence } from "framer-motion";

export default function PreviewBlog() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  // Auth Check & Modal State
  const isAuthenticated = !!localStorage.getItem("access");
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await getBlogById(id);
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  useEffect(() => {
    if (!blog) return;
    setLikes(blog.likes_count || 0);
    setDislikes(blog.dislikes_count || 0);
    setComments(blog.comments || []);
  }, [blog]);

  const title = id ? blog?.title : state?.title;
  const coverImage = id ? blog?.cover_image : state?.coverImage;
  const content = id ? null : state?.content;
  const blocks = id ? blog?.blocks : null;
  const authorName = id ? blog?.display_author : state?.author || "Draft Mode";

  const handleReaction = async (type) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    try {
      await reactToBlog(id, type);
      // For a truly robust frontend, you'd fetch the exact new counts from the API response
      // But a simple optimistic update works for now:
      if (type === "like") setLikes((prev) => prev + 1);
      else setDislikes((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (!commentText.trim()) return alert("Comment cannot be empty");

    try {
      // Name and email removed — backend handles identity via access_token
      const res = await commentOnBlog(id, {
        content: commentText,
      });
      setComments((prev) => [res.data, ...prev]);
      setCommentText("");
    } catch (err) {
      console.error(err.response?.data);
      alert("Failed to post comment. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen top-5 pt-24 pb-32 px-6 relative z-10 bg-eatpur-white-warm">
      <div className="max-w-4xl mx-auto vintage-card p-8 md:p-12 rounded-2xl bg-white border border-black/5 shadow-sm">
        {!id && (
          <button
            onClick={() => navigate("/write-blog")}
            className="btn-ghost mb-8 text-sm px-4 py-2 border border-black/10 hover:border-black/30 bg-transparent"
          >
            ← Back to Editor
          </button>
        )}

        {loading && (
          <div className="text-center text-eatpur-text font-serif italic py-10 animate-pulse">
            Gathering manuscript...
          </div>
        )}

        {coverImage && (
          <div className="w-full h-[40vh] md:h-[50vh] rounded-xl overflow-hidden mb-10 relative border border-black/5">
            <img
              src={coverImage}
              className="w-full h-full object-cover mix-blend-multiply"
              alt="Cover"
            />
          </div>
        )}

        {title && (
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-display text-eatpur-dark mb-4 leading-tight">
              {title}
            </h1>
            <div className="text-eatpur-green-dark uppercase tracking-widest text-sm font-semibold">
              By {authorName}
            </div>
          </div>
        )}

        {!id && content && (
          <div
            className="prose prose-lg max-w-none text-eatpur-text font-serif"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {id && blocks && (
          <div className="space-y-8 text-eatpur-text prose prose-lg max-w-none font-serif leading-relaxed">
            {blocks
              .sort((a, b) => a.order - b.order)
              .map((block, idx) => {
                if (block.type === "text") {
                  try {
                    const parsed = JSON.parse(block.content);
                    return (
                      <div
                        key={idx}
                        dangerouslySetInnerHTML={{
                          __html: renderTipTapJSON(parsed),
                        }}
                      />
                    );
                  } catch {
                    return null;
                  }
                }
                if (block.type === "image") {
                  return (
                    <img
                      key={idx}
                      src={block.image}
                      className="rounded-xl w-full shadow-sm border border-black/5 my-8"
                      alt="Blog feature"
                    />
                  );
                }
                return null;
              })}
          </div>
        )}

        {/* Reactions & Comments (Only shown if it's a published blog, i.e., has an ID) */}
        {id && (
          <div className="mt-16 pt-12 border-t border-black/10">
            <div className="flex flex-wrap gap-4 items-center mb-8">
              <button
                onClick={() => handleReaction("like")}
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-eatpur-green-dark/30 hover:bg-eatpur-green-light/20 text-eatpur-green-dark transition-colors font-medium bg-white"
              >
                👍 {likes}
              </button>
              <button
                onClick={() => handleReaction("dislike")}
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-red-500/30 hover:bg-red-50 text-red-500 transition-colors font-medium bg-white"
              >
                👎 {dislikes}
              </button>
            </div>

            <div className="bg-eatpur-white-warm p-8 rounded-2xl border border-black/5 mb-10 shadow-inner">
              <h3 className="text-xl font-display text-eatpur-dark mb-6 tracking-wide">
                Leave a Comment
              </h3>

              <div className="flex flex-col items-end gap-4">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write your thoughts..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors resize-none h-24 shadow-sm placeholder:text-eatpur-text-light font-sans"
                  onClick={() => !isAuthenticated && setShowAuthModal(true)}
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className="btn-primary py-3 px-8 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>

            <h3 className="text-2xl font-display text-eatpur-dark mb-8 tracking-wide">
              Discussion ({comments.length})
            </h3>
            {comments.length === 0 && (
              <p className="text-eatpur-text font-serif italic text-sm">
                No thoughts penned down yet.
              </p>
            )}
            <div className="space-y-6">
              {comments.map((c, i) => (
                <div
                  key={c.id || i}
                  className="p-6 rounded-xl bg-white border border-black/5 shadow-sm"
                >
                  <div className="flex items-baseline gap-4 mb-3">
                    <h4 className="text-eatpur-dark font-display font-medium text-lg">
                      {c.display_name || "Community Member"}
                    </h4>
                    <span className="text-xs text-eatpur-text-light font-sans tracking-wide uppercase">
                      {new Date(c.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-eatpur-text leading-relaxed font-serif text-[15px]">
                    {c.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AUTH MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl p-8 md:p-10 max-w-md w-full shadow-2xl relative border border-eatpur-green-dark/10"
            >
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-eatpur-green-light/20 rounded-full flex items-center justify-center mx-auto mb-6 text-eatpur-green-dark">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    ></path>
                  </svg>
                </div>

                <h3 className="text-2xl font-display text-eatpur-dark mb-3">
                  Join the Conversation
                </h3>

                <p className="text-eatpur-text mb-8 leading-relaxed">
                  We'd love to hear your thoughts! Please sign in or create an
                  account to like, comment, and connect with other writers in
                  the EatPur community.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => navigate("/signup")}
                    className="w-full bg-eatpur-green-dark text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all shadow-sm"
                  >
                    Create an Account
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-white text-eatpur-dark border border-black/10 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function renderTipTapJSON(node) {
  if (!node) return "";
  if (node.type === "doc") return node.content.map(renderTipTapJSON).join("");
  if (node.type === "paragraph") {
    const align = node.attrs?.textAlign || "left";
    const content =
      node.content?.map((child) => renderTipTapJSON(child)).join("") || "<br/>";
    return `<p style="text-align:${align}; margin-bottom: 1.2rem; color: #4A4A4A; line-height: 1.6;">${content}</p>`;
  }
  if (node.type === "heading") {
    const level = node.attrs?.level || 1;
    const align = node.attrs?.textAlign || "left";
    const content =
      node.content?.map((child) => renderTipTapJSON(child)).join("") || "";
    return `<h${level} style="text-align:${align}; font-family: 'Playfair Display', serif; font-weight: 600; color: #2E2E2E; margin-top: 2.5rem; margin-bottom: 1rem;">${content}</h${level}>`;
  }
  if (node.type === "text") {
    let text = node.text || "";
    if (node.marks) {
      node.marks.forEach((mark) => {
        if (mark.type === "bold")
          text = `<strong style="font-weight: 600; color: #2E2E2E;">${text}</strong>`;
        if (mark.type === "italic") text = `<em>${text}</em>`;
        if (mark.type === "textStyle" && mark.attrs?.color) {
          text = `<span style="color:${mark.attrs.color}">${text}</span>`;
        }
      });
    }
    return text;
  }
  return "";
}
