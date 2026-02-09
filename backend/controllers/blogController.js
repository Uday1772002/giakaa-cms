const BlogPost = require("../models/BlogPost");
const slugify = require("slugify");
const {
  isRequired,
  maxLength,
  isValidSlug,
  isOneOf,
  sanitizeString,
  validate,
} = require("../middleware/validate");

// helper to generate a unique slug from the title
// if "my-blog-post" already exists, it'll try "my-blog-post-1", "my-blog-post-2" etc
async function generateUniqueSlug(title, excludeId = null) {
  let baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId }; // dont match against itself when updating

    const existing = await BlogPost.findOne(query);
    if (!existing) break;

    slug = `${baseSlug}-${counter}`;
    counter++;

    // safety valve - dont loop forever
    if (counter > 100) {
      slug = `${baseSlug}-${Date.now()}`;
      break;
    }
  }

  return slug;
}

// GET published blog posts (public facing)
async function getPublishedPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // only grab what we need for the listing page
    const [posts, total] = await Promise.all([
      BlogPost.find({ status: "published" })
        .select("title slug excerpt featuredImage tags author createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments({ status: "published" }),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
}

// GET single post by slug (public)
async function getPostBySlug(req, res) {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
      status: "published",
    }).lean();

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching post" });
  }
}

// GET all posts (admin) - includes drafts
async function getAllPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status; // optional filter

    const filter = {};
    if (status && ["draft", "published"].includes(status)) {
      filter.status = status;
    }

    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("Admin posts fetch error:", err);
    res.status(500).json({ success: false, message: "Couldnt load posts" });
  }
}

// admin fetches post by mongo id (not slug) for editing
async function getPostById(req, res) {
  try {
    const post = await BlogPost.findById(req.params.id).lean();
    if (!post) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, data: post });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post ID" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// create a new blog post - handles slug generation, validation, the whole deal
async function createPost(req, res) {
  try {
    let {
      title,
      content,
      excerpt,
      metaTitle,
      metaDescription,
      featuredImage,
      status,
      tags,
      author,
      slug,
    } = req.body;

    // scrub inputs - but not content, that might have markdown/html
    title = sanitizeString(title);
    excerpt = sanitizeString(excerpt);
    metaTitle = sanitizeString(metaTitle);
    metaDescription = sanitizeString(metaDescription);
    // we dont sanitize content here because it might be markdown/html
    // the frontend should handle rendering safely (dangerouslySetInnerHTML with DOMPurify)

    const errors = validate([
      () => isRequired(title, "Title"),
      () => isRequired(content, "Content"),
      () => maxLength(title, 300, "Title"),
      () => maxLength(metaTitle, 70, "Meta title"),
      () => maxLength(metaDescription, 160, "Meta description"),
      () => maxLength(excerpt, 500, "Excerpt"),
      () => isOneOf(status, ["draft", "published"], "Status"),
    ]);

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // no slug? we'll make one from the title
    if (!slug) {
      slug = await generateUniqueSlug(title);
    } else {
      // validate the manually provided slug
      slug = slug.toLowerCase().trim();
      const slugError = isValidSlug(slug);
      if (slugError) {
        return res.status(400).json({ success: false, errors: [slugError] });
      }
      // check uniqueness
      const existingSlug = await BlogPost.findOne({ slug });
      if (existingSlug) {
        return res.status(409).json({
          success: false,
          errors: ["This slug is already taken, pick another one"],
        });
      }
    }

    // fill in seo fields automatically if the user didn't bother
    if (!metaTitle) metaTitle = title;
    if (!metaDescription && excerpt) metaDescription = excerpt;
    if (!excerpt && content) {
      // grab first 200 chars of content as excerpt
      excerpt = content.replace(/<[^>]*>/g, "").substring(0, 200) + "...";
    }

    const post = await BlogPost.create({
      title,
      slug,
      content,
      excerpt,
      metaTitle,
      metaDescription,
      featuredImage: featuredImage || "",
      status: status || "draft",
      tags: tags || [],
      author: author || "Admin",
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    // handle duplicate slug at the db level just in case
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ success: false, errors: ["Slug already exists"] });
    }
    console.error("Create post error:", err);
    res.status(500).json({ success: false, message: "Failed to create post" });
  }
}

// update post - partial updates are fine, we only touch fields that were sent
async function updatePost(req, res) {
  try {
    let {
      title,
      content,
      excerpt,
      metaTitle,
      metaDescription,
      featuredImage,
      status,
      tags,
      author,
      slug,
    } = req.body;

    // sanitize what came in
    if (title) title = sanitizeString(title);
    if (excerpt) excerpt = sanitizeString(excerpt);
    if (metaTitle) metaTitle = sanitizeString(metaTitle);
    if (metaDescription) metaDescription = sanitizeString(metaDescription);

    const errors = [];
    if (title) {
      const e = maxLength(title, 300, "Title");
      if (e) errors.push(e);
    }
    if (metaTitle) {
      const e = maxLength(metaTitle, 70, "Meta title");
      if (e) errors.push(e);
    }
    if (metaDescription) {
      const e = maxLength(metaDescription, 160, "Meta description");
      if (e) errors.push(e);
    }
    if (status) {
      const e = isOneOf(status, ["draft", "published"], "Status");
      if (e) errors.push(e);
    }

    if (errors.length) {
      return res.status(400).json({ success: false, errors });
    }

    // handle slug update
    if (slug) {
      slug = slug.toLowerCase().trim();
      const slugError = isValidSlug(slug);
      if (slugError)
        return res.status(400).json({ success: false, errors: [slugError] });

      const existingSlug = await BlogPost.findOne({
        slug,
        _id: { $ne: req.params.id },
      });
      if (existingSlug) {
        return res
          .status(409)
          .json({ success: false, errors: ["Slug already taken"] });
      }
    }

    // build update object - only include provided fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined)
      updateData.metaDescription = metaDescription;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
    if (status !== undefined) updateData.status = status;
    if (tags !== undefined) updateData.tags = tags;
    if (author !== undefined) updateData.author = author;

    const post = await BlogPost.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.json({ success: true, data: post });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ success: false, errors: ["Duplicate slug"] });
    }
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post ID" });
    }
    console.error("Update post error:", err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
}

// delete post - no soft delete, its gone for real
async function deletePost(req, res) {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    res.status(500).json({ success: false, message: "Delete failed" });
  }
}

module.exports = {
  getPublishedPosts,
  getPostBySlug,
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
