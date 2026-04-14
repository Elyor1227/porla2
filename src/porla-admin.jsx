/**
 * ╔══════════════════════════════════════════════════════╗
 * ║          PORLA — Admin Panel                         ║
 * ║          AdminApp — porla-admin.jsx                  ║
 * ╚══════════════════════════════════════════════════════╝
 * import AdminApp from "./porla-admin";
 */
import React from 'react'
import { useState, useEffect, useCallback } from "react";
import api, { storage } from "./api";
import { LOGO_DEFAULT, logoImgSvg } from "./brandLogos";

/* adminApi — api.admin bilan mos, back-compat alias */
const adminApi = api.admin;

/* ── TOKENS ─────────────────────────────────────────── */
const T = {
  bg:      "#f8f5ff",
  sidebar: "#1e1030",
  sideHov: "#2d1f4a",
  sideAct: "#4c2fa0",
  card:    "#ffffff",
  border:  "rgba(76,47,160,0.1)",
  purple:  "#4c2fa0",
  purpleSoft:"#ede9ff",
  rose:    "#d64f6e",
  gold:    "#e9a825",
  green:   "#0ea87a",
  red:     "#ef4444",
  dark:    "#1a1030",
  ink:     "#3d2b6a",
  muted:   "#8b7aac",
  white:   "#ffffff",
};
const sans  = "'Plus Jakarta Sans', system-ui, sans-serif";
const serif = "'Playfair Display', Georgia, serif";
const FONTS = ''

/* ── HELPERS ─────────────────────────────────────────── */
function useW() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  return w;
}
const fmt = (d) => new Date(d).toLocaleDateString("uz-UZ", { year:"numeric", month:"short", day:"numeric" });
const ago = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return `${s}s oldin`;
  if (s < 3600) return `${Math.floor(s/60)}m oldin`;
  if (s < 86400) return `${Math.floor(s/3600)}s oldin`;
  return `${Math.floor(s/86400)}k oldin`;
};

/* ── SHARED UI ───────────────────────────────────────── */
const Btn = ({ children, variant="primary", onClick, size="md", style={}, loading=false, disabled=false }) => {
  const [h, setH] = useState(false);
  const vs = {
    primary:{ bg:h?"#3a2280":"#4c2fa0", color:"#fff", shadow:h?"0 8px 24px rgba(76,47,160,.4)":"0 4px 14px rgba(76,47,160,.25)" },
    danger: { bg:h?"#c53030":"#ef4444", color:"#fff", shadow:"none" },
    ghost:  { bg:h?"rgba(76,47,160,.08)":"transparent", color:T.purple, border:`1.5px solid ${h?T.purple:T.border}` },
    success:{ bg:h?"#0a8a63":"#0ea87a", color:"#fff", shadow:"none" },
    gold:   { bg:h?"#c8881a":"#e9a825", color:"#fff", shadow:"none" },
  };
  const v = vs[variant] || vs.primary;
  const p = size==="sm"?"6px 14px":size==="lg"?"14px 32px":"10px 20px";
  const fs = size==="sm"?12:size==="lg"?15:13;
  return (
    <button disabled={disabled||loading} onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ fontFamily:sans, fontWeight:700, cursor:disabled||loading?"not-allowed":"pointer",
        border:v.border||"none", borderRadius:10, padding:p, fontSize:fs,
        background:v.bg, color:v.color, boxShadow:v.shadow||"none",
        transition:"all .2s", opacity:disabled||loading?.65:1,
        display:"inline-flex", alignItems:"center", gap:6, ...style }}>
      {loading && <span style={{width:12,height:12,border:"2px solid rgba(255,255,255,.4)",borderTopColor:"white",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>}
      {children}
    </button>
  );
};

const Card = ({ children, style={} }) => (
  <div style={{ background:T.card, borderRadius:16, border:`1px solid ${T.border}`,
    boxShadow:"0 2px 12px rgba(76,47,160,.06)", ...style }}>
    {children}
  </div>
);

const Badge = ({ label, color="#4c2fa0", bg }) => (
  <span style={{ fontFamily:sans, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20,
    background:bg||`${color}18`, color, border:`1px solid ${color}30` }}>{label}</span>
);

const Spinner = () => (
  <div style={{display:"flex",justifyContent:"center",alignItems:"center",padding:60}}>
    <div style={{width:36,height:36,border:"3px solid rgba(76,47,160,.15)",borderTopColor:T.purple,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
  </div>
);

const Input = ({ label, value, onChange, type="text", placeholder, style={} }) => (
  <div style={{ marginBottom:16, ...style }}>
    {label && <label style={{fontFamily:sans,fontSize:12,fontWeight:700,color:T.ink,display:"block",marginBottom:5}}>{label}</label>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ width:"100%", padding:"10px 14px", fontFamily:sans, fontSize:13, color:T.dark,
        background:"#f9f7ff", border:`1.5px solid ${T.border}`, borderRadius:10, outline:"none",
        transition:"all .2s", boxSizing:"border-box" }}
      onFocus={e=>e.target.style.borderColor=T.purple}
      onBlur={e=>e.target.style.borderColor=T.border} />
  </div>
);

const Textarea = ({ label, value, onChange, rows=4, placeholder }) => (
  <div style={{ marginBottom:16 }}>
    {label && <label style={{fontFamily:sans,fontSize:12,fontWeight:700,color:T.ink,display:"block",marginBottom:5}}>{label}</label>}
    <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder}
      style={{ width:"100%", padding:"10px 14px", fontFamily:sans, fontSize:13, color:T.dark,
        background:"#f9f7ff", border:`1.5px solid ${T.border}`, borderRadius:10, outline:"none",
        resize:"vertical", boxSizing:"border-box" }}
      onFocus={e=>e.target.style.borderColor=T.purple}
      onBlur={e=>e.target.style.borderColor=T.border} />
  </div>
);

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}
      onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(26,16,48,.6)",backdropFilter:"blur(4px)"}}/>
      <div style={{position:"relative",background:T.card,borderRadius:20,padding:"28px",width:"100%",maxWidth:520,
        boxShadow:"0 24px 80px rgba(26,16,48,.3)",maxHeight:"90vh",overflowY:"auto"}}
        onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <h3 style={{fontFamily:serif,fontSize:20,fontWeight:700,color:T.dark,margin:0}}>{title}</h3>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:8,background:"#f0ecff",border:"none",cursor:"pointer",fontSize:16,color:T.muted}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Toast = ({ msg, type }) => {
  if (!msg) return null;
  const c = type==="error" ? {bg:"#fef2f2",color:"#b91c1c",icon:"⚠"} : {bg:"#f0fdf4",color:"#065f46",icon:"✓"};
  return (
    <div style={{position:"fixed",bottom:24,right:24,zIndex:2000,background:c.bg,
      border:`1px solid ${c.color}30`,borderRadius:12,padding:"12px 20px",
      fontFamily:sans,fontSize:13,color:c.color,fontWeight:600,
      boxShadow:"0 8px 30px rgba(0,0,0,.1)",display:"flex",gap:8,animation:"slideIn .3s ease"}}>
      {c.icon} {msg}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   SCREENS
═══════════════════════════════════════════════════════ */

/* ── DASHBOARD ── */
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.stats().then(d => setStats(d.stats)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const cards = [
    { label:"Jami foydalanuvchi", value:stats.totalUsers, icon:"👥", color:T.purple, bg:"#f0ecff" },
    { label:"Premium foydalanuvchi",  value:stats.proUsers,   icon:"✦",  color:T.gold,   bg:"#fffbeb" },
    { label:"Bepul foydalanuvchi",value:stats.freeUsers,  icon:"👤", color:T.green,  bg:"#f0fdf4" },
    { label:"Bugun qo'shilgan",   value:stats.newUsersToday, icon:"🆕", color:T.rose, bg:"#fde8ec" },
    { label:"Jami kurslar",       value:stats.totalCourses,  icon:"📚", color:"#0891b2", bg:"#ecfeff" },
    { label:"Jami darslar",       value:stats.totalLessons,  icon:"📖", color:"#7c3aed", bg:"#f5f3ff" },
  ];

  const maxCount = Math.max(...(stats.last7days?.map(d=>d.count)||[1]), 1);

  return (
    <div>
      <div style={{marginBottom:32}}>
        <h2 style={{fontFamily:serif,fontSize:28,fontWeight:700,color:T.dark,margin:"0 0 6px"}}>Dashboard</h2>
        <p style={{fontFamily:sans,fontSize:14,color:T.muted,margin:0}}>Platforma umumiy ko'rinishi</p>
      </div>

      {/* Stat cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:16,marginBottom:32}}>
        {cards.map((c,i)=>(
          <Card key={i} style={{padding:"20px"}}>
            <div style={{width:44,height:44,borderRadius:12,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:14}}>{c.icon}</div>
            <p style={{fontFamily:serif,fontSize:32,fontWeight:700,color:c.color,margin:"0 0 4px",lineHeight:1}}>{c.value}</p>
            <p style={{fontFamily:sans,fontSize:12,color:T.muted,margin:0,fontWeight:600}}>{c.label}</p>
          </Card>
        ))}
      </div>

      {/* Chart + summary */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:20}}>
        <Card style={{padding:"24px"}}>
          <h3 style={{fontFamily:sans,fontSize:14,fontWeight:800,color:T.ink,margin:"0 0 24px",textTransform:"uppercase",letterSpacing:"0.08em"}}>Oxirgi 7 kun — yangi foydalanuvchilar</h3>
          <div style={{display:"flex",alignItems:"flex-end",gap:8,height:160}}>
            {stats.last7days?.map((d,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                <span style={{fontFamily:sans,fontSize:11,fontWeight:700,color:T.purple}}>{d.count}</span>
                <div style={{width:"100%",background:`linear-gradient(180deg,${T.purple},#7c5cd6)`,borderRadius:"6px 6px 0 0",
                  height:Math.max((d.count/maxCount)*120, d.count>0?8:2),transition:"height .5s ease"}}/>
                <span style={{fontFamily:sans,fontSize:10,color:T.muted,whiteSpace:"nowrap"}}>{d.date}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{padding:"24px"}}>
          <h3 style={{fontFamily:sans,fontSize:14,fontWeight:800,color:T.ink,margin:"0 0 20px",textTransform:"uppercase",letterSpacing:"0.08em"}}>Xulosa</h3>
          {[
            { label:"Premium ulushi",     value:`${stats.proPercentage}%`,   color:T.gold },
            { label:"Bu hafta",       value:`+${stats.newUsersThisWeek}`, color:T.purple },
            { label:"Bu oy",          value:`+${stats.newUsersThisMonth}`,color:T.green },
            { label:"Sikl yozuvlar", value:stats.totalCycles,           color:T.rose },
          ].map((s,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<3?`1px solid ${T.border}`:"none"}}>
              <span style={{fontFamily:sans,fontSize:13,color:T.muted}}>{s.label}</span>
              <span style={{fontFamily:sans,fontSize:15,fontWeight:800,color:s.color}}>{s.value}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ── USERS ── */
function Users({ toast }) {
  const [users, setUsers]     = useState([]);
  const [pagination, setPag]  = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [page, setPage]       = useState(1);
  const [_selected, _setSelected] = useState(null); // user detail modal (unused)
  const [proModal, setProModal] = useState(null);
  const [months, setMonths]   = useState(1);
  const [notifModal, setNotifModal] = useState(null);
  const [notifForm, setNotifForm]   = useState({ title:"", message:"", type:"info" });

  const load = useCallback(() => {
    setLoading(true);
    adminApi.users({ search, filter, page, limit:15 })
      .then(d => { setUsers(d.users); setPag(d.pagination); })
      .finally(() => setLoading(false));
  }, [search, filter, page]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setPage(1); }, [search, filter]);

  const handlePro = async (isPro) => {
    try {
      await adminApi.setPro(proModal._id, isPro, months);
      toast(isPro ? `Premium berildi (${months} oy)` : "Premium olib tashlandi", "success");
      setProModal(null); load();
    } catch(e) { toast(e.message, "error"); }
  };

  const handleBlock = async (user) => {
    if (!confirm(`${user.name} ni ${user.isBlocked?"blokdan chiqarish":"bloklash"}ni tasdiqlaysizmi?`)) return;
    try {
      await adminApi.blockUser(user._id, !user.isBlocked);
      toast(user.isBlocked ? "Blokdan chiqarildi" : "Bloklandi", "success");
      load();
    } catch(e) { toast(e.message, "error"); }
  };

  const handleDelete = async (user) => {
    if (!confirm(`${user.name} ni o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi!`)) return;
    try {
      await adminApi.deleteUser(user._id);
      toast("Foydalanuvchi o'chirildi", "success");
      load();
    } catch(e) { toast(e.message, "error"); }
  };

  const handleNotify = async () => {
    if (!notifForm.title || !notifForm.message) return;
    try {
      await adminApi.notifyUser(notifModal._id, notifForm);
      toast("Bildirishnoma yuborildi", "success");
      setNotifModal(null); setNotifForm({ title:"", message:"", type:"info" });
    } catch(e) { toast(e.message, "error"); }
  };

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div>
          <h2 style={{fontFamily:serif,fontSize:28,fontWeight:700,color:T.dark,margin:"0 0 4px"}}>Foydalanuvchilar</h2>
          <p style={{fontFamily:sans,fontSize:13,color:T.muted,margin:0}}>Jami: {pagination.total || 0} ta</p>
        </div>
      </div>

      {/* Filters */}
      <Card style={{padding:"16px 20px",marginBottom:20}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Ism yoki email..."
            style={{flex:1,minWidth:200,padding:"9px 14px",fontFamily:sans,fontSize:13,color:T.dark,
              background:"#f9f7ff",border:`1.5px solid ${T.border}`,borderRadius:10,outline:"none"}} />
          <div style={{display:"flex",gap:8}}>
            {["all","pro","free"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{
                padding:"8px 16px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:sans,fontSize:12,fontWeight:700,
                background:filter===f?"#4c2fa0":"#f0ecff",color:filter===f?"white":T.purple,transition:"all .2s",
              }}>{f==="all"?"Barchasi":f==="pro"?"✦ Premium":"Bepul"}</button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? <Spinner /> : (
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{borderBottom:`2px solid ${T.border}`}}>
                  {["Foydalanuvchi","Email","Status","Ro'yxatdan","Darslar","Amallar"].map(h=>(
                    <th key={h} style={{fontFamily:sans,fontSize:11,fontWeight:800,color:T.muted,
                      textTransform:"uppercase",letterSpacing:"0.08em",padding:"14px 16px",textAlign:"left"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u)=>(
                  <tr key={u._id} style={{borderBottom:`1px solid ${T.border}`,transition:"background .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#faf8ff"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"14px 16px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${T.purple},#7c5cd6)`,
                          display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontFamily:sans,fontSize:14,fontWeight:700,flexShrink:0}}>
                          {u.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p style={{fontFamily:sans,fontSize:13,fontWeight:700,color:T.dark,margin:"0 0 2px"}}>{u.name}</p>
                          {u.isAdmin && <Badge label="Admin" color="#7c3aed"/>}
                        </div>
                      </div>
                    </td>
                    <td style={{padding:"14px 16px",fontFamily:sans,fontSize:13,color:T.muted}}>{u.email}</td>
                    <td style={{padding:"14px 16px"}}>
                      {u.isBlocked
                        ? <Badge label="Bloklangan" color={T.red}/>
                        : u.isPro
                          ? <Badge label="✦ Premium" color={T.gold}/>
                          : <Badge label="Bepul" color={T.green}/>}
                    </td>
                    <td style={{padding:"14px 16px",fontFamily:sans,fontSize:12,color:T.muted}}>{ago(u.createdAt)}</td>
                    <td style={{padding:"14px 16px",fontFamily:sans,fontSize:13,fontWeight:700,color:T.purple,textAlign:"center"}}>
                      {u.completedLessons?.length || 0}
                    </td>
                    <td style={{padding:"14px 16px"}}>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        <Btn size="sm" variant={u.isPro?"danger":"gold"}
                          onClick={()=>{setProModal(u); setMonths(1);}}>
                          {u.isPro?"Premium olish":"Premium berish"}
                        </Btn>
                        <Btn size="sm" variant="ghost" onClick={()=>setNotifModal(u)}>📣</Btn>
                        <Btn size="sm" variant={u.isBlocked?"success":"ghost"} onClick={()=>handleBlock(u)}>
                          {u.isBlocked?"Ochish":"🚫"}
                        </Btn>
                        {!u.isAdmin && (
                          <Btn size="sm" variant="danger" onClick={()=>handleDelete(u)}>🗑</Btn>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p style={{fontFamily:sans,fontSize:14,color:T.muted,textAlign:"center",padding:40}}>Foydalanuvchilar topilmadi</p>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{display:"flex",justifyContent:"center",gap:8,padding:"16px",borderTop:`1px solid ${T.border}`}}>
            <Btn size="sm" variant="ghost" disabled={!pagination.hasPrev} onClick={()=>setPage(p=>p-1)}>← Oldingi</Btn>
            <span style={{fontFamily:sans,fontSize:13,color:T.muted,display:"flex",alignItems:"center",padding:"0 12px"}}>
              {pagination.page} / {pagination.pages}
            </span>
            <Btn size="sm" variant="ghost" disabled={!pagination.hasNext} onClick={()=>setPage(p=>p+1)}>Keyingi →</Btn>
          </div>
        )}
      </Card>

      {/* Pro modal */}
      <Modal open={!!proModal} onClose={()=>setProModal(null)} title={`Premium boshqaruvi — ${proModal?.name}`}>
        <p style={{fontFamily:sans,fontSize:13,color:T.muted,marginBottom:20}}>
          Joriy holat: <strong>{proModal?.isPro ? "✦ Pro" : "Bepul"}</strong>
          {proModal?.proExpiresAt && ` · Tugash: ${fmt(proModal.proExpiresAt)}`}
        </p>
        {!proModal?.isPro ? (
          <>
            <div style={{marginBottom:16}}>
              <label style={{fontFamily:sans,fontSize:12,fontWeight:700,color:T.ink,display:"block",marginBottom:5}}>Muddat (oy)</label>
              <div style={{display:"flex",gap:8}}>
                {[1,3,6,12].map(m=>(
                  <button key={m} onClick={()=>setMonths(m)} style={{
                    flex:1,padding:"10px",border:`2px solid ${months===m?T.gold:T.border}`,
                    borderRadius:10,background:months===m?"#fffbeb":"transparent",
                    fontFamily:sans,fontSize:13,fontWeight:700,color:months===m?T.gold:T.muted,cursor:"pointer",
                  }}>{m} oy</button>
                ))}
              </div>
            </div>
            <Btn variant="gold" style={{width:"100%",justifyContent:"center"}} onClick={()=>handlePro(true)}>
              ✦ {months} oylik Premium berish
            </Btn>
          </>
        ) : (
          <Btn variant="danger" style={{width:"100%",justifyContent:"center"}} onClick={()=>handlePro(false)}>
            Premiumni o'chirish
          </Btn>
        )}
      </Modal>

      {/* Notify modal */}
      <Modal open={!!notifModal} onClose={()=>setNotifModal(null)} title={`Bildirishnoma — ${notifModal?.name}`}>
        <Input label="Sarlavha" value={notifForm.title} onChange={e=>setNotifForm(f=>({...f,title:e.target.value}))} placeholder="Bildirishnoma sarlavhasi"/>
        <Textarea label="Xabar" value={notifForm.message} onChange={e=>setNotifForm(f=>({...f,message:e.target.value}))} placeholder="Xabar mazmuni..."/>
        <div style={{marginBottom:16}}>
          <label style={{fontFamily:sans,fontSize:12,fontWeight:700,color:T.ink,display:"block",marginBottom:5}}>Tur</label>
          <div style={{display:"flex",gap:8}}>
            {["info","reminder","achievement","warning"].map(t=>(
              <button key={t} onClick={()=>setNotifForm(f=>({...f,type:t}))} style={{
                flex:1,padding:"8px",border:`2px solid ${notifForm.type===t?T.purple:T.border}`,
                borderRadius:8,background:notifForm.type===t?T.purpleSoft:"transparent",
                fontFamily:sans,fontSize:11,fontWeight:700,color:notifForm.type===t?T.purple:T.muted,cursor:"pointer",
              }}>{t}</button>
            ))}
          </div>
        </div>
        <Btn onClick={handleNotify} style={{width:"100%",justifyContent:"center"}}>📣 Yuborish</Btn>
      </Modal>
    </div>
  );
}

/* ── COURSES ── */
function Courses({ toast }) {
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [courseModal, setCourseModal] = useState(null); // null | "new" | course object
  const [lessonPanel, setLessonPanel] = useState(null); // course object
  const [lessons, setLessons]         = useState([]);
  const [lessonModal, setLessonModal] = useState(null);
  const [form, setForm] = useState({ title:"", description:"", icon:"/Untitled (9)/svg1.svg", color:"#4c2fa0", bgColor:"#ede9ff", isPro:false, order:0 });
  const [lForm, setLForm] = useState({ title:"", content:"", videoUrl:"", duration:10, order:0, isPro:false });
  const [lessonVideoFile, setLessonVideoFile] = useState(null);
  const [lessonSaving, setLessonSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.courses().then(d=>setCourses(d.courses)).finally(()=>setLoading(false));
  };
  useEffect(()=>load(),[]);

  const loadLessons = (course) => {
    setLessonPanel(course);
    adminApi.lessons(course._id).then(d=>setLessons(d.lessons));
  };

  const openNewCourse = () => {
    setForm({ title:"", description:"", icon:"/Untitled (9)/svg1.svg", color:"#4c2fa0", bgColor:"#ede9ff", isPro:false, order:courses.length+1 });
    setCourseModal("new");
  };
  const openEditCourse = (c) => { setForm({...c}); setCourseModal(c); };

  const saveCourse = async () => {
    if (!form.title || !form.description) { toast("Sarlavha va tavsif majburiy","error"); return; }
    try {
      if (courseModal === "new") await adminApi.createCourse(form);
      else                       await adminApi.updateCourse(courseModal._id, form);
      toast(courseModal==="new"?"Kurs qo'shildi":"Kurs yangilandi","success");
      setCourseModal(null); load();
    } catch(e) { toast(e.message,"error"); }
  };

  const deleteCourse = async (c) => {
    if (!confirm(`"${c.title}" kursini o'chirishni tasdiqlaysizmi?`)) return;
    try { await adminApi.deleteCourse(c._id); toast("Kurs o'chirildi","success"); load(); }
    catch(e) { toast(e.message,"error"); }
  };

  const openNewLesson = () => {
    setLessonVideoFile(null);
    setLForm({ title:"", content:"", videoUrl:"", duration:10, order:lessons.length+1, isPro:lessonPanel.isPro });
    setLessonModal("new");
  };
  const openEditLesson = (l) => {
    setLessonVideoFile(null);
    setLForm({...l});
    setLessonModal(l);
  };

  const closeLessonModal = () => {
    if (lessonSaving) return;
    setLessonModal(null);
    setLessonVideoFile(null);
  };

  const saveLesson = async () => {
    if (lessonSaving) return;
    if (!lForm.title || !lForm.content) { toast("Sarlavha va mazmun majburiy","error"); return; }
    setLessonSaving(true);
    try {
      const payload = lessonVideoFile ? { ...lForm, video: lessonVideoFile } : { ...lForm };
      if (lessonModal==="new") await adminApi.createLesson(lessonPanel._id, payload);
      else                      await adminApi.updateLesson(lessonPanel._id, lessonModal._id, payload);
      toast(lessonModal==="new"?"Dars qo'shildi":"Dars yangilandi","success");
      setLessonModal(null);
      setLessonVideoFile(null);
      loadLessons(lessonPanel);
    } catch(e) { toast(e.message,"error"); }
    finally { setLessonSaving(false); }
  };

  const deleteLesson = async (l) => {
    if (!confirm(`"${l.title}" darsini o'chirishni tasdiqlaysizmi?`)) return;
    try {
      await adminApi.deleteLesson(lessonPanel._id, l._id);
      toast("Dars o'chirildi","success");
      loadLessons(lessonPanel);
    } catch(e) { toast(e.message,"error"); }
  };

  const ICONS = Array.from({ length: 18 }, (_, i) => `/Untitled (9)/svg${(i % 6) + 1}.svg`);

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div>
          <h2 style={{fontFamily:serif,fontSize:28,fontWeight:700,color:T.dark,margin:"0 0 4px"}}>Kurslar</h2>
          <p style={{fontFamily:sans,fontSize:13,color:T.muted,margin:0}}>Kurs va darslarni boshqarish</p>
        </div>
        <Btn onClick={openNewCourse}>＋ Yangi kurs</Btn>
      </div>

      {loading ? <Spinner /> : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
          {courses.map(c=>(
            <Card key={c._id} style={{padding:"20px"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{width:48,height:48,borderRadius:14,background:c.bgColor||"#ede9ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}><img width={50} src={c.icon} /></div>
                  <div>
                    <p style={{fontFamily:sans,fontSize:14,fontWeight:700,color:T.dark,margin:"0 0 4px",lineHeight:1.3}}>{c.title}</p>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <Badge label={`${c.lessonCount} dars`} color={T.purple}/>
                      {c.isPro && <Badge label="PREMIUM" color={T.gold}/>}
                      {!c.isActive && <Badge label="Faol emas" color={T.red}/>}
                    </div>
                  </div>
                </div>
              </div>
              <p style={{fontFamily:sans,fontSize:12,color:T.muted,lineHeight:1.5,margin:"0 0 16px"}}>{c.description}</p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <Btn size="sm" onClick={()=>loadLessons(c)}>📖 Darslar</Btn>
                <Btn size="sm" variant="ghost" onClick={()=>openEditCourse(c)}>✏️ Tahrir</Btn>
                <Btn size="sm" variant="danger" onClick={()=>deleteCourse(c)}>🗑</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Lesson panel */}
      {lessonPanel && (
        <div style={{position:"fixed",inset:0,zIndex:500,display:"flex"}}>
          <div style={{flex:1,background:"rgba(26,16,48,.5)",backdropFilter:"blur(3px)"}} onClick={()=>setLessonPanel(null)}/>
          <div style={{width:"min(520px,100%)",background:T.card,overflowY:"auto",boxShadow:"-8px 0 40px rgba(26,16,48,.15)",display:"flex",flexDirection:"column"}}>
            <div style={{padding:"24px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:T.card,zIndex:1}}>
              <div>
                <h3 style={{fontFamily:serif,fontSize:18,fontWeight:700,color:T.dark,margin:"0 0 2px"}}>{lessonPanel.title}</h3>
                <p style={{fontFamily:sans,fontSize:12,color:T.muted,margin:0}}>{lessons.length} ta dars</p>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn size="sm" onClick={openNewLesson}>＋ Dars</Btn>
                <button onClick={()=>setLessonPanel(null)} style={{width:32,height:32,borderRadius:8,background:"#f0ecff",border:"none",cursor:"pointer",fontSize:16,color:T.muted}}>✕</button>
              </div>
            </div>
            <div style={{padding:"20px",flex:1}}>
              {lessons.length === 0
                ? <p style={{fontFamily:sans,fontSize:14,color:T.muted,textAlign:"center",padding:40}}>Darslar yo'q. Birinchi darsni qo'shing!</p>
                : lessons.map((l,i)=>(
                  <div key={l._id} style={{background:"#f9f7ff",borderRadius:14,padding:"16px",marginBottom:12,border:`1px solid ${T.border}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{width:28,height:28,borderRadius:8,background:T.purpleSoft,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:sans,fontSize:12,fontWeight:800,color:T.purple}}>{i+1}</span>
                        <p style={{fontFamily:sans,fontSize:13,fontWeight:700,color:T.dark,margin:0}}>{l.title}</p>
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        {l.isPro && <Badge label="PREMIUM" color={T.gold}/>}
                        <Btn size="sm" variant="ghost" onClick={()=>openEditLesson(l)}>✏️</Btn>
                        <Btn size="sm" variant="danger" onClick={()=>deleteLesson(l)}>🗑</Btn>
                      </div>
                    </div>
                    <p style={{fontFamily:sans,fontSize:12,color:T.muted,margin:"0 0 4px"}}>{l.content?.slice(0,80)}...</p>
                    <span style={{fontFamily:sans,fontSize:11,color:T.muted}}>⏱ {l.duration} daqiqa</span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* Course modal */}
      <Modal open={!!courseModal} onClose={()=>setCourseModal(null)}
        title={courseModal==="new"?"Yangi kurs":"Kursni tahrirlash"}>
        <Input label="Sarlavha" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Kurs nomi"/>
        <Textarea label="Tavsif" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Kurs tavsifi..."/>
        <div style={{marginBottom:16}}>
          <label style={{fontFamily:sans,fontSize:12,fontWeight:700,color:T.ink,display:"block",marginBottom:5}}>Ikonka</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {ICONS.map(ic=>(
              <button key={ic} onClick={()=>setForm(f=>({...f,icon:ic}))} style={{
                width:38,height:38,borderRadius:10,border:`2px solid ${form.icon===ic?T.purple:T.border}`,
                background:form.icon===ic?T.purpleSoft:"transparent",fontSize:20,cursor:"pointer",
              }}><img width={26} src={ic} /></button>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          <div>
            <label style={{fontFamily:sans,fontSize:12,fontWeight:700,color:T.ink,display:"block",marginBottom:5}}>Rang</label>
            <input type="color" value={form.color} onChange={e=>setForm(f=>({...f,color:e.target.value}))}
              style={{width:"100%",height:40,borderRadius:10,border:`1.5px solid ${T.border}`,cursor:"pointer",padding:4}}/>
          </div>
          <div>
            <label style={{fontFamily:sans,fontSize:12,fontWeight:700,color:T.ink,display:"block",marginBottom:5}}>Fon rangi</label>
            <input type="color" value={form.bgColor} onChange={e=>setForm(f=>({...f,bgColor:e.target.value}))}
              style={{width:"100%",height:40,borderRadius:10,border:`1.5px solid ${T.border}`,cursor:"pointer",padding:4}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:20}}>
          <label style={{fontFamily:sans,fontSize:13,fontWeight:700,color:T.ink,display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
            <input type="checkbox" checked={form.isPro} onChange={e=>setForm(f=>({...f,isPro:e.target.checked}))}
              style={{width:16,height:16,accentColor:T.gold}}/>
            ✦ Premium kurs
          </label>
          <label style={{fontFamily:sans,fontSize:13,fontWeight:700,color:T.ink,display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
            <input type="checkbox" checked={form.isActive!==false} onChange={e=>setForm(f=>({...f,isActive:e.target.checked}))}
              style={{width:16,height:16,accentColor:T.green}}/>
            Faol
          </label>
        </div>
        <Btn onClick={saveCourse} style={{width:"100%",justifyContent:"center"}}>
          {courseModal==="new"?"＋ Kurs qo'shish":"✓ Saqlash"}
        </Btn>
      </Modal>

      {/* Lesson modal */}
      <Modal open={!!lessonModal} onClose={closeLessonModal}
        title={lessonModal==="new"?"Yangi dars":"Darsni tahrirlash"}>
        <Input label="Dars sarlavhasi" value={lForm.title} onChange={e=>setLForm(f=>({...f,title:e.target.value}))} placeholder="Dars nomi"/>
        <Textarea label="Mazmun" value={lForm.content} onChange={e=>setLForm(f=>({...f,content:e.target.value}))} rows={5} placeholder="Dars matni..."/>
        <div style={{marginBottom:16}}>
          <label style={{fontFamily:sans,fontSize:12,fontWeight:700,color:T.ink,display:"block",marginBottom:5}}>Video fayl (ixtiyoriy)</label>
          <input type="file" accept=".mp4,.webm,.mov,.m4v,video/mp4,video/webm,video/quicktime"
            disabled={lessonSaving}
            onChange={e=>setLessonVideoFile(e.target.files?.[0]||null)}
            style={{width:"100%",fontFamily:sans,fontSize:13,padding:8,borderRadius:10,border:`1.5px solid ${T.border}`,background:"#fff"}}/>
          {lessonVideoFile && <p style={{fontFamily:sans,fontSize:11,color:T.muted,margin:"6px 0 0"}}>📎 {lessonVideoFile.name}</p>}
          {lessonSaving && lessonVideoFile && (
            <p style={{fontFamily:sans,fontSize:11,color:T.purple,margin:"6px 0 0"}}>Video yuklanmoqda... iltimos kuting.</p>
          )}
          {lessonModal!=="new" && lessonModal?.videoFile && !lessonVideoFile && (
            <p style={{fontFamily:sans,fontSize:11,color:T.muted,margin:"6px 0 0"}}>Serverdagi video: {lessonModal.videoFile}</p>
          )}
          <p style={{fontFamily:sans,fontSize:11,color:T.muted,margin:"8px 0 0",lineHeight:1.4}}>
            mp4, webm, mov, m4v — maks. 500 MB. Fayl tanlansa tashqi URL e'tiborsiz qolinadi.
          </p>
        </div>
        <Input label="Tashqi video URL (ixtiyoriy)" value={lForm.videoUrl} onChange={e=>setLForm(f=>({...f,videoUrl:e.target.value}))} placeholder="YouTube / Vimeo / to'g'ri https://..."/>
        {!lessonVideoFile && lForm.videoUrl && (() => {
          const url = lForm.videoUrl;
          const ytId = (url.match(/(?:v=|youtu\.be\/|embed\/)([-\w]{11})/) || [])[1];
          const vmId = (url.match(/vimeo\.com\/(\d+)/) || [])[1];
          if (ytId) return (
            <div style={{borderRadius:10,overflow:"hidden",aspectRatio:"16/9",marginBottom:16,border:`1px solid ${T.border}`}}>
              <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${ytId}?rel=0`} frameBorder="0" allowFullScreen style={{display:"block"}}/>
            </div>
          );
          if (vmId) return (
            <div style={{borderRadius:10,overflow:"hidden",aspectRatio:"16/9",marginBottom:16,border:`1px solid ${T.border}`}}>
              <iframe width="100%" height="100%" src={`https://player.vimeo.com/video/${vmId}`} frameBorder="0" allowFullScreen style={{display:"block"}}/>
            </div>
          );
          return <div style={{background:"#f5f3ff",borderRadius:10,padding:"10px 14px",marginBottom:16,fontFamily:sans,fontSize:12,color:T.muted}}>🎬 Video URL saqlandi</div>;
        })()}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Input label="Davomiylik (daqiqa)" type="number" value={lForm.duration} onChange={e=>setLForm(f=>({...f,duration:+e.target.value}))}/>
          <Input label="Tartib raqami" type="number" value={lForm.order} onChange={e=>setLForm(f=>({...f,order:+e.target.value}))}/>
        </div>
        <label style={{fontFamily:sans,fontSize:13,fontWeight:700,color:T.ink,display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginBottom:20}}>
          <input type="checkbox" checked={lForm.isPro} onChange={e=>setLForm(f=>({...f,isPro:e.target.checked}))}
            style={{width:16,height:16,accentColor:T.gold}}/>
          ✦ Premium dars
        </label>
        <Btn onClick={saveLesson} loading={lessonSaving} disabled={lessonSaving} style={{width:"100%",justifyContent:"center"}}>
          {lessonModal==="new"?"＋ Dars qo'shish":"✓ Saqlash"}
        </Btn>
      </Modal>
    </div>
  );
}

/* ── QNA MANAGEMENT ── */
function QnaAdmin({ toast }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all"); // all, pending, answered
  const [published, setPublished] = useState("all"); // all, published, unpublished
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [answerForm, setAnswerForm] = useState({ answer:"", isPublished:false });

  const load = useCallback(() => {
    setLoading(true);
    adminApi.qna.list({ page, limit:15, status: status==="all"?undefined:status, search, published: published==="all"?undefined:published })
      .then(d => setQuestions(d.items || d.qna || d.questions || []))
      .catch(e => toast(e.message, "error"))
      .finally(() => setLoading(false));
  }, [page, status, published, search, toast]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const handleAnswer = async () => {
    if (!answerForm.answer.trim()) { toast("Javob yozilmadi", "error"); return; }
    try {
    await adminApi.qna.answer(modal._id, {
      answer:      answerForm.answer.trim(),
      isPublished: answerForm.isPublished,
    });
    // Backend o'zi notification yuboradi — bu yerda hech narsa qilish shart emas
    toast("Javob berildi ✓", "success");
    setModal(null);
    setAnswerForm({ answer:"", isPublished:false });
    load();
  } catch(e) { toast(e.message, "error"); }
  };

  const handlePublish = async (q, pub) => {
    try {
      await adminApi.qna.publish(q._id, pub);
      if (pub) {
        // QnA answer may have changed, so fetch latest
        await adminApi.qna.getOne(q._id);
        // await adminApi.notifyAll({
        //   type: "info",
        //   title: "Yangi savol-javob e'lon qilindi",
        //   message: `Savol: ${updated.question}\nJavob: ${updated.answer}`,
        // });
      }
      toast(pub ? "E'lon qilindi" : "E'lon bekor qilindi", "success");
      load();
    } catch(e) { toast(e.message, "error"); }
  };

  const handleDelete = async (q) => {
    if (!confirm(`"${q.question.substring(0,40)}..." o'chirilsinmi?`)) return;
    try {
      await adminApi.qna.remove(q._id);
      toast("O'chirildi", "success");
      load();
    } catch(e) { toast(e.message, "error"); }
  };

  return (
    <div>
      <div style={{marginBottom:28}}>
        <h2 style={{fontFamily:serif,fontSize:28,fontWeight:700,color:T.dark,margin:"0 0 4px"}}>Savol-javoblar</h2>
        <p style={{fontFamily:sans,fontSize:13,color:T.muted,margin:0}}>Anonim savollarni ko'rish va javob berish</p>
      </div>

      {/* Filters */}
      <Card style={{padding:"16px 20px",marginBottom:20}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
          <input value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }} placeholder="🔍 Qidirish..."
            style={{padding:"9px 14px",fontFamily:sans,fontSize:13,color:T.dark,background:"#f9f7ff",border:`1.5px solid ${T.border}`,borderRadius:10,outline:"none"}} />
          <select value={status} onChange={e=>{ setStatus(e.target.value); setPage(1); }}
            style={{padding:"9px 14px",fontFamily:sans,fontSize:13,color:T.dark,background:"#f9f7ff",border:`1.5px solid ${T.border}`,borderRadius:10,outline:"none",cursor:"pointer"}}>
            <option value="all">Barcha savollar</option>
            <option value="pending">Javob kutilmoqda</option>
            <option value="answered">Javoblangan</option>
          </select>
          <select value={published} onChange={e=>{ setPublished(e.target.value); setPage(1); }}
            style={{padding:"9px 14px",fontFamily:sans,fontSize:13,color:T.dark,background:"#f9f7ff",border:`1.5px solid ${T.border}`,borderRadius:10,outline:"none",cursor:"pointer"}}>
            <option value="all">Barcha e'lonlar</option>
            <option value="published">Faqat e'lon qilingan</option>
            <option value="unpublished">Faqat e'lon qilinmagan</option>
          </select>
        </div>
      </Card>

      {loading ? (
        <Spinner />
      ) : questions.length === 0 ? (
        <Card style={{padding:"48px 24px",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:16}}>❓</div>
          <p style={{fontFamily:sans,fontSize:14,fontWeight:700,color:T.dark,margin:0}}>Savol topilmadi</p>
        </Card>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {questions.map(q => (
            <Card key={q._id} style={{padding:"16px 20px"}}>
              <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{width:44,height:44,borderRadius:12,background:q.status==="pending"?"#fef3c7":"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                  {q.status==="pending"?"⏳":"✓"}
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6,gap:8,flexWrap:"wrap"}}>
                    <p style={{fontFamily:sans,fontSize:14,fontWeight:700,color:T.dark,margin:0}}>{q.question}</p>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {q.topic && <Badge label={`# ${q.topic}`} color="#7c3aed"/>}
                      {q.isPublished && <Badge label="E'lon" color={T.green}/>}
                      {q.status==="answered" && <Badge label="Javoblangan" color={T.blue}/>}
                    </div>
                  </div>
                  {q.askedName && <p style={{fontFamily:sans,fontSize:12,color:T.muted,margin:"0 0 6px"}}>👤 {q.askedName}</p>}
                  {q.answer && <p style={{fontFamily:sans,fontSize:13,color:T.ink,margin:"0 0 6px",lineHeight:1.5,background:"#f9f7ff",padding:"10px 12px",borderRadius:8}}>{q.answer}</p>}
                  <p style={{fontFamily:sans,fontSize:11,color:T.muted,margin:0}}>{new Date(q.createdAt).toLocaleDateString("uz-UZ",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</p>
                </div>
                <div style={{display:"flex",gap:6,flexDirection:"column",flexShrink:0}}>
                  <Btn size="sm" variant={q.status==="pending"?"primary":"success"} onClick={()=>{ setModal(q); setAnswerForm({ answer: q.answer||"", isPublished: q.isPublished||false }); }}>
                    {q.status==="pending"?"Javob":"Edit"}
                  </Btn>
                  <Btn size="sm" variant={q.isPublished?"ghost":"primary"} onClick={()=>handlePublish(q, !q.isPublished)}>
                    {q.isPublished?"Bekor":"E'lon"}
                  </Btn>
                  <Btn size="sm" variant="danger" onClick={()=>handleDelete(q)}>O'chirish</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Answer Modal */}
      {modal && (
        <Modal open={true} onClose={()=>setModal(null)} title="Javob berish">
          <div style={{marginBottom:16}}>
            <p style={{fontFamily:sans,fontSize:12,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.05em",margin:"0 0 6px"}}>Savol</p>
            <p style={{fontFamily:sans,fontSize:14,color:T.dark,margin:0,lineHeight:1.6}}>{modal.question}</p>
            {modal.askedName && <p style={{fontFamily:sans,fontSize:12,color:T.muted,margin:"8px 0 0"}}>👤 {modal.askedName}</p>}
          </div>
          <Textarea label="Javob" value={answerForm.answer} onChange={e=>setAnswerForm(f=>({...f,answer:e.target.value}))} placeholder="Javobingizni kiriting..."/>
          <label style={{fontFamily:sans,fontSize:13,fontWeight:700,color:T.ink,display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginBottom:20}}>
            <input type="checkbox" checked={answerForm.isPublished} onChange={e=>setAnswerForm(f=>({...f,isPublished:e.target.checked}))}
              style={{width:16,height:16,accentColor:T.purple}}/>
            Darhol e'lon qiling
          </label>
          <div style={{display:"flex",gap:10}}>
            <Btn onClick={handleAnswer} style={{flex:1}}>Saqlash</Btn>
            <Btn variant="ghost" onClick={()=>setModal(null)} style={{flex:1}}>Bekor</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── TIPS MANAGEMENT ── */
function TipsAdmin({ toast }) {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ content:"", category:"sog'liq", emoji:"💡", isActive:true, publishDate:"" });

  const load = useCallback(() => {
    setLoading(true);
    adminApi.tips.list({ limit:50 })
      .then(d => setTips(d.tips || []))
      .catch(e => toast(e.message, "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.content.trim()) { toast("Maslahat matni kerak", "error"); return; }
    try {
      if (modal?._id) await adminApi.tips.update(modal._id, form);
      else await adminApi.tips.create(form);
      toast(modal ? "Maslahat o'zgartirildi" : "Maslahat qo'shildi", "success");
      setModal(null);
      setForm({ content:"", category:"sog'liq", emoji:"💡", isActive:true, publishDate:"" });
      load();
    } catch(e) { toast(e.message, "error"); }
  };

  const handleDelete = async (t) => {
    if (!confirm(`"${t.content.substring(0,40)}..." o'chirilsinmi?`)) return;
    try {
      await adminApi.tips.remove(t._id);
      toast("O'chirildi", "success");
      load();
    } catch(e) { toast(e.message, "error"); }
  };

  const categories = ["sog'liq", "ovqatlanish", "jismoniy", "ruhiy", "sikl", "umumiy"];
  const emojis = ["💧", "🥗", "🚶", "🧘", "📅", "🌟"];

  return (
    <div>
      <div style={{marginBottom:28}}>
        <h2 style={{fontFamily:serif,fontSize:28,fontWeight:700,color:T.dark,margin:"0 0 4px"}}>Kunlik maslahatlar</h2>
        <p style={{fontFamily:sans,fontSize:13,color:T.muted,margin:0}}>Foydalanuvchilarga ko'rsatiladigan maslahatlarni boshqaring</p>
      </div>

      <Card style={{padding:"20px",marginBottom:20}}>
        <Btn onClick={()=>{ setModal("new"); setForm({ content:"", category:"sog'liq", emoji:"💡", isActive:true, publishDate:"" }); }} size="lg" style={{width:"100%",justifyContent:"center"}}>
          ＋ Yangi maslahat
        </Btn>
      </Card>

      {loading ? (
        <Spinner />
      ) : tips.length === 0 ? (
        <Card style={{padding:"48px 24px",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:16}}>💡</div>
          <p style={{fontFamily:sans,fontSize:14,fontWeight:700,color:T.dark,margin:0}}>Maslahat yo'q</p>
        </Card>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {tips.map(t => (
            <Card key={t._id} style={{padding:"16px 20px"}}>
              <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{fontSize:24}}>{t.emoji || "💡"}</div>
                <div style={{flex:1}}>
                  <p style={{fontFamily:sans,fontSize:14,fontWeight:700,color:T.dark,margin:"0 0 4px"}}>{t.content}</p>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                    <span style={{fontFamily:sans,fontSize:11,color:T.muted}}>📁 {t.category}</span>
                    {!t.isActive && <span style={{fontFamily:sans,fontSize:11,color:T.muted}}>🔕 O'chiq</span>}
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexDirection:"column",flexShrink:0}}>
                  <Btn size="sm" variant="ghost" onClick={()=>{ setModal(t); setForm({ content:t.content, category:t.category, emoji:t.emoji, isActive:t.isActive, publishDate:t.publishDate||"" }); }}>Tahrir</Btn>
                  <Btn size="sm" variant="danger" onClick={()=>handleDelete(t)}>O'chirish</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {modal && (
        <Modal open={true} onClose={()=>setModal(null)} title={modal==="new"?"Yangi maslahat":"Maslahatni tahrirlash"}>
          <Textarea label="Maslahat matni" value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} rows={3} placeholder="Maslahat yozish..."/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            <div>
              <label style={{fontFamily:sans,fontSize:12,fontWeight:700,color:T.ink,display:"block",marginBottom:6}}>Kategoriya</label>
              <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
                style={{width:"100%",padding:"9px 12px",fontFamily:sans,fontSize:13,color:T.dark,background:"#f9f7ff",border:`1px solid ${T.border}`,borderRadius:8,outline:"none",cursor:"pointer"}}>
                {categories.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontFamily:sans,fontSize:12,fontWeight:700,color:T.ink,display:"block",marginBottom:6}}>Emoji</label>
              <select value={form.emoji} onChange={e=>setForm(f=>({...f,emoji:e.target.value}))}
                style={{width:"100%",padding:"9px 12px",fontFamily:sans,fontSize:13,color:T.dark,background:"#f9f7ff",border:`1px solid ${T.border}`,borderRadius:8,outline:"none",cursor:"pointer"}}>
                {emojis.map(em=><option key={em} value={em}>{em}</option>)}
              </select>
            </div>
          </div>
          <Input label="Chiqarilish sanasi (ixtiyoriy)" type="date" value={form.publishDate} onChange={e=>setForm(f=>({...f,publishDate:e.target.value}))} placeholder="Sana"/>
          <label style={{fontFamily:sans,fontSize:13,fontWeight:700,color:T.ink,display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginBottom:20}}>
            <input type="checkbox" checked={form.isActive} onChange={e=>setForm(f=>({...f,isActive:e.target.checked}))}
              style={{width:16,height:16,accentColor:T.purple}}/>
            Faol (ko'rsatilish)
          </label>
          <div style={{display:"flex",gap:10}}>
            <Btn onClick={handleSave} style={{flex:1}}>Saqlash</Btn>
            <Btn variant="ghost" onClick={()=>setModal(null)} style={{flex:1}}>Bekor</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Broadcast({ toast }) {
  const [form, setForm] = useState({ title:"", message:"", type:"info", onlyPro:false });
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!form.title || !form.message) { toast("Sarlavha va xabar kerak","error"); return; }
    if (!confirm(`Barcha ${form.onlyPro?"Pro ":""} foydalanuvchilarga yuborilsinmi?`)) return;
    setLoading(true);
    try {
      const d = await adminApi.broadcast(form);
      toast(d.message, "success");
      setForm({ title:"", message:"", type:"info", onlyPro:false });
    } catch(e) { toast(e.message,"error"); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{marginBottom:32}}>
        <h2 style={{fontFamily:serif,fontSize:28,fontWeight:700,color:T.dark,margin:"0 0 6px",display:"flex",alignItems:"center",gap:12}}>
          <img src="/Untitled (11)/fontisto_info.svg" alt="" width={36} height={36} style={{ objectFit:"contain" }} />
          Xabar yuborish
        </h2>
        <p style={{fontFamily:sans,fontSize:14,color:T.muted,margin:0}}>Barcha yoki Premium foydalanuvchilarga bildirishnoma</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:24}}>
        <Card style={{padding:"28px"}}>
          <Input label="Sarlavha" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Bildirishnoma sarlavhasi"/>
          <Textarea label="Xabar" value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} rows={6} placeholder="Xabar mazmuni..."/>
          <div style={{marginBottom:20}}>
            <label style={{fontFamily:sans,fontSize:12,fontWeight:700,color:T.ink,display:"block",marginBottom:8}}>Xabar turi</label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {[{v:"info",l:"ℹ Info"},{v:"reminder",l:"⏰ Eslatma"},{v:"achievement",l:"🏆 Yutuq"},{v:"warning",l:"⚠ Ogohlantirish"}].map(t=>(
                <button key={t.v} onClick={()=>setForm(f=>({...f,type:t.v}))} style={{
                  padding:"10px 8px",borderRadius:10,border:`2px solid ${form.type===t.v?T.purple:T.border}`,
                  background:form.type===t.v?T.purpleSoft:"transparent",
                  fontFamily:sans,fontSize:11,fontWeight:700,color:form.type===t.v?T.purple:T.muted,cursor:"pointer",
                }}>{t.l}</button>
              ))}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <label style={{fontFamily:sans,fontSize:13,fontWeight:700,color:T.ink,display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
              <input type="checkbox" checked={form.onlyPro} onChange={e=>setForm(f=>({...f,onlyPro:e.target.checked}))}
                style={{width:16,height:16,accentColor:T.gold}}/>
              Faqat ✦ Premium foydalanuvchilarga
            </label>
            <Btn onClick={send} loading={loading} size="lg" style={{ display:"inline-flex", alignItems:"center", gap:8 }}>
              <img src="/Untitled (11)/mingcute_light-line.svg" alt="" width={20} height={20} style={{ objectFit:"contain" }} />
              Yuborish
            </Btn>
          </div>
        </Card>

        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Card style={{padding:"20px"}}>
            <h4 style={{fontFamily:sans,fontSize:13,fontWeight:800,color:T.ink,margin:"0 0 12px",textTransform:"uppercase",letterSpacing:"0.06em"}}>Ko'rinish</h4>
            {form.title || form.message ? (
              <div style={{background:"#f9f7ff",borderRadius:12,padding:"14px",border:`1px solid ${T.border}`}}>
                <p style={{fontFamily:sans,fontSize:13,fontWeight:700,color:T.dark,margin:"0 0 6px"}}>{form.title || "Sarlavha..."}</p>
                <p style={{fontFamily:sans,fontSize:12,color:T.muted,margin:0,lineHeight:1.5}}>{form.message || "Xabar..."}</p>
              </div>
            ) : (
              <p style={{fontFamily:sans,fontSize:13,color:T.muted,textAlign:"center",padding:"20px 0"}}>Ko'rinish bu yerda</p>
            )}
          </Card>

          <Card style={{padding:"20px",background:"linear-gradient(135deg,#1e1030,#2d1f4a)"}}>
            <p style={{fontFamily:sans,fontSize:12,fontWeight:800,color:"rgba(255,255,255,.6)",textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 12px"}}>Eslatmalar</p>
            {["Yuborishdan oldin matnni tekshiring","Premium belgisi faqat Premium uchun ishlaydi","Xabarlar bevosita ilovaga keladi"].map((t,i)=>(
              <p key={i} style={{fontFamily:sans,fontSize:12,color:"rgba(255,255,255,.7)",margin:"0 0 8px",display:"flex",gap:6}}>
                <span style={{color:"#7c5cd6",flexShrink:0}}>›</span>{t}
              </p>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT ADMIN APP
═══════════════════════════════════════════════════════ */
const ADMIN_MENU = [
  { key:"dashboard", label:"Dashboard",     emoji:"📊" },
  { key:"users",     label:"Foydalanuvchilar", emoji:"👥" },
  { key:"courses",   label:"Kurslar",       emoji:"📚" },
  { key:"qna",       label:"Savol-javoblar",emoji:"❓" },
  { key:"tips",      label:"Maslahatlar",   emoji:"💡" },
  { key:"broadcast", label:"Xabar yuborish", iconSrc:"/Untitled (11)/fontisto_info.svg" },
];

function SidebarContent({ tab, setTab, setSide }) {
  return (
    <>
      <div style={{padding:"28px 20px 20px",borderBottom:`1px solid rgba(255,255,255,.08)`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <img src={LOGO_DEFAULT} alt="Miila" style={{ ...logoImgSvg, height: 72, width: "auto", maxWidth: 300 }} />
          <div>
            <p style={{fontFamily:sans,fontSize:10,color:"rgba(255,255,255,.45)",margin:0,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>Admin Panel</p>
          </div>
        </div>
      </div>
      <nav style={{flex:1,padding:"16px 12px"}}>
        {ADMIN_MENU.map(m=>{
          const a = tab===m.key;
          return (
            <button key={m.key} onClick={()=>{setTab(m.key);setSide(false);}} style={{
              width:"100%",display:"flex",alignItems:"center",gap:12,padding:"11px 14px",
              borderRadius:12,border:"none",cursor:"pointer",marginBottom:4,transition:"all .2s",
              background:a?"rgba(124,92,214,.25)":"transparent",
              fontFamily:sans,fontSize:13,fontWeight:a?700:500,color:a?"white":"rgba(255,255,255,.6)",
              boxShadow:a?"inset 0 0 0 1px rgba(124,92,214,.5)":"none",
            }}>
              <span style={{width:32,height:32,borderRadius:9,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,
                background:a?"rgba(124,92,214,.4)":"rgba(255,255,255,.07)"}}>
                {m.iconSrc ? <img src={m.iconSrc} alt="" width={20} height={20} style={{ objectFit:"contain" }} /> : m.emoji}
              </span>
              {m.label}
              {a && <span style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:"#7c5cd6"}}/>}
            </button>
          );
        })}
      </nav>
      <div style={{padding:"12px 20px 24px",borderTop:`1px solid rgba(255,255,255,.08)`}}>
        <button onClick={() => { storage.clear(); window.location.reload(); }}
          style={{fontFamily:sans,fontSize:12,color:"rgba(255,255,255,.45)",background:"none",border:"none",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:6,padding:0}}>
          ← Chiqish
        </button>
      </div>
    </>
  );
}

export default function AdminApp() {
  const [tab, setTab]       = useState("dashboard");
  const [toast, setToast_]  = useState({ msg:"", type:"success" });
  const [sideOpen, setSide] = useState(false);
  const w = useW();
  const isLg = w >= 1024;

  const showToast = useCallback((msg, type="success") => {
    setToast_({ msg, type });
    setTimeout(() => setToast_({ msg:"", type:"success" }), 3500);
  }, []);

  const screens = {
    dashboard: <Dashboard />,
    users:     <Users toast={showToast} />,
    courses:   <Courses toast={showToast} />,
    qna:       <QnaAdmin toast={showToast} />,
    tips:      <TipsAdmin toast={showToast} />,
    broadcast: <Broadcast toast={showToast} />,
  };

  return (
    <div style={{display:"flex",minHeight:"100vh",background:T.bg,fontFamily:sans}}>
      <style>{`
        ${FONTS}
        *,*::before,*::after{box-sizing:border-box;}body{margin:0;}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(76,47,160,.2);border-radius:3px}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideIn{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}
        button{font-family:'Plus Jakarta Sans',system-ui,sans-serif}
        table{font-family:'Plus Jakarta Sans',system-ui,sans-serif}
      `}</style>

      {/* Sidebar — desktop */}
      {isLg && (
        <aside style={{width:220,flexShrink:0,background:T.sidebar,display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh"}}>
          <SidebarContent tab={tab} setTab={setTab} setSide={setSide} />
        </aside>
      )}

      {/* Mobile sidebar overlay */}
      {!isLg && sideOpen && (
        <div style={{position:"fixed",inset:0,zIndex:500}} onClick={()=>setSide(false)}>
          <div style={{position:"absolute",inset:0,background:"rgba(26,16,48,.6)",backdropFilter:"blur(3px)"}}/>
          <aside style={{position:"absolute",left:0,top:0,bottom:0,width:220,background:T.sidebar,display:"flex",flexDirection:"column",zIndex:1}}
            onClick={e=>e.stopPropagation()}>
            <SidebarContent tab={tab} setTab={setTab} setSide={setSide} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        {/* Topbar */}
        <header style={{background:T.card,borderBottom:`1px solid ${T.border}`,padding:"0 24px",height:60,
          display:"flex",alignItems:"center",justifyContent:"space-between",
          position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(76,47,160,.06)"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            {!isLg && (
              <button onClick={()=>setSide(o=>!o)} style={{width:36,height:36,background:T.purpleSoft,border:"none",borderRadius:10,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}>
                {[0,1,2].map(i=><span key={i} style={{width:16,height:2,background:T.purple,borderRadius:1,display:"block"}}/>)}
              </button>
            )}
            <h1 style={{fontFamily:serif,fontSize:18,fontWeight:700,color:T.dark,margin:0}}>
              {ADMIN_MENU.find(m=>m.key===tab)?.label}
            </h1>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#4c2fa0,#7c5cd6)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:14,fontWeight:700}}>A</div>
          </div>
        </header>

        {/* Content */}
        <main style={{flex:1,padding:isLg?"32px 36px":"20px 16px",paddingBottom:40,overflowY:"auto"}}>
          {screens[tab]}
        </main>
      </div>

      <Toast msg={toast.msg} type={toast.type}/>
    </div>
  );
}