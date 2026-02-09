const mongoose = require("mongoose");

/*
  Blog Post schema
  
  slug is indexed + unique because its used in the URL path
  and we need fast lookups for /blog/:slug routes
  
  we support both markdown and html content - the frontend 
  will render it appropriately. markdown gets converted server-side
  when needed
*/
const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // the actual blog content - markdown or html
    content: {
      type: String,
      required: true,
    },
    // short excerpt for listing pages and meta descriptions
    excerpt: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    // SEO fields - super important for the assignment
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 70, // google truncates after ~60 chars but we give some room
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160, // standard meta description length
    },
    featuredImage: {
      type: String,
      trim: true,
      default: "",
    },
    // draft vs published workflow
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    // tags for categorization (nice to have)
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: String,
      default: "Admin",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// slug index is already created by `unique: true` above
// no need to duplicate it here

// compound index for listing published posts sorted by date
// this covers the most common query pattern on the blog page
blogPostSchema.index({ status: 1, createdAt: -1 });

// text index for potential search functionality later
blogPostSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("BlogPost", blogPostSchema);
