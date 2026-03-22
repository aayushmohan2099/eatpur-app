// src/pages/PreviewBlog.jsx
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogById, reactToBlog, commentOnBlog } from "../api/blogs";
import { useNavigate } from "react-router-dom";

export default function PreviewBlog() {
  const { state } = useLocation();
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  // ✅ FETCH MODE (when ID exists)
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

  // ✅ Decide source
  const title = id ? blog?.title : state?.title;
  const coverImage = id ? blog?.cover_image : state?.coverImage;
  const content = id ? null : state?.content;
  const blocks = id ? blog?.blocks : null;

  const handleReaction = async (type) => {
    try {
      await reactToBlog(id, type);

      if (type === "like") {
        setLikes((prev) => prev + 1);
      } else {
        setDislikes((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    if (!commentText.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const res = await commentOnBlog(id, {
        name,
        email,
        content: commentText, // ✅ CORRECT FIELD
      });

      setComments((prev) => [res.data, ...prev]);
      setCommentText("");
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-[#040704]/10 px-6 py-20">
      <div className="max-w-3xl mx-auto">
        {!id && (
          <button
            onClick={() => navigate("/write-blog")}
            className="mb-6 px-4 py-2 rounded-lg border border-eatpur-gold text-eatpur-gold hover:bg-eatpur-gold hover:text-black transition"
          >
            ← Back to Editor
          </button>
        )}
        {loading && (
          <div className="text-center text-eatpur-text-light">
            Loading blog...
          </div>
        )}

        {/* COVER */}
        {coverImage && (
          <img
            src={coverImage}
            className="rounded-2xl mb-6 w-full object-cover"
          />
        )}

        {/* TITLE */}
        <h1 className="text-4xl text-eatpur-gold mb-6">{title}</h1>

        {/* ========================= */}
        {/* ✅ PREVIEW MODE (HTML) */}
        {/* ========================= */}
        {!id && content && (
          <div
            className="prose max-w-none text-eatpur-text-light"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {/* ========================= */}
        {/* ✅ FETCH MODE (BLOCKS) */}
        {/* ========================= */}
        {id && blocks && (
          <div className="space-y-6">
            {blocks
              .sort((a, b) => a.order - b.order)
              .map((block, idx) => {
                // TEXT BLOCK
                if (block.type === "text") {
                  try {
                    const parsed = JSON.parse(block.content);

                    return (
                      <div
                        key={idx}
                        className="prose max-w-none text-eatpur-text-light"
                        dangerouslySetInnerHTML={{
                          __html: renderTipTapJSON(parsed),
                        }}
                      />
                    );
                  } catch {
                    return null;
                  }
                }

                // IMAGE BLOCK
                if (block.type === "image") {
                  return (
                    <img
                      key={idx}
                      src={block.image}
                      className="rounded-xl w-full"
                    />
                  );
                }

                return null;
              })}
          </div>
        )}

        {/* ================= REACTIONS + COMMENT INPUT ================= */}
        <div className="mt-12 border-t border-[#2A3F2A] pt-6">
          {/* TOP ROW */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* COMMENT INPUT */}
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 rounded-full bg-[#0B140B] border border-[#2A3F2A] text-white"
            />

            {/* POST */}
            <button
              onClick={handleComment}
              disabled={!name.trim()}
              className="px-5 py-2 rounded-full bg-eatpur-gold text-black hover:scale-105 transition"
            >
              Post
            </button>

            {/* LIKE */}
            <button
              onClick={() => handleReaction("like")}
              className="px-4 py-2 rounded-full border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition"
            >
              👍 {likes}
            </button>

            {/* DISLIKE */}
            <button
              onClick={() => handleReaction("dislike")}
              className="px-4 py-2 rounded-full border border-red-400 text-red-400 hover:bg-red-400 hover:text-black transition"
            >
              👎 {dislikes}
            </button>
          </div>

          {/* NAME + EMAIL */}
          <div className="flex gap-3 mt-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name (required)"
              className="flex-1 px-4 py-2 rounded-lg bg-[#0B140B] border border-[#2A3F2A] text-white"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
              className="flex-1 px-4 py-2 rounded-lg bg-[#0B140B] border border-[#2A3F2A] text-white"
            />
          </div>
        </div>

        {/* ================= COMMENTS LIST ================= */}
        <div className="mt-10">
          <h3 className="text-eatpur-gold text-xl mb-4">Comments</h3>

          {comments.length === 0 && (
            <p className="text-eatpur-text-light">No comments yet.</p>
          )}

          <div className="space-y-4">
            {comments.map((c, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#0B140B]/70 border border-[#2A3F2A]"
              >
                {/* NAME */}
                <p className="text-eatpur-gold font-semibold">
                  {c.name || "Anonymous"}
                </p>

                {/* EMAIL */}
                {c.email && <p className="text-xs text-gray-500">{c.email}</p>}

                {/* CONTENT */}
                <p className="text-eatpur-text-light mt-2 text-sm">
                  {c.content}
                </p>

                {/* DATE */}
                <span className="text-xs text-gray-500">
                  {new Date(c.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ✅ Convert TipTap JSON → HTML */
function renderTipTapJSON(node) {
  if (!node) return "";

  if (node.type === "doc") {
    return node.content.map(renderTipTapJSON).join("");
  }

  if (node.type === "paragraph") {
    const align = node.attrs?.textAlign || "left";

    const content =
      node.content?.map((child) => renderTipTapJSON(child)).join("") || "";

    return `<p style="text-align:${align}">${content}</p>`;
  }

  if (node.type === "heading") {
    const level = node.attrs?.level || 1;
    const align = node.attrs?.textAlign || "left";

    const content =
      node.content?.map((child) => renderTipTapJSON(child)).join("") || "";

    return `<h${level} style="text-align:${align}">${content}</h${level}>`;
  }

  if (node.type === "text") {
    let text = node.text || "";

    if (node.marks) {
      node.marks.forEach((mark) => {
        if (mark.type === "bold") text = `<strong>${text}</strong>`;
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
