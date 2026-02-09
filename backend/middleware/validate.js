/*
  Manual validation helpers
  not using express-validator on purpose - rolling our own
  keeps things simple and transparent
*/

// check if a string is present and not just whitespace
function isRequired(value, fieldName) {
  if (!value || (typeof value === "string" && value.trim().length === 0)) {
    return `${fieldName} is required`;
  }
  return null;
}

// basic length check
function maxLength(value, max, fieldName) {
  if (value && value.length > max) {
    return `${fieldName} must be ${max} characters or less`;
  }
  return null;
}

// make sure its a valid-ish URL (not bulletproof but good enough)
function isValidUrl(value, fieldName) {
  if (!value) return null; // optional fields can skip this

  try {
    // this will throw if the url is garbage
    if (
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("/")
    ) {
      return null;
    }
    return `${fieldName} must be a valid URL`;
  } catch (err) {
    return `${fieldName} must be a valid URL`;
  }
}

// slug validation - only lowercase letters, numbers, and hyphens
function isValidSlug(value) {
  if (!value) return "Slug is required";
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(value)) {
    return "Slug can only contain lowercase letters, numbers, and hyphens";
  }
  return null;
}

// make sure the value is one of the allowed options
function isOneOf(value, allowed, fieldName) {
  if (value && !allowed.includes(value)) {
    return `${fieldName} must be one of: ${allowed.join(", ")}`;
  }
  return null;
}

// sanitize string to prevent basic XSS
// strips out script tags and event handlers
function sanitizeString(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/on\w+\s*=\s*'[^']*'/gi, "");
}

// run a bunch of validations and collect all errors
function validate(rules) {
  const errors = [];
  for (const rule of rules) {
    const error = rule();
    if (error) errors.push(error);
  }
  return errors;
}

module.exports = {
  isRequired,
  maxLength,
  isValidUrl,
  isValidSlug,
  isOneOf,
  sanitizeString,
  validate,
};
