import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// lazy load pages for better performance
// the landing page loads immediately but admin/blog pages load on demand
const Home = lazy(() => import("./pages/Home"));
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const HeroManager = lazy(() => import("./pages/admin/HeroManager"));
const BlogEditor = lazy(() => import("./pages/admin/BlogEditor"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

function LoadingFallback() {
  return (
    <div className="loading-screen">
      <div className="loader"></div>
      <p>Loading...</p>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />

            {/* admin CMS routes - no auth required per spec */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/hero" element={<HeroManager />} />
            <Route path="/admin/blog" element={<BlogEditor />} />
            <Route path="/admin/blog/:id" element={<BlogEditor />} />

            {/* catch-all for unknown routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
