import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogById, reactToBlog, commentOnBlog } from "../api/blogs";

export default function PreviewBlog() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

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

  const handleReaction = async (type) => {
    try {
      await reactToBlog(id, type);
      if (type === "like") setLikes((prev) => prev + 1);
      else setDislikes((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async () => {
    if (!name.trim()) return alert("Name is required");
    if (!commentText.trim()) return alert("Comment cannot be empty");
    try {
      const res = await commentOnBlog(id, {
        name,
        email,
        content: commentText,
      });
      setComments((prev) => [res.data, ...prev]);
      setCommentText("");
    } catch (err) {
      console.error(err.response?.data);
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
          <div className="text-center text-eatpur-text font-serif italic">
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

        <h1 className="text-4xl md:text-5xl font-display text-eatpur-dark mb-12 leading-tight">
          {title}
        </h1>

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

        {/* Reactions & Comments */}
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
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name *"
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-black/10 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-sm placeholder:text-eatpur-text-light font-sans"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optional)"
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-black/10 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-sm placeholder:text-eatpur-text-light font-sans"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your thoughts..."
                className="flex-1 w-full px-4 py-3 rounded-xl bg-white border border-black/10 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors resize-none h-24 shadow-sm placeholder:text-eatpur-text-light font-sans"
              />
              <button
                onClick={handleComment}
                disabled={!name.trim() || !commentText.trim()}
                className="btn-primary py-3 px-8 self-end md:self-stretch disabled:opacity-50 disabled:cursor-not-allowed hidden md:block" // Hidden on mobile, added below
              >
                Post
              </button>
            </div>
            <button
              onClick={handleComment}
              disabled={!name.trim() || !commentText.trim()}
              className="btn-primary py-3 px-8 w-full mt-4 md:hidden disabled:opacity-50 disabled:cursor-not-allowed" // Mobile specific
            >
              Post
            </button>
          </div>

          <h3 className="text-2xl font-display text-eatpur-dark mb-8 tracking-wide">
            Discussion ({comments.length})
          </h3>
          {comments.length === 0 && (
            <p className="text-eatpur-text font-serif italic text-sm">No thoughts penned down yet.</p>
          )}
          <div className="space-y-6">
            {comments.map((c, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-white border border-black/5 shadow-sm"
              >
                <div className="flex items-baseline gap-4 mb-2">
                  <h4 className="text-eatpur-dark font-display font-medium text-lg">
                    {c.name || "Anonymous Traveler"}
                  </h4>
                  <span className="text-xs text-eatpur-text-light font-sans tracking-wide uppercase">
                    {new Date(c.created_at).toLocaleString()}
                  </span>
                </div>
                {c.email && (
                  <p className="text-xs text-eatpur-text/60 mb-3 font-sans">{c.email}</p>
                )}
                <p className="text-eatpur-text leading-relaxed font-serif text-[15px]">{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
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
        if (mark.type === "bold") text = `<strong style="font-weight: 600; color: #2E2E2E;">${text}</strong>`;
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
