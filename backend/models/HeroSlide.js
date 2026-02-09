const mongoose = require("mongoose");

/*
  Hero Slide schema - each slide in the hero carousel
  we store display order so the CMS user can rearrange slides
  without having to delete and recreate them
*/
const heroSlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    // could be an image or video URL - we dont restrict format here
    // the frontend will figure out what to render based on the url extension
    mediaUrl: {
      type: String,
      required: true,
      trim: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    ctaText: {
      type: String,
      trim: true,
      default: "Let's Talk",
    },
    ctaLink: {
      type: String,
      trim: true,
      default: "/contact",
    },
    // lower number = shows first
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  },
);

// index on displayOrder because we always fetch slides sorted by this
heroSlideSchema.index({ displayOrder: 1 });
// also index on isActive since we filter by it in most queries
heroSlideSchema.index({ isActive: 1 });

module.exports = mongoose.model("HeroSlide", heroSlideSchema);
