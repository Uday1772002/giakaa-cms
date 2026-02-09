const HeroSlide = require("../models/HeroSlide");
const {
  isRequired,
  maxLength,
  isValidUrl,
  isOneOf,
  sanitizeString,
  validate,
} = require("../middleware/validate");

// GET all slides (public) - only active ones, sorted by display order
async function getActiveSlides(req, res) {
  try {
    const slides = await HeroSlide.find({ isActive: true })
      .sort({ displayOrder: 1 })
      .lean(); // lean() for better perf since we dont need mongoose docs

    res.json({ success: true, data: slides });
  } catch (err) {
    console.error("Failed to fetch slides:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching slides" });
  }
}

// GET all slides (admin) - includes inactive ones too
async function getAllSlides(req, res) {
  try {
    const slides = await HeroSlide.find().sort({ displayOrder: 1 }).lean();

    res.json({ success: true, data: slides });
  } catch (err) {
    console.error("Error getting all slides:", err.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

// fetch one slide - used by the edit form in admin
async function getSlideById(req, res) {
  try {
    const slide = await HeroSlide.findById(req.params.id).lean();
    if (!slide) {
      return res
        .status(404)
        .json({ success: false, message: "Slide not found" });
    }
    res.json({ success: true, data: slide });
  } catch (err) {
    // handle invalid mongo ids gracefully
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid slide ID" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// create slide - sanitize + validate first, then save
async function createSlide(req, res) {
  try {
    let {
      title,
      description,
      mediaUrl,
      mediaType,
      ctaText,
      ctaLink,
      displayOrder,
      isActive,
    } = req.body;

    // clean up user input before doing anything with it
    title = sanitizeString(title);
    description = sanitizeString(description);
    ctaText = sanitizeString(ctaText);

    // validate everything manually
    const errors = validate([
      () => isRequired(title, "Title"),
      () => isRequired(description, "Description"),
      () => isRequired(mediaUrl, "Media URL"),
      () => maxLength(title, 200, "Title"),
      () => maxLength(description, 500, "Description"),
      () => isValidUrl(mediaUrl, "Media URL"),
      () => isValidUrl(ctaLink, "CTA Link"),
      () => isOneOf(mediaType, ["image", "video"], "Media type"),
    ]);

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const slide = await HeroSlide.create({
      title,
      description,
      mediaUrl,
      mediaType: mediaType || "image",
      ctaText: ctaText || "Let's Talk",
      ctaLink: ctaLink || "/contact",
      displayOrder: displayOrder ?? 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ success: true, data: slide });
  } catch (err) {
    console.error("Create slide error:", err.message);
    res.status(500).json({ success: false, message: "Failed to create slide" });
  }
}

// update slide - only validates fields that are actually being changed
async function updateSlide(req, res) {
  try {
    let {
      title,
      description,
      mediaUrl,
      mediaType,
      ctaText,
      ctaLink,
      displayOrder,
      isActive,
    } = req.body;

    // sanitize what we can
    if (title) title = sanitizeString(title);
    if (description) description = sanitizeString(description);
    if (ctaText) ctaText = sanitizeString(ctaText);

    // only validate fields that are being updated
    const errors = [];
    if (title !== undefined) {
      const e = maxLength(title, 200, "Title");
      if (e) errors.push(e);
    }
    if (description !== undefined) {
      const e = maxLength(description, 500, "Description");
      if (e) errors.push(e);
    }
    if (mediaUrl !== undefined) {
      const e = isValidUrl(mediaUrl, "Media URL");
      if (e) errors.push(e);
    }
    if (mediaType !== undefined) {
      const e = isOneOf(mediaType, ["image", "video"], "Media type");
      if (e) errors.push(e);
    }

    if (errors.length) {
      return res.status(400).json({ success: false, errors });
    }

    const slide = await HeroSlide.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        mediaUrl,
        mediaType,
        ctaText,
        ctaLink,
        displayOrder,
        isActive,
      },
      { new: true, runValidators: true },
    );

    if (!slide) {
      return res
        .status(404)
        .json({ success: false, message: "Slide not found" });
    }

    res.json({ success: true, data: slide });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid slide ID format" });
    }
    console.error("Update slide error:", err);
    res.status(500).json({ success: false, message: "Failed to update slide" });
  }
}

// delete - pretty simple, just nuke it from the db
async function deleteSlide(req, res) {
  try {
    const slide = await HeroSlide.findByIdAndDelete(req.params.id);
    if (!slide) {
      return res
        .status(404)
        .json({ success: false, message: "Slide not found" });
    }
    res.json({ success: true, message: "Slide deleted" });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Bad slide ID" });
    }
    res.status(500).json({ success: false, message: "Delete failed" });
  }
}

module.exports = {
  getActiveSlides,
  getAllSlides,
  getSlideById,
  createSlide,
  updateSlide,
  deleteSlide,
};
