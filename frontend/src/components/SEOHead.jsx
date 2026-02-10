import { Helmet } from "react-helmet-async";

/*
  Reusable SEO head component
  handles meta tags, open graph, and canonical URLs
  
  every page should use this to set its own SEO metadata
  react-helmet-async makes sure these override the defaults in index.html
*/
function SEOHead({
  title,
  description,
  slug = "",
  image = "",
  type = "website",
  article = null,
}) {
  const siteUrl = import.meta.env.VITE_SITE_URL || "http://localhost:5173";
  const fullUrl = `${siteUrl}${slug ? `/${slug}` : ""}`;
  const pageTitle = title
    ? `${title} | Giakaa`
    : "Giakaa - Empowering Enterprise";

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta
        name="description"
        content={
          description ||
          "AI-first consulting firm delivering high-impact solutions"
        }
      />
      <link rel="canonical" href={fullUrl} />

      {/* og tags - for social media link previews */}
      <meta property="og:title" content={pageTitle} />
      <meta
        property="og:description"
        content={
          description ||
          "AI-first consulting firm delivering high-impact solutions"
        }
      />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}

      {/* twitter does its own thing of course */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta
        name="twitter:description"
        content={description || "AI-first consulting firm"}
      />
      {image && <meta name="twitter:image" content={image} />}

      {/* only show these for blog posts */}
      {article && article.publishedTime && (
        <meta
          property="article:published_time"
          content={article.publishedTime}
        />
      )}
      {article && article.author && (
        <meta property="article:author" content={article.author} />
      )}
    </Helmet>
  );
}

export default SEOHead;
