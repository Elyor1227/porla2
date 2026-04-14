/**
 * PORLA — Frontend (porla-web-updated.jsx)
 * import api, { storage } from "./api";
 * import AdminApp from "./porla-admin";
 * import PorlaCalendar from "./PorlaCalendar__2_";
 */
import React from 'react'
import { useState, useEffect, useCallback } from "react";
import api, { storage } from "./api";
import { LOGO_DEFAULT, LOGO_PREMIUM, logoImgSvg } from "./brandLogos";
import AdminApp from "./porla-admin";
import PorlaCalendar from "./PorlaCalendar (2)";
import QnaWidget from "./QnaWidget";
import DailyTip from "./DailyTip";

/* ── DESIGN TOKENS ───────────────────────────────────── */
const FONTS = ''
const T = {
  rose:"#d64f6e", roseMid:"#e8728a", roseLight:"#fde8ec",
  cream:"#fdf8f5", dark:"#221219", ink:"#4a2535",
  muted:"#9a7585", border:"rgba(214,79,110,0.12)", white:"#ffffff",
  gold:"#e9a825", green:"#0ea87a", blue:"#3b7de8", purple:"#8657d6",
  error:"#ef4444", errorBg:"#fef2f2",
};
const serif = "'Playfair Display', Georgia, serif";
const sans  = "'Plus Jakarta Sans', system-ui, sans-serif";

/* ── CONFIG ──────────────────────────────────────────── */
const TELEGRAM_PAYMENT_BOT = "https://t.me/porlapayment1_bot";
const openPaymentBot = () => window.open(TELEGRAM_PAYMENT_BOT, "_blank");

/* ── HOOKS ───────────────────────────────────────────── */
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

/* ── SHARED UI ───────────────────────────────────────── */
const Btn = ({ children, variant="primary", onClick, style={}, size="md", loading=false, disabled=false, type="button" }) => {
  const [hov, setHov] = useState(false);
  const p  = size==="sm" ? "8px 16px" : size==="lg" ? "16px 36px" : "12px 24px";
  const fs = size==="sm" ? 13 : size==="lg" ? 16 : 14;
  const vs = {
    primary: { background: hov ? "linear-gradient(135deg,#bf3a5a,#d64f6e)" : "linear-gradient(135deg,#d64f6e,#e8728a)", color: T.white, boxShadow: hov ? "0 12px 32px rgba(214,79,110,.38)" : "0 4px 16px rgba(214,79,110,.25)", transform: hov && !disabled ? "translateY(-1px)" : "none" },
    ghost:   { background: hov ? T.roseLight : "transparent", color: T.rose, border: `1.5px solid ${hov ? T.rose : T.border}` },
    gold:    { background: hov ? "linear-gradient(135deg,#c8881a,#e9a825)" : "linear-gradient(135deg,#e9a825,#f5bc3a)", color: T.white, boxShadow: hov ? "0 12px 28px rgba(233,168,37,.38)" : "0 4px 14px rgba(233,168,37,.22)", transform: hov && !disabled ? "translateY(-1px)" : "none" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:"inline-flex", alignItems:"center", gap:8, padding:p, fontSize:fs, fontFamily:sans, fontWeight:700, borderRadius:12, border:"none", cursor: disabled || loading ? "not-allowed" : "pointer", transition:"all .2s", opacity: disabled || loading ? .65 : 1, ...vs[variant], ...style }}>
      {loading && <span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,.4)", borderTopColor:"white", borderRadius:"50%", animation:"spin .7s linear infinite" }}/>}
      {children}
    </button>
  );
};

const Card = ({ children, style={}, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:T.white, borderRadius:20, border:`1px solid ${T.border}`, boxShadow: hov && onClick ? "0 8px 32px rgba(34,18,25,.1)" : "0 2px 12px rgba(34,18,25,.06)", transition:"all .2s", cursor: onClick ? "pointer" : "default", transform: hov && onClick ? "translateY(-2px)" : "none", ...style }}>
      {children}
    </div>
  );
};

const Badge = ({ type }) => {
  const isPro = type === "pro" || type === "premium";
  return (
    <span style={{ fontFamily:sans, fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:20, background: isPro ? "linear-gradient(135deg,#e9a825,#f5bc3a)" : "linear-gradient(135deg,#0ea87a,#34d399)", color:T.white, letterSpacing:"0.04em", flexShrink:0 }}>
      {isPro ? "✦ Premium" : "BEPUL"}
    </span>
  );
};

const Alert = ({ type, message, iconSrc }) => {
  if (!message) return null;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, background: type==="error" ? T.errorBg : "#f0fdf4", border:`1px solid ${type==="error" ? "#fecaca" : "#bbf7d0"}`, borderRadius:12, padding:"12px 16px", marginBottom:16, fontFamily:sans, fontSize:13, color: type==="error" ? "#b91c1c" : "#065f46", fontWeight:600 }}>
      {type==="error" ? "⚠ " : iconSrc ? <img src={iconSrc} alt="" width={22} height={22} style={{ flexShrink:0, objectFit:"contain" }} /> : "✓ "}
      <span style={{ flex:1 }}>{message}</span>
    </div>
  );
};

const Input = ({ label, value, onChange, type="text", placeholder="", error="", icon="" }) => (
  <div style={{ marginBottom:16 }}>
    {label && <label style={{ fontFamily:sans, fontSize:12, fontWeight:700, color:T.ink, display:"block", marginBottom:6 }}>{label}</label>}
    <div style={{ position:"relative" }}>
      {icon && <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16, pointerEvents:"none" }}>{icon}</span>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width:"100%", padding: icon ? "12px 14px 12px 42px" : "12px 14px", fontFamily:sans, fontSize:14, color:T.dark, background:"#fdf8f5", border:`1.5px solid ${error ? T.error : T.border}`, borderRadius:12, outline:"none", boxSizing:"border-box", transition:"border .2s" }}/>
    </div>
    {error && <p style={{ fontFamily:sans, fontSize:11, color:T.error, margin:"4px 0 0", fontWeight:600 }}>{error}</p>}
  </div>
);

/* ── NAVIGATION ──────────────────────────────────────── */
const NAV = [
  { key:"home",    label:"Bosh sahifa", emoji:"/svg/Boshsahifaicons/fa7-solid_home.svg" },
  { key:"modules", label:"Darslar",     emoji:"/svg/Boshsahifaicons/material-symbols-light_play-lesson-rounded.svg" },
  { key:"tracker", label:"Sikl kalendari",        emoji:"/svg/Boshsahifaicons/mdi_calendar-heart.svg" },
  { key:"notifs",  label:"Xabarlar",    emoji:"/svg/Boshsahifaicons/ion_notifications.svg" },
  { key:"profile", label:"Profil",      emoji:"/svg/Boshsahifaicons/ix_user-profile-filled.svg" },
];

/* Profil menyusi — NAV/login bilan bir xil public rasmlar */
const PROFILE_MENU_ICONS = {
  lessons: "/svg/xabarlarandprofileicons/mdi_book-heart.svg",
  email: "/svg/xabarlarandprofileicons/entypo_email.svg",
  lock: "/svg/xabarlarandprofileicons/mingcute_lock-fill.svg",
  help: "/svg/xabarlarandprofileicons/mage_shield-question-mark-fill.svg",
  logout: "/svg/xabarlarandprofileicons/mingcute_exit-fill.svg",
};

function Sidebar({ tab, setTab, user, unread }) {
  return (
    <aside style={{ width:240, flexShrink:0, background:T.white, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", minHeight:"100vh", position:"sticky", top:0 }}>
        <div style={{ padding:"28px 20px 20px", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <img src='/logos/logo1.svg' alt="Miila" style={{ marginLeft:'40px', height:120, width:"auto", maxWidth:280 }} />
        </div>
      </div>
      <nav style={{ flex:1, padding:"16px 12px" }}>
        {NAV.map(n => {
          const a = tab === n.key;
          return (
            <button key={n.key} onClick={() => setTab(n.key)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"11px 14px", borderRadius:14, border:"none", cursor:"pointer", marginBottom:4, transition:"all .2s", background: a ? T.roseLight : "transparent", fontFamily:sans, fontSize:14, fontWeight: a ? 700 : 500, color: a ? T.rose : T.ink }}>
              <span style={{ fontSize:18, position:"relative" }}>
                <img width={30} height={30} src={n.emoji} alt="" />
                {n.key==="notifs" && unread > 0 && (
                  <span style={{ position:"absolute", top:-4, right:-4, width:16, height:16, borderRadius:"50%", background:T.rose, color:"white", fontSize:9, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{unread > 9 ? "9+" : unread}</span>
                )}
              </span>
              {n.label}
              {a && <span style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:T.rose }}/>}
            </button>
          );
        })}
      </nav>
      <div style={{ padding:"12px 20px 24px", borderTop:`1px solid ${T.border}` }}>
        <p style={{ fontFamily:sans, fontSize:12, color:T.muted, margin:0, fontWeight:600 }}>{user?.name}</p>
        <p style={{ fontFamily:sans, fontSize:11, color:T.muted, margin:"2px 0 0", opacity:.7 }}>{user?.isPro ? "✦ Premium" : "Bepul"}</p>
        {!user?.isPro && (
          <button onClick={openPaymentBot}
            style={{ width:"100%", marginTop:12, padding:"8px 12px", fontSize:12, fontFamily:sans, fontWeight:700, background:"linear-gradient(135deg,#e9a825,#f5bc3a)", color:"white", border:"none", borderRadius:10, cursor:"pointer", display:'flex',}}>
            <img width={40} src={LOGO_PREMIUM} alt="premium" /> <p style={{marginTop:16}}>Premium xaridi</p>
          </button>
        )}
      </div>
    </aside>
  );
}

function TopBar({ tab, setTab, unread }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header style={{ background:T.white, borderBottom:`1px solid ${T.border}`, padding:"0 20px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 12px rgba(34,18,25,.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <img src='/logos/logo1.svg' alt="Miila" style={{ ...logoImgSvg, height:58, width:"auto", maxWidth:280 }} />
        </div>
        <span style={{ fontFamily:sans, fontSize:14, fontWeight:700, color:T.ink }}>{NAV.find(n => n.key===tab)?.label}</span>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={() => setTab("notifs")}
            style={{ position:"relative", width:36, height:36, background:T.roseLight, border:"none", borderRadius:10, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}
            aria-label="Xabarlar"
          >
            <img src="/svg/xabarlarandprofileicons/ion_notifications.svg" alt="" width={22} height={22} style={{ objectFit:"contain" }} />
            {unread > 0 && <span style={{ position:"absolute", top:4, right:4, width:14, height:14, borderRadius:"50%", background:T.rose, color:"white", fontSize:8, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{unread > 9 ? "9+" : unread}</span>}
          </button>
          <button onClick={() => setOpen(_o => !_o)}
            style={{ width:36, height:36, background:T.roseLight, border:"none", borderRadius:10, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4 }}>
            {[0,1,2].map(_i => <span key={_i} style={{ width:16, height:2, background:T.rose, borderRadius:1, display:"block" }}/>)}
          </button>
        </div>
      </header>
      {open && (
        <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(34,18,25,.5)" }} onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ position:"absolute", right:0, top:0, bottom:0, width:260, background:T.white, padding:"24px 16px" }}>
            {NAV.map(n => (
              <button key={n.key} onClick={() => { setTab(n.key); setOpen(false); }}
                style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"13px 14px", borderRadius:14, border:"none", cursor:"pointer", marginBottom:4, background: tab===n.key ? T.roseLight : "transparent", fontFamily:sans, fontSize:14, fontWeight: tab===n.key ? 700 : 500, color: tab===n.key ? T.rose : T.ink }}>
                <span style={{ fontSize:18 }}><img width={30} height={30} src={n.emoji} alt="" /></span>
                {n.label}
                {n.key==="notifs" && unread > 0 && (
                  <span style={{ marginLeft:"auto", background:T.rose, color:"white", borderRadius:20, fontSize:11, fontWeight:700, padding:"1px 7px" }}>{unread}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function BottomNav({ tab, setTab, unread }) {
  return (
    <nav style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:100, background:T.white, borderTop:`1px solid ${T.border}`, display:"flex", padding:"8px 0 12px", boxShadow:"0 -4px 20px rgba(34,18,25,.08)" }}>
      {NAV.map(n => {
        const a = tab === n.key;
        return (
          <button key={n.key} onClick={() => setTab(n.key)}
            style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"4px 0" }}>
            <span style={{ position:"relative", width:40, height:28, borderRadius:10, background:"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, transition:"all .2s" }}>
              <img width={30} height={30} src={n.emoji} alt="" />
              {n.key==="notifs" && unread > 0 && (
                <span style={{ position:"absolute", top:2, right:2, width:14, height:14, borderRadius:"50%", background:"#ef4444", color:"white", fontSize:8, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{unread > 9 ? "9+" : unread}</span>
              )}
            </span>
            <span style={{ fontFamily:sans, fontSize:10, fontWeight: a ? 700 : 500, color: a ? T.rose : T.muted }}>{n.label}</span>
            <span style={{ width:18, height:2, borderRadius:999, background:a ? T.rose : "transparent", transition:"all .2s" }}/>
          </button>
        );
      })}
    </nav>
  );
}

/* ── AUTH PAGE ───────────────────────────────────────── */
function AuthPage({ onLogin }) {
  const [mode, setMode]       = useState("login");
  const [form, setForm]       = useState({ name:"", email:"", password:"" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr]   = useState("");
  const [success, setSuccess] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (mode==="register" && !form.name.trim()) e.name = "Ism kiritilmadi";
    if (!form.email.includes("@")) e.email = "Email noto'g'ri";
    if (form.password.length < 6) e.password = "Kamida 6 ta belgi";
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setApiErr(""); setSuccess("");
    try {
      if (mode==="login") {
        const data = await api.auth.login(form.email, form.password);
        setSuccess("Xush kelibsiz!");
        setTimeout(() => onLogin(data.user), 700);
      } else {
        const data = await api.auth.register(form.name, form.email, form.password);
        setSuccess("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
        setTimeout(() => onLogin(data.user), 900);
      }
    } catch (err) {
      setApiErr(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#fdf8f5 0%,#fde8ec 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <style>{`${FONTS} *, *::before, *::after{box-sizing:border-box;} body{margin:0;} @keyframes spin{to{transform:rotate(360deg);}}`}</style>
      <div style={{ width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"flex", justifyContent:"center", margin:"0 auto 16px" }}>
            <img src='/logos/logo1.svg' alt="Miila" style={{ marginLeft:'60px', height:120, width:"auto", maxWidth:380 }} />
          </div>
          <h1 style={{ fontFamily:serif, fontSize:32, fontWeight:700, color:T.dark, margin:0 }}>Miila</h1>
          <p style={{ fontFamily:sans, fontSize:14, color:T.muted, margin:"6px 0 0" }}>Ayollar salomatligi platformasi</p>
        </div>
        <Card style={{ padding:"32px" }}>
          <div style={{ display:"flex", background:T.roseLight, borderRadius:12, padding:4, marginBottom:24 }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setErrors({}); setApiErr(""); }}
                style={{ flex:1, padding:"10px", borderRadius:10, border:"none", cursor:"pointer", fontFamily:sans, fontSize:13, fontWeight:700, transition:"all .2s", background: mode===m ? T.white : "transparent", color: mode===m ? T.rose : T.muted, boxShadow: mode===m ? "0 2px 8px rgba(34,18,25,.1)" : "none" }}>
                {m==="login" ? "Kirish" : "Ro'yxatdan o'tish"}
              </button>
            ))}
          </div>
          <Alert type="error" message={apiErr}/>
          {success && <Alert type="success" message={success} iconSrc="/Untitled (11)/mdi_flower.svg"/>}
          {mode==="register" && <Input label="Ism" value={form.name} onChange={e => set("name", e.target.value)} placeholder="To'liq ismingiz" error={errors.name} icon={<img width={20} src='/svg/xabarlarandprofileicons/ix_user-profile-filled.svg'/>}/>}
          <Input label="Email" value={form.email} onChange={e => set("email", e.target.value)} type="email" placeholder="email@example.com" error={errors.email} icon={<img width={20} src='/svg/xabarlarandprofileicons/entypo_email.svg'/>}/>
          <Input label="Parol" value={form.password} onChange={e => set("password", e.target.value)} type="password" placeholder={mode==="login" ? "Parolingizni kiriting" : "Kamida 6 ta belgi"} error={errors.password} icon={<img width={20} src='/svg/xabarlarandprofileicons/mingcute_lock-fill.svg'/>}/>
          <Btn onClick={handleSubmit} loading={loading} disabled={loading} style={{ width:"100%", justifyContent:"center", marginTop:8 }} size="lg" type="button">
            {loading ? "Kutilmoqda..." : (mode==="login" ? "Kirish →" : "Hisob yaratish →")}
          </Btn>
        </Card>
      </div>
    </div>
  );
}

/* ── HOME SCREEN ─────────────────────────────────────── */
function Home({ w, user, setTab }) {
  const isLg = w >= 1024, isMd = w >= 640;
  const [today, setToday]     = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.tracker.getToday(), api.courses.getAll()])
      .then(([t, c]) => { setToday(t.data); setCourses(c.courses?.slice(0, 3) || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: isLg ? "40px 48px" : "24px 20px", paddingBottom: isLg ? 40 : 90 }}>
      <div style={{ marginBottom:32 }}>
        <p style={{ fontFamily:sans, fontSize:14, color:T.muted, margin:"0 0 4px", fontWeight:500 }}>Xayrli kun</p>
        <h1 style={{ fontFamily:serif, fontSize: isLg ? 42 : 28, fontWeight:700, color:T.dark, margin:0, lineHeight:1.2 }}>
          Salom, {user?.name?.split(" ")[0] || "Foydalanuvchi"}!
        </h1>
      </div>

      <div style={{ display:"grid", gridTemplateColumns: isLg ? "1fr 1fr 1fr" : isMd ? "1fr 1fr" : "1fr", gap:20, marginBottom:32 }}>
        <div style={{ gridColumn: isLg ? "span 2" : "span 1", background:"linear-gradient(135deg,#d64f6e 0%,#c0415f 40%,#a33358 100%)", borderRadius:24, padding:"28px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,.07)", top:-60, right:-40 }}/>
          <p style={{ fontFamily:sans, fontSize:12, color:"rgba(255,255,255,.75)", margin:"0 0 16px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em" }}>Joriy Sikl</p>
          <div style={{ display:"flex", alignItems:"flex-end", gap:40, flexWrap:"wrap" }}>
            <div>
              <p style={{ fontFamily:serif, fontSize:64, fontWeight:700, color:T.white, margin:0, lineHeight:1 }}>{today?.dayOfCycle || "—"}</p>
              <p style={{ fontFamily:sans, fontSize:13, color:"rgba(255,255,255,.7)", margin:"4px 0 0" }}>Joriy kun</p>
            </div>
            <div>
              <p style={{ fontFamily:serif, fontSize:40, fontWeight:700, color:"rgba(255,255,255,.9)", margin:0, lineHeight:1 }}>{today?.daysUntilNext ?? "—"}</p>
              <p style={{ fontFamily:sans, fontSize:13, color:"rgba(255,255,255,.7)", margin:"4px 0 0" }}>Keyingi hayzgacha</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:20 }}>
            {[[300,300,-80,-60],[200,200,"auto","-30px","0","auto"],[120,120,"auto","auto","40px","40px"]].map(([w,h,t,r,b,l],i)=>(
              <div key={i} style={{position:"absolute",width:w,height:h,borderRadius:"50%",background:"rgba(255,255,255,.06)",top:t,right:r,bottom:b,left:l}} />
            ))}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateRows: "auto auto", gap:12 }}>
          <DailyTip onModulesClick={() => setTab("modules")} />
        </div>
      </div>

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <p style={{ fontFamily:sans, fontSize:11, fontWeight:800, color:T.muted, textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>So'nggi darslar</p>
        <button onClick={() => setTab("modules")} style={{ background:"none", border:"none", fontFamily:sans, fontSize:13, color:T.rose, fontWeight:700, cursor:"pointer" }}>Barchasi →</button>
      </div>
      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:40 }}>
          <div style={{ width:32, height:32, border:"3px solid rgba(214,79,110,.2)", borderTopColor:T.rose, borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns: isLg ? "repeat(3,1fr)" : isMd ? "repeat(2,1fr)" : "1fr", gap:16 }}>
          {courses.map((c, i) => (
            <Card key={i} onClick={() => setTab("modules")} style={{ padding:"20px" }}>
              <div style={{ width:48, height:48, borderRadius:14, background:c.bgColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:14 }}><img width={40} src={c.icon} /></div>
              <p style={{ fontFamily:sans, fontSize:14, fontWeight:700, color:T.dark, margin:"0 0 6px", lineHeight:1.4 }}>{c.title}</p>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontFamily:sans, fontSize:12, color:T.muted }}>{c.lessonCount} dars</span>
                {!user?.isPro && <Badge type={c.isPro ? "pro" : "free"}/>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── VIDEO PLAYER ─────────────────────────────────────── */
function streamVideoSrc(rawUrl) {
  if (!rawUrl) return rawUrl;
  const u = String(rawUrl);
  if (u.includes("youtube.com") || u.includes("youtu.be") || u.includes("vimeo.com")) return u;
  const base = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
  const full = u.startsWith("http://") || u.startsWith("https://") ? u : `${base}${u.startsWith("/") ? "" : "/"}${u}`;
  const token = storage.getToken();
  if (!token) return full;
  const sep = full.includes("?") ? "&" : "?";
  return `${full}${sep}token=${encodeURIComponent(token)}`;
}

function VideoPlayer({ url, title }) {
  const isYoutube = url?.includes("youtube.com") || url?.includes("youtu.be");
  const isVimeo   = url?.includes("vimeo.com");
  const getYoutubeId = u => { const m = u.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/); return m ? m[1] : null; };
  const getVimeoId   = u => { const m = u.match(/vimeo\.com\/(\d+)/); return m ? m[1] : null; };
  const playUrl = streamVideoSrc(url);

  if (!url) return (
    <div style={{ background:"#1a1a2e", borderRadius:16, aspectRatio:"16/9", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
      <span style={{ fontSize:40 }}>🎬</span>
      <p style={{ fontFamily:sans, fontSize:13, color:"rgba(255,255,255,.4)", margin:0 }}>Video yuklanmagan</p>
    </div>
  );

  if (isYoutube) {
    const id = getYoutubeId(url);
    return (
      <div style={{ borderRadius:16, overflow:"hidden", aspectRatio:"16/9" }}>
        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${id}?rel=0`}
          title={title} frameBorder="0" allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ display:"block" }}/>
      </div>
    );
  }
  if (isVimeo) {
    const id = getVimeoId(url);
    return (
      <div style={{ borderRadius:16, overflow:"hidden", aspectRatio:"16/9" }}>
        <iframe width="100%" height="100%" src={`https://player.vimeo.com/video/${id}`}
          title={title} frameBorder="0" allowFullScreen style={{ display:"block" }}/>
      </div>
    );
  }
  return (
    <video controls controlsList="nodownload" style={{ width:"100%", borderRadius:16, background:"#000", maxHeight:360 }} src={playUrl}>
      Brauzeringiz videoni qo'llab-quvvatlamaydi.
    </video>
  );
}

/* ── LESSON MODAL ─────────────────────────────────────── */
function LessonModal({ userIsPro, lesson, courseTitle, courseId, onClose, onNavigate }) {
  const [lessonData, setLessonData] = useState(lesson);
  const [, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    // if (courseId && lesson._id) {
    //   setLoading(true);
    //   api.courses.getLesson(courseId, lesson._id)
    //     .then(d => setLessonData({ ...d.lesson, navigation: d.navigation }))
    //     .catch(() => setLessonData(lesson))
    //     .finally(() => setLoading(false));
    // }
   if (lesson.isLocked) {
    setLessonData(lesson);
    return;
  }

  if (courseId && lesson._id) {
    setLoading(true);
    api.courses.getLesson(courseId, lesson._id)
      .then(d => setLessonData({ ...d.lesson, navigation: d.navigation }))
      .catch(error => {
        // 403 – Premium dars ekanligini aniqlash
        let isPremiumLocked = false;
        let lockMessage = 'Bu dars premium foydalanuvchilar uchun';

        // Turli xil error formatlarini tekshirish
        if (error.response?.status === 403) {
          isPremiumLocked = true;
          lockMessage = error.response.data?.message || lockMessage;
        } else if (error.status === 403) {
          isPremiumLocked = true;
          lockMessage = error.message || lockMessage;
        } else if (error.message?.includes('403') || error.toString().includes('403')) {
          isPremiumLocked = true;
        }

        if (isPremiumLocked) {
          setLessonData({
            ...lesson,
            isLocked: true,
            lockMessage: lockMessage
          });
        } else {
          // Boshqa xatoliklar – eski holatga tushamiz
          setLessonData(lesson);
        }
      })
      .finally(() => setLoading(false));
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps -- lesson obyektini to‘liq qaramlikka qo‘yish ortiqcha qayta yuklashlarni keltirib chiqaradi
  }, [courseId, lesson._id, lesson.isLocked]);

  const handleCompleteLesson = async () => {
    if (!courseId || !lessonData._id) return;
    setCompleting(true);
    try {
      const result = await api.courses.completeLesson(courseId, lessonData._id);
      if (result.nextLesson) {
        onNavigate?.(result.nextLesson);
      }
    } catch (err) {
      console.error("Darsni yakunlashda xato:", err.message);
    } finally {
      setCompleting(false);
    }
  };

  const nav = lessonData.navigation;

  if (!lessonData) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(0,0,0,.7)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ background:T.white, borderRadius:24, width:"100%", maxWidth:700, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 32px 80px rgba(0,0,0,.4)" }}>
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, background:T.white, zIndex:10, borderRadius:"24px 24px 0 0" }}>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:sans, fontSize:11, fontWeight:700, color:T.muted, margin:"0 0 2px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{courseTitle}</p>
            <p style={{ fontFamily:serif, fontSize:18, fontWeight:700, color:T.dark, margin:0 }}>{lessonData.title}</p>
            {nav && <p style={{ fontFamily:sans, fontSize:12, color:T.muted, margin:"4px 0 0" }}>Dars {nav.current}/{nav.total}</p>}
          </div>
          <button onClick={onClose} style={{ width:36, height:36, borderRadius:10, background:T.roseLight, border:"none", cursor:"pointer", fontSize:18, color:T.rose, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>✕</button>
        </div>
        <div style={{ padding:"24px" }}>
          {(lessonData.isLocked) ? (
            
            <div style={{ textAlign:"center", padding:"40px 20px" }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🔒</div>
              <p style={{ fontFamily:serif, fontSize:22, fontWeight:700, color:T.dark, margin:"0 0 8px" }}>{userIsPro ? "Bu dars hozircha ochiq emas" : "Premium kontent"}</p>
              <p style={{ fontFamily:sans, fontSize:14, color:T.muted, margin:"0 0 24px", lineHeight:1.6 }}>
                {userIsPro
                  ? "Agar muammo davom etsa, qo'llab-quvvatlash bilan bog'laning (+998 91 779 34 70)."
                  : "Bu dars faqat Premium obunachilarga ochiq. Premiumga o'ting va barcha darslarga kiring."}
              </p>
              {!userIsPro && (
                <Btn variant="gold" size="lg" onClick={openPaymentBot}> <img width={40} height={40} src={LOGO_PREMIUM} alt="premium" style={logoImgSvg} /> Premiumga o'tish</Btn>
              )}
            </div>
          ) : (
            <>
              {lessonData.videoUrl && <div style={{ marginBottom:24 }}><VideoPlayer url={lessonData.videoUrl} title={lessonData.title}/></div>}
              {lessonData.content && <div style={{ fontFamily:sans, fontSize:15, color:T.ink, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{lessonData.content}</div>}
              {lessonData.duration > 0 && <p style={{ fontFamily:sans, fontSize:12, color:T.muted, marginTop:16 }}>⏱ {lessonData.duration} daqiqa</p>}
              
              {!lessonData.isCompleted && (
                <Btn 
                  onClick={handleCompleteLesson} 
                  disabled={completing}
                  style={{ width:"100%", justifyContent:"center", marginTop:20 }}
                >
                  {completing ? "Saqlanmoqda..." : "✅ Darsni yakunlash"}
                </Btn>
              )}
              {lessonData.isCompleted && (
                <div style={{ marginTop:20, padding:"12px 16px", borderRadius:12, background:"#f0fdf4", border:"1.5px solid #86efac", fontFamily:sans, fontSize:13, color:"#166534", fontWeight:600, textAlign:"center" }}>
                  ✓ Siz ushbu darsni yakunladingiz
                </div>
              )}

              {nav && (
                <div style={{ display:"flex", gap:12, marginTop:24 }}>
                  {nav.prevLesson && (
                    <Btn 
                      variant="ghost" 
                      onClick={() => onNavigate?.(nav.prevLesson)}
                      style={{ flex:1, justifyContent:"center" }}
                    >
                      ‹ Oldingi dars
                    </Btn>
                  )}
                  {nav.nextLesson && (
                    <Btn 
                      onClick={() => onNavigate?.(nav.nextLesson)}
                      style={{ flex:1, justifyContent:"center" }}
                    >
                      Keyingi dars ›
                    </Btn>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── COURSE DETAIL ────────────────────────────────────── */
function CourseDetail({ course, userIsPro, onBack }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState("");
  const [active, setActive]   = useState(null);

  useEffect(() => {
    api.courses.getOne(course._id)
      .then(d => setLessons(d.lessons || []))
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, [course._id]);

  const handleNavigateLesson = (lesson) => {
    setActive(lesson);
  };

  return (
    <div>
      <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", fontFamily:sans, fontSize:14, fontWeight:700, color:T.rose, marginBottom:20, padding:0 }}>
        ‹ Orqaga
      </button>

      <div style={{ background:`linear-gradient(135deg,${course.color}18,${course.bgColor})`, border:`1px solid ${course.color}30`, borderRadius:20, padding:"24px", marginBottom:24 }}>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <div style={{ width:64, height:64, borderRadius:18, background:course.bgColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, border:`2px solid ${course.color}30` }}><img width={40} src={course.icon} /></div>
          <div>
            <p style={{ fontFamily:serif, fontSize:22, fontWeight:700, color:T.dark, margin:"0 0 4px" }}>{course.title}</p>
            <p style={{ fontFamily:sans, fontSize:13, color:T.muted, margin:"0 0 8px", lineHeight:1.5 }}>{course.description}</p>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              {!userIsPro && <Badge type={course.isPro ? "pro" : "free"}/>}
              <span style={{ fontFamily:sans, fontSize:12, color:T.muted, fontWeight:600 }}>📖 {lessons.length} dars</span>
            </div>
          </div>
        </div>
      </div>

      <Alert type="error" message={err}/>

      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:48 }}>
          <div style={{ width:36, height:36, border:"3px solid rgba(214,79,110,.2)", borderTopColor:T.rose, borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {lessons.map((l, idx) => (
            <Card key={l._id || idx} onClick={() => setActive(l)} style={{ padding:"16px 20px", cursor:"pointer" }}>
              <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:44, height:44, borderRadius:12, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, background: l.isLocked ? "#f5f5f5" : l.isCompleted ? "#f0fdf4" : course.bgColor, border: l.isLocked ? "1.5px dashed #ddd" : "none" }}>
                  {l.isLocked ? <img width={24} src="/Untitled (10)/mingcute_lock-fill.svg" alt="" /> : l.isCompleted ? "✅" : idx === 0 ? <img width={24} src="/Untitled (10)/mingcute_video-fill.svg" alt="" /> : <img width={24} src="/Untitled (10)/mingcute_video-fill.svg" alt="" />}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4, gap:8 }}>
                    <p style={{ fontFamily:sans, fontSize:14, fontWeight:700, color: l.isLocked ? T.muted : T.dark, margin:0 }}>{l.title}</p>
                    {!userIsPro && idx === 0 && <span style={{ fontFamily:sans, fontSize:10, fontWeight:700, color:T.green, background:"#f0fdf4", padding:"2px 8px", borderRadius:20 }}></span>}
                    {!userIsPro && l.isLocked && <span style={{ fontFamily:sans, fontSize:10, fontWeight:700, color:T.gold, background:"#fffbeb", padding:"2px 8px", borderRadius:20 }}>PREMIUM</span>}
                  </div>
                  {l.duration > 0 && <p style={{ fontFamily:sans, fontSize:12, color:T.muted, margin:0 }}>⏱ {l.duration} daqiqa</p>}
                </div>
                <span style={{ color: l.isLocked ? "#ddd" : T.muted, fontSize:20 }}>›</span>
              </div>
            </Card>
          ))}
          {!userIsPro && lessons.length > 1 && (
            <div style={{ background:"linear-gradient(135deg,#fffbeb,#fef9ef)", border:"1.5px solid rgba(233,168,37,.3)", borderRadius:18, padding:"18px 20px", textAlign:"center", marginTop:8 }}>
              <p style={{ fontFamily:sans, fontSize:12, color:"#b45309", margin:"0 0 14px" }}>Premium obunaga o'ting va barcha darslarga kiring</p>
              <Btn variant="gold" size="sm" onClick={openPaymentBot}>Premiumga o'tish <img width={40} height={40} src={LOGO_PREMIUM} alt="premium" style={logoImgSvg} /></Btn>
            </div>
          )}
        </div>
      )}
      {active && <LessonModal userIsPro={userIsPro} lesson={active} courseTitle={course.title} courseId={course._id} onClose={() => setActive(null)} onNavigate={handleNavigateLesson}/>}
    </div>
  );
}

/* ── MODULES SCREEN ───────────────────────────────────── */
function Modules({ w, user }) {
  const isLg = w >= 1024, isMd = w >= 640;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.courses.getAll()
      .then(d => setCourses(d.courses || []))
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  const free = courses.filter(c => !c.isPro);
  const pro  = courses.filter(c => c.isPro);
  const userIsPro = user?.isPro || user?.isAdmin;
  const totalLessons = courses.reduce((s, c) => s + (c.lessonCount || 0), 0);

  if (selected) return (
    <div style={{ padding: isLg ? "40px 48px" : "24px 20px", paddingBottom: isLg ? 40 : 90 }}>
      <CourseDetail course={selected} userIsPro={userIsPro} onBack={() => setSelected(null)}/>
    </div>
  );

  return (
    <div style={{ padding: isLg ? "40px 48px" : "24px 20px", paddingBottom: isLg ? 40 : 90 }}>
      <div style={{ marginBottom:32 }}>
        <h2 style={{ fontFamily:serif, fontSize: isLg ? 38 : 26, fontWeight:700, color:T.dark, margin:"0 0 8px" }}>Darslar</h2>
        <p style={{ fontFamily:sans, fontSize:14, color:T.muted, margin:0 }}>Sog'liq haqida bilimingizni kengaytiring</p>
      </div>
      <Alert type="error" message={err}/>

      <div style={{ display:"grid", gridTemplateColumns: userIsPro ? (isMd ? "repeat(2,1fr)" : "repeat(2,1fr)") : (isMd ? "repeat(4,1fr)" : "repeat(2,1fr)"), gap:16, marginBottom:36 }}>
        {(userIsPro
          ? [
              { n: courses.length + "", l:"Kurslar", bg:"linear-gradient(135deg,#d64f6e,#e8728a)" },
              { n: totalLessons + "", l:"Jami darslar", bg:"linear-gradient(135deg,#8657d6,#a78bfa)" },
            ]
          : [
              { n: free.length + "", l:"Bepul kurslar", bg:"linear-gradient(135deg,#0ea87a,#34d399)" },
              { n: pro.length + "", l:"Premium kurslar", bg:"linear-gradient(135deg,#e9a825,#f5bc3a)" },
              { n: totalLessons + "", l:"Jami darslar", bg:"linear-gradient(135deg,#8657d6,#a78bfa)" },
            ]
        ).map((s, i) => (
          <div key={i} style={{ background:s.bg, borderRadius:20, padding:"20px", color:T.white, boxShadow:"0 8px 24px rgba(0,0,0,.1)" }}>
            <p style={{ fontFamily:serif, fontSize:32, fontWeight:700, color:T.white, margin:"0 0 4px" }}>{s.n}</p>
            <p style={{ fontFamily:sans, fontSize:12, color:"rgba(255,255,255,.8)", margin:0, fontWeight:600 }}>{s.l}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:60 }}>
          <div style={{ width:40, height:40, border:"3px solid rgba(214,79,110,.2)", borderTopColor:T.rose, borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
        </div>
      ) : userIsPro ? (
        <>
          <p style={{ fontFamily:sans, fontSize:11, fontWeight:800, color:T.rose, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>Barcha kurslar</p>
          <div style={{ display:"grid", gridTemplateColumns: isLg ? "repeat(2,1fr)" : "1fr", gap:14, marginBottom:32 }}>
            {courses.map((c, i) => (
              <Card key={c._id || i} onClick={() => setSelected(c)} style={{ padding:"20px 22px", cursor:"pointer" }}>
                <div style={{ display:"flex", gap:16 }}>
                  <div style={{ width:56, height:56, borderRadius:16, background:c.bgColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}><img width={40} src={c.icon} alt="" /></div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:sans, fontSize:15, fontWeight:700, color:T.dark, margin:"0 0 6px", lineHeight:1.3 }}>{c.title}</p>
                    <p style={{ fontFamily:sans, fontSize:13, color:T.muted, margin:"0 0 10px", lineHeight:1.5 }}>{c.description}</p>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <span style={{ fontFamily:sans, fontSize:12, color:T.muted, fontWeight:600 }}>📖 {c.lessonCount} dars</span>
                      <Btn size="sm">Ochish →</Btn>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          <p style={{ fontFamily:sans, fontSize:11, fontWeight:800, color:T.green, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>✓ Bepul darslar</p>
          <div style={{ display:"grid", gridTemplateColumns: isLg ? "repeat(2,1fr)" : "1fr", gap:14, marginBottom:32 }}>
            {free.map((c, i) => (
              <Card key={i} onClick={() => setSelected(c)} style={{ padding:"20px 22px", cursor:"pointer" }}>
                <div style={{ display:"flex", gap:16 }}>
                  <div style={{ width:56, height:56, borderRadius:16, background:c.bgColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}><img width={40} src={c.icon} alt="" /></div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:6 }}>
                      <p style={{ fontFamily:sans, fontSize:15, fontWeight:700, color:T.dark, margin:0, lineHeight:1.3 }}>{c.title}</p>
                      <Badge type="free"/>
                    </div>
                    <p style={{ fontFamily:sans, fontSize:13, color:T.muted, margin:"0 0 10px", lineHeight:1.5 }}>{c.description}</p>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <span style={{ fontFamily:sans, fontSize:12, color:T.muted, fontWeight:600 }}>📖 {c.lessonCount} dars · 1-dars bepul</span>
                      <Btn size="sm">Ochish →</Btn>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
      
          <div style={{ background:"linear-gradient(145deg,#1e1015,#2d1520)", borderRadius:24, padding:"24px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:12 }}>
              <div>
                <p style={{ fontFamily:serif, fontSize: isLg ? 24 : 20, fontWeight:700, color:T.white, margin:"0 0 4px", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}><img width={52} height={52} src={LOGO_PREMIUM} alt="premium" style={logoImgSvg} /> Premium Darslar</p>
                <p style={{ fontFamily:sans, fontSize:13, color:"rgba(255,255,255,.55)", margin:0 }}>Premium rejimga o'ting va barchasini oching</p>
              </div>
              <Btn variant="gold" onClick={openPaymentBot}>Premiumga o'tish <img style={{ ...logoImgSvg, backgroundColor: 'rgba(255, 255, 255, 0.55)', borderRadius:12 }} width={52} height={52} src={LOGO_PREMIUM} alt="premium" /></Btn>
            </div>
            <div style={{ display:"grid", gridTemplateColumns: isLg ? "repeat(3,1fr)" : isMd ? "repeat(2,1fr)" : "1fr", gap:12 }}>
              {pro.map((c, i) => (
                <div key={i} onClick={() => setSelected(c)}
                  style={{ background:"rgba(255,255,255,.06)", borderRadius:18, padding:"18px", border:"1px solid rgba(255,255,255,.1)", cursor:"pointer" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:c.bgColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}><img width={40} src={c.icon} alt="" /></div>
                    <span style={{ fontSize:18 }}>🔒</span>
                  </div>
                  <p style={{ fontFamily:sans, fontSize:13, fontWeight:700, color:T.white, margin:"0 0 4px", lineHeight:1.3 }}>{c.title}</p>
                  <p style={{ fontFamily:sans, fontSize:11, color:"rgba(255,255,255,.45)", margin:0 }}>{c.lessonCount} dars · Premium</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── TRACKER SCREEN ───────────────────────────────────── */
function Tracker({ w }) {
  return (
    <div style={{ paddingBottom: w < 1024 ? 80 : 0 }}>
      <PorlaCalendar />
    </div>
  );
}

/* ── NOTIFICATIONS SCREEN ─────────────────────────────── */
function Notifications({ w, onRead }) {
  const isLg = w >= 1024;
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState("");

  // Anonymous QnA javoblarni ham notification sifatida ko'rsatish
  const load = useCallback(() => {
    Promise.all([
      api.notifications.getAll(),
      api.auth.me().then(res => res.user?.email ? api.qnaAnon.answers(res.user.email) : { answers: [] })
    ])
      .then(([notifData, qnaData]) => {
        const notifList = notifData.notifications || notifData.items || notifData.data || [];
        // isPublished true bo'lganlar hamma uchun, false bo'lganlar faqat o'ziga ko'rinadi
        const allQna = qnaData.answers || qnaData.qna || qnaData.items || [];
        const qnaNotifs = allQna.map(a => ({
          _id: a._id || (a.question + a.answer),
          type: "info",
          title: "Savolingizga javob",
          message: `Savol: ${a.question || ''}\nJavob: ${a.answer || ''}`,
          createdAt: a.answeredAt || a.createdAt || Date.now(),
          isRead: false
        }));
        setNotifs([...notifList, ...qnaNotifs]);
        if (onRead) onRead(0);
      })
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, [onRead]);

  useEffect(() => { load(); }, [load]);

  const markRead = async id => {
    await api.notifications.markRead(id).catch(() => {});
    setNotifs(p => p.map(n => n._id === id ? { ...n, isRead:true } : n));
  };

  const readAll = async () => {
    await api.notifications.readAll().catch(() => {});
    setNotifs(p => p.map(n => ({ ...n, isRead:true })));
  };

  const typeColor = { info:T.blue, reminder:T.purple, achievement:T.green, warning:T.gold };
  const typeIconSrc = {
    info: "/Untitled (11)/fontisto_info.svg",
    reminder: "/Untitled (11)/mingcute_light-line.svg",
    achievement: "/Untitled (11)/material-symbols_trophy-rounded.svg",
    warning: "/Untitled (11)/fluent_warning-12-regular.svg",
  };

  return (
    <div style={{ padding: isLg ? "40px 48px" : "24px 20px", paddingBottom: isLg ? 40 : 90 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28, flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 style={{ fontFamily:serif, fontSize: isLg ? 38 : 26, fontWeight:700, color:T.dark, margin:"0 0 6px" }}>Xabarlar</h2>
          <p style={{ fontFamily:sans, fontSize:14, color:T.muted, margin:0 }}>Admin va tizim xabarlari</p>
        </div>
        {notifs.some(n => !n.isRead) && (
          <Btn variant="ghost" size="sm" onClick={readAll}>✓ Barchasini o'qildi</Btn>
        )}
      </div>
      <Alert type="error" message={err}/>
      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:60 }}>
          <div style={{ width:36, height:36, border:"3px solid rgba(214,79,110,.2)", borderTopColor:T.rose, borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
        </div>
      ) : notifs.length === 0 ? (
        <Card style={{ padding:"48px 24px", textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🔕</div>
          <p style={{ fontFamily:serif, fontSize:20, fontWeight:700, color:T.dark, margin:"0 0 8px" }}>Xabar yo'q</p>
          <p style={{ fontFamily:sans, fontSize:14, color:T.muted, margin:0 }}>Yangi xabarlar shu yerda ko'rinadi</p>
        </Card>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {notifs.map(n => {
            const col = typeColor[n.type] || T.blue;
            return (
              <Card key={n._id} onClick={() => !n.isRead && markRead(n._id)}
                style={{ padding:"16px 20px", cursor: n.isRead ? "default" : "pointer", borderLeft:`3px solid ${n.isRead ? "transparent" : col}`, background: n.isRead ? T.white : "#fdfaff" }}>
                <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <div style={{ width:40, height:40, borderRadius:12, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background: n.isRead ? "#f5f5f5" : `${col}15` }}>
                    <img src={typeIconSrc[n.type] || typeIconSrc.info} alt="" width={22} height={22} style={{ objectFit:"contain" }} />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4, gap:8 }}>
                      <p style={{ fontFamily:sans, fontSize:14, fontWeight:700, whiteSpace:"nowrap", color: n.isRead ? T.muted : T.dark, margin:0 }}>{n.title}</p>
                      {!n.isRead && <span style={{ width:8, height:8, borderRadius:"50%", background:T.rose, flexShrink:0, display:"block" }}/>}
                    </div>
                    <p style={{ fontFamily:sans, fontSize:13, whiteSpace:"normal", color:T.muted, margin:"0 0 6px", lineHeight:1.5 }}>{n.message}</p>
                    <p style={{ fontFamily:sans, fontSize:11, color:T.muted, margin:0 }}>
                      {new Date(n.createdAt).toLocaleDateString("uz-UZ", { day:"numeric", month:"long", hour:"2-digit", minute:"2-digit" })}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── PROFILE SCREEN ───────────────────────────────────── */
function Profile({ w, user, onLogout }) {
  const isLg = w >= 1024, isMd = w >= 640;
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  const handleLogout = async () => {
    setLogoutLoading(true);
    await api.auth.logout();
    onLogout();
  };

  const handlePasswordChange = async () => {
    setPasswordMsg({ type: "", text: "" });
    
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      setPasswordMsg({ type: "error", text: "Barcha maydonlarni to'ldiring" });
      return;
    }
    
    if (passwordForm.new.length < 6) {
      setPasswordMsg({ type: "error", text: "Yangi parol kamida 6 belgidan iborat bo'lishi kerak" });
      return;
    }
    
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordMsg({ type: "error", text: "Parollar mos kelmadi" });
      return;
    }

    setPasswordLoading(true);
    try {
      const result = await api.auth.changePassword(passwordForm.current, passwordForm.new);
      setPasswordMsg({ type: "success", text: result.message || "Parol muvaffaqiyatli o'zgartirildi" });
      setPasswordForm({ current: "", new: "", confirm: "" });
      setTimeout(() => {
        setPasswordMode(false);
        setPasswordMsg({ type: "", text: "" });
      }, 2000);
    } catch (err) {
      setPasswordMsg({ type: "error", text: err.message || "Parol o'zgartirishda xato" });
    } finally {
      setPasswordLoading(false);
    }
  };

  const menuItems = [
    { iconSrc: PROFILE_MENU_ICONS.lessons, label:"Bajarilgan darslar", sub:`${user?.completedLessons?.length || 0} ta dars tugallangan`, color:T.blue,   bg:"#eff6ff" },
    { iconSrc: PROFILE_MENU_ICONS.email, label:"Email",              sub: user?.email || "",                                           color:T.green,  bg:"#f0fdf4" },
    { iconSrc: PROFILE_MENU_ICONS.lock, label:"Parol o'zgartirish",  sub:"Hisobi himoyasi",                                          color:T.gold,   bg:"#fffbeb", action: () => setPasswordMode(!passwordMode) },
    { iconSrc: PROFILE_MENU_ICONS.help, label:"Yordam markazi",     sub:"Biz bilan bog'lanish uchun telefon raqami: +998 91 779 34 70",                                          color:"#0891b2",bg:"#ecfeff" },
    { iconSrc: PROFILE_MENU_ICONS.logout, label:"Chiqish",            sub:"Hisobdan chiqish",                                           color:"#ef4444",bg:"#fef2f2", danger:true, action:handleLogout },
  ];

  return (
    <div style={{ padding: isLg ? "40px 48px" : "24px 20px", paddingBottom: isLg ? 40 : 90 }}>
      <div style={{ marginBottom:32 }}>
        <h2 style={{ fontFamily:serif, fontSize: isLg ? 38 : 26, fontWeight:700, color:T.dark, margin:"0 0 6px" }}>Profil</h2>
        <p style={{ fontFamily:sans, fontSize:14, color:T.muted, margin:0 }}>Hisob sozlamalari</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns: isLg ? "360px 1fr" : "1fr", gap:24 }}>
        <div>
          <div style={{ background:"linear-gradient(135deg,#d64f6e 0%,#b83155 50%,#92244a 100%)", borderRadius:24, padding:"32px 24px", textAlign:"center", marginBottom:20, position:"relative", overflow:"hidden", boxShadow:"0 16px 48px rgba(214,79,110,.3)" }}>
            <div style={{ position:"absolute", width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,.06)", top:-50, right:-40 }}/>
            <div style={{ position:"relative" }}>
              <div style={{ width:88, height:88, borderRadius:"50%", background:"rgba(255,255,255,.2)", border:"3px solid rgba(255,255,255,.5)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:40 }}>
                <img src="/svg/xabarlarandprofileicons/ix_user-profile-filled.svg" alt="" width={44} height={44} style={{ objectFit:"contain" }} />
              </div>
              <p style={{ fontFamily:serif, fontSize:26, fontWeight:700, color:T.white, margin:"0 0 4px" }}>{user?.name || "Foydalanuvchi"}</p>
              <p style={{ fontFamily:sans, fontSize:13, color:"rgba(255,255,255,.7)", margin:"0 0 16px" }}>{user?.email}</p>
              <span style={{ fontFamily:sans, fontSize:12, fontWeight:700, padding:"5px 14px", borderRadius:20, background: user?.isPro ? "linear-gradient(135deg,#e9a825,#f5bc3a)" : "rgba(255,255,255,.2)", color:"white" }}>
                {user?.isPro ? "Premium" : "Bepul"}
              </span>
            </div>
          </div>
          {!user?.isPro && (
            <div style={{ background:"linear-gradient(135deg,#fffbeb,#fef9ef)", border:"1.5px solid rgba(233,168,37,.3)", borderRadius:20, padding:"18px 20px" }}>
              <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:80, height:80, borderRadius:14, background:"rgba(233,168,37,.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}> <img width={52} height={52} src={LOGO_PREMIUM} alt="premium" style={logoImgSvg} /> </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:sans, fontSize:15, fontWeight:800, color:"#92400e", margin:"0 0 2px" }}>Premium : 37000 so'm</p>
                  <p style={{ fontFamily:sans, fontSize:12, color:"#b45309", margin:0 }}>Barcha darslarga cheksiz kirish</p>
                </div>
                <Btn variant="gold" size="sm" onClick={openPaymentBot}>Xarid</Btn>
              </div>
            </div>
          )}
          {user?.isPro && (
            <div style={{ background:"linear-gradient(135deg,#f0fdf4,#fbfcf8)", border:"1.5px solid rgba(16,185,129,.3)", borderRadius:20, padding:"18px 20px" }}>
              <div style={{ display:"flex", gap:14 }}>
                <div style={{ width:80, height:80, borderRadius:14, background:"rgba(16,185,129,.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}><img width={52} height={52} src={LOGO_PREMIUM} alt="premium" style={logoImgSvg} /></div>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:sans, fontSize:15, fontWeight:800, color:"#065f46", margin:"0 0 2px" }}>Premium faol</p>
                  <p style={{ fontFamily:sans, fontSize:12, color:"#047857", margin:0 }}>
                    {`${user.proDaysLeft} kun qoldi`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <p style={{ fontFamily:sans, fontSize:11, fontWeight:800, color:T.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>Sozlamalar</p>
          <div style={{ display:"grid", gridTemplateColumns: isMd && !isLg ? "1fr 1fr" : "1fr", gap:10 }}>
            {menuItems.map((m, i) => (
              <Card key={i} onClick={m.action || (() => {})} style={{ padding:"16px 18px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:13, background:m.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <img src={m.iconSrc} alt="" width={22} height={22} style={{ objectFit:"contain" }} />
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:sans, fontSize:14, fontWeight:700, color: m.danger ? "#ef4444" : T.dark, margin:"0 0 2px" }}>{m.label}</p>
                    <p style={{ fontFamily:sans, fontSize:12, color:T.muted, margin:0 }}>{m.sub}</p>
                  </div>
                  {m.action && logoutLoading && m.danger
                    ? <div style={{ width:16, height:16, border:"2px solid #fca5a5", borderTopColor:"#ef4444", borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
                    : <span style={{ color:T.muted, fontSize:20 }}>›</span>
                  }
                </div>
              </Card>
            ))}
          </div>

          {passwordMode && (
            <div style={{ marginTop:20, padding:"20px", borderRadius:20, background:"#f8f9fa", border:"1.5px solid #e5e7eb" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                <p style={{ fontFamily:sans, fontSize:14, fontWeight:700, color:T.dark, margin:0 }}>Parol o'zgartirish</p>
                <button onClick={() => setPasswordMode(false)} style={{ background:"none", border:"none", color:T.muted, fontSize:18, cursor:"pointer", fontWeight:700 }}>×</button>
              </div>

              <div style={{ marginBottom:14 }}>
                <label style={{ fontFamily:sans, fontSize:12, fontWeight:600, color:T.muted, display:"block", marginBottom:6 }}>Hozirgi parol</label>
                <input 
                  type="password" 
                  placeholder="Joriy parolni kiriting"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                  disabled={passwordLoading}
                  style={{ width:"100%", padding:"12px 14px", fontFamily:sans, fontSize:14, color:T.dark, background:"#fdf8f5", border:`1.5px solid ${T.border}`, borderRadius:12, outline:"none", boxSizing:"border-box", transition:"border .2s" }}
                />
              </div>

              <div style={{ marginBottom:14 }}>
                <label style={{ fontFamily:sans, fontSize:12, fontWeight:600, color:T.muted, display:"block", marginBottom:6 }}>Yangi parol</label>
                <input 
                  type="password" 
                  placeholder="Yangi parolni kiriting (min. 6 belgi)"
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                  disabled={passwordLoading}
                  style={{ width:"100%", padding:"12px 14px", fontFamily:sans, fontSize:14, color:T.dark, background:"#fdf8f5", border:`1.5px solid ${T.border}`, borderRadius:12, outline:"none", boxSizing:"border-box", transition:"border .2s" }}
                />
              </div>

              <div style={{ marginBottom:14 }}>
                <label style={{ fontFamily:sans, fontSize:12, fontWeight:600, color:T.muted, display:"block", marginBottom:6 }}>Parolni tasdiqlang</label>
                <input 
                  type="password" 
                  placeholder="Yangi parolni yana kiriting"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                  disabled={passwordLoading}
                  style={{ width:"100%", padding:"12px 14px", fontFamily:sans, fontSize:14, color:T.dark, background:"#fdf8f5", border:`1.5px solid ${T.border}`, borderRadius:12, outline:"none", boxSizing:"border-box", transition:"border .2s" }}
                />
              </div>

              {passwordMsg.text && (
                <div style={{ 
                  padding:"10px 14px", 
                  borderRadius:12, 
                  marginBottom:14,
                  background: passwordMsg.type === "error" ? "#fef2f2" : "#f0fdf4",
                  border: `1.5px solid ${passwordMsg.type === "error" ? "#fca5a5" : "#86efac"}`,
                  fontFamily:sans,
                  fontSize:12,
                  color: passwordMsg.type === "error" ? "#991b1b" : "#166534"
                }}>
                  {passwordMsg.text}
                </div>
              )}

              <Btn 
                onClick={handlePasswordChange} 
                disabled={passwordLoading}
                style={{ width:"100%", justifyContent:"center" }}
              >
                {passwordLoading ? "Saqlanmoqda..." : "Parolni o'zgartirish"}
              </Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════ */
export default function PorlaApp() {
  const [user, setUser]               = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [tab, setTab]                 = useState("home");
  const [unread, setUnread]           = useState(0);
  const w = useWindowWidth();
  const isDesktop = w >= 1024;

  /* Auth check */
  useEffect(() => {
    let mounted = true;
    async function checkAuth() {
      const savedUser = storage.getUser();
      const token     = storage.getToken();
      if (savedUser && token) {
        try {
          const d = await api.auth.me();
          if (!mounted) return;
          setUser(d.user);
          storage.setUser(d.user);
          setTab(d.user?.isAdmin ? "__admin__" : "home");
        } catch {
          storage.clear();
        }
      }
      if (!mounted) return;
      setAuthChecked(true);
    }

    checkAuth();
    return () => { mounted = false; };
  }, []);

  /* Unread count */
  useEffect(() => {
    if (!user || user.isAdmin) return;
    api.notifications.getAll()
      .then(d => setUnread(d.unreadCount || 0))
      .catch(() => {});
  }, [user, tab]);

  const handleLogin  = useCallback(u => { setUser(u); setTab(u?.isAdmin ? "__admin__" : "home"); }, []);
  const handleLogout = useCallback(() => { setUser(null); setTab("home"); }, []);

  /* Loading splash */
  if (!authChecked) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:T.cream, flexDirection:"column", gap:20 }}>
      <style>{`${FONTS} @keyframes spin{to{transform:rotate(360deg);}}`}</style>
      <div style={{ minHeight:104, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <img src={LOGO_DEFAULT} alt="Miila" width={96} height={96} style={logoImgSvg} />
      </div>
      <div style={{ width:32, height:32, border:"3px solid rgba(214,79,110,.2)", borderTopColor:T.rose, borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
    </div>
  );

  if (!user) return <AuthPage onLogin={handleLogin}/>;
  if (user.isAdmin || tab === "__admin__") return <AdminApp/>;

  const screens = {
    home:    <Home    w={w} user={user} setTab={setTab}/>,
    modules: <Modules w={w} user={user}/>,
    tracker: <Tracker w={w}/>,
    notifs:  <Notifications w={w} onRead={() => setUnread(0)}/>,
    profile: <Profile w={w} user={user} onLogout={handleLogout}/>,
  };

  return (
    <div style={{ fontFamily:sans, background:T.cream, minHeight:"100vh" }}>
      <style>{`
        ${FONTS}
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(214,79,110,.2); border-radius: 3px; }
        button { transition: all .2s; }
        button:active { transform: scale(.97) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {isDesktop ? (
        <div style={{ display:"flex", minHeight:"100vh" }}>
          <Sidebar tab={tab} setTab={setTab} user={user} unread={unread}/>
          <main style={{ flex:1, overflowY:"auto", background:T.cream }}>
            {screens[tab] || screens.home}
          </main>
        </div>
      ) : (
        <>
          <TopBar tab={tab} setTab={setTab} unread={unread}/>
          <main style={{ background:T.cream, minHeight:"calc(100vh - 60px)" }}>
            {screens[tab] || screens.home}
          </main>
          <BottomNav tab={tab} setTab={setTab} unread={unread}/>
        </>
      )}
      <QnaWidget />
    </div>
  );
}