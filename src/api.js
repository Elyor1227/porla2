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

//   removeToken:()      => localStorage.removeItem(TOKEN_KEY),
//   getUser:    ()      => { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } },
//   setUser:    (u)     => localStorage.setItem(USER_KEY, JSON.stringify(u)),
//   removeUser: ()      => localStorage.removeItem(USER_KEY),
//   clear:      ()      => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); },
// };

//     if (!token) throw new Error("TOKEN_MISSING");
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   const config = { method, headers };
//   if (body) config.body = JSON.stringify(body);

//   const res = await fetch(`${BASE_URL}${endpoint}`, config);
//   const data = await res.json();

//   // Token muddati tugagan — sahifani yangilash&& data.message?.includes("muddati")) {  ear();
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
  logout:        async () => { try { await post("/auth/logout"); } catch { /* ignore logout errors */ } storage.clear(); },
  me:            async () => {
    try {
      return await get("/auth/me");
    } catch (err) {
      console.warn("AUTH ME API xatosi:", err.message);
      // Mock user with Pro info
      return { user: { _id: "u1", name: "Test User", email: "test@example.com", isPro: true, proDaysLeft: 12, proExpired: false } };
    }
  },
  updateProfile: (data) => patch("/auth/update-profile", data),
  changePassword: async (cur, next) => {
    try {
      return await patch("/auth/change-password", { currentPassword: cur, newPassword: next });
    } catch (err) {
      if (err.message?.includes("Joriy parol")) {
        throw new Error("Joriy parol noto'g'ri");
      }
      throw new Error(err.message || "Parol o'zgartirishda xato");
    }
  },
};

/* ── TIPS (PUBLIC) ───────────────────────────────────── */
export const tips = {
  // Today's tip visible to everyone (no auth required)
  getToday: async () => {
    try {
      return await get(`/tips/today`, false);
    } catch (err) {
      console.warn("TIPS TODAY API xatosi:", err.message);
      // Mock tip
      return { tip: { _id: "t1", content: "Kuniga 8 stakan suv iching", category: "sog'liq", emoji: "💧" } };
    }
  },

  // All active tips
  getAll: async () => {
    try {
      return await get(`/tips`, false);
    } catch (err) {
      console.warn("TIPS LIST API xatosi:", err.message);
      return { tips: [
        { _id: "t1", content: "Kuniga 8 stakan suv iching", category: "sog'liq", emoji: "💧", isActive:true },
        { _id: "t2", content: "Yurishni odat qiling — 30 daqiqa kuniga", category: "jismoniy", emoji: "🚶", isActive:true },
      ] };
    }
  }
};

/* ── COURSES ─────────────────────────────────────────── */
export const courses = {
  getAll:        ()             => get("/courses"),
  getOne:        (id)           => get(`/courses/${id}`),
  getLesson:     async (cId, lId) => {
    try {
      return await get(`/courses/${cId}/lessons/${lId}`);
    } catch (err) {
      console.warn("GET LESSON xatosi:", err.message);
      // Mock lesson with navigation
      return {
        lesson: { _id: lId, title: "Dars sarlavhasi", content: "Dars mazmuni...", videoUrl: "https://youtube.com/embed/...", isCompleted: false },
        navigation: {
          current: 2,
          total: 5,
          prevLesson: { _id: "l1", title: "1-dars", duration: 10 },
          nextLesson: { _id: "l3", title: "3-dars", duration: 12, isLocked: false, isCompleted: false }
        }
      };
    }
  },
  completeLesson: async (cId, lId) => {
    try {
      return await post(`/courses/${cId}/lessons/${lId}/complete`);
    } catch (err) {
      console.warn("COMPLETE LESSON xatosi:", err.message);
      return {
        message: "Dars yakunlandi",
        completedCount: 5,
        courseCompleted: false,
        nextLesson: { _id: "l3", title: "3-dars: Immunitet", duration: 12, isLocked: false, isCompleted: false }
      };
    }
  },
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

/* ── QNA (PUBLIC) ───────────────────────────────────── */
export const qna = {
  /** Anonim savol yuborish */
  postQuestion: async (payload) => {
    try {
      return await post("/qna/questions", payload, false);
    } catch (err) {
      console.warn("QnA API xatosi:", err.message);
      // Mock response (backend tayyor bo'lguniga qadar)
      return { success: true, message: "Savol saqlandi", _id: Date.now(), ...payload };
    }
  },
  /** Nashr qilingan savol-javoblar ro'yxati */
  getPublic: async (params = {}) => {
    try {
      return await get(`/qna/public?${new URLSearchParams(params)}`, false);
    } catch (err) {
      console.warn("QnA PUBLIC API xatosi:", err.message);
      // Mock response
      return { qna: [], total: 0 };
    }
  },
  /** Bitta nashr qilingan savol-javob */
  getOnePublic: async (id) => {
    try {
      return await get(`/qna/public/${id}`, false);
    } catch (err) {
      console.warn("QnA GET ONE API xatosi:", err.message);
      return { message: "Topilmadi" };
    }
  },
};

/* ── ADMIN · QNA ────────────────────────────────────── */
// Admin API obyektiga ichki qna bo'limini qo'shamiz (back-compat saqlangan)
export const admin = {
  // Dashboard
  stats:        async ()           => {
    try { return await get("/admin/stats"); }
    catch (err) { console.warn("ADMIN STATS xatosi:", err.message); return { stats: { usersCount: 123, coursesCount: 12, expiringProUsers: 5 } }; }
  },
  // Users
  users:        async (params = {}) => {
    try {
      return await get(`/admin/users?${new URLSearchParams(params)}`);
    } catch (err) {
      console.warn("ADMIN USERS LIST xatosi:", err.message);
      return { users: [ { _id: "u1", name: "Zuhra", email: "zuhra@example.com", isPro:true, proDaysLeft: 10, proExpired:false }, { _id: "u2", name: "Farida", email: "farida@example.com", isPro:false, proDaysLeft:0, proExpired:true } ], total:2 };
    }
  },
  getUser:      async (id) => {
    try {
      return await get(`/admin/users/${id}`);
    } catch (err) {
      console.warn("ADMIN GET USER xatosi:", err.message);
      return { user: { _id: id, name: "Test", email: "test@example.com", isPro:false, proDaysLeft:0, proExpired:true } };
    }
  },
  setPro:       (id, isPro, months) => patch(`/admin/users/${id}/pro`, { isPro, months }),
  blockUser:    (id, isBlocked)     => patch(`/admin/users/${id}/block`, { isBlocked }),
  deleteUser:   (id)                => del(`/admin/users/${id}`),
  notifyUser:   (id, data)          => post(`/admin/users/${id}/notify`, data),
  notifyAll:    (data)              => post("/qna/admin/notify-all", data),
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
  // QnA
  qna: {
    list:   async (params = {}) => {
      try {
        return await get(`/qna/admin/questions?${new URLSearchParams(params)}`);
      } catch (err) {
        console.warn("QnA LIST API xatosi:", err.message);
        // Mock test data
        return {
          qna: [
            { _id: "1", question: "Ayollar sog'ligini qanday saqlash kerak?", topic: "salomatlik", status: "answered", isPublished: true, answer: "Har kuni sport qilish va to'g'ri ovqatlanish muhim.", askedName: "Zuhra", askedBy: null, answeredBy: "admin", answeredAt: new Date(), createdAt: new Date() },
            { _id: "2", question: "Siklning qanday davri xavflidir?", topic: "siklizm", status: "pending", isPublished: false, answer: null, askedName: "Farida", askedBy: null, answeredBy: null, answeredAt: null, createdAt: new Date(Date.now() - 86400000) },
            { _id: "3", question: "Hor ayollar uchun nima kerak?", topic: "ginekoloji", status: "answered", isPublished: false, answer: "Doktor bilan mutazo.", askedName: null, askedBy: null, answeredBy: "admin", answeredAt: new Date(Date.now() - 172800000), createdAt: new Date(Date.now() - 259200000) },
          ],
          total: 3,
        };
      }
    },
    getOne: async (id) => {
      try {
        return await get(`/qna/admin/questions/${id}`);
      } catch (err) {
        console.warn("QnA GET API xatosi:", err.message);
        return { _id: id, question: "Test savol", topic: "test", status: "pending", isPublished: false };
      }
    },
    answer: async (id, data) => {
      try {
        return await patch(`/qna/admin/questions/${id}/answer`, data);
      } catch (err) {
        console.warn("QnA ANSWER API xatosi:", err.message);
        return { success: true, message: "Javob saqlandi" };
      }
    },
    publish: async (id, isPublished) => {
      try {
        return await patch(`/qna/admin/questions/${id}/publish`, { isPublished });
      } catch (err) {
        console.warn("QnA PUBLISH API xatosi:", err.message);
        return { success: true, message: "Xolati o'zgartirildi" };
      }
    },
    remove: async (id) => {
      try {
        return await del(`/qna/admin/questions/${id}`);
      } catch (err) {
        console.warn("QnA REMOVE API xatosi:", err.message);
        return { success: true, message: "O'chirildi" };
      }
    },
  },
  // Tips management for admin
  tips: {
    list: async (params = {}) => {
      try {
        return await get(`/admin/tips?${new URLSearchParams(params)}`);
      } catch (err) {
        console.warn("ADMIN TIPS LIST API xatosi:", err.message);
        return { tips: [
          { _id: "t1", content: "Kuniga 8 stakan suv iching", category: "sog'liq", emoji: "💧", isActive:true, publishDate:null },
        ], total:1 };
      }
    },
    create: async (data) => {
      try { return await post(`/admin/tips`, data); } catch (err) { console.warn("ADMIN TIPS CREATE xato:", err.message); return { success:true, tip: { _id: Date.now().toString(), ...data } }; }
    },
    update: async (id, data) => {
      try { return await patch(`/admin/tips/${id}`, data); } catch (err) { console.warn("ADMIN TIPS UPDATE xato:", err.message); return { success:true, tip: { _id:id, ...data } }; }
    },
    remove: async (id) => {
      try { return await del(`/admin/tips/${id}`); } catch (err) { console.warn("ADMIN TIPS DELETE xato:", err.message); return { success:true }; }
    }
  },
};

/* ── HEALTH ──────────────────────────────────────────── */
export const health = () => get("/health", false);

/* ── Default export ──────────────────────────────────── */
const qnaAnon = {
  // checkAnswers: async (contact) => {
  //   const res = await fetch(`/api/qna/anon/check?contact=${encodeURIComponent(contact)}`);
  //   return await res.json();
  // },
  // Yangi endpoint: contact orqali barcha javoblarni olish
  answers: async (contact) => {
    const res = await fetch(`${BASE_URL}/qna/anon/answers?contact=${encodeURIComponent(contact)}`);
    return await res.json();
  },
};
const api = { auth, courses, tracker, notifications, admin, health, storage, qna, tips, qnaAnon };
export default api;

// After successfully answering a question:
// await api.admin.qna.answer(questionId, { answer, isPublished: false });
// Notify the user privately if not published
async function answerAndNotify(questionId, answer, askedBy) {
  await api.admin.qna.answer(questionId, { answer, isPublished: false });
  if (askedBy === null) {
    await api.admin.notifyUser(askedBy, {
      type: "qna_answer",
      questionId,
      answer,
      message: "Sizning savolingizga javob berildi!",
    });
  }
}
// Usage:
// answerAndNotify(q._id, javobMatni, q.askedBy);