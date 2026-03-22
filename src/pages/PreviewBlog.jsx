// src/pages/PreviewBlog.jsx
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogById } from "../api/blogs";
import { useNavigate } from "react-router-dom";

export default function PreviewBlog() {
  const { state } = useLocation();
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  // ✅ Decide source
  const title = id ? blog?.title : state?.title;
  const coverImage = id ? blog?.cover_image : state?.coverImage;
  const content = id ? null : state?.content;
  const blocks = id ? blog?.blocks : null;

  return (
    <div className="min-h-screen bg-eatpur-dark px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/write-blog")}
          className="mb-6 px-4 py-2 rounded-lg border border-eatpur-gold text-eatpur-gold hover:bg-eatpur-gold hover:text-black transition"
        >
          ← Back to Editor
        </button>
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
