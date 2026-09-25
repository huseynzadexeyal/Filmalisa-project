/* =========================================================
   Filmalisa — API qatı
   Bütün səhifələr fetch-i birbaşa yox, bu fayldan istifadə edir:
   base URL, token, xəta idarəsi, login/logout, qoruma (requireAuth).
   Səhifədən ƏVVƏL yüklənməlidir:
   <script src="../../global/api.js"></script>
   ========================================================= */

const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa";

// global/ içindədir → kök = "../" (alt-qovluqda deploy olunsa da işləyir)
const SITE_ROOT = new URL("../", document.currentScript.src).href;
const pageUrl = (path) => SITE_ROOT + path;

const LOGIN_PAGE = {
  client: "client/login/login.html",
  admin: "admin/admin_panel/admin_panel.html",
};
const TOKEN_KEY = { client: "filmalisa-token", admin: "filmalisa-admin-token" };
const PROFILE_KEY = { client: "filmalisa-profile", admin: "filmalisa-admin-profile" };

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/* ---------- Session ---------- */
const getToken = (role) => localStorage.getItem(TOKEN_KEY[role]);

function getProfile(role = "client") {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY[role]));
  } catch {
    return null;
  }
}

function saveSession(role, data) {
  localStorage.setItem(TOKEN_KEY[role], data.tokens.access_token);
  localStorage.setItem(PROFILE_KEY[role], JSON.stringify(data.profile));
}

function logout(role, redirect = true) {
  localStorage.removeItem(TOKEN_KEY[role]);
  localStorage.removeItem(PROFILE_KEY[role]);
  if (redirect) location.href = pageUrl(LOGIN_PAGE[role]);
}

/* Token yoxdursa login səhifəsinə göndərir */
function requireAuth(role) {
  if (getToken(role)) return true;
  location.replace(pageUrl(LOGIN_PAGE[role]));
  return false;
}

/* ---------- Ortaq köməkçilər ---------- */
const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function toast(message, type = "error") {
  const el = document.createElement("div");
  el.className = `toast toast--${type}`;
  el.setAttribute("role", "status");
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

/* ---------- Əsas sorğu funksiyası ---------- */
async function apiRequest(path, { method = "GET", body, role, auth = true } = {}) {
  role = role || (path.startsWith("/admin") ? "admin" : "client");

  const headers = { Accept: "application/json", "Accept-Language": "en" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = getToken(role);
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(API_BASE + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Network error. Check your connection and try again.", 0);
  }

  let json = null;
  try {
    json = await res.json();
  } catch {
    /* boş cavab */
  }

  // Token bitib / yanlışdır → login-ə qaytar
  if (res.status === 401 && auth && token) {
    logout(role);
    throw new ApiError("Session expired. Please log in again.", 401);
  }

  if (!res.ok || (json && json.result === false)) {
    throw new ApiError((json && json.message) || `Request failed (${res.status})`, res.status);
  }
  return json ? json.data : null;
}

/* ---------- Endpoint-lər (Postman kolleksiyasına görə) ---------- */
const api = {
  /* Auth */
  async login(email, password) {
    const data = await apiRequest("/auth/login", { method: "POST", body: { email, password }, role: "client", auth: false });
    saveSession("client", data);
    return data.profile;
  },
  async adminLogin(email, password) {
    const data = await apiRequest("/auth/admin/login", { method: "POST", body: { email, password }, role: "admin", auth: false });
    saveSession("admin", data);
    return data.profile;
  },
  signup: (full_name, email, password) =>
    apiRequest("/auth/signup", { method: "POST", body: { full_name, email, password }, role: "client", auth: false }),

  /* Client */
  profile: () => apiRequest("/profile", { role: "client" }),
  updateProfile: (body) => apiRequest("/profile", { method: "PUT", body, role: "client" }),
  categories: () => apiRequest("/categories"),
  movies: () => apiRequest("/movies"),
  movie: (id) => apiRequest(`/movies/${id}`),
  favorites: () => apiRequest("/movies/favorites"),
  toggleFavorite: (id) => apiRequest(`/movie/${id}/favorite`, { method: "POST" }), // əlavə edir / çıxarır
  comments: (id) => apiRequest(`/movies/${id}/comments`),
  addComment: (id, comment) => apiRequest(`/movies/${id}/comment`, { method: "POST", body: { comment } }),
  removeComment: (id, commentId) => apiRequest(`/movies/${id}/comment/${commentId}`, { method: "DELETE" }),
  sendContact: (body) => apiRequest("/contact", { method: "POST", body, role: "client" }),

  /* Admin */
  admin: {
    dashboard: () => apiRequest("/admin/dashboard"),
    users: () => apiRequest("/admin/users"),

    categories: () => apiRequest("/admin/categories"),
    createCategory: (name) => apiRequest("/admin/category", { method: "POST", body: { name } }),
    updateCategory: (id, name) => apiRequest(`/admin/category/${id}`, { method: "PUT", body: { name } }),
    removeCategory: (id) => apiRequest(`/admin/category/${id}`, { method: "DELETE" }),

    actors: () => apiRequest("/admin/actors"),
    createActor: (body) => apiRequest("/admin/actor", { method: "POST", body }),
    updateActor: (id, body) => apiRequest(`/admin/actor/${id}`, { method: "PUT", body }),
    removeActor: (id) => apiRequest(`/admin/actor/${id}`, { method: "DELETE" }),

    movies: () => apiRequest("/admin/movies"),
    movie: (id) => apiRequest(`/admin/movies/${id}`),
    createMovie: (body) => apiRequest("/admin/movie", { method: "POST", body }),
    updateMovie: (id, body) => apiRequest(`/admin/movie/${id}`, { method: "PUT", body }),
    removeMovie: (id) => apiRequest(`/admin/movie/${id}`, { method: "DELETE" }),

    comments: () => apiRequest("/admin/comments"),
    removeComment: (movieId, commentId) => apiRequest(`/admin/movies/${movieId}/comment/${commentId}`, { method: "DELETE" }),

    contacts: () => apiRequest("/admin/contacts"),
    removeContact: (id) => apiRequest(`/admin/contact/${id}`, { method: "DELETE" }),
  },
};
