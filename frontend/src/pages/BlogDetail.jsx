import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { blogAPI } from "../utils/api";
import SEOHead from "../components/SEOHead";

/*
  Blog detail page - renders a single blog post
  
  URL structure: /blog/:slug (SEO-friendly)
  
  Rendering strategy: CSR (Client-Side Rendering)
  - We use react-helmet-async for meta tags which works with most crawlers
  - For true SSR wed need Next.js, but Vite + React is what we have
  - Google's crawler can handle CSR content these days
  - See README for more on this trade-off
*/
function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  async function fetchPost() {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await blogAPI.getBySlug(slug);
      setPost(res.data);
    } catch (err) {
      if (err.status === 404) {
        setNotFound(true);
      }
      console.error("Failed to load post:", err);
    } finally {
      setLoading(false);
    }
  }

  // convert markdown content to sanitized HTML
  // using DOMPurify to prevent XSS attacks from blog content
  function renderContent(content) {
    if (!content) return "";
    const rawHtml = marked(content);
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    return { __html: cleanHtml };
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="blog-detail">
        <div className="loading-screen">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="blog-detail">
        <div className="empty-state">
          <h3>Post not found</h3>
          <p>
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="btn btn-primary"
            style={{ marginTop: "16px" }}
          >
            ← Back to Insights
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="blog-detail">
      {/* SEO meta tags - dynamically set per post */}
      <SEOHead
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        slug={`blog/${post.slug}`}
        image={post.featuredImage}
        type="article"
        article={{
          publishedTime: post.createdAt,
          author: post.author,
        }}
      />

      <div className="blog-detail-header">
        <Link
          to="/blog"
          className="btn-ghost"
          style={{ marginBottom: "24px", display: "inline-block" }}
        >
          ← Back to Insights
        </Link>
        <h1>{post.title}</h1>
        <div className="blog-detail-meta">
          <span>By {post.author}</span>
          <span>•</span>
          <span>{formatDate(post.createdAt)}</span>
          {post.updatedAt !== post.createdAt && (
            <>
              <span>•</span>
              <span>Updated {formatDate(post.updatedAt)}</span>
            </>
          )}
        </div>
      </div>

      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={post.title}
          className="blog-detail-image"
        />
      )}

      {/* the actual post content */}
      <div
        className="blog-detail-content"
        dangerouslySetInnerHTML={renderContent(post.content)}
      />

      {/* tags - just visual, they dont link anywhere yet */}
      {post.tags && post.tags.length > 0 && (
        <div className="blog-detail-tags">
          {post.tags.map((tag, i) => (
            <span key={i}>{tag}</span>
          ))}
        </div>
      )}
    </article>
  );
}

export default BlogDetail;
