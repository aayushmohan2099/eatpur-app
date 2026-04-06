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
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 5000;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "<p>Start writing your story...</p>",
    onUpdate: ({ editor }) => {
      setCharCount(editor.getText().length);
    },
  });

  useEffect(() => {
    let draft = state;
    if (!draft) {
      const saved = localStorage.getItem("blog_draft");
      if (saved) draft = JSON.parse(saved);
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
      if (saved) draft = JSON.parse(saved);
    }
    if (!editor || !draft?.editorJSON) return;
    editor.commands.setContent(draft.editorJSON);
  }, [editor]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const valid = files.filter((f) => f.type.startsWith("image/"));
    if (images.length + valid.length > 10)
      return alert("Max 10 images allowed");
    const newImages = valid.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const insertImage = (img) => {
    editor.chain().focus().setImage({ src: img.url }).run();
  };

  const handlePreview = () => {
    const draft = { title, coverImage, images, editorJSON: editor.getJSON() };
    localStorage.setItem("blog_draft", JSON.stringify(draft));
    navigate("/preview-blog", {
      state: { ...draft, content: editor.getHTML() },
    });
  };

  const removeImage = (imgToRemove) => {
    setImages((prev) => prev.filter((img) => img.url !== imgToRemove.url));
    const json = editor.getJSON();
    const filteredContent = json.content
      .map((node) => {
        if (node.type === "image" && node.attrs.src === imgToRemove.url)
          return null;
        return node;
      })
      .filter(Boolean);
    editor.commands.setContent({ ...json, content: filteredContent });
    if (coverImage === imgToRemove.url) setCoverImage(null);
  };

  const buildBlocks = (json, images) => {
    if (!json?.content) return [];
    const blocks = [];
    let order = 0;
    json.content.forEach((node) => {
      if (node.type === "paragraph" || node.type === "heading") {
        if (!node.content) return;
        blocks.push({
          type: "text",
          content: JSON.stringify(node),
          order: order++,
        });
      }
      if (node.type === "image") {
        const matched = images.find((img) => img.url === node.attrs.src);
        if (matched && matched.file instanceof File) {
          blocks.push({ type: "image", file: matched.file, order: order++ });
        }
      }
    });
    return blocks;
  };

  const handlePublish = async () => {
    const text = editor.getText();
    if (text.length > MAX_CHARS)
      return alert("More than 5000 characters not allowed ❌");
    try {
      const author = prompt("Enter Author Name");
      const email = prompt("Enter Email (optional)");
      if (!title || !author) return alert("Title and Author required");

      const blocks = buildBlocks(editor.getJSON(), images);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("is_active", "1");
      formData.append("is_published", "1");
      if (coverImage) {
        const coverFile = images.find((i) => i.url === coverImage)?.file;
        if (coverFile) formData.append("cover_image", coverFile);
      }
      const slugify = (text) =>
        text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      formData.append("slug", slugify(title) + "-" + Date.now());

      blocks.forEach((block, i) => {
        formData.append(`blocks[${i}][type]`, block.type);
        formData.append(`blocks[${i}][order]`, block.order);
        if (block.type === "text")
          formData.append(`blocks[${i}][content]`, block.content);
        if (block.type === "image")
          formData.append(`blocks[${i}][image]`, block.file);
      });

      await createBlog(formData);
      alert("Blog published successfully 🚀");
      localStorage.removeItem("blog_draft");
    } catch (err) {
      alert(JSON.stringify(err.response?.data || "Error", null, 2));
    }
  };

  if (!editor) return null;

  return (
    <div className="w-full min-h-screen top-5 pt-24 pb-32 px-6 relative z-10 bg-eatpur-white-warm">
      <div className="max-w-4xl mx-auto vintage-card p-8 md:p-12 rounded-2xl bg-white border border-black/5 shadow-sm">
        <input
          placeholder="Your Story Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-4xl md:text-5xl font-display bg-transparent border-b border-black/10 pb-4 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors mb-8 placeholder:text-eatpur-text-light"
        />

        <div className="flex flex-wrap gap-2 mb-8">
          {["Bold", "Italic"].map((action) => (
            <button
              key={action}
              onClick={() => editor.chain().focus()[`toggle${action}`]().run()}
              className={`px-4 py-2 rounded-lg text-sm transition-colors border ${editor.isActive(action.toLowerCase()) ? "bg-eatpur-green-dark text-white border-eatpur-green-dark" : "bg-white border-black/10 text-eatpur-dark hover:border-eatpur-green-dark hover:text-eatpur-green-dark"}`}
            >
              {action}
            </button>
          ))}
          <button
            onClick={() => editor.chain().focus().setColor("#2E2E2E").run()}
            className="px-4 py-2 rounded-lg text-sm bg-white border border-black/10 text-eatpur-dark hover:border-black/30 transition-colors"
          >
            Dark Text
          </button>
          {["Left", "Center", "Right"].map((align) => (
            <button
              key={align}
              onClick={() =>
                editor.chain().focus().setTextAlign(align.toLowerCase()).run()
              }
              className={`px-4 py-2 rounded-lg text-sm transition-colors border ${editor.isActive({ textAlign: align.toLowerCase() }) ? "bg-eatpur-green-dark text-white border-eatpur-green-dark" : "bg-white border-black/10 text-eatpur-dark hover:border-eatpur-green-dark hover:text-eatpur-green-dark"}`}
            >
              {align}
            </button>
          ))}
        </div>

        <div className="relative rounded-xl border border-black/10 bg-eatpur-white-warm p-6 min-h-[400px] focus-within:border-eatpur-green-dark/50 transition-colors shadow-inner font-serif text-lg">
          <EditorContent
            editor={editor}
            className="prose max-w-none text-eatpur-dark outline-none opacity-90"
          />
        </div>

        <div
          className={`text-right text-sm mt-2 ${charCount > MAX_CHARS ? "text-red-500 font-medium" : "text-eatpur-text-light"}`}
        >
          {charCount} / {MAX_CHARS}
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-display text-eatpur-dark mb-4">
            Cover Image
          </h3>
          <label className="cursor-pointer block w-full border border-dashed border-black/20 rounded-xl h-48 bg-eatpur-white-warm hover:bg-eatpur-green-light/10 transition-colors overflow-hidden group">
            {coverImage ? (
              <div className="relative w-full h-full">
                <img
                  src={coverImage}
                  className="w-full h-full object-cover mix-blend-multiply"
                  alt="Cover"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setCoverImage(null);
                  }}
                  className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full text-eatpur-text-light group-hover:text-eatpur-green-dark transition-colors">
                <span className="text-4xl mb-2 font-light">+</span>
                <span className="font-medium">Select Cover Image</span>
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

        <div className="mt-8">
          <label className="inline-flex cursor-pointer px-6 py-2 rounded-full border border-eatpur-green-dark/30 bg-white text-eatpur-green-dark items-center gap-2 hover:bg-eatpur-green-light/20 transition-colors font-medium shadow-sm">
            <span className="text-xl leading-none">+</span> Add Content Images
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative group rounded-xl overflow-hidden h-32 border border-black/10 shadow-sm"
              >
                <img
                  src={img.url}
                  className="w-full h-full object-cover"
                  alt="Upload"
                />
                <button
                  onClick={() => insertImage(img)}
                  className="absolute inset-0 bg-white/90 text-eatpur-green-dark opacity-0 group-hover:opacity-100 transition-opacity font-medium flex items-center justify-center"
                >
                  Insert
                </button>
                <button
                  onClick={() => removeImage(img)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col items-end gap-4 mt-12 pt-8 border-t border-black/5">
          {charCount > MAX_CHARS && (
            <div className="text-red-500 text-sm font-medium">
              Content exceeds maximum character limit.
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-end">
            <button
              onClick={handlePreview}
              className="btn-ghost w-full sm:w-auto font-medium"
            >
              Preview Post
            </button>
            <button
              onClick={handlePublish}
              disabled={charCount > MAX_CHARS}
              className={`btn-primary w-full sm:w-auto font-medium ${charCount > MAX_CHARS ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
