import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QnaWidget from "./QnaWidget";

const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const [ref, inView] = useInView(0.08);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(40px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

const features = [
  {
    icon: "🌸",
    title: "Sodda tushuntirishlar",
    desc: "Qisqa video darslar orqali, tanangizni tushuning Tanangizni tushunish orqali, o’zligingizni anglang",
  },
  {
    icon: "👩‍⚕️",
    title: "Qulay kuzatuv",
    desc: "Menstrual siklingizni qulay tarzda kuzating va muhim kunlarni oldindan biling.",
  },
  {
    icon: "💊",
    title: "Shaxsiylashtirilgan yondashuv",
    desc: "Siz kiritgan ma’lumotlarga qarab sog‘lig‘ingizni yaxshiroq tushunishga yordam beradigan tajriba.",
  },
  {
    icon: "📊",
    title: "Kunlik Maslahatlar",
    desc: "Oy davomida siklingiz davriga mos tarzda kunlik maslahatlar oling.",
  },
];

const steps = [
  { num: "01", title: "Ro'yxatdan o'ting", desc: "Email bilan 30 soniyada hisob yarating." },
  { num: "02", title: "Profilingizni to'ldiring", desc: "Sog’liq ma’lumotlaringizni kiriting, siz uchun shaxsiylashtiramiz." },
  { num: "03", title: "Kuzatib boring", desc: "Har kuni sikl, kayfiyat va sog'liq ma'lumotlarini belgilang." },
  { num: "04", title: "Video darslardan o’rganing", desc: "Qisqa video darslar orqali tanangizni tinglashni o’rganing." },
  { num: "05", title: "Anonim Savol- Javoblar qo’shish", desc: "Tibbiy savollaringizni anonim yo’llang va doktordan javob oling." },
];

const _testimonials = [
  {
    name: "Malika T.",
    city: "Toshkent",
    text: "Porla mening hayotimni o'zgartirdi. Endi tsiklimni aniq bilaman va ginekologimga aniq ma'lumot bera olaman.",
    stars: 5,
    avatar: "M",
    color: "#f472b6",
  },
  {
    name: "Nilufar R.",
    city: "Samarqand",
    text: "Online maslahat xizmati ajoyib! Shahrimizda yaxshi ginekolog topish qiyin, Porla bu muammoni hal qildi.",
    stars: 5,
    avatar: "N",
    color: "#a78bfa",
  },
  {
    name: "Zulfiya K.",
    city: "Namangan",
    text: "Homiladorlik davrida juda ko'p foydali ma'lumot oldim. Ilovani barcha do'stlarimga tavsiya qildim.",
    stars: 5,
    avatar: "Z",
    color: "#34d399",
  },
];

const _stats = [
  { value: "50,000+", label: "Faol foydalanuvchi" },
  { value: "200+", label: "Mutaxassis shifokor" },
  { value: "4.9★", label: "App Store reytingi" },
  { value: "98%", label: "Mamnun foydalanuvchi" },
];

export default function PorlaLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const [_count, _setCount] = useState({ users: 0, docs: 0 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#fdf8f5", color: "#1a1a1a", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        .nav-link { color: #5a3e35; text-decoration: none; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 0.05em; transition: color 0.3s; }
        .nav-link:hover { color: #c2545a; }
        .btn-primary { background: linear-gradient(135deg, #c2545a 0%, #e8728a 100%); color: white; border: none; border-radius: 50px; padding: 14px 32px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.3s; letter-spacing: 0.03em; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(194,84,90,0.35); }
        .btn-outline { background: transparent; color: #c2545a; border: 1.5px solid #c2545a; border-radius: 50px; padding: 13px 30px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.3s; letter-spacing: 0.03em; }
        .btn-outline:hover { background: #c2545a; color: white; transform: translateY(-2px); }
        .feature-card { background: white; border-radius: 20px; padding: 32px 28px; transition: all 0.4s; cursor: default; border: 1px solid rgba(194,84,90,0.08); }
        .feature-card:hover { transform: translateY(-8px); box-shadow: 0 24px 60px rgba(194,84,90,0.12); border-color: rgba(194,84,90,0.2); }
        .step-card { position: relative; }
        .testimonial-card { background: white; border-radius: 20px; padding: 28px; border: 1px solid rgba(194,84,90,0.1); transition: all 0.3s; }
        .testimonial-card:hover { box-shadow: 0 20px 50px rgba(194,84,90,0.1); transform: translateY(-4px); }
        .blob-1 { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(232,114,138,0.15) 0%, transparent 70%); top: -100px; right: -100px; animation: float 8s ease-in-out infinite; pointer-events: none; }
        .blob-2 { position: absolute; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(194,84,90,0.1) 0%, transparent 70%); bottom: 50px; left: -100px; animation: float 10s ease-in-out infinite reverse; pointer-events: none; }
        .blob-3 { position: absolute; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%); top: 50%; left: 50%; animation: float 7s ease-in-out infinite 2s; pointer-events: none; }
        @keyframes float { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(20px,-20px) scale(1.03); } 66% { transform: translate(-15px,15px) scale(0.97); } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
        .pulse-dot { position: relative; display: inline-block; }
        .pulse-dot::before { content: ''; position: absolute; inset: -4px; border-radius: 50%; background: rgba(194,84,90,0.3); animation: pulse-ring 2s ease-out infinite; }
        .gradient-text { background: linear-gradient(135deg, #c2545a 0%, #e8728a 50%, #a855f7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .wavy-line { height: 3px; background: linear-gradient(90deg, transparent, #c2545a, #e8728a, #c2545a, transparent); border-radius: 2px; }
        .mobile-menu { display: none; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu { display: flex; }
          .hero-grid { flex-direction: column !important; }
          .hero-text { text-align: center; }
          .hero-title { font-size: clamp(40px, 10vw, 56px) !important; }
          .features-grid { grid-template-columns: 1fr 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-row { grid-template-columns: 1fr 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
        }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 5%",
        background: scrolled ? "rgba(253,248,245,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        boxShadow: scrolled ? "0 2px 30px rgba(0,0,0,0.06)" : "none",
        transition: "all 0.4s ease",
        height: 70, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #c2545a, #e8728a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>🌸</div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#5a3e35", letterSpacing: "0.02em" }}>Porla</span>
        </div>
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <a href="#features" className="nav-link">Imkoniyatlar</a>
          <a href="#how" className="nav-link">Qanday ishlaydi</a>
          <a href="#testimonials" className="nav-link">Fikrlar</a>
          <a href="/qna" className="nav-link">Savol-javoblar</a>
          <button className="btn-primary" onClick={() => navigate("/login")} style={{ padding: "10px 24px", fontSize: 14 }}>Boshlash</button>
        </div>
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          <div style={{ width: 24, height: 2, background: "#5a3e35", marginBottom: 5, transition: "0.3s", transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
          <div style={{ width: 24, height: 2, background: "#5a3e35", marginBottom: 5, opacity: menuOpen ? 0 : 1, transition: "0.3s" }} />
          <div style={{ width: 24, height: 2, background: "#5a3e35", transition: "0.3s", transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
        </button>
      </nav>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 70, left: 0, right: 0, zIndex: 999,
          background: "rgba(253,248,245,0.98)", backdropFilter: "blur(20px)",
          padding: "20px 5% 30px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          display: "flex", flexDirection: "column", gap: 20,
        }}>
          <a href="#features" className="nav-link" onClick={() => setMenuOpen(false)}>Imkoniyatlar</a>
          <a href="#how" className="nav-link" onClick={() => setMenuOpen(false)}>Qanday ishlaydi</a>
          <a href="#testimonials" className="nav-link" onClick={() => setMenuOpen(false)}>Fikrlar</a>
          <a href="/qna" className="nav-link" onClick={() => setMenuOpen(false)}>Savol-javoblar</a>
          <button className="btn-primary" onClick={() => navigate("/login")} style={{ width: "fit-content" }}>Boshlash</button>
        </div>
      )}

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 5% 60px", position: "relative", overflow: "hidden" }}>
        <div className="blob-1" />
        <div className="blob-2" />

        {/* Background pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "radial-gradient(circle, #c2545a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }} />

        <div className="hero-grid" style={{ display: "flex", alignItems: "center", gap: "5%", width: "100%", maxWidth: 1200, margin: "0 auto" }}>
          {/* Left */}
          <div className="hero-text" style={{ flex: 1, zIndex: 1 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(194,84,90,0.08)", border: "1px solid rgba(194,84,90,0.2)",
              borderRadius: 50, padding: "8px 18px", marginBottom: 32,
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#c2545a", fontWeight: 500,
              animation: "float 4s ease-in-out infinite",
            }}>
              <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#c2545a", display: "inline-block" }} />
              Ayollar salomatligi uchun ishonchli platforma
            </div>

            <h1 className="hero-title gradient-text" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(48px, 6vw, 80px)",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 24,
              letterSpacing: "-0.02em",
            }}>
              Tanangiz haqida bilish<br />
              <em style={{ fontStyle: "italic" }}>uyat emas,</em><br />
              zarurat
            </h1>

            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#7a6560",
              lineHeight: 1.7, marginBottom: 40, maxWidth: 480, fontWeight: 300,
            }}>
              Porla bilan o‘z tanangizni yaxshiroq tushunib, sog‘lig‘ingizga ongli va ishonchli yondashishni boshlang.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 52 }}>
              <button className="btn-primary" onClick={() => navigate("/login")}>Bepul boshlash →</button>
              <button onClick={() => document.getElementById("how").scrollIntoView({ behavior: "smooth" })} className="btn-outline">Qanday ishlaydi</button>
            </div>

            {/* Social proof */}
            {/* <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex" }}>
                {["#f472b6", "#a78bfa", "#34d399", "#fb923c", "#60a5fa"].map((c, i) => (
                  <div key={i} style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${c}, ${c}99)`,
                    border: "2px solid white",
                    marginLeft: i > 0 ? -10 : 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, color: "white", fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {["M", "N", "Z", "G", "S"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#3d2b26" }}>50,000+ ayol ishonadi</div>
                <div style={{ display: "flex", gap: 2 }}>{"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#f59e0b", fontSize: 13 }}>{s}</span>)}</div>
              </div>
            </div> */}
          </div>

          {/* Right — Phone mockup */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1, minHeight: 500 }}>
            <div style={{ position: "relative", width: 280 }}>
              {/* Glow */}
              <div style={{
                position: "absolute", inset: -40,
                background: "radial-gradient(circle, rgba(232,114,138,0.3) 0%, transparent 70%)",
                borderRadius: "50%", animation: "float 6s ease-in-out infinite",
              }} />

              {/* Phone frame */}
              <div style={{
                background: "white",
                borderRadius: 40,
                padding: 12,
                boxShadow: "0 40px 100px rgba(194,84,90,0.2), 0 10px 40px rgba(0,0,0,0.08)",
                position: "relative",
                animation: "float 5s ease-in-out infinite 1s",
              }}>
                {/* Notch */}
                <div style={{ background: "#1a1a1a", borderRadius: 28, overflow: "hidden" }}>
                  <div style={{ background: "#1a1a1a", height: 28, display: "flex", justifyContent: "center", alignItems: "flex-end", paddingBottom: 4 }}>
                    <div style={{ width: 80, height: 16, background: "#2a2a2a", borderRadius: 10 }} />
                  </div>
                  {/* App screen */}
                  <div style={{ background: "#fdf8f5", height: 500, padding: "20px 16px", overflowY: "hidden" }}>
                    {/* Status bar */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#3d2b26" }}>9:41</span>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700, color: "#c2545a" }}>Porla</span>
                      <span style={{ fontSize: 11 }}>●●●</span>
                    </div>

                    {/* Greeting */}
                    <div style={{ background: "linear-gradient(135deg, #c2545a, #e8728a)", borderRadius: 20, padding: "18px 16px", marginBottom: 16, color: "white" }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, opacity: 0.85, marginBottom: 4 }}>Xayrli kun, Malika! 🌸</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, lineHeight: 1.2 }}>Tsiklingizning<br />14-kuni</div>
                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        {["12", "13", "14", "15", "16", "17"].map((d, i) => (
                          <div key={i} style={{
                            width: 28, height: 32, borderRadius: 10, display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center", gap: 2,
                            background: i === 2 ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.1)",
                            border: i === 2 ? "1.5px solid white" : "1px solid rgba(255,255,255,0.2)",
                          }}>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, opacity: 0.8 }}>{["Sh", "Ya", "Du", "Se", "Ch", "Pa"][i]}</span>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600 }}>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats row */}
                    {/* <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                      {[
                        { icon: "💧", label: "Suv", val: "6/8 stakan" },
                        { icon: "😴", label: "Uyqu", val: "7.5 soat" },
                        { icon: "🏃", label: "Qadam", val: "4,200" },
                        { icon: "💊", label: "Vitamin", val: "✓ Qabul qilindi" },
                      ].map((s, i) => (
                        <div key={i} style={{
                          background: "white", borderRadius: 14, padding: "12px 10px",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                        }}>
                          <div style={{ fontSize: 16, marginBottom: 4 }}>{s.icon}</div>
                          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: "#9a8580", marginBottom: 2 }}>{s.label}</div>
                          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, color: "#3d2b26" }}>{s.val}</div>
                        </div>
                      ))}
                    </div> */}

                    {/* Doctor card */}
                    <div style={{ background: "white", borderRadius: 16, padding: "12px 14px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#3d2b26" }}>5- Modul. Ayol Garmonlari</div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: "#9a8580" }}>Estrogen va progesteron sikl davrida qanday ishlashi </div>
                      </div>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #c2545a, #e8728a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white" }}>→</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div style={{
                position: "absolute", top: -20, left: -50,
                background: "white", borderRadius: 16, padding: "10px 14px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                display: "flex", alignItems: "center", gap: 8,
                animation: "float 5s ease-in-out infinite 0.5s",
              }}>
                <span style={{ fontSize: 18 }}>📅</span>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#9a8580" }}>Keyingi sikl</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#c2545a" }}>14 kun qoldi</div>
                </div>
              </div>

              <div style={{
                position: "absolute", bottom: 60, right: -55,
                background: "white", borderRadius: 16, padding: "10px 14px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                display: "flex", alignItems: "center", gap: 8,
                animation: "float 6s ease-in-out infinite 1.5s",
              }}>
                <span style={{ fontSize: 18 }}>✅</span>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#9a8580" }}>Maslahat</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#3d2b26" }}>Tasdiqlandi!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      {/* <section style={{ background: "linear-gradient(135deg, #3d2b26 0%, #5a3e35 100%)", padding: "48px 5%" }}>
        <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          {_stats.map((s, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#e8728a", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 6, fontWeight: 300 }}>{s.label}</div>
            </AnimatedSection>
          ))}
        </div>
      </section> */}

      {/* FEATURES */}
      <section id="features" style={{ padding: "100px 5%", background: "#fdf8f5" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimatedSection>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: "0.15em", color: "#c2545a", textTransform: "uppercase", fontWeight: 500, marginBottom: 16 }}>Nima  uchun Porla?</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, color: "#3d2b26", lineHeight: 1.15, marginBottom: 20 }}>
                Sog‘lig‘ingiz uchun asosiy<br />imkoniyatlar bir joyda
              </h2>
              <div className="wavy-line" style={{ width: 80, margin: "0 auto" }} />
            </div>
          </AnimatedSection>

          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {features.map((f, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="feature-card">
                  <div style={{
                    width: 52, height: 52, borderRadius: 16,
                    background: "linear-gradient(135deg, rgba(194,84,90,0.1), rgba(232,114,138,0.15))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, marginBottom: 20,
                  }}>{f.icon}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#3d2b26", marginBottom: 10 }}>{f.title}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#7a6560", lineHeight: 1.65, fontWeight: 300 }}>{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: "100px 5%", background: "linear-gradient(180deg, #fdf8f5 0%, #fef0f1 100%)", position: "relative", overflow: "hidden" }}>
        <div className="blob-3" />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <AnimatedSection>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: "0.15em", color: "#c2545a", textTransform: "uppercase", fontWeight: 500, marginBottom: 16 }}>Jarayon</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, color: "#3d2b26", lineHeight: 1.15 }}>
                Qanday boshlaysiz?
              </h2>
            </div>
          </AnimatedSection>

          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
            {steps.map((s, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="step-card">
                  {i < steps.length - 1 && (
                    <div style={{
                      position: "absolute", top: 28, left: "75%", width: "50%", height: 1,
                      background: "linear-gradient(90deg, rgba(194,84,90,0.4), transparent)",
                      display: window?.innerWidth > 768 ? "block" : "none",
                    }} />
                  )}
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 700,
                    color: "rgba(194,84,90,0.15)", lineHeight: 1, marginBottom: 16,
                  }}>{s.num}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#3d2b26", marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#7a6560", lineHeight: 1.65, fontWeight: 300 }}>{s.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {/* <section id="testimonials" style={{ padding: "100px 5%", background: "#fdf8f5" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimatedSection>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: "0.15em", color: "#c2545a", textTransform: "uppercase", fontWeight: 500, marginBottom: 16 }}>Foydalanuvchilar</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, color: "#3d2b26", lineHeight: 1.15 }}>
                Ular nima deyishadi?
              </h2>
            </div>
          </AnimatedSection>

          <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {_testimonials.map((t, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="testimonial-card">
                  <div style={{ display: "flex", gap: 2, marginBottom: 18 }}>
                    {"★★★★★".split("").map((s, j) => <span key={j} style={{ color: "#f59e0b", fontSize: 16 }}>{s}</span>)}
                  </div>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: "#3d2b26",
                    lineHeight: 1.7, marginBottom: 24, fontStyle: "italic",
                  }}>"{t.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, color: "white",
                    }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#3d2b26" }}>{t.name}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9a8580" }}>{t.city}</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA */}
      <section style={{ padding: "100px 5%", background: "linear-gradient(135deg, #3d2b26 0%, #5a3e35 50%, #7a2c35 100%)", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(232,114,138,0.1) 1px, transparent 1px)", backgroundSize: "50px 50px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,114,138,0.2) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
          <AnimatedSection>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🌸</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 700, color: "white", lineHeight: 1.15, marginBottom: 20 }}>
              Bugun boshlang,<br />
              <em style={{ fontStyle: "italic", color: "#e8728a" }}>bepul</em>
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 40, fontWeight: 300 }}>
              Juda ko'p ayollar allaqachon Porla bilan o'z sog'lig'ini nazorat qilmoqda. Siz ham ularga qo'shiling.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              {/* <button style={{
                background: "linear-gradient(135deg, #e8728a, #f472b6)",
                color: "white", border: "none", borderRadius: 50, padding: "16px 38px",
                fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, cursor: "pointer",
                transition: "all 0.3s", letterSpacing: "0.03em",
                boxShadow: "0 8px 30px rgba(232,114,138,0.4)",
              }}
                onMouseOver={e => { e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = "0 16px 40px rgba(232,114,138,0.5)"; }}
                onMouseOut={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "0 8px 30px rgba(232,114,138,0.4)"; }}
              >
                📱 App Store
              </button> */}
              {/* <button style={{
                background: "rgba(255,255,255,0.1)", color: "white",
                border: "1.5px solid rgba(255,255,255,0.3)",
                borderRadius: 50, padding: "15px 36px",
                fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, cursor: "pointer",
                transition: "all 0.3s", letterSpacing: "0.03em",
                backdropFilter: "blur(10px)",
              }}
                onMouseOver={e => { e.target.style.background = "rgba(255,255,255,0.2)"; e.target.style.transform = "translateY(-3px)"; }}
                onMouseOut={e => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.transform = "none"; }}
              >
                🤖 Google Play
              </button> */}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#2a1d18", padding: "48px 5% 32px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #c2545a, #e8728a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌸</div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "white" }}>Porla</span>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 16, fontWeight: 300 }}>Ayollar salomatligi platformasi • O'zbekiston</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
          {["Maxfiylik siyosati", "Foydalanish shartlari", "Bog'lanish"].map((l, i) => (
            <a key={i} href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseOver={e => e.target.style.color = "#e8728a"}
              onMouseOut={e => e.target.style.color = "rgba(255,255,255,0.4)"}>{l}</a>
          ))}
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.25)", fontWeight: 300 }}>© 2025 Porla. Barcha huquqlar himoyalangan.</p>
      </footer>
      <QnaWidget />
    </div>
  );
}