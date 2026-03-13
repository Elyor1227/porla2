// /**
//  * ╔══════════════════════════════════════════════════════╗
//  * ║              PORLA — API Service Layer               ║
//  * ║   Barcha backend so'rovlari shu fayl orqali ketadi   ║
//  * ╚══════════════════════════════════════════════════════╝
//  *
//  * Foydalanish:
//  *   import api from "./api";
//  *   const { user, token } = await api.auth.login(email, password);
//  */

// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// // ─── Token boshqaruvi ────────────────────────────────────
// const TOKEN_KEY = "porla_token";
// const USER_KEY  = "porla_user";

// export const storage = {
//   getToken:   ()      => localStorage.getItem(TOKEN_KEY),
//   setToken:   (t)     => localStorage.setItem(TOKEN_KEY, t),
//   removeToken:()      => localStorage.removeItem(TOKEN_KEY),
//   getUser:    ()      => { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } },
//   setUser:    (u)     => localStorage.setItem(USER_KEY, JSON.stringify(u)),
//   removeUser: ()      => localStorage.removeItem(USER_KEY),
//   clear:      ()      => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); },
// };

// // ─── HTTP helper ─────────────────────────────────────────
// async function request(method, endpoint, body = null, requireAuth = true) {
//   const headers = { "Content-Type": "application/json" };

//   if (requireAuth) {
//     const token = storage.getToken();
//     if (!token) throw new Error("TOKEN_MISSING");
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   const config = { method, headers };
//   if (body) config.body = JSON.stringify(body);

//   const res = await fetch(`${BASE_URL}${endpoint}`, config);
//   const data = await res.json();

//   // Token muddati tugagan — sahifani yangilash
//   if (res.status === 401 && data.message?.includes("muddati")) {
//     storage.clear();
//     window.location.reload();
//     throw new Error(data.message);
//   }

//   if (!res.ok) throw new Error(data.message || "So'rov muvaffaqiyatsiz");
//   return data;
// }

// const get    = (url, auth = true)        => request("GET",    url, null, auth);
// const post   = (url, body, auth = true)  => request("POST",   url, body, auth);
// const patch  = (url, body, auth = true)  => request("PATCH",  url, body, auth);
// const del    = (url, auth = true)        => request("DELETE", url, null, auth);

// // ═══════════════════════════════════════════════════════
// //                     AUTH API
// // ═══════════════════════════════════════════════════════
// const auth = {
//   /**
//    * Ro'yxatdan o'tish
//    * @returns {{ token, user }}
//    */
//   register: async (name, email, password) => {
//     const data = await post("/auth/register", { name, email, password }, false);
//     storage.setToken(data.token);
//     storage.setUser(data.user);
//     return data;
//   },

//   /**
//    * Tizimga kirish
//    * @returns {{ token, user }}
//    */
//   login: async (email, password) => {
//     const data = await post("/auth/login", { email, password }, false);
//     storage.setToken(data.token);
//     storage.setUser(data.user);
//     return data;
//   },

//   /**
//    * Tizimdan chiqish
//    */
//   logout: async () => {
//     try { await post("/auth/logout"); } catch (_) {}
//     storage.clear();
//   },

//   /**
//    * Joriy foydalanuvchi
//    * @returns {{ user }}
//    */
//   me: () => get("/auth/me"),

//   /**
//    * Profil yangilash
//    */
//   updateProfile: (data) => patch("/auth/update-profile", data),

//   /**
//    * Parol o'zgartirish
//    */
//   changePassword: (currentPassword, newPassword) =>
//     patch("/auth/change-password", { currentPassword, newPassword }),
// };

// // ═══════════════════════════════════════════════════════
// //                    COURSES API
// // ═══════════════════════════════════════════════════════
// const courses = {
//   /** Barcha kurslar */
//   getAll: () => get("/courses"),

//   /** Bitta kurs + darslar */
//   getOne: (id) => get(`/courses/${id}`),

//   /** Darsni tugallash */
//   completeLesson: (courseId, lessonId) =>
//     post(`/courses/${courseId}/lessons/${lessonId}/complete`),
// };

// // ═══════════════════════════════════════════════════════
// //                   TRACKER API
// // ═══════════════════════════════════════════════════════
// const tracker = {
//   /** Bugungi ma'lumotlar */
//   getToday: () => get("/tracker/today"),

//   /** Tsikl tarixi */
//   getCycles: () => get("/tracker/cycles"),

//   /**
//    * Yangi tsikl boshlash
//    * @param {string} startDate  — "2024-03-01"
//    * @param {number} cycleLength — kun soni
//    */
//   startCycle: (startDate, cycleLength = 28, notes = "") =>
//     post("/tracker/cycles", { startDate, cycleLength, notes }),

//   /** Tsiklni yangilash */
//   updateCycle: (id, data) => patch(`/tracker/cycles/${id}`, data),

//   /**
//    * Kunlik belgilar qo'shish
//    * @param {string} date     — "2024-03-15"
//    * @param {string[]} items  — ["og'riq", "kayfiyat yaxshi"]
//    * @param {string} mood     — "happy" | "neutral" | "sad" | ...
//    * @param {number} painLevel — 0–10
//    */
//   addSymptoms: (date, items, mood, painLevel, notes = "") =>
//     post("/tracker/symptoms", { date, items, mood, painLevel, notes }),
// };

// // ═══════════════════════════════════════════════════════
// //                 NOTIFICATIONS API
// // ═══════════════════════════════════════════════════════
// const notifications = {
//   getAll:   ()   => get("/notifications"),
//   markRead: (id) => patch(`/notifications/${id}/read`),
//   readAll:  ()   => patch("/notifications/read-all"),
// };

// // ═══════════════════════════════════════════════════════
// //                  HEALTH CHECK
// // ═══════════════════════════════════════════════════════
// const health = () => get("/health", false);

// // ─── Default export ───────────────────────────────────────
// const api = { auth, courses, tracker, notifications, health, storage };
// export default api;

// // Named exports ham
// export { auth, courses, tracker, notifications, health };

/**
 * ╔══════════════════════════════════════════════════════╗
 * ║              PORLA — API Service Layer               ║
 * ╚══════════════════════════════════════════════════════╝
 * import api, { storage } from "./api";
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ── Storage ─────────────────────────────────────────── */
export const storage = {
  getToken:    ()  => localStorage.getItem("porla_token"),
  setToken:    (t) => localStorage.setItem("porla_token", t),
  getUser:     ()  => { try { return JSON.parse(localStorage.getItem("porla_user")); } catch { return null; } },
  setUser:     (u) => localStorage.setItem("porla_user", JSON.stringify(u)),
  clear:       ()  => { localStorage.removeItem("porla_token"); localStorage.removeItem("porla_user"); },
};

/* ── HTTP helper ─────────────────────────────────────── */
async function request(method, endpoint, body = null, requireAuth = true) {
  const headers = { "Content-Type": "application/json" };
  if (requireAuth) {
    const token = storage.getToken();
    if (!token) throw new Error("TOKEN_MISSING");
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res  = await fetch(`${BASE_URL}${endpoint}`, { method, headers, ...(body ? { body: JSON.stringify(body) } : {}) });
  const data = await res.json();

  if (res.status === 401 && data.message?.includes("muddati")) {
    storage.clear(); window.location.reload();
    throw new Error(data.message);
  }
  if (!res.ok) throw new Error(data.message || "So'rov muvaffaqiyatsiz");
  return data;
}

const get   = (url, auth = true)       => request("GET",    url, null, auth);
const post  = (url, body, auth = true) => request("POST",   url, body, auth);
const patch = (url, body, auth = true) => request("PATCH",  url, body, auth);
const del   = (url, auth = true)       => request("DELETE", url, null, auth);

/* ── AUTH ────────────────────────────────────────────── */
export const auth = {
  register: async (name, email, password) => {
    const d = await post("/auth/register", { name, email, password }, false);
    storage.setToken(d.token); storage.setUser(d.user); return d;
  },
  login: async (email, password) => {
    const d = await post("/auth/login", { email, password }, false);
    storage.setToken(d.token); storage.setUser(d.user); return d;
  },
  logout:        async () => { try { await post("/auth/logout"); } catch (_) {} storage.clear(); },
  me:            ()          => get("/auth/me"),
  updateProfile: (data)      => patch("/auth/update-profile", data),
  changePassword:(cur, next) => patch("/auth/change-password", { currentPassword: cur, newPassword: next }),
};

/* ── COURSES ─────────────────────────────────────────── */
export const courses = {
  getAll:        ()             => get("/courses"),
  getOne:        (id)           => get(`/courses/${id}`),
  completeLesson:(cId, lId)     => post(`/courses/${cId}/lessons/${lId}/complete`),
};

/* ── TRACKER ─────────────────────────────────────────── */
export const tracker = {
  getToday:   () => get("/tracker/today"),
  getCycles:  () => get("/tracker/cycles"),
  startCycle: (startDate, cycleLength = 28, notes = "") => post("/tracker/cycles", { startDate, cycleLength, notes }),
  updateCycle:(id, data) => patch(`/tracker/cycles/${id}`, data),
  addSymptoms:(date, items, mood, painLevel, notes = "") => post("/tracker/symptoms", { date, items, mood, painLevel, notes }),
};

/* ── NOTIFICATIONS ───────────────────────────────────── */
export const notifications = {
  getAll:   ()   => get("/notifications"),
  markRead: (id) => patch(`/notifications/${id}/read`),
  readAll:  ()   => patch("/notifications/read-all"),
};

/* ── ADMIN ───────────────────────────────────────────── */
export const admin = {
  // Dashboard
  stats:        ()                  => get("/admin/stats"),
  // Users
  users:        (params = {})       => get(`/admin/users?${new URLSearchParams(params)}`),
  getUser:      (id)                => get(`/admin/users/${id}`),
  setPro:       (id, isPro, months) => patch(`/admin/users/${id}/pro`, { isPro, months }),
  blockUser:    (id, isBlocked)     => patch(`/admin/users/${id}/block`, { isBlocked }),
  deleteUser:   (id)                => del(`/admin/users/${id}`),
  notifyUser:   (id, data)          => post(`/admin/users/${id}/notify`, data),
  broadcast:    (data)              => post("/admin/broadcast", data),
  // Courses
  courses:      ()                  => get("/admin/courses"),
  createCourse: (data)              => post("/admin/courses", data),
  updateCourse: (id, data)          => patch(`/admin/courses/${id}`, data),
  deleteCourse: (id)                => del(`/admin/courses/${id}`),
  // Lessons
  lessons:      (cId)               => get(`/admin/courses/${cId}/lessons`),
  createLesson: (cId, data)         => post(`/admin/courses/${cId}/lessons`, data),
  updateLesson: (cId, lId, data)    => patch(`/admin/courses/${cId}/lessons/${lId}`, data),
  deleteLesson: (cId, lId)          => del(`/admin/courses/${cId}/lessons/${lId}`),
  // Seed
  seed:         ()                  => post("/admin/seed"),
};

/* ── HEALTH ──────────────────────────────────────────── */
export const health = () => get("/health", false);

/* ── Default export ──────────────────────────────────── */
const api = { auth, courses, tracker, notifications, admin, health, storage };
export default api;