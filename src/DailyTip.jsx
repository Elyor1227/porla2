import React from 'react'
import { useEffect, useState } from "react";
import api from "./api";

export default function DailyTip({ onModulesClick }) {
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(true);
  const serif = "'Playfair Display', Georgia, serif";
  const sans  = "'Plus Jakarta Sans', system-ui, sans-serif";
  const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');`;
const T = {
  rose:"#d64f6e", roseMid:"#e8728a", roseLight:"#fde8ec",
  cream:"#fdf8f5", dark:"#221219", ink:"#4a2535",
  muted:"#9a7585", border:"rgba(214,79,110,0.12)", white:"#ffffff",
  gold:"#e9a825", green:"#0ea87a", blue:"#3b7de8", purple:"#8657d6",
  error:"#ef4444", errorBg:"#fef2f2",
};
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
  useEffect(() => {
    let mounted = true;
    api.tips.getToday()
      .then(d => { if (mounted) setTip(d.tip || d.data || null); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) return null;
  if (!tip) return null;

  return (
    // <div style={{ padding:12, borderRadius:12, background:"#f9f7ff", border:"1px solid rgba(124,58,237,.06)", display:"flex", gap:12, alignItems:"center", ...style }}>
    //   <div style={{ fontSize:28 }}>{tip.emoji || "💡"}</div>
    //   <div>
    //     <div style={{ fontFamily:"Inter, sans-serif", fontSize:13, fontWeight:700, color:"#111827" }}>Kunlik maslahat</div>
    //     <div style={{ fontFamily:"Inter, sans-serif", fontSize:14, color:"#374151" }}>{tip.content}</div>
    //   </div>
    // </div>
    <div style={{ background:"linear-gradient(145deg,#fffbf0,#fef6e4)", borderRadius:24, padding:"24px", border:"1.5px solid rgba(233,168,37,.2)" }}>
          <div style={{ width:44, height:44, borderRadius:14, background:"linear-gradient(135deg,#e9a825,#f5bc3a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:14 }}>💡</div>
          <p style={{ fontFamily:sans, fontSize:11, fontWeight:700, color:T.gold, textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 8px" }}>Kunlik tibbiy faktlar</p>
          <p style={{ fontFamily:sans, fontSize:14, color:T.ink, lineHeight:1.6, margin:"0 0 16px" }}>{tip.content}</p>
          <Btn variant="gold" size="sm" onClick={onModulesClick}>Darslar →</Btn>
          </div>
  );
}
