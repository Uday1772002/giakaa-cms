import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { heroAPI } from "../../utils/api";
import SEOHead from "../../components/SEOHead";

/*
  Hero Slider management page
  lets you create, edit, delete hero slides
  and toggle active/inactive status
*/
function HeroManager() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState(null); // null = listing, object = editing/creating
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSlides();
  }, []);

  async function loadSlides() {
    try {
      const res = await heroAPI.getAll();
      setSlides(res.data || []);
    } catch (err) {
      showToast("Failed to load slides", "error");
    } finally {
      setLoading(false);
    }
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  // blank slate for creating a new slide
  function startCreating() {
    setEditingSlide({
      title: "",
      description: "",
      mediaUrl: "",
      mediaType: "image",
      ctaText: "Let's Talk",
      ctaLink: "/contact",
      displayOrder: slides.length,
      isActive: true,
    });
  }

  function startEditing(slide) {
    setEditingSlide({ ...slide });
  }

  function cancelEdit() {
    setEditingSlide(null);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setEditingSlide((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    // quick checks before we hit the API (server validates too)
    if (!editingSlide.title || !editingSlide.title.trim()) {
      showToast("Title is required", "error");
      setSaving(false);
      return;
    }
    if (!editingSlide.description || !editingSlide.description.trim()) {
      showToast("Description is required", "error");
      setSaving(false);
      return;
    }
    if (!editingSlide.mediaUrl || !editingSlide.mediaUrl.trim()) {
      showToast("Media URL is required", "error");
      setSaving(false);
      return;
    }

    try {
      if (editingSlide._id) {
        // updating existing slide
        await heroAPI.update(editingSlide._id, editingSlide);
        showToast("Slide updated!");
      } else {
        // creating new slide
        await heroAPI.create(editingSlide);
        showToast("Slide created!");
      }
      setEditingSlide(null);
      await loadSlides();
    } catch (err) {
      const msg = err.errors
        ? err.errors.join(", ")
        : err.message || "Save failed";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this slide? This cant be undone.")) return;

    try {
      await heroAPI.delete(id);
      showToast("Slide deleted");
      await loadSlides();
    } catch (err) {
      showToast("Delete failed", "error");
    }
  }

  async function toggleActive(slide) {
    try {
      await heroAPI.update(slide._id, { isActive: !slide.isActive });
      await loadSlides();
      showToast(`Slide ${slide.isActive ? "deactivated" : "activated"}`);
    } catch (err) {
      showToast("Update failed", "error");
    }
  }

  return (
    <div className="admin-layout">
      <SEOHead
        title="Manage Hero Slider"
        description="CMS - Hero slider management"
      />

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      <div className="container">
        <div className="admin-nav">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/hero" className="active">
            Hero Slider
          </Link>
          <Link to="/admin/blog">Blog Posts</Link>
        </div>

        {editingSlide ? (
          // ---- EDIT / CREATE FORM ----
          <div>
            <div className="admin-header">
              <h1>{editingSlide._id ? "Edit Slide" : "New Slide"}</h1>
              <button className="btn btn-outline btn-sm" onClick={cancelEdit}>
                ← Back to list
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  name="title"
                  value={editingSlide.title}
                  onChange={handleChange}
                  placeholder="e.g. Empowering Enterprise"
                  maxLength={200}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={editingSlide.description}
                  onChange={handleChange}
                  placeholder="Supporting text for the slide..."
                  style={{ minHeight: "100px" }}
                  maxLength={500}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Media URL *</label>
                  <input
                    name="mediaUrl"
                    value={editingSlide.mediaUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Media Type</label>
                  <select
                    name="mediaType"
                    value={editingSlide.mediaType}
                    onChange={handleChange}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              {/* preview the media */}
              {editingSlide.mediaUrl && (
                <div
                  style={{
                    marginBottom: "20px",
                    borderRadius: "var(--radius-sm)",
                    overflow: "hidden",
                    maxHeight: "200px",
                    border: "1px solid var(--border)",
                  }}
                >
                  {editingSlide.mediaType === "video" ? (
                    <video
                      src={editingSlide.mediaUrl}
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        objectFit: "cover",
                      }}
                      muted
                    />
                  ) : (
                    <img
                      src={editingSlide.mediaUrl}
                      alt="Preview"
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>CTA Button Text</label>
                  <input
                    name="ctaText"
                    value={editingSlide.ctaText}
                    onChange={handleChange}
                    placeholder="Let's Talk"
                  />
                </div>
                <div className="form-group">
                  <label>CTA Button Link</label>
                  <input
                    name="ctaLink"
                    value={editingSlide.ctaLink}
                    onChange={handleChange}
                    placeholder="/contact"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    name="displayOrder"
                    type="number"
                    value={editingSlide.displayOrder}
                    onChange={handleChange}
                    min={0}
                  />
                </div>
                <div className="form-group">
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      name="isActive"
                      type="checkbox"
                      checked={editingSlide.isActive}
                      onChange={handleChange}
                      style={{ width: "auto" }}
                    />
                    Active (visible on website)
                  </label>
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
                    : editingSlide._id
                      ? "Update Slide"
                      : "Create Slide"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          // ---- SLIDES LISTING ----
          <div>
            <div className="admin-header">
              <h1>Hero Slides</h1>
              <button
                className="btn btn-primary btn-sm"
                onClick={startCreating}
              >
                + New Slide
              </button>
            </div>

            {loading ? (
              <div className="loading-screen" style={{ minHeight: "30vh" }}>
                <div className="loader"></div>
              </div>
            ) : slides.length === 0 ? (
              <div className="empty-state">
                <h3>No slides yet</h3>
                <p>Create your first hero slide to get started.</p>
                <button
                  className="btn btn-primary"
                  onClick={startCreating}
                  style={{ marginTop: "16px" }}
                >
                  Create First Slide
                </button>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Title</th>
                    <th>Media</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slides.map((slide) => (
                    <tr key={slide._id}>
                      <td>{slide.displayOrder}</td>
                      <td>
                        <strong style={{ color: "var(--text-primary)" }}>
                          {slide.title}
                        </strong>
                        <br />
                        <small>{slide.description?.substring(0, 60)}...</small>
                      </td>
                      <td>
                        <img
                          src={slide.mediaUrl}
                          alt=""
                          style={{
                            width: "80px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      </td>
                      <td>
                        <button
                          className={`status-badge ${slide.isActive ? "active" : "inactive"}`}
                          onClick={() => toggleActive(slide)}
                          style={{ cursor: "pointer", border: "none" }}
                        >
                          {slide.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => startEditing(slide)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(slide._id)}
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
        )}
      </div>
    </div>
  );
}

export default HeroManager;
