import React from 'react'

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: '100vh', background: '#fdf8f5', fontFamily: 'system-ui, sans-serif', color: '#4a2535' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #e8a0a0 0%, #c56a81 100%)', color: 'white', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>Maxfiylik Siyosati</h1>
        <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>Oxirgi yangilash: 2026-yil 9-sentabr</p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>1. Umumiy Ma'lumot</h2>
          <p>
            Miila ("Dastur", "Biz", "Bizning") sizning maxfiyligingizni juda muhim deb hisoblaydi. Ushbu Maxfiylik Siyosati sizga tushuntiradiki, biz qanday tarzda ma'lumot to'playmiz, ishlatamiz va himoya qilamiz.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>2. To'playdigan Ma'lumotlar</h2>
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>Hisobiy ma'lumotlar:</strong> ism, elektron pochta, telefon raqam, parol</li>
            <li><strong>Sog'lik ma'lumotlari:</strong> menstruatsiya sikli, belgilar, kayfiyat, og'riq darajasi</li>
            <li><strong>Foydalanish ma'lumotlari:</strong> qanday funksiyalarga kirgon, saytni qanday vaqt ishlatgan</li>
            <li><strong>Cihaz ma'lumotlari:</strong> cihaz turi, operatsion sistema, IP-manzil</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>3. Ma'lumotlarni Qanday Ishlatamiz</h2>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Hisobni yaratish va boshqarish</li>
            <li>Sikl bashoratlari taqdim etish</li>
            <li>Sog'lik tavsiyalari berish</li>
            <li>Dasturni yaxshilash va xatolarni tuzatish</li>
            <li>Qonuni kerak bo'lganida, qonuniy talablarni bajarish</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>4. Ma'lumotlarni Himoya Qilish</h2>
          <p>
            Biz sizning sog'lik ma'lumotlaringizni quyidagi yo'llar bilan himoya qilamiz:
          </p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Barcha ma'lumotlar shifrlash (HTTPS/SSL) orqali uzatiladi</li>
            <li>Server'da shifrlangan holatda saqlanadi</li>
            <li>Faqat avtorizlangan ishchi va tizimlar ma'lumotlarga kira oladi</li>
            <li>Muntazam xavfsizlik tekshiruvi o'tkaziladi</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>5. Uchinchi Tomonlar Bilan Mulohaza</h2>
          <p>
            Biz sizning shaxsiy ma'lumotlaringizni uchinchi tomonlar bilan baham ko'rmayamiz, bundan:
          </p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Reklama kompaniyalari</li>
            <li>Ijtimoiy tarmoq platformalari</li>
            <li>To'lov protsessori (faqat zarur bo'lsa)</li>
          </ul>
          <p style={{ marginTop: '12px' }}>
            Faqat qonuniy talaba yoki sizning aniq ruxsatingiz bilan mulohaza qilamiz.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>6. Sizning Huquqlaringiz</h2>
          <p>Sizda quyidagi huquqlar mavjud:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>Kirish huquqi:</strong> o'z ma'lumotlaringizni koʻrish</li>
            <li><strong>Tahrirlash huquqi:</strong> noto'g'ri ma'lumotlarni tuzatish</li>
            <li><strong>O'chirish huquqi:</strong> hisobingiz va barcha ma'lumotlarini o'chirish</li>
            <li><strong>Ruxsat o'zini qaytarish:</strong> ma'lumot to'plamini rad etish</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>7. Bog'laning</h2>
          <p>
            Agar maxfiylik haqida savol yoki xavotir bo'lsa, biz bilan bog'laning:
          </p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Email: support@miila.uz</li>
            <li>Telegram: @miila_support</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px', padding: '20px', background: '#f5e8eb', borderRadius: '12px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#6a4857' }}>
            <strong>Eslatma:</strong> Ushbu Maxfiylik Siyosati har qanday vaqtda o'zgartirilishi mumkin. O'zgarishlardan siz e-maillar orqali xabardor qilamiz.
          </p>
        </section>
      </div>
    </div>
  )
}
