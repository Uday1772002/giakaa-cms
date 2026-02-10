import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { blogAPI } from "../utils/api";
import SEOHead from "../components/SEOHead";

function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await blogAPI.getPublished(page, 9);
      setPosts(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error("Failed to fetch blog posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  // "January 15, 2025" looks nicer than the raw ISO string
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div style={{ paddingTop: "100px", minHeight: "100vh" }}>
      <SEOHead
        title="Insights & Blog"
        description="Stay ahead with expert perspectives, trend analyses, and industry updates that shape the future of technology and digital transformation."
        slug="blog"
      />

      <div className="container">
        <div className="section-header">
          <h2>Insights</h2>
          <p>
            Stay ahead with expert perspectives, trend analyses, and industry
            updates that shape the future of digital transformation.
          </p>
        </div>

        {loading ? (
          <div className="loading-screen" style={{ minHeight: "40vh" }}>
            <div className="loader"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <h3>No posts yet</h3>
            <p>Check back later or create some posts in the CMS admin panel.</p>
            <Link
              to="/admin/blog"
              className="btn btn-primary"
              style={{ marginTop: "16px" }}
            >
              Create First Post
            </Link>
          </div>
        ) : (
          <>
            <div className="blog-grid">
              {posts.map((post) => (
                <Link
                  to={`/blog/${post.slug}`}
                  key={post._id}
                  className="blog-card"
                >
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="blog-card-image"
                      loading="lazy"
                    />
                  )}
                  <div className="blog-card-body">
                    {post.tags && post.tags[0] && (
                      <span className="blog-card-tag">{post.tags[0]}</span>
                    )}
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="blog-card-meta">
                      <span>{post.author}</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* prev/next buttons - only show if theres more than one page */}
            {pagination && pagination.pages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  marginTop: "48px",
                }}
              >
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Previous
                </button>
                <span
                  style={{
                    padding: "8px 16px",
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                  }}
                >
                  Page {page} of {pagination.pages}
                </span>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BlogList;
