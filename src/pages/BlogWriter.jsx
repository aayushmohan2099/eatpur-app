import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../api/blogs";
import TextAlign from "@tiptap/extension-text-align";
import { useLocation } from "react-router-dom";

export default function BlogWriter() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [coverImage, setCoverImage] = useState(null);

  const { state } = useLocation();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "<p>Start writing your story...</p>",
  });

  useEffect(() => {
    let draft = state;
    if (!draft) {
      const saved = localStorage.getItem("blog_draft");
      if (saved) {
        draft = JSON.parse(saved);
      }
    }

    if (!draft) return;

    if (draft.title) setTitle(draft.title);
    if (draft.images) setImages(draft.images);
    if (draft.coverImage) setCoverImage(draft.coverImage);
  }, [state]);

  useEffect(() => {
    let draft = state;

    if (!draft) {
      const saved = localStorage.getItem("blog_draft");
      if (saved) {
        draft = JSON.parse(saved);
      }
    }

    if (!editor || !draft?.editorJSON) return;

    editor.commands.setContent(draft.editorJSON);
  }, [editor]);

  // ✅ Upload images (max 10, only images)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const valid = files.filter((f) => f.type.startsWith("image/"));

    if (images.length + valid.length > 10) {
      alert("Max 10 images allowed");
      return;
    }

    const newImages = valid.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  // ✅ Insert image into editor
  const insertImage = (img) => {
    editor.chain().focus().setImage({ src: img.url }).run();
  };

  // ✅ Preview
  const handlePreview = () => {
    const draft = {
      title,
      coverImage,
      images,
      editorJSON: editor.getJSON(),
    };

    // ✅ Save properly
    localStorage.setItem("blog_draft", JSON.stringify(draft));

    // ✅ Navigate ONCE
    navigate("/preview-blog", {
      state: {
        ...draft,
        content: editor.getHTML(),
      },
    });
  };

  const removeImage = (imgToRemove) => {
    // 1. Remove from state
    setImages((prev) => prev.filter((img) => img.url !== imgToRemove.url));

    // 2. Remove from editor (ALL occurrences)
    const json = editor.getJSON();

    const filteredContent = json.content
      .map((node) => {
        if (node.type === "image" && node.attrs.src === imgToRemove.url) {
          return null;
        }
        return node;
      })
      .filter(Boolean);

    editor.commands.setContent({
      ...json,
      content: filteredContent,
    });

    // 3. Remove cover if it's the same
    if (coverImage === imgToRemove.url) {
      setCoverImage(null);
    }
  };

  const buildBlocks = (json, images) => {
    if (!json?.content) return [];
    const blocks = [];
    let order = 0;

    json.content.forEach((node) => {
      // TEXT
      if (node.type === "paragraph" || node.type === "heading") {
        if (!node.content) return;

        blocks.push({
          type: "text",
          content: JSON.stringify(node),
          order: order++,
        });
      }

      // IMAGE
      if (node.type === "image") {
        const src = node.attrs.src;

        const matched = images.find((img) => img.url === src);

        if (matched && matched.file instanceof File) {
          blocks.push({
            type: "image",
            file: matched.file,
            order: order++,
          });
        }
      }
    });

    return blocks;
  };

  // ✅ Publish Modal trigger
  const handlePublish = async () => {
    try {
      const json = editor.getJSON();

      const author = prompt("Enter Author Name");
      const email = prompt("Enter Email (optional)");

      if (!title || !author) {
        alert("Title and Author required");
        return;
      }

      const blocks = buildBlocks(json, images);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("author", author);
      formData.append("is_active", "1");
      formData.append("is_published", "1");

      // COVER IMAGE
      if (coverImage) {
        const coverFile = images.find((i) => i.url === coverImage)?.file;
        if (coverFile) {
          formData.append("cover_image", coverFile);
        }
      }
      const slugify = (text) =>
        text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      formData.append("slug", slugify(title) + "-" + Date.now());
      // BLOCKS
      blocks.forEach((block, i) => {
        formData.append(`blocks[${i}][type]`, block.type);
        formData.append(`blocks[${i}][order]`, block.order);

        if (block.type === "text") {
          formData.append(`blocks[${i}][content]`, block.content);
        }

        if (block.type === "image") {
          formData.append(`blocks[${i}][image]`, block.file);
        }
      });

      await createBlog(formData);

      alert("Blog published successfully 🚀");
      localStorage.removeItem("blog_draft");
    } catch (err) {
      console.error("FULL ERROR:", err);
      console.log("RESPONSE:", err.response?.data);

      alert(JSON.stringify(err.response?.data, null, 2));
    }
  };

  if (!editor) return null;

  return (
    <div className="min-h-screen bg-[#040704]/10 px-6 py-20">
      <div className="max-w-5xl mx-auto">
        {/* TITLE */}
        <input
          placeholder="Blog Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl bg-transparent border-b border-[#2A3F2A] pb-3 text-eatpur-text-light focus:outline-none focus:border-eatpur-gold"
        />

        {/* TOOLBAR */}
        <div className="flex flex-wrap gap-2 my-4">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`btn ${
              editor.isActive({ textAlign: "center" })
                ? "bg-eatpur-gold text-black"
                : ""
            }`}
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`btn ${
              editor.isActive({ textAlign: "center" })
                ? "bg-eatpur-gold text-black"
                : ""
            }`}
          >
            Italic
          </button>
          <button
            onClick={() => editor.chain().focus().setColor("#FFD54A").run()}
            className={`btn ${
              editor.isActive({ textAlign: "center" })
                ? "bg-eatpur-gold text-black"
                : ""
            }`}
          >
            Gold
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`btn ${
              editor.isActive({ textAlign: "center" })
                ? "bg-eatpur-gold text-black"
                : ""
            }`}
          >
            Left
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`btn ${
              editor.isActive({ textAlign: "center" })
                ? "bg-eatpur-gold text-black"
                : ""
            }`}
          >
            Center
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`btn ${
              editor.isActive({ textAlign: "center" })
                ? "bg-eatpur-gold text-black"
                : ""
            }`}
          >
            Right
          </button>
        </div>

        {/* EDITOR */}
        <div className="relative editor-glass">
          <div className="absolute inset-0 bg-eatpur-gold/5 blur-2xl opacity-30 rounded-2xl"></div>
          <EditorContent editor={editor} />
        </div>

        {/* COVER IMAGE UPLOAD */}
        <div className="mt-10">
          <h3 className="text-eatpur-gold mb-3">Cover Image</h3>

          <label className="group cursor-pointer flex items-center justify-center border border-dashed border-[#2A3F2A] rounded-2xl h-40 bg-[#0B140B]/60 backdrop-blur-md hover:scale-[1.02] transition">
            {coverImage ? (
              <div className="relative w-full h-full">
                <img
                  src={coverImage}
                  className="h-full w-full object-cover rounded-2xl"
                />

                {/* REMOVE COVER */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setCoverImage(null);
                  }}
                  className="absolute top-1 right-1 bg-red-500/90 backdrop-blur text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:scale-110 hover:bg-red-600 transition"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="text-center text-eatpur-text-light">
                <div className="text-3xl mb-2">+</div>
                <p>Select Cover Image</p>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                const url = URL.createObjectURL(file);

                setCoverImage(url);

                setImages((prev) => [...prev, { file, url }]);
              }}
            />
          </label>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="mt-8 flex justify-center">
          <label className="group cursor-pointer relative px-6 py-4 rounded-2xl border border-[#2A3F2A] bg-[#0B140B]/70 backdrop-blur-md text-eatpur-gold flex items-center gap-3 hover:scale-105 transition shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            {/* Glow */}
            <span className="absolute inset-0 bg-eatpur-gold/10 opacity-0 group-hover:opacity-100 blur-xl transition rounded-2xl"></span>

            {/* + Icon */}
            <span className="text-2xl font-bold">+</span>

            {/* Text */}
            <span className="relative z-10 font-medium">Add Images</span>

            {/* Hidden input */}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* IMAGE POOL */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {images.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img.url}
                className="rounded-xl h-32 w-full object-cover"
              />

              {/* INSERT */}
              <button
                onClick={() => insertImage(img)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 text-white"
              >
                Insert
              </button>

              {/* DELETE */}
              <button
                onClick={() => removeImage(img)}
                className="absolute top-1 right-1 bg-red-500/90 backdrop-blur text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:scale-110 hover:bg-red-600 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 mt-10">
          <button onClick={handlePreview} className="btn">
            Preview
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handlePublish}
            className="px-8 py-3 rounded-full border border-eatpur-gold text-eatpur-gold hover:bg-eatpur-gold hover:text-black transition"
          >
            Publish
          </motion.button>
        </div>
      </div>
      <style>
        {`
        /* Glass Editor Style */
        .editor-glass {
          position: relative;
          border-radius: 24px;
          padding: 20px;

          /* Glass effect */
          background: rgba(15, 25, 15, 0.6);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);

          /* Border */
          border: 1px solid rgba(255, 215, 100, 0.15);

          /* Shadow (BLACK DEPTH) */
          box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);

          /* Smooth */
          transition: all 0.3s ease;
        }

        /* Hover glow */
        .editor-glass:hover {
          box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.8),
            0 0 25px rgba(255, 201, 51, 0.15);
        }

        /* Editor text styling */
        .editor-glass .ProseMirror {
          outline: none;
          color: #EDE6D6;
          min-height: 300px;
        }

        /* Placeholder */
        .editor-glass .ProseMirror p.is-editor-empty:first-child::before {
          content: "Start writing your story...";
          color: #888;
          float: left;
          pointer-events: none;
        }

        .editor-glass:focus-within {
          border-color: rgba(255, 201, 51, 0.4);
          box-shadow:
            0 25px 60px rgba(0, 0, 0, 0.9),
            0 0 30px rgba(255, 201, 51, 0.2);
        }
      `}
      </style>
    </div>
  );
}
