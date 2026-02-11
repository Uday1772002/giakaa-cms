# Giakaa CMS

Hey! This is my full-stack CMS project for the o8m Labs internship assignment. It clones the [giakaa.com](https://giakaa.com) layout and adds a custom admin panel where you can manage the hero slider and write SEO-friendly blog posts.

Built it with the MERN stack — React on the front, Node/Express/MongoDB on the back.

## Quick Links

- **Live Site**: [https://giakaa-cms.onrender.com](https://giakaa-cms.onrender.com)
- **Blog**: [https://giakaa-cms.onrender.com/blog](https://giakaa-cms.onrender.com/blog)
- **Admin Panel**: [https://giakaa-cms.onrender.com/admin](https://giakaa-cms.onrender.com/admin)
- **GitHub Repo**: [https://github.com/Uday1772002/giakaa-cms](https://github.com/Uday1772002/giakaa-cms)

---

## What Does It Do?

Basically three things:

1. **Landing Page** — Clones the giakaa.com layout with hero slider, stats, services, industries, case studies, testimonials, tech stack, and all those sections
2. **Blog System** — SEO-optimized blog with markdown support, pagination, meta tags, the works
3. **Admin CMS** — A panel at `/admin` where you can create/edit/delete hero slides and blog posts without touching code

## How It's Built

```
Frontend (React + Vite)              Backend (Node + Express)
┌────────────────────┐               ┌──────────────────────┐
│  Landing Page      │──── fetch ───→│  Hero API            │
│  Blog Pages        │               │  Blog API            │
│  Admin CMS Panel   │               │  Sitemap Generator   │
│                    │               │  Manual Validation   │
│  react-helmet-async│               └─────────┬────────────┘
│  (handles SEO)     │                         │
└────────────────────┘               ┌─────────┴────────────┐
                                     │  MongoDB             │
                                     │  - HeroSlides        │
                                     │  - BlogPosts         │
                                     └──────────────────────┘
```

---

## Project Structure

I tried to keep it organized but not over-engineered:

```
├── backend/
│   ├── config/db.js              # mongo connection
│   ├── controllers/
│   │   ├── heroController.js     # hero slide CRUD
│   │   └── blogController.js     # blog CRUD + auto slug generation
│   ├── middleware/validate.js    # hand-rolled validation (no express-validator)
│   ├── models/
│   │   ├── HeroSlide.js          # mongoose schema for slides
│   │   └── BlogPost.js           # mongoose schema for posts
│   ├── routes/
│   │   ├── heroRoutes.js
│   │   ├── blogRoutes.js
│   │   └── sitemapRoutes.js      # generates XML sitemap on the fly
│   ├── seed.js                   # fills db with sample data
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/           # all the landing page sections
│   │   │   ├── HeroSlider.jsx    # pulls slides from CMS, auto-advances
│   │   │   ├── SEOHead.jsx       # meta tags, og tags, canonical URLs
│   │   │   └── ... (12 more)
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── BlogList.jsx      # paginated blog listing
│   │   │   ├── BlogDetail.jsx    # /blog/:slug with markdown rendering
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── HeroManager.jsx
│   │   │       └── BlogEditor.jsx # markdown editor + live preview
│   │   ├── utils/api.js          # all API calls in one place
│   │   └── styles/global.css     # everything styled with CSS variables
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## SEO — What I Did and Why

This was a big part of the assignment so I spent real time on it:

| What              | How I Did It                                                               |
| ----------------- | -------------------------------------------------------------------------- |
| Meta Title        | Dynamic per page via react-helmet-async. Blog posts pull from CMS field.   |
| Meta Description  | Set per page. Auto-generates from excerpt if you don't write one manually. |
| SEO-Friendly URLs | Blog posts live at `/blog/:slug`. Slugs auto-generate from titles.         |
| Open Graph        | og:title, og:description, og:url, og:type, og:image — all set per page.    |
| Twitter Cards     | twitter:card, twitter:title, twitter:description, twitter:image.           |
| Canonical URLs    | `<link rel="canonical">` in SEOHead component.                             |
| Sitemap           | Dynamic XML at `/api/sitemap.xml` — auto-includes all published posts.     |
| robots.txt        | Points crawlers to the sitemap.                                            |
| Article Meta      | article:published_time and article:author for blog posts specifically.     |

### Why CSR and not SSR?

Honestly, I thought about this. The assignment says React, not Next.js. Vite doesn't have plug-and-play SSR. So I went with CSR + react-helmet-async for meta tags.

Googlebot can render JavaScript these days so it mostly works. But yeah, for a real production blog where SEO is life-or-death, I'd use Next.js with `getStaticProps` for blog pages. That's a trade-off I'm aware of.

---

## Database Design

### HeroSlide

| Field        | Type                       | What Its For                |
| ------------ | -------------------------- | --------------------------- |
| title        | String (required, max 200) | Slide headline              |
| description  | String (required, max 500) | Supporting text             |
| mediaUrl     | String (required)          | Image or video URL          |
| mediaType    | Enum [image, video]        | So we know how to render it |
| ctaText      | String                     | Button label                |
| ctaLink      | String                     | Where the button goes       |
| displayOrder | Number                     | Lower = shows first         |
| isActive     | Boolean                    | Show/hide without deleting  |

Indexes: `displayOrder` (we always sort by this) and `isActive` (we always filter on this).

### BlogPost

| Field           | Type                       | What Its For                  |
| --------------- | -------------------------- | ----------------------------- |
| title           | String (required, max 300) | Post title                    |
| slug            | String (unique)            | The URL-friendly version      |
| content         | String (required)          | Markdown or HTML body         |
| excerpt         | String (max 500)           | Short blurb for listing pages |
| metaTitle       | String (max 70)            | What Google sees (SEO)        |
| metaDescription | String (max 160)           | The snippet under the title   |
| featuredImage   | String                     | Cover image URL               |
| status          | Enum [draft, published]    | Draft vs live                 |
| tags            | [String]                   | Categorize posts              |
| author          | String                     | Who wrote it                  |

Indexes: `slug` (unique, for fast lookups), `{status, createdAt}` compound (for "get published posts newest first"), and a text index on title+content for future search.

### Why MongoDB?

CMS content is pretty flexible — blog posts can have wildly different structures, markdown, embedded stuff. MongoDB handles that well. If I needed users/roles/permissions with strict relations, I'd reach for Postgres.

---

## Things I'm Proud Of

- **No express-validator** — rolled my own validation in `validate.js`. It checks required fields, max lengths, valid URLs, slug format, enum values, and sanitizes strings. Not as fancy but I understand every line of it.
- **Code splitting** — admin pages are lazy-loaded so a regular visitor never downloads CMS code
- **Auto slug generation** — if "my-blog-post" is taken, it tries "my-blog-post-1", "my-blog-post-2" etc. Has a safety valve at 100 so it doesn't loop forever.
- **DOMPurify everywhere** — blog content goes through both server-side sanitization and client-side DOMPurify. No XSS getting through.
- **Lean queries** — backend uses `.lean()` and `.select()` where possible so we're not shipping entire mongoose documents over the wire

---

## Honest Trade-offs

| Decision                          | Why I Made It                                                                 |
| --------------------------------- | ----------------------------------------------------------------------------- |
| CSR instead of SSR                | Assignment says React, not Next.js. react-helmet covers most SEO needs.       |
| MongoDB only                      | One database keeps things simple. Would add Postgres for users in production. |
| No authentication on admin        | Not required by the spec. In prod, JWT + roles for sure.                      |
| URL-based images (no file upload) | Keeps it simple. Would add Cloudinary/S3 with more time.                      |
| Plain CSS over Tailwind           | One file, easy to read, ships fast. No build complexity.                      |
| Manual validation                 | More code but zero magic. I know exactly what its checking.                   |

---

## What I'd Do With More Time

- Switch to Next.js for proper SSR/SSG on blog pages
- Add image uploads (Cloudinary or S3) instead of pasting URLs
- Rich text editor like TipTap instead of raw markdown
- JWT auth with admin/editor roles
- Full-text blog search using the MongoDB text index I already set up
- Content versioning so you can undo edits
- Scheduled publishing (set a post to go live at a future date)
- E2E tests with Cypress or Playwright
- Rate limiting on API endpoints
- Docker setup for one-command deployment

---

## Getting It Running

### You'll Need

- Node.js 18+
- MongoDB running somewhere (local, Docker, or Atlas)

### Backend

```bash
cd backend
npm install
npm run seed    # fills the db with sample slides + posts
npm run dev     # starts on http://localhost:5001
```

### Frontend

```bash
cd frontend
npm install
npm run dev     # starts on http://localhost:5173, proxies /api to backend
```

Then open `http://localhost:5173` for the site and `http://localhost:5173/admin` for the CMS.

---

## API Endpoints

Nothing fancy, just REST:

**Hero Slides:**

- `GET /api/hero` — active slides (what visitors see)
- `GET /api/hero/admin/all` — all slides including inactive
- `POST /api/hero/admin` — create
- `PUT /api/hero/admin/:id` — update
- `DELETE /api/hero/admin/:id` — delete

**Blog Posts:**

- `GET /api/blog` — published posts with pagination
- `GET /api/blog/slug/:slug` — single post by slug
- `GET /api/blog/admin/all` — all posts including drafts
- `POST /api/blog/admin` — create
- `PUT /api/blog/admin/:id` — update
- `DELETE /api/blog/admin/:id` — delete

**Other:**

- `GET /api/sitemap.xml` — auto-generated XML sitemap
- `GET /api/health` — health check

---

## Tech Stack

| What           | With                                |
| -------------- | ----------------------------------- |
| Frontend       | React 18, Vite 5, React Router v6   |
| SEO            | react-helmet-async                  |
| Blog Rendering | marked (markdown → html), DOMPurify |
| Backend        | Node.js, Express                    |
| Database       | MongoDB + Mongoose                  |
| Validation     | Hand-rolled (no express-validator)  |
| Styling        | Custom CSS with CSS variables       |

---

_Built by Jayaram Uday for the o8m Labs Full-Stack MERN Developer Intern assignment._
