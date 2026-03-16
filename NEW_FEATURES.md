# 🌟 Yangi xususiyatlar — 2026-03-16

Quyidagi yangi API lar va UI qo'shildi:

## 1. 💡 Kunlik maslahatlar (Daily Tips)

### Frontend (Foydalanuvchi tomonida)
- **Qayerda**: Home sahifasida "Kunlik maslahat" kartasi ko'rinadi
- **Component**: `src/DailyTip.jsx` — barcha foydalanuvchilar uchun bugungi maslahatni ko'rsatadi
- **API call**: `api.tips.getToday()` — `/api/tips/today` (token shart emas)

Mock response:
```json
{
  "tip": {
    "_id": "...",
    "content": "Kuniga 8 stakan suv iching",
    "category": "sog'liq",
    "emoji": "💧"
  }
}
```

### Admin tomonida
- **Qayerda**: Admin paneli → "Maslahatlar" (💡) tab
- **Amallari**: 
  - ✅ Barcha maslahatlar ro'yxati (+ pagination)
  - ✅ Yangi maslahat qo'shish
  - ✅ Maslahatni tahrirlash (edit)
  - ✅ Maslahatni o'chirish
  - ✅ Kategoriya tanla (sog'liq / ovqatlanish / jismoniy / ruhiy / sikl / umumiy)
  - ✅ Emoji tanlash
  - ✅ Chiqarilish sanasi o'rnatish (ixtiyoriy)
  - ✅ Faol/O'chiq xolat

API endpoints (mocks ishchi):
```
GET  /api/admin/tips                  — barcha maslahatlar
POST /api/admin/tips                  — yangi qo'shish
PATCH /api/admin/tips/:id            — tahrir
DELETE /api/admin/tips/:id           — o'chirish
```

---

## 2. 👑 Premium (Pro) muddati o'zgarishlari

### Foydalanuvchi tomonida (`/api/auth/me`)
Response endi quyidagilarni o'z ichiga oladi:
```json
{
  "user": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "isPro": true,
    "proDaysLeft": 12,      // ← yangi
    "proExpired": false     // ← yangi
  }
}
```

**Profil sahifasida** Pro tugash muddatini ko'rsatish mumkin.

### Admin tomonida

#### 1. Foydalanuvchilar ro'yxati (`GET /api/admin/users`)
```json
{
  "users": [
    {
      "_id": "...",
      "name": "Zuhra",
      "email": "zuhra@example.com",
      "isPro": true,
      "proDaysLeft": 10,      // ← yangi
      "proExpired": false     // ← yangi
    }
  ]
}
```

#### 2. Bitta foydalanuvchi (`GET /api/admin/users/:id`)
Xuddi shunday `proDaysLeft` va `proExpired` maydonlari qaytaradi.

#### 3. Dashboard statistikasi (`GET /api/admin/stats`)
```json
{
  "stats": {
    "usersCount": 123,
    "coursesCount": 12,
    "expiringProUsers": 5    // ← yangi: 7 kun ichida muddati tugaydigan Pro foydalanuvchilar
  }
}
```

---

## 3. 📢 Nashr qilingan savollar → Xabarlar

### Jarayon
1. Admin "Savol-javoblar" bo'limida savolga **javob yozadi** va **"E'lon" tugmasini bosadi**.
2. Avtomatik ravishda `adminApi.broadcast()` chaqiriladi (savol + javob mazmuni).
3. Broadcast **foydalanuvchilarning "Xabarlar" sahifasida** ko'rinadi (agar backend `/admin/broadcast` ni notifications-ga aylantirsa).

**Frontend o'zgarishlari:**
- `src/porla-admin.jsx` — `handlePublish()` da broadcast yaratish qo'shildi
- `src/porla-web-updated.jsx` — `Notifications` ekran turli response formatlarni qabul qiladi (`d.notifications` | `d.items` | `d.data`)

---

## 🔧 API Mocks (Backend tayyor bo'lguniga qadar)

Barcha yangi endpointlar **mock javoblar** bilan taqdim etilgan, shuning uchun:
- Backend siz amalga oshirayotganida frontend ishlaydi.
- Backend API ready bo'lganida, frontend o'zgartirishsiz ishlayveradi.

### Mock bilan ishlash
```javascript
// src/api.js

// Tips
api.tips.getToday()          // Mock: { tip: { content: "...", emoji: "💧" } }
api.tips.getAll()            // Mock: { tips: [...] }

// Admin Tips
admin.tips.list()            // Mock: { tips: [...] }
admin.tips.create(data)      // Mock: { success: true, tip: {...} }
admin.tips.update(id, data)  // Mock: { success: true, tip: {...} }
admin.tips.remove(id)        // Mock: { success: true }

// Admin Users (Pro info qo'shildi)
admin.users()                // Mock users qo'shildi proDaysLeft/proExpired
admin.getUser(id)            // Mock user qo'shildi proDaysLeft/proExpired

// Admin Stats (expiringProUsers qo'shildi)
admin.stats()                // Mock: { stats: { expiringProUsers: 5, ... } }
```

---

## 🚀 Test qilish

### 1. Loyihani ishga tushiring
```powershell
cd "c:\Users\Adm1n\OneDrive\Рабочий стол\porla-backend"
npm run dev
```

### 2. Foydalanuvchi sifatida
- App-ga kirish yoki bepul rejimda qarang.
- **Home sahifasiga o'tish** → "Kunlik maslahat" kartasini ko'rsatadi (mock: 💧 "Kuniga 8 stakan suv iching").

### 3. Admin sifatida
- Admin panelga kirish (`/admin`).
- **"Maslahatlar" (💡) tab** ni tanlang.
- ✅ Maslahatlarni ko'ring (mock data)
- ✅ "Yangi maslahat" tugmasini bosing
- ✅ Matn, kategoriya, emoji, sana qo'shib saqlang
- ✅ Tahrirlash va o'chirish imkoniyatini test qiling.

### 4. QnA → Broadcast
- Admin → "Savol-javoblar" → bir savolga javob yozing → **"E'lon" tugmasini bosing**.
- Console-da broadcast chaqirilganini ko'rsatadi (mock).
- Haqiqiy backend-da u "Xabarlar" sahifasida ko'rinadi.

---

## 📝 Kodlar qayerda

| Feature | File |
|---------|------|
| Tips API | `src/api.js` |
| Daily Tip Component | `src/DailyTip.jsx` |
| Home Screen (Daily Tip renders) | `src/porla-web-updated.jsx` |
| Admin Tips UI | `src/porla-admin.jsx` (TipsAdmin function) |
| Admin Menu + Routing | `src/porla-admin.jsx` (ADMIN_MENU, screens) |
| QnA → Broadcast | `src/porla-admin.jsx` (handlePublish) |
| Notifications parsing | `src/porla-web-updated.jsx` |

---

## ⚠️ Backend tayyorlanashi kerak

Quyidaglar hali backend-da amalga oshirilmagan bo'lishi mumkin. Agar kerak bo'lsa, qo'shish mumkin:

1. **Tips endpoints** (`/api/tips`, `/api/admin/tips/*`)
   - `/tips/today` — bugungi maslahatni qaytarish
   - `/admin/tips` — CRUD operatsiyalar
   - PublishDate asosan rotation

2. **Pro expiry management**
   - `auth.me()` → `proDaysLeft`, `proExpired` qaytarish
   - Token har so'rovda tekshirish va expired bo'lsa auto-off
   - Notification yuborish muddat tugashidan 3-7 kun oldin

3. **Broadcast → Notifications**
   - `/admin/broadcast` POST qilganda, notifications jadvaliga yozish
   - `/notifications` GET qilganda, broadcastlarni ham qaytarish

4. **Admin stats**
   - `expiringProUsers` hisoblash (7 kun ichida)

---

## ✅ Tayyor!

Hozir frontend-da:
- ✅ Daily tips qo'shildi
- ✅ Admin tips UI tayyor
- ✅ Pro expiry fields mock
- ✅ QnA publish → broadcast
- ✅ Notifications turli format qabul qiladi

Backend: API endpoints amalga oshirilsa, hammasi ishlayveradi! 🎉
