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
    if (images.length + valid.length > 10) return alert("Max 10 images allowed");
    const newImages = valid.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const insertImage = (img) => {
    editor.chain().focus().setImage({ src: img.url }).run();
  };

  const handlePreview = () => {
    const draft = { title, coverImage, images, editorJSON: editor.getJSON() };
    localStorage.setItem("blog_draft", JSON.stringify(draft));
    navigate("/preview-blog", { state: { ...draft, content: editor.getHTML() } });
  };

  const removeImage = (imgToRemove) => {
    setImages((prev) => prev.filter((img) => img.url !== imgToRemove.url));
    const json = editor.getJSON();
    const filteredContent = json.content
      .map((node) => {
        if (node.type === "image" && node.attrs.src === imgToRemove.url) return null;
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
        blocks.push({ type: "text", content: JSON.stringify(node), order: order++ });
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
    if (text.length > MAX_CHARS) return alert("More than 5000 characters not allowed ❌");
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
      const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      formData.append("slug", slugify(title) + "-" + Date.now());

      blocks.forEach((block, i) => {
        formData.append(`blocks[${i}][type]`, block.type);
        formData.append(`blocks[${i}][order]`, block.order);
        if (block.type === "text") formData.append(`blocks[${i}][content]`, block.content);
        if (block.type === "image") formData.append(`blocks[${i}][image]`, block.file);
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
    <div className="w-full min-h-screen pt-24 pb-32 px-6 relative z-10">
      <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 rounded-3xl">
        <input
          placeholder="Blog Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-4xl md:text-5xl font-display bg-transparent border-b border-eatpur-gold/20 pb-4 text-gradient-gold focus:outline-none focus:border-eatpur-gold transition-colors mb-8"
        />

        <div className="flex flex-wrap gap-2 mb-8">
          {["Bold", "Italic"].map((action) => (
            <button
              key={action}
              onClick={() => editor.chain().focus()[`toggle${action}`]().run()}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${editor.isActive(action.toLowerCase()) ? 'bg-eatpur-gold text-eatpur-dark font-bold' : 'bg-eatpur-dark/50 border border-eatpur-gold/20 text-eatpur-text hover:text-eatpur-yellow'}`}
            >
              {action}
            </button>
          ))}
          <button
            onClick={() => editor.chain().focus().setColor("#FFC933").run()}
            className="px-4 py-2 rounded-lg text-sm bg-eatpur-dark/50 border border-eatpur-gold text-eatpur-gold font-bold hover:bg-eatpur-gold hover:text-eatpur-dark transition-colors"
          >
            Gold Text
          </button>
          {["Left", "Center", "Right"].map((align) => (
            <button
              key={align}
              onClick={() => editor.chain().focus().setTextAlign(align.toLowerCase()).run()}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${editor.isActive({ textAlign: align.toLowerCase() }) ? 'bg-eatpur-gold text-eatpur-dark font-bold' : 'bg-eatpur-dark/50 border border-eatpur-gold/20 text-eatpur-text hover:text-eatpur-yellow'}`}
            >
              {align}
            </button>
          ))}
        </div>

        <div className="relative rounded-2xl border border-eatpur-gold/15 bg-eatpur-dark/40 backdrop-blur-sm p-6 min-h-[400px] focus-within:border-eatpur-gold/40 transition-colors shadow-[inset_0_0_20px_rgba(4,7,4,0.5)]">
          <EditorContent editor={editor} className="prose prose-invert max-w-none text-eatpur-white-warm outline-none" />
        </div>

        <div className={`text-right text-sm mt-2 ${charCount > MAX_CHARS ? "text-red-400" : "text-eatpur-text/60"}`}>
          {charCount} / {MAX_CHARS}
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-display text-eatpur-gold mb-4">Cover Image</h3>
          <label className="cursor-pointer block w-full border-2 border-dashed border-eatpur-gold/30 rounded-2xl h-48 bg-eatpur-dark/30 hover:bg-eatpur-gold/5 transition-colors overflow-hidden group">
            {coverImage ? (
              <div className="relative w-full h-full">
                <img src={coverImage} className="w-full h-full object-cover" alt="Cover" />
                <button
                  onClick={(e) => { e.preventDefault(); setCoverImage(null); }}
                  className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full text-eatpur-text group-hover:text-eatpur-yellow transition-colors">
                <span className="text-4xl mb-2">+</span>
                <span>Select Cover Image</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const url = URL.createObjectURL(file);
              setCoverImage(url);
              setImages((prev) => [...prev, { file, url }]);
            }} />
          </label>
        </div>

        <div className="mt-8">
          <label className="inline-flex cursor-pointer px-6 py-3 rounded-full border border-eatpur-gold/30 bg-eatpur-dark/50 text-eatpur-gold items-center gap-2 hover:bg-eatpur-gold hover:text-eatpur-dark transition-colors font-medium">
            <span className="text-xl">+</span> Add Content Images
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {images.map((img, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden h-32 border border-eatpur-gold/20">
                <img src={img.url} className="w-full h-full object-cover" alt="Upload" />
                <button onClick={() => insertImage(img)} className="absolute inset-0 bg-eatpur-dark/70 text-eatpur-yellow opacity-0 group-hover:opacity-100 transition-opacity font-bold flex items-center justify-center">
                  Insert into post
                </button>
                <button onClick={() => removeImage(img)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col items-end gap-4 mt-12 pt-8 border-t border-eatpur-gold/10">
          {charCount > MAX_CHARS && <div className="text-red-400 text-sm">Content exceeds maximum characters.</div>}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-end">
            <button onClick={handlePreview} className="btn-ghost w-full sm:w-auto">Preview Post</button>
            <button
              onClick={handlePublish}
              disabled={charCount > MAX_CHARS}
              className={`btn-primary w-full sm:w-auto ${charCount > MAX_CHARS ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
