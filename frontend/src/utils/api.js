/*
  API utility - centralized place for all backend calls
  keeps the components clean and makes it easy to swap
  the base URL when deploying
*/

const API_BASE = import.meta.env.VITE_API_URL || "/api";

// wraps fetch so we dont repeat headers/error handling everywhere
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw { status: response.status, ...data };
    }

    return data;
  } catch (err) {
    // if its already our error format, rethrow
    if (err.status) throw err;
    // otherwise wrap it
    throw { status: 500, message: err.message || "Network error" };
  }
}

// ---- Hero Slide APIs ----

export const heroAPI = {
  // public
  getActive: () => apiFetch("/hero"),

  // admin
  getAll: () => apiFetch("/hero/admin/all"),
  getById: (id) => apiFetch(`/hero/admin/${id}`),
  create: (data) =>
    apiFetch("/hero/admin", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiFetch(`/hero/admin/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiFetch(`/hero/admin/${id}`, {
      method: "DELETE",
    }),
};

// ---- Blog Post APIs ----

export const blogAPI = {
  // public
  getPublished: (page = 1, limit = 10) =>
    apiFetch(`/blog?page=${page}&limit=${limit}`),
  getBySlug: (slug) => apiFetch(`/blog/slug/${slug}`),

  // admin
  getAll: (page = 1, limit = 20, status = "") => {
    let url = `/blog/admin/all?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return apiFetch(url);
  },
  getById: (id) => apiFetch(`/blog/admin/${id}`),
  create: (data) =>
    apiFetch("/blog/admin", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiFetch(`/blog/admin/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiFetch(`/blog/admin/${id}`, {
      method: "DELETE",
    }),
};
