// /**
//  * ╔══════════════════════════════════════════════════════╗
//  * ║     PORLA — Frontend (Login + App + API)             ║
//  * ║     Bu fayl api.js bilan ishlaydi                    ║
//  * ╚══════════════════════════════════════════════════════╝
//  *
//  * MUHIM: api.js faylini shu fayl bilan bir joyga qo'ying
//  * import api, { storage } from "./api";
//  */

// import { useState, useEffect, useCallback } from "react";
// import api, { storage } from "./api";   // ← api.js fayli
// import AdminApp from "./porla-admin";   // ← Admin panel

// /* ── FONTS & TOKENS ─────────────────────────────────── */
// const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');`;

// const T = {
//   rose:"#d64f6e", roseMid:"#e8728a", roseLight:"#fde8ec",
//   cream:"#fdf8f5", dark:"#221219", ink:"#4a2535",
//   muted:"#9a7585", border:"rgba(214,79,110,0.12)", white:"#ffffff",
//   gold:"#e9a825", green:"#0ea87a", blue:"#3b7de8", purple:"#8657d6",
//   error:"#ef4444", errorBg:"#fef2f2",
// };
// const serif = "'Playfair Display', Georgia, serif";
// const sans  = "'Plus Jakarta Sans', system-ui, sans-serif";

// /* ── WINDOW WIDTH HOOK ──────────────────────────────── */
// function useWindowWidth() {
//   const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
//   useEffect(() => {
//     const h = () => setW(window.innerWidth);
//     window.addEventListener("resize", h);
//     return () => window.removeEventListener("resize", h);
//   }, []);
//   return w;
// }

// /* ── SHARED UI ──────────────────────────────────────── */
// const Btn = ({ children, variant="primary", onClick, style={}, size="md", loading=false, disabled=false, type="button" }) => {
//   const [hov, setHov] = useState(false);
//   const p  = size==="sm"?"8px 16px":size==="lg"?"16px 36px":"12px 24px";
//   const fs = size==="sm"?13:size==="lg"?16:14;
//   const vs = {
//     primary:{ background:hov?"linear-gradient(135deg,#bf3a5a,#d64f6e)":"linear-gradient(135deg,#d64f6e,#e8728a)", color:T.white, boxShadow:hov?"0 12px 32px rgba(214,79,110,.38)":"0 4px 16px rgba(214,79,110,.25)", transform:hov&&!disabled?"translateY(-1px)":"none" },
//     ghost:  { background:hov?T.roseLight:"transparent", color:T.rose, border:`1.5px solid ${hov?T.rose:T.border}` },
//     gold:   { background:hov?"linear-gradient(135deg,#c8881a,#e9a825)":"linear-gradient(135deg,#e9a825,#f5bc3a)", color:T.white, boxShadow:hov?"0 12px 28px rgba(233,168,37,.38)":"0 4px 14px rgba(233,168,37,.22)", transform:hov&&!disabled?"translateY(-1px)":"none" },
//   };
//   return (
//     <button type={type} onClick={onClick} disabled={disabled||loading}
//       onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
//       style={{ fontFamily:sans, fontWeight:700, cursor:disabled||loading?"not-allowed":"pointer",
//         border:"none", borderRadius:size==="sm"?10:14, transition:"all .22s", padding:p, fontSize:fs,
//         display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8, opacity:disabled||loading?.65:1,
//         ...vs[variant], ...style }}>
//       {loading ? <span style={{width:14,height:14,border:"2px solid rgba(255,255,255,.4)",borderTopColor:"white",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}} /> : null}
//       {children}
//     </button>
//   );
// };

// const Card = ({ children, style={}, onClick }) => {
//   const [hov, setHov] = useState(false);
//   return (
//     <div onClick={onClick} onMouseEnter={()=>onClick&&setHov(true)} onMouseLeave={()=>setHov(false)}
//       style={{ background:T.white, borderRadius:20, border:`1px solid ${hov?"rgba(214,79,110,.2)":T.border}`,
//         boxShadow:hov?"0 16px 48px rgba(214,79,110,.12)":"0 2px 12px rgba(34,18,25,.06)",
//         transition:"all .25s", transform:hov&&onClick?"translateY(-2px)":"none",
//         cursor:onClick?"pointer":"default", ...style }}>
//       {children}
//     </div>
//   );
// };

// const Badge = ({ type }) => {
//   const s = type==="pro"
//     ?{bg:"linear-gradient(90deg,#e9a825,#f5bc3a)",color:T.white,label:"✦ PRO"}
//     :{bg:"rgba(14,168,122,.12)",color:T.green,border:"1px solid rgba(14,168,122,.25)",label:"✓ Bepul"};
//   return <span style={{fontFamily:sans,fontSize:10,fontWeight:800,padding:"3px 9px",borderRadius:20,background:s.bg,color:s.color,border:s.border,letterSpacing:"0.05em"}}>{s.label}</span>;
// };

// const Input = ({ label, type="text", value, onChange, placeholder, error, icon }) => (
//   <div style={{ marginBottom:20 }}>
//     {label && <label style={{fontFamily:sans,fontSize:13,fontWeight:700,color:T.ink,display:"block",marginBottom:6}}>{label}</label>}
//     <div style={{ position:"relative" }}>
//       {icon && <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:18,pointerEvents:"none"}}>{icon}</span>}
//       <input type={type} value={value} onChange={onChange} placeholder={placeholder}
//         style={{ width:"100%", padding: icon?"12px 14px 12px 42px":"12px 16px",
//           fontFamily:sans, fontSize:14, color:T.dark, background:T.white,
//           border:`1.5px solid ${error?"#ef4444":value?"rgba(214,79,110,.3)":T.border}`,
//           borderRadius:12, outline:"none", transition:"all .2s", boxSizing:"border-box",
//           boxShadow:error?"0 0 0 3px rgba(239,68,68,.1)":value?"0 0 0 3px rgba(214,79,110,.08)":"none" }}
//         onFocus={e=>{e.target.style.borderColor=error?"#ef4444":T.rose;e.target.style.boxShadow=error?"0 0 0 3px rgba(239,68,68,.1)":"0 0 0 3px rgba(214,79,110,.1)";}}
//         onBlur={e=>{e.target.style.borderColor=error?"#ef4444":value?"rgba(214,79,110,.3)":T.border;e.target.style.boxShadow=error?"0 0 0 3px rgba(239,68,68,.1)":value?"0 0 0 3px rgba(214,79,110,.08)":"none";}} />
//     </div>
//     {error && <p style={{fontFamily:sans,fontSize:12,color:"#ef4444",margin:"5px 0 0",fontWeight:500}}>⚠ {error}</p>}
//   </div>
// );

// const Alert = ({ type="error", message }) => {
//   if (!message) return null;
//   const c = type==="error"?{bg:"#fef2f2",border:"rgba(239,68,68,.2)",color:"#b91c1c",icon:"⚠"}:{bg:"#f0fdf4",border:"rgba(14,168,122,.2)",color:"#065f46",icon:"✓"};
//   return (
//     <div style={{background:c.bg,border:`1px solid ${c.border}`,borderRadius:12,padding:"12px 16px",marginBottom:20,fontFamily:sans,fontSize:13,color:c.color,fontWeight:500,display:"flex",gap:8,alignItems:"flex-start"}}>
//       <span>{c.icon}</span><span>{message}</span>
//     </div>
//   );
// };

// /* ════════════════════════════════════════════════════════
//    AUTH SCREENS: LOGIN & REGISTER
// ════════════════════════════════════════════════════════ */

// function AuthPage({ onLogin }) {
//   const [mode, setMode]       = useState("login"); // "login" | "register"
//   const [form, setForm]       = useState({ name:"", email:"", password:"", confirm:"" });
//   const [errors, setErrors]   = useState({});
//   const [apiError, setApiError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPwd, setShowPwd] = useState(false);
//   const w = useWindowWidth();
//   const isLg = w >= 900;

//   const set = (key) => (e) => {
//     setForm(f => ({ ...f, [key]: e.target.value }));
//     setErrors(er => ({ ...er, [key]: "" }));
//     setApiError("");
//   };

//   const validate = () => {
//     const e = {};
//     if (mode === "register" && !form.name.trim())     e.name     = "Ism kiritilishi shart";
//     if (!form.email.trim())                            e.email    = "Email kiritilishi shart";
//     else if (!/^\S+@\S+\.\S+$/.test(form.email))      e.email    = "Email noto'g'ri formatda";
//     if (!form.password)                                e.password = "Parol kiritilishi shart";
//     else if (form.password.length < 6)                 e.password = "Kamida 6 ta belgi";
//     if (mode === "register" && form.password !== form.confirm) e.confirm = "Parollar mos kelmadi";
//     return e;
//   };

//   const handleSubmit = async () => {
//     const errs = validate();
//     if (Object.keys(errs).length) { setErrors(errs); return; }
//     setLoading(true); setApiError(""); setSuccess("");
//     try {
//       if (mode === "login") {
//         const data = await api.auth.login(form.email, form.password);
//         setSuccess("Xush kelibsiz! Yo'naltirilmoqda...");
//         setTimeout(() => onLogin(data.user), 800);
//       } else {
//         const data = await api.auth.register(form.name, form.email, form.password);
//         setSuccess("Muvaffaqiyatli ro'yxatdan o'tdingiz! Xush kelibsiz 🌸");
//         setTimeout(() => onLogin(data.user), 1000);
//       }
//     } catch (err) {
//       setApiError(err.message || "Xatolik yuz berdi");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const switchMode = (m) => {
//     setMode(m);
//     setForm({ name:"", email:"", password:"", confirm:"" });
//     setErrors({}); setApiError(""); setSuccess("");
//   };

//   return (
//     <div style={{ minHeight:"100vh", display:"flex", background:T.cream, fontFamily:sans }}>
//       {/* ── LEFT PANEL (desktop only) ── */}
//       {isLg && (
//         <div style={{ width:"45%", background:"linear-gradient(145deg,#d64f6e 0%,#a83055 50%,#7a1f3a 100%)",
//           position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", padding:"60px 56px" }}>
//           {/* Decorative circles */}
//           {[[300,300,-80,-60],[200,200,"auto","-30px","0","auto"],[120,120,"auto","auto","40px","40px"]].map(([w,h,t,r,b,l],i)=>(
//             <div key={i} style={{position:"absolute",width:w,height:h,borderRadius:"50%",background:"rgba(255,255,255,.06)",top:t,right:r,bottom:b,left:l}} />
//           ))}
//           <div style={{ position:"relative", zIndex:1 }}>
//             {/* Logo */}
//             <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:56 }}>
//               <div style={{width:50,height:50,borderRadius:16,background:"rgba(255,255,255,.2)",border:"2px solid rgba(255,255,255,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,backdropFilter:"blur(10px)"}}>🌸</div>
//               <span style={{fontFamily:serif,fontSize:28,fontWeight:700,color:T.white}}>Porla</span>
//             </div>
//             <h2 style={{fontFamily:serif,fontSize:40,fontWeight:700,color:T.white,lineHeight:1.2,marginBottom:20}}>
//               Sog'lig'ingizni<br/><em>birinchi o'ringa</em><br/>qo'ying
//             </h2>
//             <p style={{fontFamily:sans,fontSize:15,color:"rgba(255,255,255,.75)",lineHeight:1.7,marginBottom:48,fontWeight:300}}>
//               Tsikl kuzatuvi, online maslahat va shaxsiy sog'liq tahlili — hammasi bir platformada.
//             </p>
//             {/* Feature list */}
//             {["🌸 Hayz tsiklini kuzatish","👩‍⚕️ Mutaxassis shifokorlar bilan maslahat","📚 Sog'liq bo'yicha kurslar","📊 Shaxsiy sog'liq tahlili"].map((f,i)=>(
//               <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
//                 <div style={{width:32,height:32,borderRadius:10,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{f.split(" ")[0]}</div>
//                 <span style={{fontFamily:sans,fontSize:14,color:"rgba(255,255,255,.85)",fontWeight:500}}>{f.slice(f.indexOf(" ")+1)}</span>
//               </div>
//             ))}
//             {/* Trust badges */}
//             <div style={{display:"flex",gap:24,marginTop:48,paddingTop:32,borderTop:"1px solid rgba(255,255,255,.15)"}}>
//               {[{n:"50K+",l:"Foydalanuvchi"},{n:"4.9★",l:"Reyting"},{n:"200+",l:"Shifokor"}].map((s,i)=>(
//                 <div key={i}>
//                   <p style={{fontFamily:serif,fontSize:22,fontWeight:700,color:T.white,margin:"0 0 2px"}}>{s.n}</p>
//                   <p style={{fontFamily:sans,fontSize:11,color:"rgba(255,255,255,.6)",margin:0,fontWeight:600}}>{s.l}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── RIGHT PANEL — Form ── */}
//       <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding: isLg?"60px 64px":"32px 24px" }}>
//         <div style={{ width:"100%", maxWidth:420 }}>
//           {/* Mobile logo */}
//           {!isLg && (
//             <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:40,justifyContent:"center"}}>
//               <div style={{width:40,height:40,borderRadius:14,background:"linear-gradient(135deg,#d64f6e,#e8728a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"0 6px 20px rgba(214,79,110,.3)"}}>🌸</div>
//               <span style={{fontFamily:serif,fontSize:24,fontWeight:700,color:T.dark}}>Porla</span>
//             </div>
//           )}

//           {/* Tab switcher */}
//           <div style={{display:"flex",background:"rgba(214,79,110,.08)",borderRadius:14,padding:4,marginBottom:32,border:`1px solid ${T.border}`}}>
//             {["login","register"].map(m=>(
//               <button key={m} onClick={()=>switchMode(m)} style={{
//                 flex:1, padding:"10px", border:"none", borderRadius:12,
//                 background:mode===m?"white":"transparent",
//                 fontFamily:sans, fontSize:14, fontWeight:mode===m?700:500,
//                 color:mode===m?T.rose:T.muted, cursor:"pointer", transition:"all .2s",
//                 boxShadow:mode===m?"0 2px 8px rgba(214,79,110,.12)":"none",
//               }}>
//                 {m==="login"?"Kirish":"Ro'yxatdan o'tish"}
//               </button>
//             ))}
//           </div>

//           {/* Title */}
//           <div style={{marginBottom:28}}>
//             <h1 style={{fontFamily:serif,fontSize:30,fontWeight:700,color:T.dark,margin:"0 0 6px"}}>
//               {mode==="login"?"Xush kelibsiz 👋":"Hisob yaratish 🌸"}
//             </h1>
//             <p style={{fontFamily:sans,fontSize:14,color:T.muted,margin:0,fontWeight:400}}>
//               {mode==="login"?"Porla platformasiga kiring":"Bepul ro'yxatdan o'ting — 30 soniya"}
//             </p>
//           </div>

//           {/* Alerts */}
//           <Alert type="error"   message={apiError} />
//           <Alert type="success" message={success} />

//           {/* Form fields */}
//           {mode==="register" && (
//             <Input label="To'liq ism" value={form.name} onChange={set("name")}
//               placeholder="Masalan: Malika Toshmatova" error={errors.name} icon="👤" />
//           )}
//           <Input label="Email manzil" type="email" value={form.email} onChange={set("email")}
//             placeholder="email@misol.com" error={errors.email} icon="📧" />
//           <div style={{position:"relative"}}>
//             <Input label="Parol" type={showPwd?"text":"password"} value={form.password} onChange={set("password")}
//               placeholder={mode==="login"?"Parolingizni kiriting":"Kamida 6 ta belgi"} error={errors.password} icon="🔒" />
//             <button onClick={()=>setShowPwd(p=>!p)} style={{position:"absolute",right:12,top:34,background:"none",border:"none",cursor:"pointer",fontSize:16,color:T.muted}}>
//               {showPwd?"🙈":"👁"}
//             </button>
//           </div>
//           {mode==="register" && (
//             <Input label="Parolni tasdiqlang" type="password" value={form.confirm} onChange={set("confirm")}
//               placeholder="Parolni qayta kiriting" error={errors.confirm} icon="✅" />
//           )}

//           {/* Submit */}
//           <Btn type="button" onClick={handleSubmit} loading={loading} style={{width:"100%",justifyContent:"center",marginTop:8}} size="lg">
//             {loading?"Kutilmoqda...":(mode==="login"?"Kirish →":"Hisob yaratish →")}
//           </Btn>

//           {/* Terms */}
//           {mode==="register" && (
//             <p style={{fontFamily:sans,fontSize:12,color:T.muted,textAlign:"center",marginTop:16,lineHeight:1.6}}>
//               Ro'yxatdan o'tish orqali siz{" "}
//               <a href="#" style={{color:T.rose,textDecoration:"none",fontWeight:600}}>Foydalanish shartlari</a>{" "}va{" "}
//               <a href="#" style={{color:T.rose,textDecoration:"none",fontWeight:600}}>Maxfiylik siyosati</a>ga rozilik bildirasiz.
//             </p>
//           )}
//           {mode==="login" && (
//             <p style={{fontFamily:sans,fontSize:13,color:T.muted,textAlign:"center",marginTop:20}}>
//               Hisobingiz yo'qmi?{" "}
//               <button onClick={()=>switchMode("register")} style={{background:"none",border:"none",color:T.rose,fontFamily:sans,fontSize:13,fontWeight:700,cursor:"pointer"}}>
//                 Ro'yxatdan o'ting
//               </button>
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ════════════════════════════════════════════════════════
//    MAIN APP SCREENS
// ════════════════════════════════════════════════════════ */

// /* ── NAV ── */
// const NAV = [
//   { key:"home",    label:"Bosh sahifa", emoji:"🏠" },
//   { key:"modules", label:"Kurslar",     emoji:"📚" },
//   { key:"tracker", label:"Sikl",        emoji:"📅" },
//   { key:"profile", label:"Profil",      emoji:"👤" },
// ];

// function Sidebar({ tab, setTab, user }) {
//   return (
//     <aside style={{ width:240, flexShrink:0, background:T.white, borderRight:`1px solid ${T.border}`,
//       display:"flex", flexDirection:"column", position:"sticky", top:0, height:"100vh",
//       boxShadow:"2px 0 20px rgba(34,18,25,.05)" }}>
//       <div style={{padding:"28px 24px 20px",borderBottom:`1px solid ${T.border}`}}>
//         <div style={{display:"flex",alignItems:"center",gap:10}}>
//           <div style={{width:40,height:40,borderRadius:14,background:"linear-gradient(135deg,#d64f6e,#e8728a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 6px 18px rgba(214,79,110,.3)"}}>🌸</div>
//           <span style={{fontFamily:serif,fontSize:22,fontWeight:700,color:T.dark}}>Porla</span>
//         </div>
//         <p style={{fontFamily:sans,fontSize:12,color:T.muted,margin:"8px 0 0",fontWeight:500}}>Salom, {user?.name?.split(" ")[0] || "Foydalanuvchi"} 👋</p>
//       </div>
//       <nav style={{flex:1,padding:"16px 12px"}}>
//         {NAV.map(n=>{
//           const a = tab===n.key;
//           return (
//             <button key={n.key} onClick={()=>setTab(n.key)} style={{
//               width:"100%",display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
//               borderRadius:14,border:"none",cursor:"pointer",marginBottom:4,transition:"all .2s",
//               background:a?"linear-gradient(135deg,rgba(214,79,110,.12),rgba(232,114,138,.08))":"transparent",
//               fontFamily:sans,fontSize:14,fontWeight:a?700:500,color:a?T.rose:T.ink,
//               boxShadow:a?"inset 0 0 0 1.5px rgba(214,79,110,.2)":"none",
//             }}>
//               <span style={{width:34,height:34,borderRadius:10,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,
//                 background:a?"linear-gradient(135deg,#d64f6e,#e8728a)":T.roseLight,
//                 boxShadow:a?"0 4px 12px rgba(214,79,110,.3)":"none"}}>{n.emoji}</span>
//               {n.label}
//               {a && <span style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:T.rose}}/>}
//             </button>
//           );
//         })}
//       </nav>
//       <div style={{padding:"0 12px 24px"}}>
//         {!user?.isPro && (
//           <div style={{background:"linear-gradient(135deg,#2c1a1e,#3d1f2a)",borderRadius:16,padding:"16px",boxShadow:"0 8px 24px rgba(34,18,25,.2)"}}>
//             <p style={{fontFamily:serif,fontSize:16,color:T.white,margin:"0 0 6px"}}>✦ Pro rejim</p>
//             <p style={{fontFamily:sans,fontSize:12,color:"rgba(255,255,255,.6)",margin:"0 0 12px",lineHeight:1.5}}>Barcha kurslarga kirish</p>
//             <Btn variant="gold" size="sm" style={{width:"100%",justifyContent:"center"}}>Ulash</Btn>
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// }

// function TopBar({ tab, setTab }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <>
//       <header style={{background:T.white,borderBottom:`1px solid ${T.border}`,padding:"0 20px",
//         height:60,display:"flex",alignItems:"center",justifyContent:"space-between",
//         position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(34,18,25,.06)"}}>
//         <div style={{display:"flex",alignItems:"center",gap:10}}>
//           <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#d64f6e,#e8728a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🌸</div>
//           <span style={{fontFamily:serif,fontSize:18,fontWeight:700,color:T.dark}}>Porla</span>
//         </div>
//         <span style={{fontFamily:sans,fontSize:14,fontWeight:700,color:T.ink}}>{NAV.find(n=>n.key===tab)?.label}</span>
//         <button onClick={()=>setOpen(o=>!o)} style={{width:36,height:36,background:T.roseLight,border:"none",borderRadius:10,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}>
//           {[0,1,2].map(i=><span key={i} style={{width:16,height:2,background:T.rose,borderRadius:1,display:"block"}}/>)}
//         </button>
//       </header>
//       {open && (
//         <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(34,18,25,.5)",backdropFilter:"blur(4px)"}} onClick={()=>setOpen(false)}>
//           <div onClick={e=>e.stopPropagation()} style={{position:"absolute",right:0,top:0,bottom:0,width:260,background:T.white,padding:"24px 16px"}}>
//             {NAV.map(n=>(
//               <button key={n.key} onClick={()=>{setTab(n.key);setOpen(false);}} style={{
//                 width:"100%",display:"flex",alignItems:"center",gap:12,padding:"13px 14px",
//                 borderRadius:14,border:"none",cursor:"pointer",marginBottom:4,
//                 background:tab===n.key?T.roseLight:"transparent",
//                 fontFamily:sans,fontSize:14,fontWeight:tab===n.key?700:500,color:tab===n.key?T.rose:T.ink,
//               }}>
//                 <span style={{fontSize:18}}>{n.emoji}</span>{n.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// function BottomNav({ tab, setTab }) {
//   return (
//     <nav style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:T.white,
//       borderTop:`1px solid ${T.border}`,display:"flex",padding:"8px 0 12px",
//       boxShadow:"0 -4px 20px rgba(34,18,25,.08)"}}>
//       {NAV.map(n=>{
//         const a = tab===n.key;
//         return (
//           <button key={n.key} onClick={()=>setTab(n.key)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 0"}}>
//             <span style={{width:40,height:28,borderRadius:10,background:a?"linear-gradient(135deg,#d64f6e,#e8728a)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,boxShadow:a?"0 4px 10px rgba(214,79,110,.25)":"none",transition:"all .2s"}}>{n.emoji}</span>
//             <span style={{fontFamily:sans,fontSize:10,fontWeight:a?700:500,color:a?T.rose:T.muted}}>{n.label}</span>
//           </button>
//         );
//       })}
//     </nav>
//   );
// }

// /* ── HOME SCREEN ─────────────────────────────────── */
// function Home({ w, user }) {
//   const isLg=w>=1024, isMd=w>=640;
//   const [today, setToday] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([api.tracker.getToday(), api.courses.getAll()])
//       .then(([t, c]) => { setToday(t.data); setCourses(c.courses?.slice(0,3) || []); })
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   const days = [{d:"Du",n:8},{d:"Se",n:9},{d:"Ch",n:10},{d:"Pa",n:11},{d:"Ju",n:12},{d:"Sh",n:13}];

//   return (
//     <div style={{padding:isLg?"40px 48px":"24px 20px",paddingBottom:isLg?40:90}}>
//       <div style={{marginBottom:32}}>
//         <p style={{fontFamily:sans,fontSize:14,color:T.muted,margin:"0 0 4px",fontWeight:500}}>Xayrli kun ✨</p>
//         <h1 style={{fontFamily:serif,fontSize:isLg?42:28,fontWeight:700,color:T.dark,margin:0,lineHeight:1.2}}>
//           Salom, {user?.name?.split(" ")[0] || "Foydalanuvchi"}!
//         </h1>
//       </div>

//       <div style={{display:"grid",gridTemplateColumns:isLg?"1fr 1fr 1fr":isMd?"1fr 1fr":"1fr",gap:20,marginBottom:36}}>
//         {/* Cycle card */}
//         <div style={{gridColumn:isLg?"span 2":"span 1",background:"linear-gradient(135deg,#d64f6e 0%,#c0415f 40%,#a33358 100%)",borderRadius:24,padding:"28px",position:"relative",overflow:"hidden"}}>
//           <div style={{position:"absolute",width:220,height:220,borderRadius:"50%",background:"rgba(255,255,255,.07)",top:-60,right:-40}}/>
//           <div style={{position:"relative"}}>
//             <p style={{fontFamily:sans,fontSize:12,color:"rgba(255,255,255,.75)",margin:"0 0 16px",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em"}}>Joriy Tsikl</p>
//             <div style={{display:"flex",alignItems:"flex-end",gap:40,flexWrap:"wrap"}}>
//               <div>
//                 <p style={{fontFamily:serif,fontSize:64,fontWeight:700,color:T.white,margin:0,lineHeight:1}}>{today?.dayOfCycle || "—"}</p>
//                 <p style={{fontFamily:sans,fontSize:13,color:"rgba(255,255,255,.7)",margin:"4px 0 0"}}>Joriy kun</p>
//               </div>
//               <div>
//                 <p style={{fontFamily:serif,fontSize:40,fontWeight:700,color:"rgba(255,255,255,.9)",margin:0,lineHeight:1}}>{today?.daysUntilNext ?? "—"}</p>
//                 <p style={{fontFamily:sans,fontSize:13,color:"rgba(255,255,255,.7)",margin:"4px 0 0"}}>Keyingi hayzgacha</p>
//               </div>
//             </div>
//             <div style={{display:"flex",gap:8,marginTop:20}}>
//               {days.map((x,i)=>(
//                 <div key={i} style={{flex:1,background:i===2?"rgba(255,255,255,.92)":"rgba(255,255,255,.18)",borderRadius:12,padding:"8px 0",textAlign:"center",border:i===2?"none":"1px solid rgba(255,255,255,.2)"}}>
//                   <p style={{fontFamily:sans,fontSize:10,color:i===2?T.rose:"rgba(255,255,255,.75)",margin:"0 0 3px",fontWeight:700}}>{x.d}</p>
//                   <p style={{fontFamily:sans,fontSize:14,fontWeight:700,color:i===2?T.rose:T.white,margin:0}}>{x.n}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Tip card */}
//         <div style={{background:"linear-gradient(145deg,#fffbf0,#fef6e4)",borderRadius:24,padding:"24px",border:"1.5px solid rgba(233,168,37,.2)"}}>
//           <div style={{width:44,height:44,borderRadius:14,background:"linear-gradient(135deg,#e9a825,#f5bc3a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:14,boxShadow:"0 6px 16px rgba(233,168,37,.3)"}}>🌙</div>
//           <p style={{fontFamily:sans,fontSize:11,fontWeight:700,color:T.gold,textTransform:"uppercase",letterSpacing:"0.07em",margin:"0 0 8px"}}>Kunlik maslahat</p>
//           <p style={{fontFamily:sans,fontSize:14,color:T.ink,lineHeight:1.6,margin:"0 0 16px"}}>Sikl ma'lumotlarini kiritish uchun kalendarga o'ting</p>
//           <Btn variant="gold" size="sm">Kalendar →</Btn>
//         </div>
//       </div>

//       {/* Journey */}
//       <p style={{fontFamily:sans,fontSize:11,fontWeight:800,color:T.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14}}>Sizning yo'lingiz</p>
//       <Card style={{padding:"24px 28px",marginBottom:32}}>
//         <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
//           <div style={{width:64,height:64,borderRadius:18,background:T.roseLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,flexShrink:0}}>🌱</div>
//           <div style={{flex:1,minWidth:200}}>
//             <p style={{fontFamily:serif,fontSize:20,fontWeight:700,color:T.dark,margin:"0 0 6px"}}>
//               {user?.completedLessons?.length > 0 ? `${user.completedLessons.length} ta dars tugallandi!` : "Hali hech narsa tugallanmagan"}
//             </p>
//             <p style={{fontFamily:sans,fontSize:14,color:T.muted,margin:"0 0 16px"}}>
//               {user?.completedLessons?.length > 0 ? "Davom eting! Ajoyib natijalar kutmoqda." : "Birinchi qadamni qo'ying! Sog'liqqa sarflangan har bir daqiqa foydali."}
//             </p>
//             <Btn>🚀 Birinchi darsni boshlash</Btn>
//           </div>
//           <div style={{textAlign:"center",flexShrink:0}}>
//             <svg width="80" height="80" viewBox="0 0 80 80">
//               <circle cx="40" cy="40" r="32" fill="none" stroke={T.roseLight} strokeWidth="8"/>
//               <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#d64f6e"/><stop offset="1" stopColor="#e8728a"/></linearGradient></defs>
//               <circle cx="40" cy="40" r="32" fill="none" stroke="url(#rg)" strokeWidth="8" strokeDasharray="201" strokeDashoffset={201-(201*Math.min((user?.completedLessons?.length||0)/10,1))} strokeLinecap="round" transform="rotate(-90 40 40)"/>
//               <text x="40" y="45" textAnchor="middle" fontFamily={sans} fontSize="14" fontWeight="700" fill={T.rose}>{user?.completedLessons?.length||0}%</text>
//             </svg>
//           </div>
//         </div>
//       </Card>

//       {/* Courses */}
//       <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
//         <p style={{fontFamily:sans,fontSize:11,fontWeight:800,color:T.muted,textTransform:"uppercase",letterSpacing:"0.1em",margin:0}}>Kurslar</p>
//         <button style={{background:"none",border:"none",fontFamily:sans,fontSize:13,color:T.rose,fontWeight:700,cursor:"pointer"}}>Barchasi →</button>
//       </div>
//       {loading ? (
//         <div style={{display:"flex",justifyContent:"center",padding:40}}>
//           <div style={{width:32,height:32,border:"3px solid rgba(214,79,110,.2)",borderTopColor:T.rose,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
//         </div>
//       ) : (
//         <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(3,1fr)":isMd?"repeat(2,1fr)":"1fr",gap:16}}>
//           {courses.map((c,i)=>(
//             <Card key={i} onClick={()=>{}} style={{padding:"20px"}}>
//               <div style={{width:48,height:48,borderRadius:14,background:c.bgColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:14}}>{c.icon}</div>
//               <p style={{fontFamily:sans,fontSize:14,fontWeight:700,color:T.dark,margin:"0 0 6px",lineHeight:1.4}}>{c.title}</p>
//               <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
//                 <span style={{fontFamily:sans,fontSize:12,color:T.muted}}>{c.lessonCount} dars</span>
//                 <Badge type={c.isPro?"pro":"free"}/>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ── MODULES SCREEN ──────────────────────────────── */
// function Modules({ w }) {
//   const isLg=w>=1024, isMd=w>=640;
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     api.courses.getAll()
//       .then(d => setCourses(d.courses || []))
//       .catch(e => setErr(e.message))
//       .finally(() => setLoading(false));
//   }, []);

//   const free = courses.filter(c => !c.isPro);
//   const pro  = courses.filter(c => c.isPro);

//   return (
//     <div style={{padding:isLg?"40px 48px":"24px 20px",paddingBottom:isLg?40:90}}>
//       <div style={{marginBottom:32}}>
//         <h2 style={{fontFamily:serif,fontSize:isLg?38:26,fontWeight:700,color:T.dark,margin:"0 0 8px"}}>Kurslar</h2>
//         <p style={{fontFamily:sans,fontSize:14,color:T.muted,margin:0}}>Sog'liq haqida bilimingizni kengaytiring</p>
//       </div>
//       <Alert type="error" message={err}/>
//       {/* Stats */}
//       <div style={{display:"grid",gridTemplateColumns:isMd?"repeat(4,1fr)":"repeat(2,1fr)",gap:16,marginBottom:36}}>
//         {[{n:courses.length+"",l:"Jami kurslar",bg:"linear-gradient(135deg,#d64f6e,#e8728a)"},{n:free.length+"",l:"Bepul kurslar",bg:"linear-gradient(135deg,#0ea87a,#34d399)"},{n:pro.length+"",l:"Pro kurslar",bg:"linear-gradient(135deg,#e9a825,#f5bc3a)"},{n:courses.reduce((s,c)=>s+(c.lessonCount||0),0)+"",l:"Jami darslar",bg:"linear-gradient(135deg,#8657d6,#a78bfa)"}].map((s,i)=>(
//           <div key={i} style={{background:s.bg,borderRadius:20,padding:"20px",color:T.white,boxShadow:"0 8px 24px rgba(0,0,0,.1)"}}>
//             <p style={{fontFamily:serif,fontSize:32,fontWeight:700,color:T.white,margin:"0 0 4px"}}>{s.n}</p>
//             <p style={{fontFamily:sans,fontSize:12,color:"rgba(255,255,255,.8)",margin:0,fontWeight:600}}>{s.l}</p>
//           </div>
//         ))}
//       </div>
//       {loading ? (
//         <div style={{display:"flex",justifyContent:"center",padding:60}}>
//           <div style={{width:40,height:40,border:"3px solid rgba(214,79,110,.2)",borderTopColor:T.rose,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
//         </div>
//       ) : (
//         <>
//           <p style={{fontFamily:sans,fontSize:11,fontWeight:800,color:T.green,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14}}>✓ Bepul kurslar</p>
//           <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(2,1fr)":"1fr",gap:14,marginBottom:32}}>
//             {free.map((c,i)=>(
//               <Card key={i} onClick={()=>{}} style={{padding:"20px 22px"}}>
//                 <div style={{display:"flex",gap:16}}>
//                   <div style={{width:56,height:56,borderRadius:16,background:c.bgColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{c.icon}</div>
//                   <div style={{flex:1}}>
//                     <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6}}>
//                       <p style={{fontFamily:sans,fontSize:15,fontWeight:700,color:T.dark,margin:0,lineHeight:1.3}}>{c.title}</p>
//                       <Badge type="free"/>
//                     </div>
//                     <p style={{fontFamily:sans,fontSize:13,color:T.muted,margin:"0 0 10px",lineHeight:1.5}}>{c.description}</p>
//                     <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
//                       <span style={{fontFamily:sans,fontSize:12,color:T.muted,fontWeight:600}}>📖 {c.lessonCount} dars</span>
//                       <Btn size="sm">Boshlash →</Btn>
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//           <div style={{background:"linear-gradient(145deg,#1e1015,#2d1520)",borderRadius:24,padding:"24px"}}>
//             <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
//               <div>
//                 <p style={{fontFamily:serif,fontSize:isLg?24:20,fontWeight:700,color:T.white,margin:"0 0 4px"}}>✦ Pro Kurslar</p>
//                 <p style={{fontFamily:sans,fontSize:13,color:"rgba(255,255,255,.55)",margin:0}}>Pro rejimga o'ting va barchasini oching</p>
//               </div>
//               <Btn variant="gold">Pro ga o'tish ✦</Btn>
//             </div>
//             <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(3,1fr)":isMd?"repeat(2,1fr)":"1fr",gap:12}}>
//               {pro.map((c,i)=>(
//                 <div key={i} style={{background:"rgba(255,255,255,.06)",borderRadius:18,padding:"18px",border:"1px solid rgba(255,255,255,.1)"}}>
//                   <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
//                     <div style={{width:44,height:44,borderRadius:12,background:c.bgColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{c.icon}</div>
//                     <span style={{fontSize:18}}>🔒</span>
//                   </div>
//                   <p style={{fontFamily:sans,fontSize:13,fontWeight:700,color:T.white,margin:"0 0 4px",lineHeight:1.3}}>{c.title}</p>
//                   <p style={{fontFamily:sans,fontSize:11,color:"rgba(255,255,255,.45)",margin:0}}>{c.lessonCount} dars · Pro</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// /* ── TRACKER SCREEN ──────────────────────────────── */
// function Tracker({ w }) {
//   const isLg=w>=1024;
//   const [selected, setSelected] = useState([]);
//   const [phase, setPhase] = useState("hayz");
//   const [todayData, setTodayData] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [msg, setMsg] = useState("");

//   useEffect(() => {
//     api.tracker.getToday()
//       .then(d => setTodayData(d.data))
//       .catch(() => {});
//   }, []);

//   const weekDays = ["Du","Se","Ch","Pa","Ju","Sh","Ya"];
//   const cells = [];
//   for (let i=0;i<6;i++) cells.push(null);
//   for (let i=1;i<=31;i++) cells.push(i);

//   const toggle = d => setSelected(p => p.includes(d) ? p.filter(x=>x!==d) : [...p,d]);

//   const handleSave = async () => {
//     if (!selected.length) return;
//     setSaving(true); setMsg("");
//     try {
//       const startDate = `2026-03-${String(selected[0]).padStart(2,"0")}`;
//       await api.tracker.startCycle(startDate, 28);
//       setMsg("✓ Tsikl muvaffaqiyatli saqlandi!");
//     } catch (e) {
//       setMsg("⚠ " + e.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const phases = [
//     {key:"hayz",label:"Hayz",color:T.rose},{key:"taxminiy",label:"Taxminiy",color:"#f97316"},{key:"bugun",label:"Bugun",color:T.ink},
//   ];

//   return (
//     <div style={{padding:isLg?"40px 48px":"24px 20px",paddingBottom:isLg?40:90}}>
//       <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32,flexWrap:"wrap",gap:12}}>
//         <div>
//           <h2 style={{fontFamily:serif,fontSize:isLg?38:26,fontWeight:700,color:T.dark,margin:"0 0 6px"}}>Porla Kalendari</h2>
//           <p style={{fontFamily:sans,fontSize:14,color:T.muted,margin:0}}>Siklni kuzatib boring</p>
//         </div>
//       </div>
//       <div style={{display:"grid",gridTemplateColumns:isLg?"1fr 320px":"1fr",gap:24}}>
//         <div>
//           <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
//             <div style={{background:"linear-gradient(135deg,#d64f6e,#e8728a)",borderRadius:20,padding:"22px"}}>
//               <p style={{fontFamily:sans,fontSize:11,fontWeight:700,color:"rgba(255,255,255,.75)",textTransform:"uppercase",letterSpacing:"0.06em",margin:"0 0 8px"}}>Keyingi hayzgacha</p>
//               <p style={{fontFamily:serif,fontSize:44,fontWeight:700,color:T.white,margin:0,lineHeight:1}}>{todayData?.daysUntilNext ?? "—"}</p>
//               <p style={{fontFamily:sans,fontSize:12,color:"rgba(255,255,255,.6)",margin:"6px 0 0"}}>kun</p>
//             </div>
//             <Card style={{padding:"22px"}}>
//               <p style={{fontFamily:sans,fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",margin:"0 0 8px"}}>Sikl kuni</p>
//               <p style={{fontFamily:serif,fontSize:44,fontWeight:700,color:T.rose,margin:0,lineHeight:1}}>{todayData?.dayOfCycle ?? "—"}</p>
//               <p style={{fontFamily:sans,fontSize:12,color:T.muted,margin:"6px 0 0"}}>{todayData?.cycleLength || 28} kunlik sikldan</p>
//             </Card>
//           </div>

//           <Card style={{padding:"18px 20px",marginBottom:20}}>
//             <p style={{fontFamily:sans,fontSize:13,fontWeight:700,color:T.ink,margin:"0 0 12px"}}>Tsikl turini tanlang</p>
//             <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
//               {phases.map(p=>(
//                 <button key={p.key} onClick={()=>setPhase(p.key)} style={{
//                   display:"flex",alignItems:"center",gap:7,padding:"7px 16px",borderRadius:30,
//                   background:phase===p.key?`${p.color}15`:"transparent",
//                   border:`1.5px solid ${phase===p.key?p.color:"rgba(0,0,0,.1)"}`,
//                   fontFamily:sans,fontSize:13,fontWeight:600,color:phase===p.key?p.color:T.muted,cursor:"pointer",transition:"all .2s",
//                 }}>
//                   <span style={{width:9,height:9,borderRadius:"50%",background:p.color,display:"inline-block",flexShrink:0}}/>
//                   {p.label}
//                 </button>
//               ))}
//             </div>
//           </Card>

//           <Card style={{padding:"24px"}}>
//             <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
//               <button style={{width:36,height:36,borderRadius:10,background:T.roseLight,border:"none",cursor:"pointer",fontSize:18,color:T.rose,fontWeight:700}}>‹</button>
//               <h3 style={{fontFamily:serif,fontSize:20,fontWeight:700,color:T.dark,margin:0}}>March 2026</h3>
//               <button style={{width:36,height:36,borderRadius:10,background:T.roseLight,border:"none",cursor:"pointer",fontSize:18,color:T.rose,fontWeight:700}}>›</button>
//             </div>
//             <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,marginBottom:10}}>
//               {weekDays.map(d=><div key={d} style={{textAlign:"center",fontFamily:sans,fontSize:11,fontWeight:800,color:T.muted,padding:"4px 0"}}>{d}</div>)}
//             </div>
//             <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6}}>
//               {cells.map((d,i)=>{
//                 if(!d) return <div key={i}/>;
//                 const isToday=d===10, isSel=selected.includes(d);
//                 return (
//                   <button key={i} onClick={()=>toggle(d)} style={{
//                     aspectRatio:"1/1",borderRadius:12,
//                     border:isToday?`2px solid ${T.rose}`:"none",
//                     background:isSel?"linear-gradient(135deg,#d64f6e,#e8728a)":isToday?T.roseLight:"transparent",
//                     color:isSel?T.white:isToday?T.rose:T.dark,
//                     fontFamily:sans,fontSize:13,fontWeight:(isSel||isToday)?700:400,
//                     cursor:"pointer",transition:"all .15s",display:"flex",alignItems:"center",justifyContent:"center",minHeight:36,
//                   }}>{d}</button>
//                 );
//               })}
//             </div>
//           </Card>

//           {msg && <p style={{fontFamily:sans,fontSize:13,color:msg.startsWith("✓")?T.green:T.error,margin:"12px 0 0",fontWeight:600}}>{msg}</p>}
//           <Btn onClick={handleSave} loading={saving} style={{width:"100%",justifyContent:"center",marginTop:16}} size="lg">✓ Saqlash</Btn>
//         </div>

//         {isLg && (
//           <div>
//             <Card style={{padding:"22px",marginBottom:16}}>
//               <p style={{fontFamily:sans,fontSize:11,fontWeight:800,color:T.muted,textTransform:"uppercase",letterSpacing:"0.1em",margin:"0 0 16px"}}>Tsikl fazalari</p>
//               {[{label:"Menstruatsiya",days:"1–5",color:"#ef4444",desc:"Qon ketish davri"},{label:"Follikulyar",days:"6–13",color:"#f97316",desc:"Yetilish davri"},{label:"Ovulyatsiya",days:"14",color:T.green,desc:"Eng hosildor kun"},{label:"Lyuteal",days:"15–28",color:T.purple,desc:"Muvozanat davri"}].map((f,i)=>(
//                 <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:14}}>
//                   <div style={{width:10,height:10,borderRadius:"50%",background:f.color,flexShrink:0,marginTop:4}}/>
//                   <div>
//                     <div style={{display:"flex",gap:8,alignItems:"center"}}>
//                       <p style={{fontFamily:sans,fontSize:13,fontWeight:700,color:T.dark,margin:0}}>{f.label}</p>
//                       <span style={{fontFamily:sans,fontSize:11,color:T.muted,background:T.cream,padding:"2px 8px",borderRadius:20}}>{f.days}-kun</span>
//                     </div>
//                     <p style={{fontFamily:sans,fontSize:12,color:T.muted,margin:"2px 0 0"}}>{f.desc}</p>
//                   </div>
//                 </div>
//               ))}
//             </Card>
//             <div style={{background:"linear-gradient(135deg,#d64f6e,#c0415f)",borderRadius:20,padding:"20px"}}>
//               <p style={{fontFamily:serif,fontSize:18,fontWeight:700,color:T.white,margin:"0 0 8px"}}>💡 Bilasizmi?</p>
//               <p style={{fontFamily:sans,fontSize:13,color:"rgba(255,255,255,.8)",lineHeight:1.6,margin:"0 0 16px"}}>O'rtacha tsikl 28 kun, lekin 21–35 kun ham normal hisoblanadi.</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ── PROFILE SCREEN ──────────────────────────────── */
// function Profile({ w, user, onLogout }) {
//   const isLg=w>=1024, isMd=w>=640;
//   const [loading, setLoading] = useState(false);

//   const handleLogout = async () => {
//     setLoading(true);
//     await api.auth.logout();
//     onLogout();
//   };

//   const menuItems = [
//     {icon:"📚",label:"Bajarilgan darslar",sub:`${user?.completedLessons?.length||0} ta dars tugallangan`,color:T.blue,bg:"#eff6ff"},
//     {icon:"📧",label:"Email",sub:user?.email||"",color:T.green,bg:"#f0fdf4"},
//     {icon:"🔔",label:"Bildirishnomalar",sub:"Yoqilgan",color:T.purple,bg:"#f3f0ff",arrow:true},
//     {icon:"🔒",label:"Maxfiylik",sub:"Ma'lumotlar himoyasi",color:T.gold,bg:"#fffbeb",arrow:true},
//     {icon:"❓",label:"Yordam markazi",sub:"Savol va javoblar",color:"#0891b2",bg:"#ecfeff",arrow:true},
//     {icon:"🚪",label:"Chiqish",sub:"Hisobdan chiqish",color:"#ef4444",bg:"#fef2f2",arrow:true,danger:true,action:handleLogout},
//   ];

//   return (
//     <div style={{padding:isLg?"40px 48px":"24px 20px",paddingBottom:isLg?40:90}}>
//       <div style={{marginBottom:32}}>
//         <h2 style={{fontFamily:serif,fontSize:isLg?38:26,fontWeight:700,color:T.dark,margin:"0 0 6px"}}>Profil</h2>
//         <p style={{fontFamily:sans,fontSize:14,color:T.muted,margin:0}}>Hisob sozlamalari</p>
//       </div>
//       <div style={{display:"grid",gridTemplateColumns:isLg?"360px 1fr":"1fr",gap:24}}>
//         <div>
//           <div style={{background:"linear-gradient(135deg,#d64f6e 0%,#b83155 50%,#92244a 100%)",borderRadius:24,padding:"32px 24px",textAlign:"center",marginBottom:20,position:"relative",overflow:"hidden",boxShadow:"0 16px 48px rgba(214,79,110,.3)"}}>
//             <div style={{position:"absolute",width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,.06)",top:-50,right:-40}}/>
//             <div style={{position:"relative"}}>
//               <div style={{width:88,height:88,borderRadius:"50%",background:"rgba(255,255,255,.2)",border:"3px solid rgba(255,255,255,.5)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:40}}>👤</div>
//               <p style={{fontFamily:serif,fontSize:26,fontWeight:700,color:T.white,margin:"0 0 4px"}}>{user?.name || "Foydalanuvchi"}</p>
//               <p style={{fontFamily:sans,fontSize:13,color:"rgba(255,255,255,.7)",margin:"0 0 20px"}}>{user?.email}</p>
//               <div style={{display:"flex",gap:12,justifyContent:"center"}}>
//                 {[{n:user?.completedLessons?.length||0,l:"Darslar"},{n:"—",l:"Kurslar"}].map((s,i)=>(
//                   <div key={i} style={{background:"rgba(255,255,255,.15)",borderRadius:14,padding:"10px 22px",border:"1px solid rgba(255,255,255,.2)"}}>
//                     <p style={{fontFamily:serif,fontSize:24,fontWeight:700,color:T.white,margin:"0 0 2px"}}>{s.n}</p>
//                     <p style={{fontFamily:sans,fontSize:11,color:"rgba(255,255,255,.7)",margin:0,fontWeight:600}}>{s.l}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//           {!user?.isPro && (
//             <div style={{background:"linear-gradient(135deg,#fffbeb,#fef9ef)",border:"1.5px solid rgba(233,168,37,.3)",borderRadius:20,padding:"18px 20px"}}>
//               <div style={{display:"flex",gap:14,alignItems:"center"}}>
//                 <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#e9a825,#f5bc3a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>✦</div>
//                 <div style={{flex:1}}>
//                   <p style={{fontFamily:sans,fontSize:15,fontWeight:800,color:"#92400e",margin:"0 0 2px"}}>Pro ga o'ting</p>
//                   <p style={{fontFamily:sans,fontSize:12,color:"#b45309",margin:0}}>Barcha kurslarga cheksiz kirish</p>
//                 </div>
//                 <Btn variant="gold" size="sm">Ulash</Btn>
//               </div>
//             </div>
//           )}
//         </div>
//         <div>
//           <p style={{fontFamily:sans,fontSize:11,fontWeight:800,color:T.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14}}>Sozlamalar</p>
//           <div style={{display:"grid",gridTemplateColumns:isMd&&!isLg?"1fr 1fr":"1fr",gap:10}}>
//             {menuItems.map((m,i)=>(
//               <Card key={i} onClick={m.action||(()=>{})} style={{padding:"16px 18px"}}>
//                 <div style={{display:"flex",alignItems:"center",gap:14}}>
//                   <div style={{width:44,height:44,borderRadius:13,background:m.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{m.icon}</div>
//                   <div style={{flex:1}}>
//                     <p style={{fontFamily:sans,fontSize:14,fontWeight:700,color:m.danger?"#ef4444":T.dark,margin:"0 0 2px"}}>{m.label}</p>
//                     <p style={{fontFamily:sans,fontSize:12,color:T.muted,margin:0}}>{m.sub}</p>
//                   </div>
//                   {m.arrow && <span style={{color:T.muted,fontSize:20}}>›</span>}
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ════════════════════════════════════════════════════════
//    ROOT — Auth guard + App shell
// ════════════════════════════════════════════════════════ */
// export default function PorlaApp() {
//   const [user, setUser] = useState(null);
//   const [authChecked, setAuthChecked] = useState(false);
//   const [tab, setTab] = useState("home");
//   const w = useWindowWidth();
//   const isDesktop = w >= 1024;

//   // Auth check on mount
//   useEffect(() => {
//     const savedUser = storage.getUser();
//     const token     = storage.getToken();
//     if (savedUser && token) {
//       // Tokenni tekshirish
//       api.auth.me()
//         .then(d => { setUser(d.user); storage.setUser(d.user); setTab(d.user?.isAdmin ? "__admin__" : "home"); })
//         .catch(() => { storage.clear(); })
//         .finally(() => setAuthChecked(true));
//     } else {
//       setAuthChecked(true);
//     }
//   }, []);

//   const handleLogin  = useCallback((u) => { setUser(u); setTab(u?.isAdmin ? "__admin__" : "home"); }, []);
//   const handleLogout = useCallback(() => { setUser(null); setTab("home"); }, []);

//   // Loading splash
//   if (!authChecked) {
//     return (
//       <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:T.cream,flexDirection:"column",gap:20}}>
//         <div style={{width:48,height:48,borderRadius:16,background:"linear-gradient(135deg,#d64f6e,#e8728a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🌸</div>
//         <div style={{width:32,height:32,border:"3px solid rgba(214,79,110,.2)",borderTopColor:T.rose,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
//       </div>
//     );
//   }

//   // Auth wall
//   if (!user) return <AuthPage onLogin={handleLogin} />;

//   // Admin wall — isAdmin bo'lsa AdminApp ko'rsatiladi
//   if (user.isAdmin || tab === "__admin__") return <AdminApp />;

//   // App
//   const screens = {
//     home:    <Home    w={w} user={user} />,
//     modules: <Modules w={w} />,
//     tracker: <Tracker w={w} />,
//     profile: <Profile w={w} user={user} onLogout={handleLogout} />,
//   };

//   return (
//     <div style={{fontFamily:sans,background:T.cream,minHeight:"100vh"}}>
//       <style>{`
//         ${FONTS}
//         *, *::before, *::after { box-sizing: border-box; }
//         body { margin: 0; }
//         ::-webkit-scrollbar { width: 6px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: rgba(214,79,110,.2); border-radius: 3px; }
//         button { transition: all .2s; }
//         button:active { transform: scale(.97) !important; }
//         @keyframes spin { to { transform: rotate(360deg); } }
//       `}</style>

//       {isDesktop ? (
//         <div style={{display:"flex",minHeight:"100vh"}}>
//           <Sidebar tab={tab} setTab={setTab} user={user} />
//           <main style={{flex:1,overflowY:"auto",background:T.cream}}>{screens[tab]}</main>
//         </div>
//       ) : (
//         <>
//           <TopBar tab={tab} setTab={setTab} />
//           <main style={{background:T.cream,minHeight:"calc(100vh - 60px)"}}>{screens[tab]}</main>
//           <BottomNav tab={tab} setTab={setTab} />
//         </>
//       )}
//     </div>
//   );
// }

/**
 * PORLA — Frontend (porla-web-updated.jsx)
 * import api, { storage } from "./api";
 * import AdminApp from "./porla-admin";
 * import PorlaCalendar from "./PorlaCalendar__2_";
 */
import { useState, useEffect, useCallback } from "react";
import api, { storage } from "./api";
import AdminApp from "./porla-admin";
import PorlaCalendar from "./PorlaCalendar (2)";

/* ── DESIGN TOKENS ───────────────────────────────────── */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');`;
const T = {
  rose:"#d64f6e", roseMid:"#e8728a", roseLight:"#fde8ec",
  cream:"#fdf8f5", dark:"#221219", ink:"#4a2535",
  muted:"#9a7585", border:"rgba(214,79,110,0.12)", white:"#ffffff",
  gold:"#e9a825", green:"#0ea87a", blue:"#3b7de8", purple:"#8657d6",
  error:"#ef4444", errorBg:"#fef2f2",
};
const serif = "'Playfair Display', Georgia, serif";
const sans  = "'Plus Jakarta Sans', system-ui, sans-serif";

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

const Badge = ({ type }) => (
  <span style={{ fontFamily:sans, fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:20, background: type==="pro" ? "linear-gradient(135deg,#e9a825,#f5bc3a)" : "linear-gradient(135deg,#0ea87a,#34d399)", color:T.white, letterSpacing:"0.04em", flexShrink:0 }}>
    {type==="pro" ? "✦ PRO" : "BEPUL"}
  </span>
);

const Alert = ({ type, message }) => {
  if (!message) return null;
  return (
    <div style={{ background: type==="error" ? T.errorBg : "#f0fdf4", border:`1px solid ${type==="error" ? "#fecaca" : "#bbf7d0"}`, borderRadius:12, padding:"12px 16px", marginBottom:16, fontFamily:sans, fontSize:13, color: type==="error" ? "#b91c1c" : "#065f46", fontWeight:600 }}>
      {type==="error" ? "⚠ " : "✓ "}{message}
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
  { key:"home",    label:"Bosh sahifa", emoji:"🏠" },
  { key:"modules", label:"Kurslar",     emoji:"📚" },
  { key:"tracker", label:"Sikl",        emoji:"📅" },
  { key:"notifs",  label:"Xabarlar",    emoji:"🔔" },
  { key:"profile", label:"Profil",      emoji:"👤" },
];

function Sidebar({ tab, setTab, user, unread }) {
  return (
    <aside style={{ width:240, flexShrink:0, background:T.white, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", minHeight:"100vh", position:"sticky", top:0 }}>
      <div style={{ padding:"28px 20px 20px", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:12, background:"linear-gradient(135deg,#d64f6e,#e8728a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🌸</div>
          <span style={{ fontFamily:serif, fontSize:20, fontWeight:700, color:T.dark }}>Porla</span>
        </div>
      </div>
      <nav style={{ flex:1, padding:"16px 12px" }}>
        {NAV.map(n => {
          const a = tab === n.key;
          return (
            <button key={n.key} onClick={() => setTab(n.key)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"11px 14px", borderRadius:14, border:"none", cursor:"pointer", marginBottom:4, transition:"all .2s", background: a ? T.roseLight : "transparent", fontFamily:sans, fontSize:14, fontWeight: a ? 700 : 500, color: a ? T.rose : T.ink }}>
              <span style={{ fontSize:18, position:"relative" }}>
                {n.emoji}
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
        <p style={{ fontFamily:sans, fontSize:11, color:T.muted, margin:"2px 0 0", opacity:.7 }}>{user?.isPro ? "✦ Pro" : "Bepul"}</p>
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
          <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#d64f6e,#e8728a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🌸</div>
          <span style={{ fontFamily:serif, fontSize:18, fontWeight:700, color:T.dark }}>Porla</span>
        </div>
        <span style={{ fontFamily:sans, fontSize:14, fontWeight:700, color:T.ink }}>{NAV.find(n => n.key===tab)?.label}</span>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={() => setTab("notifs")}
            style={{ position:"relative", width:36, height:36, background:T.roseLight, border:"none", borderRadius:10, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>
            🔔
            {unread > 0 && <span style={{ position:"absolute", top:4, right:4, width:14, height:14, borderRadius:"50%", background:T.rose, color:"white", fontSize:8, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{unread > 9 ? "9+" : unread}</span>}
          </button>
          <button onClick={() => setOpen(o => !o)}
            style={{ width:36, height:36, background:T.roseLight, border:"none", borderRadius:10, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4 }}>
            {[0,1,2].map(i => <span key={i} style={{ width:16, height:2, background:T.rose, borderRadius:1, display:"block" }}/>)}
          </button>
        </div>
      </header>
      {open && (
        <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(34,18,25,.5)" }} onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ position:"absolute", right:0, top:0, bottom:0, width:260, background:T.white, padding:"24px 16px" }}>
            {NAV.map(n => (
              <button key={n.key} onClick={() => { setTab(n.key); setOpen(false); }}
                style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"13px 14px", borderRadius:14, border:"none", cursor:"pointer", marginBottom:4, background: tab===n.key ? T.roseLight : "transparent", fontFamily:sans, fontSize:14, fontWeight: tab===n.key ? 700 : 500, color: tab===n.key ? T.rose : T.ink }}>
                <span style={{ fontSize:18 }}>{n.emoji}</span>
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
            <span style={{ position:"relative", width:40, height:28, borderRadius:10, background: a ? "linear-gradient(135deg,#d64f6e,#e8728a)" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, boxShadow: a ? "0 4px 10px rgba(214,79,110,.25)" : "none", transition:"all .2s" }}>
              {n.emoji}
              {n.key==="notifs" && unread > 0 && (
                <span style={{ position:"absolute", top:2, right:2, width:14, height:14, borderRadius:"50%", background:"#ef4444", color:"white", fontSize:8, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{unread > 9 ? "9+" : unread}</span>
              )}
            </span>
            <span style={{ fontFamily:sans, fontSize:10, fontWeight: a ? 700 : 500, color: a ? T.rose : T.muted }}>{n.label}</span>
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
        setSuccess("Muvaffaqiyatli ro'yxatdan o'tdingiz! 🌸");
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
          <div style={{ width:64, height:64, borderRadius:20, background:"linear-gradient(135deg,#d64f6e,#e8728a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 16px", boxShadow:"0 12px 32px rgba(214,79,110,.3)" }}>🌸</div>
          <h1 style={{ fontFamily:serif, fontSize:32, fontWeight:700, color:T.dark, margin:0 }}>Porla</h1>
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
          {success && <Alert type="success" message={success}/>}
          {mode==="register" && <Input label="Ism" value={form.name} onChange={e => set("name", e.target.value)} placeholder="To'liq ismingiz" error={errors.name} icon="👤"/>}
          <Input label="Email" value={form.email} onChange={e => set("email", e.target.value)} type="email" placeholder="email@example.com" error={errors.email} icon="📧"/>
          <Input label="Parol" value={form.password} onChange={e => set("password", e.target.value)} type="password" placeholder={mode==="login" ? "Parolingizni kiriting" : "Kamida 6 ta belgi"} error={errors.password} icon="🔒"/>
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
        <p style={{ fontFamily:sans, fontSize:14, color:T.muted, margin:"0 0 4px", fontWeight:500 }}>Xayrli kun ✨</p>
        <h1 style={{ fontFamily:serif, fontSize: isLg ? 42 : 28, fontWeight:700, color:T.dark, margin:0, lineHeight:1.2 }}>
          Salom, {user?.name?.split(" ")[0] || "Foydalanuvchi"}!
        </h1>
      </div>

      <div style={{ display:"grid", gridTemplateColumns: isLg ? "1fr 1fr 1fr" : isMd ? "1fr 1fr" : "1fr", gap:20, marginBottom:32 }}>
        <div style={{ gridColumn: isLg ? "span 2" : "span 1", background:"linear-gradient(135deg,#d64f6e 0%,#c0415f 40%,#a33358 100%)", borderRadius:24, padding:"28px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,.07)", top:-60, right:-40 }}/>
          <p style={{ fontFamily:sans, fontSize:12, color:"rgba(255,255,255,.75)", margin:"0 0 16px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em" }}>Joriy Tsikl</p>
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
          <Btn variant="ghost" size="sm" onClick={() => setTab("tracker")} style={{ marginTop:20, background:"rgba(255,255,255,.15)", color:"white", border:"1px solid rgba(255,255,255,.3)" }}>
            Kalendar →
          </Btn>
        </div>

        <div style={{ background:"linear-gradient(145deg,#fffbf0,#fef6e4)", borderRadius:24, padding:"24px", border:"1.5px solid rgba(233,168,37,.2)" }}>
          <div style={{ width:44, height:44, borderRadius:14, background:"linear-gradient(135deg,#e9a825,#f5bc3a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:14 }}>💡</div>
          <p style={{ fontFamily:sans, fontSize:11, fontWeight:700, color:T.gold, textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 8px" }}>Kunlik maslahat</p>
          <p style={{ fontFamily:sans, fontSize:14, color:T.ink, lineHeight:1.6, margin:"0 0 16px" }}>Har kuni siklni kuzating — sog'liqni nazorat qiling</p>
          <Btn variant="gold" size="sm" onClick={() => setTab("modules")}>Kurslar →</Btn>
        </div>
      </div>

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <p style={{ fontFamily:sans, fontSize:11, fontWeight:800, color:T.muted, textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>So'nggi kurslar</p>
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
              <div style={{ width:48, height:48, borderRadius:14, background:c.bgColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:14 }}>{c.icon}</div>
              <p style={{ fontFamily:sans, fontSize:14, fontWeight:700, color:T.dark, margin:"0 0 6px", lineHeight:1.4 }}>{c.title}</p>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontFamily:sans, fontSize:12, color:T.muted }}>{c.lessonCount} dars</span>
                <Badge type={c.isPro ? "pro" : "free"}/>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── VIDEO PLAYER ─────────────────────────────────────── */
function VideoPlayer({ url, title }) {
  const isYoutube = url?.includes("youtube.com") || url?.includes("youtu.be");
  const isVimeo   = url?.includes("vimeo.com");
  const getYoutubeId = u => { const m = u.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/); return m ? m[1] : null; };
  const getVimeoId   = u => { const m = u.match(/vimeo\.com\/(\d+)/); return m ? m[1] : null; };

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
    <video controls style={{ width:"100%", borderRadius:16, background:"#000", maxHeight:360 }} src={url}>
      Brauzeringiz videoni qo'llab-quvvatlamaydi.
    </video>
  );
}

/* ── LESSON MODAL ─────────────────────────────────────── */
function LessonModal({ lesson, courseTitle, onClose }) {
  if (!lesson) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(0,0,0,.7)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ background:T.white, borderRadius:24, width:"100%", maxWidth:700, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 32px 80px rgba(0,0,0,.4)" }}>
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, background:T.white, zIndex:10, borderRadius:"24px 24px 0 0" }}>
          <div>
            <p style={{ fontFamily:sans, fontSize:11, fontWeight:700, color:T.muted, margin:"0 0 2px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{courseTitle}</p>
            <p style={{ fontFamily:serif, fontSize:18, fontWeight:700, color:T.dark, margin:0 }}>{lesson.title}</p>
          </div>
          <button onClick={onClose} style={{ width:36, height:36, borderRadius:10, background:T.roseLight, border:"none", cursor:"pointer", fontSize:18, color:T.rose, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ padding:"24px" }}>
          {lesson.isLocked ? (
            <div style={{ textAlign:"center", padding:"40px 20px" }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🔒</div>
              <p style={{ fontFamily:serif, fontSize:22, fontWeight:700, color:T.dark, margin:"0 0 8px" }}>Pro kontent</p>
              <p style={{ fontFamily:sans, fontSize:14, color:T.muted, margin:"0 0 24px", lineHeight:1.6 }}>Bu dars faqat Pro obunachilarga ochiq. Pro ga o'ting va barcha darslarga kiring.</p>
              <Btn variant="gold" size="lg">✦ Pro ga o'tish</Btn>
            </div>
          ) : (
            <>
              {lesson.videoUrl && <div style={{ marginBottom:24 }}><VideoPlayer url={lesson.videoUrl} title={lesson.title}/></div>}
              {lesson.content && <div style={{ fontFamily:sans, fontSize:15, color:T.ink, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{lesson.content}</div>}
              {lesson.duration > 0 && <p style={{ fontFamily:sans, fontSize:12, color:T.muted, marginTop:16 }}>⏱ {lesson.duration} daqiqa</p>}
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

  return (
    <div>
      <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", fontFamily:sans, fontSize:14, fontWeight:700, color:T.rose, marginBottom:20, padding:0 }}>
        ‹ Orqaga
      </button>

      <div style={{ background:`linear-gradient(135deg,${course.color}18,${course.bgColor})`, border:`1px solid ${course.color}30`, borderRadius:20, padding:"24px", marginBottom:24 }}>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <div style={{ width:64, height:64, borderRadius:18, background:course.bgColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, border:`2px solid ${course.color}30` }}>{course.icon}</div>
          <div>
            <p style={{ fontFamily:serif, fontSize:22, fontWeight:700, color:T.dark, margin:"0 0 4px" }}>{course.title}</p>
            <p style={{ fontFamily:sans, fontSize:13, color:T.muted, margin:"0 0 8px", lineHeight:1.5 }}>{course.description}</p>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <Badge type={course.isPro ? "pro" : "free"}/>
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
                  {l.isLocked ? "🔒" : l.isCompleted ? "✅" : idx === 0 ? "🎬" : "▶"}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                    <p style={{ fontFamily:sans, fontSize:14, fontWeight:700, color: l.isLocked ? T.muted : T.dark, margin:0 }}>{l.title}</p>
                    {idx === 0 && <span style={{ fontFamily:sans, fontSize:10, fontWeight:700, color:T.green, background:"#f0fdf4", padding:"2px 8px", borderRadius:20 }}>BEPUL</span>}
                    {l.isLocked && <span style={{ fontFamily:sans, fontSize:10, fontWeight:700, color:T.gold, background:"#fffbeb", padding:"2px 8px", borderRadius:20 }}>PRO</span>}
                  </div>
                  {l.duration > 0 && <p style={{ fontFamily:sans, fontSize:12, color:T.muted, margin:0 }}>⏱ {l.duration} daqiqa</p>}
                </div>
                <span style={{ color: l.isLocked ? "#ddd" : T.muted, fontSize:20 }}>›</span>
              </div>
            </Card>
          ))}
          {!userIsPro && lessons.length > 1 && (
            <div style={{ background:"linear-gradient(135deg,#fffbeb,#fef9ef)", border:"1.5px solid rgba(233,168,37,.3)", borderRadius:18, padding:"18px 20px", textAlign:"center", marginTop:8 }}>
              <p style={{ fontFamily:sans, fontSize:14, fontWeight:700, color:"#92400e", margin:"0 0 4px" }}>✦ {lessons.length - 1} ta dars Pro uchun</p>
              <p style={{ fontFamily:sans, fontSize:12, color:"#b45309", margin:"0 0 14px" }}>Pro obunaga o'ting va barcha darslarga kiring</p>
              <Btn variant="gold" size="sm">Pro ga o'tish ✦</Btn>
            </div>
          )}
        </div>
      )}
      {active && <LessonModal lesson={active} courseTitle={course.title} onClose={() => setActive(null)}/>}
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

  if (selected) return (
    <div style={{ padding: isLg ? "40px 48px" : "24px 20px", paddingBottom: isLg ? 40 : 90 }}>
      <CourseDetail course={selected} userIsPro={userIsPro} onBack={() => setSelected(null)}/>
    </div>
  );

  return (
    <div style={{ padding: isLg ? "40px 48px" : "24px 20px", paddingBottom: isLg ? 40 : 90 }}>
      <div style={{ marginBottom:32 }}>
        <h2 style={{ fontFamily:serif, fontSize: isLg ? 38 : 26, fontWeight:700, color:T.dark, margin:"0 0 8px" }}>Kurslar</h2>
        <p style={{ fontFamily:sans, fontSize:14, color:T.muted, margin:0 }}>Sog'liq haqida bilimingizni kengaytiring</p>
      </div>
      <Alert type="error" message={err}/>

      <div style={{ display:"grid", gridTemplateColumns: isMd ? "repeat(4,1fr)" : "repeat(2,1fr)", gap:16, marginBottom:36 }}>
        {[
          { n: courses.length+"",                                   l:"Jami kurslar",  bg:"linear-gradient(135deg,#d64f6e,#e8728a)" },
          { n: free.length+"",                                      l:"Bepul kurslar", bg:"linear-gradient(135deg,#0ea87a,#34d399)" },
          { n: pro.length+"",                                       l:"Pro kurslar",   bg:"linear-gradient(135deg,#e9a825,#f5bc3a)" },
          { n: courses.reduce((s,c) => s + (c.lessonCount||0), 0)+"", l:"Jami darslar",  bg:"linear-gradient(135deg,#8657d6,#a78bfa)" },
        ].map((s, i) => (
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
      ) : (
        <>
          <p style={{ fontFamily:sans, fontSize:11, fontWeight:800, color:T.green, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>✓ Bepul kurslar</p>
          <div style={{ display:"grid", gridTemplateColumns: isLg ? "repeat(2,1fr)" : "1fr", gap:14, marginBottom:32 }}>
            {free.map((c, i) => (
              <Card key={i} onClick={() => setSelected(c)} style={{ padding:"20px 22px", cursor:"pointer" }}>
                <div style={{ display:"flex", gap:16 }}>
                  <div style={{ width:56, height:56, borderRadius:16, background:c.bgColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{c.icon}</div>
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
                <p style={{ fontFamily:serif, fontSize: isLg ? 24 : 20, fontWeight:700, color:T.white, margin:"0 0 4px" }}>✦ Pro Kurslar</p>
                <p style={{ fontFamily:sans, fontSize:13, color:"rgba(255,255,255,.55)", margin:0 }}>Pro rejimga o'ting va barchasini oching</p>
              </div>
              <Btn variant="gold">Pro ga o'tish ✦</Btn>
            </div>
            <div style={{ display:"grid", gridTemplateColumns: isLg ? "repeat(3,1fr)" : isMd ? "repeat(2,1fr)" : "1fr", gap:12 }}>
              {pro.map((c, i) => (
                <div key={i} onClick={() => setSelected(c)}
                  style={{ background:"rgba(255,255,255,.06)", borderRadius:18, padding:"18px", border:"1px solid rgba(255,255,255,.1)", cursor:"pointer" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:c.bgColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{c.icon}</div>
                    <span style={{ fontSize:18 }}>{userIsPro ? "▶" : "🔒"}</span>
                  </div>
                  <p style={{ fontFamily:sans, fontSize:13, fontWeight:700, color:T.white, margin:"0 0 4px", lineHeight:1.3 }}>{c.title}</p>
                  <p style={{ fontFamily:sans, fontSize:11, color:"rgba(255,255,255,.45)", margin:0 }}>{c.lessonCount} dars · Pro</p>
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

  const load = useCallback(() => {
    api.notifications.getAll()
      .then(d => { setNotifs(d.notifications || []); if (onRead) onRead(0); })
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
  const typeEmoji = { info:"💬", reminder:"🔔", achievement:"🏆", warning:"⚠️" };

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
                  <div style={{ width:40, height:40, borderRadius:12, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, background: n.isRead ? "#f5f5f5" : `${col}15` }}>
                    {typeEmoji[n.type] || "💬"}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4, gap:8 }}>
                      <p style={{ fontFamily:sans, fontSize:14, fontWeight:700, color: n.isRead ? T.muted : T.dark, margin:0 }}>{n.title}</p>
                      {!n.isRead && <span style={{ width:8, height:8, borderRadius:"50%", background:T.rose, flexShrink:0, display:"block" }}/>}
                    </div>
                    <p style={{ fontFamily:sans, fontSize:13, color:T.muted, margin:"0 0 6px", lineHeight:1.5 }}>{n.message}</p>
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

  const handleLogout = async () => {
    setLogoutLoading(true);
    await api.auth.logout();
    onLogout();
  };

  const menuItems = [
    { icon:"📚", label:"Bajarilgan darslar", sub:`${user?.completedLessons?.length || 0} ta dars tugallangan`, color:T.blue,   bg:"#eff6ff" },
    { icon:"📧", label:"Email",              sub: user?.email || "",                                           color:T.green,  bg:"#f0fdf4" },
    { icon:"🔒", label:"Maxfiylik",          sub:"Ma'lumotlar himoyasi",                                       color:T.gold,   bg:"#fffbeb" },
    { icon:"❓", label:"Yordam markazi",     sub:"Savol va javoblar",                                          color:"#0891b2",bg:"#ecfeff" },
    { icon:"🚪", label:"Chiqish",            sub:"Hisobdan chiqish",                                           color:"#ef4444",bg:"#fef2f2", danger:true, action:handleLogout },
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
              <div style={{ width:88, height:88, borderRadius:"50%", background:"rgba(255,255,255,.2)", border:"3px solid rgba(255,255,255,.5)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:40 }}>👤</div>
              <p style={{ fontFamily:serif, fontSize:26, fontWeight:700, color:T.white, margin:"0 0 4px" }}>{user?.name || "Foydalanuvchi"}</p>
              <p style={{ fontFamily:sans, fontSize:13, color:"rgba(255,255,255,.7)", margin:"0 0 16px" }}>{user?.email}</p>
              <span style={{ fontFamily:sans, fontSize:12, fontWeight:700, padding:"5px 14px", borderRadius:20, background: user?.isPro ? "linear-gradient(135deg,#e9a825,#f5bc3a)" : "rgba(255,255,255,.2)", color:"white" }}>
                {user?.isPro ? "✦ Pro" : "Bepul"}
              </span>
            </div>
          </div>
          {!user?.isPro && (
            <div style={{ background:"linear-gradient(135deg,#fffbeb,#fef9ef)", border:"1.5px solid rgba(233,168,37,.3)", borderRadius:20, padding:"18px 20px" }}>
              <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg,#e9a825,#f5bc3a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>✦</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:sans, fontSize:15, fontWeight:800, color:"#92400e", margin:"0 0 2px" }}>Pro ga o'ting</p>
                  <p style={{ fontFamily:sans, fontSize:12, color:"#b45309", margin:0 }}>Barcha kurslarga cheksiz kirish</p>
                </div>
                <Btn variant="gold" size="sm">Ulash</Btn>
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
                  <div style={{ width:44, height:44, borderRadius:13, background:m.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{m.icon}</div>
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
    const savedUser = storage.getUser();
    const token     = storage.getToken();
    if (savedUser && token) {
      api.auth.me()
        .then(d => {
          setUser(d.user);
          storage.setUser(d.user);
          setTab(d.user?.isAdmin ? "__admin__" : "home");
        })
        .catch(() => storage.clear())
        .finally(() => setAuthChecked(true));
    } else {
      setAuthChecked(true);
    }
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
      <div style={{ width:48, height:48, borderRadius:16, background:"linear-gradient(135deg,#d64f6e,#e8728a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>🌸</div>
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
    </div>
  );
}