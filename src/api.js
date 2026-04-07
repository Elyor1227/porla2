// /**
//  * ╔══════════════════════════════════════════════════════╗
//  * ║              PORLA — API Service Layer               ║
//  * ╚══════════════════════════════════════════════════════╝
//  * import api, { storage } from "./api";
//  */

// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// /* ── Storage ─────────────────────────────────────────── */
// export const storage = {
//   getToken:    ()  => localStorage.getItem("porla_token"),
//   setToken:    (t) => localStorage.setItem("porla_token", t),
//   getUser:     ()  => { try { return JSON.parse(localStorage.getItem("porla_user")); } catch { return null; } },
//   setUser:     (u) => localStorage.setItem("porla_user", JSON.stringify(u)),
//   clear:       ()  => { localStorage.removeItem("porla_token"); localStorage.removeItem("porla_user"); },
// };

// /* ── HTTP helper ─────────────────────────────────────── */
// async function request(method, endpoint, body = null, requireAuth = true) {
//   const headers = { "Content-Type": "application/json" };
//   if (requireAuth) {
//     const token = storage.getToken();
//     if (!token) throw new Error("TOKEN_MISSING");
//     headers["Authorization"] = `Bearer ${token}`;
//   }
//   const res  = await fetch(`${BASE_URL}${endpoint}`, { method, headers, ...(body ? { body: JSON.stringify(body) } : {}) });
//   const data = await res.json();

//   if (res.status === 401 && data.message?.includes("muddati")) {
//     storage.clear(); window.location.reload();
//     throw new Error(data.message);
//   }
//   if (!res.ok) throw new Error(data.message || "So'rov muvaffaqiyatsiz");
//   return data;
// }

// const get   = (url, auth = true)       => request("GET",    url, null, auth);
// const post  = (url, body, auth = true) => request("POST",   url, body, auth);
// const patch = (url, body, auth = true) => request("PATCH",  url, body, auth);
// const del   = (url, auth = true)       => request("DELETE", url, null, auth);

// /* ── AUTH ────────────────────────────────────────────── */
// export const auth = {
//   register: async (name, email, password) => {
//     const d = await post("/auth/register", { name, email, password }, false);
//     storage.setToken(d.token); storage.setUser(d.user); return d;
//   },
//   login: async (email, password) => {
//     const d = await post("/auth/login", { email, password }, false);
//     storage.setToken(d.token); storage.setUser(d.user); return d;
//   },
//   logout:        async () => { try { await post("/auth/logout"); } catch { /* ignore logout errors */ } storage.clear(); },
//   me:            async () => {
//     try {
//       return await get("/auth/me");
//     } catch (err) {
//       console.warn("AUTH ME API xatosi:", err.message);
//       // Mock user with Pro info
//       return { user: { _id: "u1", name: "Test User", email: "test@example.com", isPro: true, proDaysLeft: 12, proExpired: false } };
//     }
//   },
//   updateProfile: (data) => patch("/auth/update-profile", data),
//   changePassword: async (cur, next) => {
//     try {
//       return await patch("/auth/change-password", { currentPassword: cur, newPassword: next });
//     } catch (err) {
//       if (err.message?.includes("Joriy parol")) {
//         throw new Error("Joriy parol noto'g'ri");
//       }
//       throw new Error(err.message || "Parol o'zgartirishda xato");
//     }
//   },
// };

// /* ── TIPS (PUBLIC) ───────────────────────────────────── */
// export const tips = {
//   // Today's tip visible to everyone (no auth required)
//   getToday: async () => {
//     try {
//       return await get(`/tips/today`, false);
//     } catch (err) {
//       console.warn("TIPS TODAY API xatosi:", err.message);
//       // Mock tip
//       return { tip: { _id: "t1", content: "Kuniga 8 stakan suv iching", category: "sog'liq", emoji: "💧" } };
//     }
//   },

//   // All active tips
//   getAll: async () => {
//     try {
//       return await get(`/tips`, false);
//     } catch (err) {
//       console.warn("TIPS LIST API xatosi:", err.message);
//       return { tips: [
//         { _id: "t1", content: "Kuniga 8 stakan suv iching", category: "sog'liq", emoji: "💧", isActive:true },
//         { _id: "t2", content: "Yurishni odat qiling — 30 daqiqa kuniga", category: "jismoniy", emoji: "🚶", isActive:true },
//       ] };
//     }
//   }
// };

// /* ── COURSES ─────────────────────────────────────────── */
// export const courses = {
//   getAll:        ()             => get("/courses"),
//   getOne:        (id)           => get(`/courses/${id}`),
//   getLesson:     async (cId, lId) => {
//     try {
//       return await get(`/courses/${cId}/lessons/${lId}`);
//     } catch (err) {
//       console.warn("GET LESSON xatosi:", err.message);
//       // Mock lesson with navigation
//       return {
//         lesson: { _id: lId, title: "Dars sarlavhasi", content: "Dars mazmuni...", videoUrl: "https://youtube.com/embed/...", isCompleted: false },
//         navigation: {
//           current: 2,
//           total: 5,
//           prevLesson: { _id: "l1", title: "1-dars", duration: 10 },
//           nextLesson: { _id: "l3", title: "3-dars", duration: 12, isLocked: false, isCompleted: false }
//         }
//       };
//     }
//   },
//   completeLesson: async (cId, lId) => {
//     try {
//       return await post(`/courses/${cId}/lessons/${lId}/complete`);
//     } catch (err) {
//       console.warn("COMPLETE LESSON xatosi:", err.message);
//       return {
//         message: "Dars yakunlandi",
//         completedCount: 5,
//         courseCompleted: false,
//         nextLesson: { _id: "l3", title: "3-dars: Immunitet", duration: 12, isLocked: false, isCompleted: false }
//       };
//     }
//   },
// };

// /* ── TRACKER ─────────────────────────────────────────── */
// export const tracker = {
//   getToday:   () => get("/tracker/today"),
//   getCycles:  () => get("/tracker/cycles"),
//   startCycle: (startDate, cycleLength = 28, notes = "") => post("/tracker/cycles", { startDate, cycleLength, notes }),
//   updateCycle:(id, data) => patch(`/tracker/cycles/${id}`, data),
//   addSymptoms:(date, items, mood, painLevel, notes = "") => post("/tracker/symptoms", { date, items, mood, painLevel, notes }),
// };

// /* ── NOTIFICATIONS ───────────────────────────────────── */
// export const notifications = {
//   getAll:   ()   => get("/notifications"),
//   markRead: (id) => patch(`/notifications/${id}/read`),
//   readAll:  ()   => patch("/notifications/read-all"),
// };

// /* ── QNA (PUBLIC) ───────────────────────────────────── */
// export const qna = {
//   /** Anonim savol yuborish */
//   postQuestion: async (payload) => {
//     try {
//       return await post("/qna/questions", payload, false);
//     } catch (err) {
//       console.warn("QnA API xatosi:", err.message);
//       // Mock response (backend tayyor bo'lguniga qadar)
//       return { success: true, message: "Savol saqlandi", _id: Date.now(), ...payload };
//     }
//   },
//   /** Nashr qilingan savol-javoblar ro'yxati */
//   getPublic: async (params = {}) => {
//     try {
//       return await get(`/qna/public?${new URLSearchParams(params)}`, false);
//     } catch (err) {
//       console.warn("QnA PUBLIC API xatosi:", err.message);
//       // Mock response
//       return { qna: [], total: 0 };
//     }
//   },
//   /** Bitta nashr qilingan savol-javob */
//   getOnePublic: async (id) => {
//     try {
//       return await get(`/qna/public/${id}`, false);
//     } catch (err) {
//       console.warn("QnA GET ONE API xatosi:", err.message);
//       return { message: "Topilmadi" };
//     }
//   },
// };

// /* ── ADMIN · QNA ────────────────────────────────────── */
// // Admin API obyektiga ichki qna bo'limini qo'shamiz (back-compat saqlangan)
// export const admin = {
//   // Dashboard
//   stats:        async ()           => {
//     try { return await get("/admin/stats"); }
//     catch (err) { console.warn("ADMIN STATS xatosi:", err.message); return { stats: { usersCount: 123, coursesCount: 12, expiringProUsers: 5 } }; }
//   },
//   // Users
//   users:        async (params = {}) => {
//     try {
//       return await get(`/admin/users?${new URLSearchParams(params)}`);
//     } catch (err) {
//       console.warn("ADMIN USERS LIST xatosi:", err.message);
//       return { users: [ { _id: "u1", name: "Zuhra", email: "zuhra@example.com", isPro:true, proDaysLeft: 10, proExpired:false }, { _id: "u2", name: "Farida", email: "farida@example.com", isPro:false, proDaysLeft:0, proExpired:true } ], total:2 };
//     }
//   },
//   getUser:      async (id) => {
//     try {
//       return await get(`/admin/users/${id}`);
//     } catch (err) {
//       console.warn("ADMIN GET USER xatosi:", err.message);
//       return { user: { _id: id, name: "Test", email: "test@example.com", isPro:false, proDaysLeft:0, proExpired:true } };
//     }
//   },
//   setPro:       (id, isPro, months) => patch(`/admin/users/${id}/pro`, { isPro, months }),
//   blockUser:    (id, isBlocked)     => patch(`/admin/users/${id}/block`, { isBlocked }),
//   deleteUser:   (id)                => del(`/admin/users/${id}`),
//   notifyUser:   (id, data)          => post(`/admin/users/${id}/notify`, data),
//   // notifyAll:    (data)              => post("/qna/admin/notify-all", data),
//   broadcast:    (data)              => post("/admin/broadcast", data),
//   // Courses
//   courses:      ()                  => get("/admin/courses"),
//   createCourse: (data)              => post("/admin/courses", data),
//   updateCourse: (id, data)          => patch(`/admin/courses/${id}`, data),
//   deleteCourse: (id)                => del(`/admin/courses/${id}`),
//   // Lessons
//   lessons:      (cId)               => get(`/admin/courses/${cId}/lessons`),
//   createLesson: (cId, data)         => post(`/admin/courses/${cId}/lessons`, data),
//   updateLesson: (cId, lId, data)    => patch(`/admin/courses/${cId}/lessons/${lId}`, data),
//   deleteLesson: (cId, lId)          => del(`/admin/courses/${cId}/lessons/${lId}`),
//   // Seed
//   seed:         ()                  => post("/admin/seed"),
//   // QnA
//   qna: {
//     list:   async (params = {}) => {
//       try {
//         return await get(`/qna/admin/questions?${new URLSearchParams(params)}`);
//       } catch (err) {
//         console.warn("QnA LIST API xatosi:", err.message);
//         // Mock test data
//         return {
//           qna: [
//             { _id: "1", question: "Ayollar sog'ligini qanday saqlash kerak?", topic: "salomatlik", status: "answered", isPublished: true, answer: "Har kuni sport qilish va to'g'ri ovqatlanish muhim.", askedName: "Zuhra", askedBy: null, answeredBy: "admin", answeredAt: new Date(), createdAt: new Date() },
//             { _id: "2", question: "Siklning qanday davri xavflidir?", topic: "siklizm", status: "pending", isPublished: false, answer: null, askedName: "Farida", askedBy: null, answeredBy: null, answeredAt: null, createdAt: new Date(Date.now() - 86400000) },
//             { _id: "3", question: "Hor ayollar uchun nima kerak?", topic: "ginekoloji", status: "answered", isPublished: false, answer: "Doktor bilan mutazo.", askedName: null, askedBy: null, answeredBy: "admin", answeredAt: new Date(Date.now() - 172800000), createdAt: new Date(Date.now() - 259200000) },
//           ],
//           total: 3,
//         };
//       }
//     },
//     getOne: async (id) => {
//       try {
//         return await get(`/qna/admin/questions/${id}`);
//       } catch (err) {
//         console.warn("QnA GET API xatosi:", err.message);
//         return { _id: id, question: "Test savol", topic: "test", status: "pending", isPublished: false };
//       }
//     },
//     answer: async (id, data) => {
//       try {
//         return await patch(`/qna/admin/questions/${id}/answer`, data);
//       } catch (err) {
//         console.warn("QnA ANSWER API xatosi:", err.message);
//         return { success: true, message: "Javob saqlandi" };
//       }
//     },
//     publish: async (id, isPublished) => {
//       try {
//         return await patch(`/qna/admin/questions/${id}/publish`, { isPublished });
//       } catch (err) {
//         console.warn("QnA PUBLISH API xatosi:", err.message);
//         return { success: true, message: "Xolati o'zgartirildi" };
//       }
//     },
//     remove: async (id) => {
//       try {
//         return await del(`/qna/admin/questions/${id}`);
//       } catch (err) {
//         console.warn("QnA REMOVE API xatosi:", err.message);
//         return { success: true, message: "O'chirildi" };
//       }
//     },
//   },
//   // Tips management for admin
//   tips: {
//     list: async (params = {}) => {
//       try {
//         return await get(`/tips`);
//       } catch (err) {
//         console.warn("ADMIN TIPS LIST API xatosi:", err.message);
//         return { tips: [
//           { _id: "t1", content: "Kuniga 8 stakan suv iching", category: "sog'liq", emoji: "💧", isActive:true, publishDate:null },
//         ], total:1 };
//       }
//     },
//     create: async (data) => {
//       try { return await post(`/tips/admin/tips`, data); } catch (err) { console.warn("ADMIN TIPS CREATE xato:", err.message); return { success:true, tip: { _id: Date.now().toString(), ...data } }; }
//     },
//     update: async (id, data) => {
//       try { return await patch(`/tips/admin/tips/${id}`, data); } catch (err) { console.warn("ADMIN TIPS UPDATE xato:", err.message); return { success:true, tip: { _id:id, ...data } }; }
//     },  
//     remove: async (id) => {
//       try { return await del(`/tips/admin/tips/${id}`); } catch (err) { console.warn("ADMIN TIPS DELETE xato:", err.message); return { success:true }; }
//     }
//   },
// };

// /* ── HEALTH ──────────────────────────────────────────── */
// export const health = () => get("/health", false);

// /* ── Default export ──────────────────────────────────── */
// const qnaAnon = {
//   // checkAnswers: async (contact) => {
//   //   const res = await fetch(`/api/qna/anon/check?contact=${encodeURIComponent(contact)}`);
//   //   return await res.json();
//   // },
//   // Yangi endpoint: contact orqali barcha javoblarni olish
//   answers: async (contact) => {
//     const res = await fetch(`${BASE_URL}/qna/anon/answers?contact=${encodeURIComponent(contact)}`);
//     return await res.json();
//   },
// };
// const api = { auth, courses, tracker, notifications, admin, health, storage, qna, tips, qnaAnon };
// export default api;

// // After successfully answering a question:
// // await api.admin.qna.answer(questionId, { answer, isPublished: false });
// // Notify the user privately if not published
// // async function answerAndNotify(questionId, answer, askedBy) {
// //   await api.admin.qna.answer(questionId, { answer, isPublished: false });
// //   if (askedBy === null) {
// //     await api.admin.notifyUser(askedBy, {
// //       type: "qna_answer",
// //       questionId,
// //       answer,
// //       message: "Sizning savolingizga javob berildi!",
// //     });
// //   }
// // }
// // Usage:
// // answerAndNotify(q._id, javobMatni, q.askedBy);

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ══════════════════════════════════════════════════════════
   CACHE LAYER
   – In-memory store, TTL-based, key-based invalidation
   ══════════════════════════════════════════════════════════ */
const cache = {
  _store: new Map(),

  /** Yozish: key, value, ttl (millisekund) */
  set(key, value, ttl = 60_000) {
    this._store.set(key, { value, expiresAt: Date.now() + ttl });
  },

  /** O'qish: muddati o'tgan bo'lsa null qaytaradi */
  get(key) {
    const entry = this._store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) { this._store.delete(key); return null; }
    return entry.value;
  },

  /** Bitta key yoki prefix bilan boshlanuvchi barcha keylarni o'chirish */
  invalidate(keyOrPrefix) {
    for (const k of this._store.keys()) {
      if (k === keyOrPrefix || k.startsWith(keyOrPrefix)) {
        this._store.delete(k);
      }
    }
  },

  /** Hamma narsani tozalash */
  clear() { this._store.clear(); },
};

/* TTL konstantalari (ms) */
const TTL = {
  MINUTE:  60_000,
  MINUTES5: 300_000,
  MINUTES10: 600_000,
  HOUR:  3_600_000,
};

/* ── Storage ─────────────────────────────────────────── */
export const storage = {
  getToken:    ()  => localStorage.getItem("porla_token"),
  setToken:    (t) => localStorage.setItem("porla_token", t),
  getUser:     ()  => { try { return JSON.parse(localStorage.getItem("porla_user")); } catch { return null; } },
  setUser:     (u) => localStorage.setItem("porla_user", JSON.stringify(u)),
  clear:       ()  => { localStorage.removeItem("porla_token"); localStorage.removeItem("porla_user"); cache.clear(); },
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
  if (!res.ok) {
    const err = new Error(data.message || "So'rov muvaffaqiyatsiz");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/** multipart (video yuklash) — Content-Type ni qo'lda qo'yilmaydi */
async function sendForm(method, endpoint, formData) {
  const token = storage.getToken();
  if (!token) throw new Error("TOKEN_MISSING");
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (res.status === 401 && data.message?.includes("muddati")) {
    storage.clear(); window.location.reload();
    throw new Error(data.message);
  }
  if (!res.ok) {
    const err = new Error(data.message || "So'rov muvaffaqiyatsiz");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function appendLessonFormData(fd, data) {
  Object.entries(data).forEach(([k, v]) => {
    if (k === "video") return;
    if (v === undefined || v === null) return;
    fd.append(k, typeof v === "boolean" ? String(v) : String(v));
  });
}

const get   = (url, auth = true)       => request("GET",    url, null, auth);
const post  = (url, body, auth = true) => request("POST",   url, body, auth);
const patch = (url, body, auth = true) => request("PATCH",  url, body, auth);
const del   = (url, auth = true)       => request("DELETE", url, null, auth);

/**
 * Keshli GET: avval cache'dan o'qiydi, yo'q bo'lsa serverdan tortadi.
 * @param {string} key   - cache kaliti
 * @param {Function} fn  - ma'lumot qaytaruvchi async funksiya
 * @param {number} ttl   - yashash muddati (ms)
 */
async function cachedGet(key, fn, ttl = TTL.MINUTES5) {
  const hit = cache.get(key);
  if (hit !== null) return hit;
  const data = await fn();
  cache.set(key, data, ttl);
  return data;
}

/* ── AUTH ────────────────────────────────────────────── */
export const auth = {
  register: async (name, email, password) => {
    const d = await post("/auth/register", { name, email, password }, false);
    storage.setToken(d.token); storage.setUser(d.user);
    cache.invalidate("auth:me"); // yangi user → eski me cache bekor
    return d;
  },
  login: async (email, password) => {
    const d = await post("/auth/login", { email, password }, false);
    storage.setToken(d.token); storage.setUser(d.user);
    cache.invalidate("auth:me");
    return d;
  },
  logout: async () => {
    try { await post("/auth/logout"); } catch { /* ignore */ }
    storage.clear(); // cache.clear() ham ichida
  },
  me: async () => {
    return cachedGet("auth:me", async () => {
      try {
        return await get("/auth/me");
      } catch (err) {
        console.warn("AUTH ME API xatosi:", err.message);
        return { user: { _id: "u1", name: "Test User", email: "test@example.com", isPro: true, proDaysLeft: 12, proExpired: false } };
      }
    }, TTL.MINUTES10);
  },
  updateProfile: async (data) => {
    const res = await patch("/auth/update-profile", data);
    cache.invalidate("auth:me"); // profil o'zgardi → yangilash
    return res;
  },
  changePassword: async (cur, next) => {
    try {
      return await patch("/auth/change-password", { currentPassword: cur, newPassword: next });
    } catch (err) {
      if (err.message?.includes("Joriy parol")) throw new Error("Joriy parol noto'g'ri");
      throw new Error(err.message || "Parol o'zgartirishda xato");
    }
  },
};

/* ── TIPS (PUBLIC) ───────────────────────────────────── */
export const tips = {
  getToday: async () => {
    return cachedGet("tips:today", async () => {
      try {
        return await get("/tips/today", false);
      } catch (err) {
        console.warn("TIPS TODAY API xatosi:", err.message);
        return { tip: { _id: "t1", content: "Kuniga 8 stakan suv iching", category: "sog'liq", emoji: "💧" } };
      }
    }, TTL.HOUR); // kunlik tip — 1 soat kesh
  },

  getAll: async () => {
    return cachedGet("tips:all", async () => {
      try {
        return await get("/tips", false);
      } catch (err) {
        console.warn("TIPS LIST API xatosi:", err.message);
        return { tips: [
          { _id: "t1", content: "Kuniga 8 stakan suv iching", category: "sog'liq", emoji: "💧", isActive: true },
          { _id: "t2", content: "Yurishni odat qiling — 30 daqiqa kuniga", category: "jismoniy", emoji: "🚶", isActive: true },
        ] };
      }
    }, TTL.MINUTES10);
  },
};

/* ── COURSES ─────────────────────────────────────────── */
export const courses = {
  getAll: async () => {
    return cachedGet("courses:all", () => get("/courses"), TTL.MINUTES10);
  },

  getOne: async (id) => {
    return cachedGet(`courses:${id}`, () => get(`/courses/${id}`), TTL.MINUTES10);
  },

  getLesson: async (cId, lId) => {
    return cachedGet(`lessons:${cId}:${lId}`, async () => {
      try {
        return await get(`/courses/${cId}/lessons/${lId}`);
      } catch (err) {
        console.warn("GET LESSON xatosi:", err.message);
        return {
          lesson: { _id: lId, title: "Dars sarlavhasi", content: "Dars mazmuni...", videoUrl: "https://youtube.com/embed/...", isCompleted: false },
          navigation: {
            current: 2, total: 5,
            prevLesson: { _id: "l1", title: "1-dars", duration: 10 },
            nextLesson: { _id: "l3", title: "3-dars", duration: 12, isLocked: false, isCompleted: false },
          },
        };
      }
    }, TTL.MINUTES5);
  },

  completeLesson: async (cId, lId) => {
    try {
      const res = await post(`/courses/${cId}/lessons/${lId}/complete`);
      // Dars tugagach → o'sha dars va kurs keshlari bekor
      cache.invalidate(`lessons:${cId}:${lId}`);
      cache.invalidate(`courses:${cId}`);
      cache.invalidate("courses:all");
      return res;
    } catch (err) {
      console.warn("COMPLETE LESSON xatosi:", err.message);
      return {
        message: "Dars yakunlandi", completedCount: 5, courseCompleted: false,
        nextLesson: { _id: "l3", title: "3-dars: Immunitet", duration: 12, isLocked: false, isCompleted: false },
      };
    }
  },
};

/* ── TRACKER ─────────────────────────────────────────── */
export const tracker = {
  getToday: async () => {
    return cachedGet("tracker:today", () => get("/tracker/today"), TTL.MINUTE);
  },

  getCycles: async () => {
    return cachedGet("tracker:cycles", () => get("/tracker/cycles"), TTL.MINUTES5);
  },

  startCycle: async (startDate, cycleLength = 28, notes = "") => {
    const res = await post("/tracker/cycles", { startDate, cycleLength, notes });
    cache.invalidate("tracker:"); // barcha tracker keshlarini bekor qil
    return res;
  },

  updateCycle: async (id, data) => {
    const res = await patch(`/tracker/cycles/${id}`, data);
    cache.invalidate("tracker:");
    return res;
  },

  addSymptoms: async (date, items, mood, painLevel, notes = "") => {
    const res = await post("/tracker/symptoms", { date, items, mood, painLevel, notes });
    cache.invalidate("tracker:today");
    cache.invalidate("tracker:cycles");
    return res;
  },
};

/* ── NOTIFICATIONS ───────────────────────────────────── */
export const notifications = {
  getAll: async () => {
    return cachedGet("notifications:all", () => get("/notifications"), TTL.MINUTE);
  },

  markRead: async (id) => {
    const res = await patch(`/notifications/${id}/read`);
    cache.invalidate("notifications:all");
    return res;
  },

  readAll: async () => {
    const res = await patch("/notifications/read-all");
    cache.invalidate("notifications:all");
    return res;
  },
};

/* ── QNA (PUBLIC) ───────────────────────────────────── */
export const qna = {
  postQuestion: async (payload) => {
    try {
      const res = await post("/qna/questions", payload, false);
      cache.invalidate("qna:public"); // yangi savol → public ro'yxat yangilanishi mumkin
      return res;
    } catch (err) {
      console.warn("QnA API xatosi:", err.message);
      return { success: true, message: "Savol saqlandi", _id: Date.now(), ...payload };
    }
  },

  getPublic: async (params = {}) => {
    const key = `qna:public:${new URLSearchParams(params).toString()}`;
    return cachedGet(key, async () => {
      try {
        return await get(`/qna/public?${new URLSearchParams(params)}`, false);
      } catch (err) {
        console.warn("QnA PUBLIC API xatosi:", err.message);
        return { qna: [], total: 0 };
      }
    }, TTL.MINUTES5);
  },

  getOnePublic: async (id) => {
    return cachedGet(`qna:public:${id}`, async () => {
      try {
        return await get(`/qna/public/${id}`, false);
      } catch (err) {
        console.warn("QnA GET ONE API xatosi:", err.message);
        return { message: "Topilmadi" };
      }
    }, TTL.MINUTES5);
  },
};

/* ── ADMIN ──────────────────────────────────────────── */
export const admin = {
  stats: async () => {
    return cachedGet("admin:stats", async () => {
      try { return await get("/admin/stats"); }
      catch (err) {
        console.warn("ADMIN STATS xatosi:", err.message);
        return { stats: { usersCount: 123, coursesCount: 12, expiringProUsers: 5 } };
      }
    }, TTL.MINUTES5);
  },

  users: async (params = {}) => {
    const key = `admin:users:${new URLSearchParams(params).toString()}`;
    return cachedGet(key, async () => {
      try {
        return await get(`/admin/users?${new URLSearchParams(params)}`);
      } catch (err) {
        console.warn("ADMIN USERS LIST xatosi:", err.message);
        return { users: [
          { _id: "u1", name: "Zuhra", email: "zuhra@example.com", isPro: true, proDaysLeft: 10, proExpired: false },
          { _id: "u2", name: "Farida", email: "farida@example.com", isPro: false, proDaysLeft: 0, proExpired: true },
        ], total: 2 };
      }
    }, TTL.MINUTES5);
  },

  getUser: async (id) => {
    return cachedGet(`admin:user:${id}`, async () => {
      try {
        return await get(`/admin/users/${id}`);
      } catch (err) {
        console.warn("ADMIN GET USER xatosi:", err.message);
        return { user: { _id: id, name: "Test", email: "test@example.com", isPro: false, proDaysLeft: 0, proExpired: true } };
      }
    }, TTL.MINUTES5);
  },

  setPro: async (id, isPro, months) => {
    const res = await patch(`/admin/users/${id}/pro`, { isPro, months });
    cache.invalidate(`admin:user:${id}`);
    cache.invalidate("admin:users:");
    cache.invalidate("admin:stats");
    cache.invalidate("auth:me"); // agar o'zi bo'lsa
    return res;
  },

  blockUser: async (id, isBlocked) => {
    const res = await patch(`/admin/users/${id}/block`, { isBlocked });
    cache.invalidate(`admin:user:${id}`);
    cache.invalidate("admin:users:");
    return res;
  },

  deleteUser: async (id) => {
    const res = await del(`/admin/users/${id}`);
    cache.invalidate(`admin:user:${id}`);
    cache.invalidate("admin:users:");
    cache.invalidate("admin:stats");
    return res;
  },

  notifyUser:  (id, data) => post(`/admin/users/${id}/notify`, data),
  broadcast:   (data)     => post("/admin/broadcast", data),

  // Courses
  courses: async () => {
    return cachedGet("admin:courses", () => get("/admin/courses"), TTL.MINUTES5);
  },

  createCourse: async (data) => {
    const res = await post("/admin/courses", data);
    cache.invalidate("admin:courses");
    cache.invalidate("courses:all");
    cache.invalidate("admin:stats");
    return res;
  },

  updateCourse: async (id, data) => {
    const res = await patch(`/admin/courses/${id}`, data);
    cache.invalidate("admin:courses");
    cache.invalidate(`courses:${id}`);
    cache.invalidate("courses:all");
    return res;
  },

  deleteCourse: async (id) => {
    const res = await del(`/admin/courses/${id}`);
    cache.invalidate("admin:courses");
    cache.invalidate(`courses:${id}`);
    cache.invalidate("courses:all");
    cache.invalidate("admin:stats");
    return res;
  },

  // Lessons
  lessons: async (cId) => {
    return cachedGet(`admin:lessons:${cId}`, () => get(`/admin/courses/${cId}/lessons`), TTL.MINUTES5);
  },

  createLesson: async (cId, data) => {
    let res;
    if (data.video instanceof File) {
      const fd = new FormData();
      fd.append("video", data.video);
      appendLessonFormData(fd, data);
      res = await sendForm("POST", `/admin/courses/${cId}/lessons`, fd);
    } else {
      const { video: _v, ...json } = data;
      res = await post(`/admin/courses/${cId}/lessons`, json);
    }
    cache.invalidate(`admin:lessons:${cId}`);
    cache.invalidate(`courses:${cId}`);
    cache.invalidate("courses:all");
    return res;
  },

  updateLesson: async (cId, lId, data) => {
    let res;
    if (data.video instanceof File) {
      const fd = new FormData();
      fd.append("video", data.video);
      appendLessonFormData(fd, data);
      res = await sendForm("PATCH", `/admin/courses/${cId}/lessons/${lId}`, fd);
    } else {
      const { video: _v, ...json } = data;
      res = await patch(`/admin/courses/${cId}/lessons/${lId}`, json);
    }
    cache.invalidate(`admin:lessons:${cId}`);
    cache.invalidate(`lessons:${cId}:${lId}`);
    cache.invalidate(`courses:${cId}`);
    return res;
  },

  deleteLesson: async (cId, lId) => {
    const res = await del(`/admin/courses/${cId}/lessons/${lId}`);
    cache.invalidate(`admin:lessons:${cId}`);
    cache.invalidate(`lessons:${cId}:${lId}`);
    cache.invalidate(`courses:${cId}`);
    cache.invalidate("courses:all");
    return res;
  },

  seed: async () => {
    const res = await post("/admin/seed");
    cache.clear(); // seed → hamma narsani qayta yukla
    return res;
  },

  // QnA
  qna: {
    list: async (params = {}) => {
      const key = `admin:qna:${new URLSearchParams(params).toString()}`;
      return cachedGet(key, async () => {
        try {
          return await get(`/qna/admin/questions?${new URLSearchParams(params)}`);
        } catch (err) {
          console.warn("QnA LIST API xatosi:", err.message);
          return {
            qna: [
              { _id: "1", question: "Ayollar sog'ligini qanday saqlash kerak?", topic: "salomatlik", status: "answered", isPublished: true, answer: "Har kuni sport qilish va to'g'ri ovqatlanish muhim.", askedName: "Zuhra", askedBy: null, answeredBy: "admin", answeredAt: new Date(), createdAt: new Date() },
              { _id: "2", question: "Siklning qanday davri xavflidir?", topic: "siklizm", status: "pending", isPublished: false, answer: null, askedName: "Farida", askedBy: null, answeredBy: null, answeredAt: null, createdAt: new Date(Date.now() - 86400000) },
              { _id: "3", question: "Hor ayollar uchun nima kerak?", topic: "ginekoloji", status: "answered", isPublished: false, answer: "Doktor bilan mutazo.", askedName: null, askedBy: null, answeredBy: "admin", answeredAt: new Date(Date.now() - 172800000), createdAt: new Date(Date.now() - 259200000) },
            ],
            total: 3,
          };
        }
      }, TTL.MINUTE); // admin qna — tez-tez o'zgarishi mumkin
    },

    getOne: async (id) => {
      return cachedGet(`admin:qna:item:${id}`, async () => {
        try {
          return await get(`/qna/admin/questions/${id}`);
        } catch (err) {
          console.warn("QnA GET API xatosi:", err.message);
          return { _id: id, question: "Test savol", topic: "test", status: "pending", isPublished: false };
        }
      }, TTL.MINUTES5);
    },

    answer: async (id, data) => {
      try {
        const res = await patch(`/qna/admin/questions/${id}/answer`, data);
        cache.invalidate(`admin:qna:item:${id}`);
        cache.invalidate("admin:qna:");      // barcha admin qna listlar
        cache.invalidate("qna:public");     // publish bo'lishi mumkin
        return res;
      } catch (err) {
        console.warn("QnA ANSWER API xatosi:", err.message);
        return { success: true, message: "Javob saqlandi" };
      }
    },

    publish: async (id, isPublished) => {
      try {
        const res = await patch(`/qna/admin/questions/${id}/publish`, { isPublished });
        cache.invalidate(`admin:qna:item:${id}`);
        cache.invalidate("admin:qna:");
        cache.invalidate("qna:public");     // public ko'rinish o'zgaradi
        return res;
      } catch (err) {
        console.warn("QnA PUBLISH API xatosi:", err.message);
        return { success: true, message: "Xolati o'zgartirildi" };
      }
    },

    remove: async (id) => {
      try {
        const res = await del(`/qna/admin/questions/${id}`);
        cache.invalidate(`admin:qna:item:${id}`);
        cache.invalidate("admin:qna:");
        cache.invalidate("qna:public");
        return res;
      } catch (err) {
        console.warn("QnA REMOVE API xatosi:", err.message);
        return { success: true, message: "O'chirildi" };
      }
    },
  },

  // Tips
  tips: {
    list: async (_params = {}) => {
      return cachedGet("admin:tips", async () => {
        try {
          return await get("/tips");
        } catch (err) {
          console.warn("ADMIN TIPS LIST API xatosi:", err.message);
          return { tips: [
            { _id: "t1", content: "Kuniga 8 stakan suv iching", category: "sog'liq", emoji: "💧", isActive: true, publishDate: null },
          ], total: 1 };
        }
      }, TTL.MINUTES5);
    },

    create: async (data) => {
      try {
        const res = await post("/tips/admin/tips", data);
        cache.invalidate("admin:tips");
        cache.invalidate("tips:");
        return res;
      } catch (err) {
        console.warn("ADMIN TIPS CREATE xato:", err.message);
        return { success: true, tip: { _id: Date.now().toString(), ...data } };
      }
    },

    update: async (id, data) => {
      try {
        const res = await patch(`/tips/admin/tips/${id}`, data);
        cache.invalidate("admin:tips");
        cache.invalidate("tips:");
        return res;
      } catch (err) {
        console.warn("ADMIN TIPS UPDATE xato:", err.message);
        return { success: true, tip: { _id: id, ...data } };
      }
    },

    remove: async (id) => {
      try {
        const res = await del(`/tips/admin/tips/${id}`);
        cache.invalidate("admin:tips");
        cache.invalidate("tips:");
        return res;
      } catch (err) {
        console.warn("ADMIN TIPS DELETE xato:", err.message);
        return { success: true };
      }
    },
  },
};

/* ── HEALTH ──────────────────────────────────────────── */
export const health = () => get("/health", false);

/* ── Anon QnA ────────────────────────────────────────── */
const qnaAnon = {
  answers: async (contact) => {
    // Anon javoblar — keshsiz (personal + real-time)
    const res = await fetch(`${BASE_URL}/qna/anon/answers?contact=${encodeURIComponent(contact)}`);
    return await res.json();
  },
};

/* ── Cache utility (tashqaridan ham boshqarish uchun) ── */
export { cache };

/* ── Default export ──────────────────────────────────── */
const api = { auth, courses, tracker, notifications, admin, health, storage, qna, tips, qnaAnon, cache };
export default api;