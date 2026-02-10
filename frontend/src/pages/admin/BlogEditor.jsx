import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { blogAPI } from "../../utils/api";
import SEOHead from "../../components/SEOHead";

/*
  Blog editor - used for both creating and editing posts
  if theres an :id in the URL we load that post, otherwise its a new one
  
  supports markdown content with live preview
  handles draft/published workflow
*/
function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [posts, setPosts] = useState([]);
  const [showList, setShowList] = useState(!isEditing);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  // form state
  const emptyPost = {
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    metaTitle: "",
    metaDescription: "",
    featuredImage: "",
    status: "draft",
    tags: "",
    author: "Admin",
  };
  const [form, setForm] = useState(emptyPost);

  useEffect(() => {
    if (isEditing) {
      loadPost(id);
      setShowList(false);
    } else {
      loadPosts();
    }
  }, [id]);

  async function loadPosts() {
    setLoading(true);
    try {
      const res = await blogAPI.getAll(1, 50, statusFilter);
      setPosts(res.data || []);
    } catch (err) {
      showToast("Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  }

  // reload when filter changes
  useEffect(() => {
    if (showList) loadPosts();
  }, [statusFilter]);

  async function loadPost(postId) {
    setLoading(true);
    try {
      const res = await blogAPI.getById(postId);
      const post = res.data;
      setForm({
        ...post,
        tags: (post.tags || []).join(", "), // convert array to comma-separated string for the input
      });
      setShowList(false);
    } catch (err) {
      showToast("Post not found", "error");
      navigate("/admin/blog");
    } finally {
      setLoading(false);
    }
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleNewPost() {
    setForm(emptyPost);
    setShowList(false);
    setShowPreview(false);
    // clear the URL params
    navigate("/admin/blog");
  }

  function handleBackToList() {
    setShowList(true);
    setForm(emptyPost);
    setShowPreview(false);
    navigate("/admin/blog");
    loadPosts();
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    // catch empty fields before bothering the server
    if (!form.title || !form.title.trim()) {
      showToast("Title is required", "error");
      setSaving(false);
      return;
    }
    if (!form.content || !form.content.trim()) {
      showToast("Content is required", "error");
      setSaving(false);
      return;
    }

    // turn the comma-separated tags string back into an array
    const postData = {
      ...form,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };

    try {
      if (form._id) {
        await blogAPI.update(form._id, postData);
        showToast("Post updated!");
      } else {
        const res = await blogAPI.create(postData);
        setForm((prev) => ({
          ...prev,
          _id: res.data._id,
          slug: res.data.slug,
        }));
        showToast("Post created!");
      }
    } catch (err) {
      const msg = err.errors
        ? err.errors.join(", ")
        : err.message || "Save failed";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(postId) {
    if (!window.confirm("Delete this post? Gone forever.")) return;

    try {
      await blogAPI.delete(postId);
      showToast("Post deleted");
      if (!showList) handleBackToList();
      else await loadPosts();
    } catch (err) {
      showToast("Delete failed", "error");
    }
  }

  // turn the markdown into html for the preview pane
  function getPreviewHtml() {
    if (!form.content)
      return '<p style="color: #666;">Start writing to see preview...</p>';
    const rawHtml = marked(form.content);
    return DOMPurify.sanitize(rawHtml);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="admin-layout">
      <SEOHead
        title="Manage Blog Posts"
        description="CMS - Blog post management"
      />

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      <div className="container">
        <div className="admin-nav">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/hero">Hero Slider</Link>
          <Link to="/admin/blog" className="active">
            Blog Posts
          </Link>
        </div>

        {showList ? (
          // ---- POSTS LISTING ----
          <div>
            <div className="admin-header">
              <h1>Blog Posts</h1>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleNewPost}
              >
                + New Post
              </button>
            </div>

            {/* filter by status */}
            <div style={{ marginBottom: "20px", display: "flex", gap: "8px" }}>
              <button
                className={`btn btn-sm ${statusFilter === "" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setStatusFilter("")}
              >
                All
              </button>
              <button
                className={`btn btn-sm ${statusFilter === "published" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setStatusFilter("published")}
              >
                Published
              </button>
              <button
                className={`btn btn-sm ${statusFilter === "draft" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setStatusFilter("draft")}
              >
                Drafts
              </button>
            </div>

            {loading ? (
              <div className="loading-screen" style={{ minHeight: "30vh" }}>
                <div className="loader"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="empty-state">
                <h3>No posts yet</h3>
                <p>Write your first blog post to get started.</p>
                <button
                  className="btn btn-primary"
                  onClick={handleNewPost}
                  style={{ marginTop: "16px" }}
                >
                  Write First Post
                </button>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Author</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post._id}>
                      <td>
                        <strong style={{ color: "var(--text-primary)" }}>
                          {post.title}
                        </strong>
                        <br />
                        <small style={{ color: "var(--text-muted)" }}>
                          /blog/{post.slug}
                        </small>
                      </td>
                      <td>
                        <span className={`status-badge ${post.status}`}>
                          {post.status}
                        </span>
                      </td>
                      <td>{post.author}</td>
                      <td>{formatDate(post.updatedAt)}</td>
                      <td>
                        <div className="admin-actions">
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => loadPost(post._id)}
                          >
                            Edit
                          </button>
                          {post.status === "published" && (
                            <Link
                              to={`/blog/${post.slug}`}
                              className="btn btn-outline btn-sm"
                              target="_blank"
                            >
                              View
                            </Link>
                          )}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(post._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          // ---- POST EDITOR ----
          <div>
            <div className="admin-header">
              <h1>{form._id ? "Edit Post" : "New Post"}</h1>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className={`btn btn-sm ${showPreview ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? "✏️ Editor" : "👁️ Preview"}
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={handleBackToList}
                >
                  ← Back to list
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-screen" style={{ minHeight: "30vh" }}>
                <div className="loader"></div>
              </div>
            ) : showPreview ? (
              // ---- PREVIEW MODE ----
              <div>
                <div
                  style={{
                    padding: "32px",
                    background: "var(--bg-card)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>
                    {form.title || "Untitled Post"}
                  </h1>

                  {form.featuredImage && (
                    <img
                      src={form.featuredImage}
                      alt="Featured"
                      style={{
                        width: "100%",
                        maxHeight: "300px",
                        objectFit: "cover",
                        borderRadius: "var(--radius-sm)",
                        marginBottom: "24px",
                      }}
                    />
                  )}

                  <div
                    className="blog-detail-content"
                    dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
                  />

                  <div
                    style={{
                      marginTop: "24px",
                      padding: "16px",
                      background: "var(--bg-secondary)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.85rem",
                    }}
                  >
                    <strong>SEO Preview:</strong>
                    <div style={{ marginTop: "8px", color: "var(--accent)" }}>
                      {form.metaTitle || form.title || "Page Title"}
                    </div>
                    <div
                      style={{ color: "var(--success)", fontSize: "0.8rem" }}
                    >
                      yoursite.com/blog/{form.slug || "post-slug"}
                    </div>
                    <div
                      style={{
                        color: "var(--text-secondary)",
                        marginTop: "4px",
                      }}
                    >
                      {form.metaDescription ||
                        form.excerpt ||
                        "Meta description will appear here..."}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // ---- EDITOR FORM ----
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Your blog post title"
                    maxLength={300}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Slug (auto-generated if empty)</label>
                    <input
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="auto-generated-from-title"
                    />
                    <small
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.75rem",
                      }}
                    >
                      URL will be: /blog/{form.slug || "auto-generated"}
                    </small>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Content * (Markdown supported)</label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Write your blog post content in Markdown...&#10;&#10;## Heading&#10;&#10;Paragraph text with **bold** and *italic*.&#10;&#10;- List item 1&#10;- List item 2"
                    style={{
                      minHeight: "350px",
                      fontFamily: "monospace",
                      fontSize: "0.9rem",
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Excerpt (auto-generated if empty)</label>
                  <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    placeholder="A short summary of the post for listing pages..."
                    style={{ minHeight: "80px" }}
                    maxLength={500}
                  />
                </div>

                <div className="form-group">
                  <label>Featured Image URL</label>
                  <input
                    name="featuredImage"
                    value={form.featuredImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  {form.featuredImage && (
                    <img
                      src={form.featuredImage}
                      alt="Preview"
                      style={{
                        marginTop: "8px",
                        width: "200px",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        border: "1px solid var(--border)",
                      }}
                    />
                  )}
                </div>

                {/* seo stuff - meta title + description for google */}
                <div
                  style={{
                    padding: "20px",
                    background: "var(--bg-secondary)",
                    borderRadius: "var(--radius-sm)",
                    marginBottom: "20px",
                    border: "1px solid var(--border)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1rem",
                      marginBottom: "16px",
                      color: "var(--text-primary)",
                    }}
                  >
                    SEO Settings
                  </h3>
                  <div className="form-group">
                    <label>
                      Meta Title (auto from title if empty, max 70 chars)
                    </label>
                    <input
                      name="metaTitle"
                      value={form.metaTitle}
                      onChange={handleChange}
                      placeholder="SEO title for search engines"
                      maxLength={70}
                    />
                    <small
                      style={{
                        color:
                          form.metaTitle?.length > 60
                            ? "var(--warning)"
                            : "var(--text-muted)",
                        fontSize: "0.75rem",
                      }}
                    >
                      {form.metaTitle?.length || 0}/70 characters
                    </small>
                  </div>
                  <div className="form-group">
                    <label>Meta Description (max 160 chars)</label>
                    <textarea
                      name="metaDescription"
                      value={form.metaDescription}
                      onChange={handleChange}
                      placeholder="Brief description for search engine results"
                      style={{ minHeight: "60px" }}
                      maxLength={160}
                    />
                    <small
                      style={{
                        color:
                          form.metaDescription?.length > 150
                            ? "var(--warning)"
                            : "var(--text-muted)",
                        fontSize: "0.75rem",
                      }}
                    >
                      {form.metaDescription?.length || 0}/160 characters
                    </small>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tags (comma separated)</label>
                    <input
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="AI, Technology, Cloud"
                    />
                  </div>
                  <div className="form-group">
                    <label>Author</label>
                    <input
                      name="author"
                      value={form.author}
                      onChange={handleChange}
                      placeholder="Author name"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : form._id
                        ? "Update Post"
                        : "Create Post"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleBackToList}
                  >
                    Cancel
                  </button>
                  {form._id && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(form._id)}
                    >
                      Delete Post
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogEditor;
