// import React from 'react'
// import { useState, useEffect } from "react";

// const toStr = (d) => {
//   return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
// };
// const parseD = (s) => { const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); };
// const addD   = (d,n) => { const r=new Date(d); r.setDate(r.getDate()+n); return r; };
// const TODAY  = toStr(new Date());

// const MONTHS_UZ = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
// const DAYS_UZ   = ["Du","Se","Ch","Pa","Ju","Sh","Ya"];

// const PHASES = {
//   hayz:        { label:"Hayz",        color:"#D4567A", bg:"#FCE4EC", emoji:"🩸" },
//   predicted:   { label:"Taxminiy",    color:"#E8869E", bg:"#FDE8F0", emoji:"📅" },
//   follikulyar: { label:"Follikulyar", color:"#E07840", bg:"#FFF0E8", emoji:"🌱" },
//   ovulatsiya:  { label:"Ovulatsiya",  color:"#C8900A", bg:"#FFF8E1", emoji:"🌟" },
//   lyuteal:     { label:"Lyuteal",     color:"#7C5CBF", bg:"#F0EAF8", emoji:"🌙" },
// };

// const PHASE_INFO = {
//   hayz:        { title:"🩸 Hayz fazasi",     text:"Hayz – bachadon shilliq qavatining to'kilishi. 3–7 kun davom etadi. Dam olish va issiq ovqat yeyish tavsiya etiladi.", tips:["Issiq kompres qo'ying, yaxshi bo'ladi 🌡️","Temir boy ovqatlar yeyish foydali","Yengil cho'zilish og'riqni kamaytiradi","Ko'p suv iching 💧"] },
//   predicted:   { title:"📅 Taxminiy hayz",   text:"Bu kunlar oldingi siklga asosan hisoblangan taxminiy sanalar. Aniq sanangiz farq qilishi mumkin — o'zingiz kiritib yangilang.", tips:["Gigiyena narsalarini tayyorlang","Issiq ovqat yeyish foydali","Dam olishni rejalashtiring"] },
//   follikulyar: { title:"🌱 Follikulyar faza",text:"Estrogen oshadi, energiyangiz ko'tariladi. Yangi narsalar o'rganishga eng yaxshi vaqt!", tips:["Yangi narsalar o'rganishga eng zo'r vaqt!","Uchrashuvlarni shu vaqtga rejalashtirsangiz yaxshi","Sport va ijod uchun ideal davr 🚀","Energiyangizdan to'liq foydalaning!"] },
//   ovulatsiya:  { title:"🌟 Ovulatsiya",      text:"Tuxumhujayra chiqadi — eng unumdor kun. Tuxumhujayra 12–24 soat, sperma 5 kungacha yashaydi.", tips:["Eng unumdor kunlaringiz, e'tibor bering 🥚","Kayfiyat va energiya cho'qqida!","Muhim qarorlarni shu kunga qo'ying"] },
//   lyuteal:     { title:"🌙 Lyuteal faza",    text:"Progesteron ko'tariladi. PMS belgilari (shishish, kayfiyat o'zgarishi) bo'lishi mumkin.", tips:["Shirin ishtaha oshsa — meva yeng 🍌","Kayfiyat o'zgarsa o'zingizni ayblamang 💜","Magniyga boy ovqatlar yeyish foydali","Dam olishni ko'paytiring, katta qarorlarni keyinga qo'ying"] },
// };

// // ── Asosiy hisob-kitob ────────────────────────────────────────────────────────
// // periodRanges = [{ start:"YYYY-MM-DD", end:"YYYY-MM-DD" }]
// // Qaytaradi: map { dateStr -> phaseKey }
// function buildCycleMap(periodRanges, cycleLen) {
//   const map = {};
//   if (!periodRanges.length) return map;

//   const sorted = [...periodRanges].sort((a,b) => parseD(a.start) - parseD(b.start));

//   // 1. Avval barcha HAQIQIY hayz kunlarini belgilaymiz (ustiga yozib)
//   sorted.forEach(({ start, end }) => {
//     const s = parseD(start);
//     const periodLen = Math.round((parseD(end) - s) / 86400000) + 1;
//     for (let i = 0; i < periodLen; i++) {
//       map[toStr(addD(s, i))] = "hayz";
//     }
//   });

//   // 2. Har bir kiritilgan hayz uchun 3 fazani belgilaymiz
//   //    Qoida: faza faqat O'SHA hayz start dan keyingi hayz start gacha bo'lgan oraliqda
//   sorted.forEach(({ start, end }, idx) => {
//     const s = parseD(start);
//     const periodLen = Math.round((parseD(end) - s) / 86400000) + 1;

//     // Bu siklning oxiri: keyingi kiritilgan hayz boshlangan kun yoki +cycleLen
//     const nextPeriodStart = sorted[idx + 1] ? parseD(sorted[idx + 1].start) : null;
//     const cycleWindowEnd  = nextPeriodStart
//       ? toStr(addD(nextPeriodStart, -1))   // keyingi hayz 1 kun oldin
//       : toStr(addD(s, cycleLen - 1));       // yoki +cycleLen

//     const ovDay = cycleLen - 14;
//     for (let day = periodLen + 1; day <= cycleLen; day++) {
//       const ds = toStr(addD(s, day - 1));
//       // Sikldan tashqariga chiqmasin
//       if (ds > cycleWindowEnd) break;
//       // Haqiqiy hayz kuniga tegmasin
//       if (map[ds] === "hayz") break;

//       if      (day < ovDay - 1)                           map[ds] = "follikulyar";
//       else if (day >= ovDay - 1 && day <= ovDay + 1)      map[ds] = "ovulatsiya";
//       else                                                 map[ds] = "lyuteal";
//     }
//   });

//   // 3. Taxminiy hayz: eng so'nggi kiritilgan hayzdan cycleLen * 1,2,3... kun keyin
//   //    FAQAT kelajak, FAQAT o'zi kiritmagan oylar
//   const latest = sorted[sorted.length - 1];
//   const latestLen   = Math.round((parseD(latest.end) - parseD(latest.start)) / 86400000) + 1;
//   const latestStart = parseD(latest.start);

//   for (let c = 1; c <= 6; c++) {
//     const nextS = addD(latestStart, cycleLen * c);

//     const alreadyLogged = sorted.some(r => {
//       const diff = Math.abs(Math.round((parseD(r.start) - nextS) / 86400000));
//       return diff < cycleLen / 2;
//     });
//     if (alreadyLogged) continue;

//     for (let i = 0; i < latestLen; i++) {
//       const ds = toStr(addD(nextS, i));
//       if (!map[ds] && ds >= TODAY) map[ds] = "predicted";
//     }
//   }

//   return map;
// }

// export default function PorlaCalendar() {
//   const [cycleLen]      = useState(28);
//   const [periodRanges, setPeriodRanges] = useState(() => {
//     try { return JSON.parse(localStorage.getItem("pc_periods_v3") || "[]"); } catch { return []; }
//   });
//   const [selectFirst, setSelectFirst] = useState(null);
//   const [hoverDate,   setHoverDate]   = useState(null);
//   const [calYear,  setCalYear]  = useState(new Date().getFullYear());
//   const [calMonth, setCalMonth] = useState(new Date().getMonth());
//   const [phasePopup, setPhasePopup] = useState(null);
//   const [toast,      setToast]      = useState("");

//   // "+ Qo'shish" modal
//   const [addModal,    setAddModal]    = useState(false);
//   const [addStart,    setAddStart]    = useState(TODAY);
//   const [addDuration, setAddDuration] = useState(5);

//   useEffect(() => { localStorage.setItem("pc_periods_v3", JSON.stringify(periodRanges)); }, [periodRanges]);

//   const cycleMap = buildCycleMap(periodRanges, cycleLen);

//   // Cycle stats
//   const sorted = [...periodRanges].sort((a,b) => parseD(b.start) - parseD(a.start));
//   const last   = sorted[0];
//   let currentCycleDay = null, daysUntilNext = null;
//   if (last) {
//     const diffDays  = Math.round((parseD(TODAY) - parseD(last.start)) / 86400000);
//     // Necha sikldan o'tgani va joriy sikl kuni
//     currentCycleDay = (diffDays % cycleLen) + 1;
//     // Keyingi hayz: qaysi sikl boshiga to'g'ri kelishini hisoblaymiz
//     const cyclesPassed = Math.floor(diffDays / cycleLen);
//     const nextStart = toStr(addD(parseD(last.start), (cyclesPassed + 1) * cycleLen));
//     daysUntilNext   = Math.round((parseD(nextStart) - parseD(TODAY)) / 86400000);
//   }

//   function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 2800); }

//   // Kalendarda tap
//   function handleDayTap(ds) {
//     const phase = cycleMap[ds];
//     // Agar faza kun bo'lsa va tanlash rejimida emas — info ko'rsat
//     if (phase && phase !== "predicted" && !selectFirst) {
//       setPhasePopup(phase);
//       return;
//     }
//     // Tanlash rejimi
//     if (!selectFirst) {
//       setSelectFirst(ds);
//     } else {
//       const a = parseD(selectFirst), b = parseD(ds);
//       const start = toStr(a <= b ? a : b);
//       const end   = toStr(a <= b ? b : a);
//       const days  = Math.round((parseD(end) - parseD(start)) / 86400000) + 1;
//       if (days > 15) { showToast("⚠️ 15 kundan ko'p bo'lishi mumkin emas"); setSelectFirst(null); return; }
//       savePeriod(start, end, days);
//       setSelectFirst(null);
//     }
//   }

//   function savePeriod(start, end, days) {
//     // Ustma-ust tushgan yozuvlarni olib tashlaymiz
//     const filtered = periodRanges.filter(r =>
//       parseD(r.end) < parseD(start) || parseD(r.start) > parseD(end)
//     );
//     setPeriodRanges([...filtered, { start, end }]);
//     showToast(`✅ ${days} kunlik hayz saqlandi!`);
//   }

//   // Modal orqali qo'shish
//   function handleAddModal() {
//     const end  = toStr(addD(parseD(addStart), addDuration - 1));
//     savePeriod(addStart, end, addDuration);
//     setAddModal(false);
//   }

//   // Preview range (hover)
//   function inPreviewRange(ds) {
//     if (!selectFirst || !hoverDate) return false;
//     const a = parseD(selectFirst), b = parseD(hoverDate), cur = parseD(ds);
//     const lo = a<=b?a:b, hi = a<=b?b:a;
//     return cur >= lo && cur <= hi;
//   }

//   // ── Calendar renderer ─────────────────────────────────────────────────────
//   function renderCalendar() {
//     const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
//     const firstDow    = new Date(calYear, calMonth, 1).getDay();
//     const offset      = firstDow === 0 ? 6 : firstDow - 1;
//     const cells       = [];

//     for (let i = 0; i < offset; i++) cells.push(<div key={`e${i}`}/>);

//     for (let d = 1; d <= daysInMonth; d++) {
//       const ds      = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
//       const isToday = ds === TODAY;
//       const isFirst = ds === selectFirst;
//       const inPrev  = inPreviewRange(ds);
//       const phase   = cycleMap[ds];
//       const ph      = phase ? PHASES[phase] : null;

//       let bg = "transparent", fg = "#555", fw = "500", shadow = "none", border = "none";

//       if (isToday && !phase && !isFirst && !inPrev) {
//         bg = "transparent"; fg = "#D4567A"; fw = "900";
//         border = "2.5px solid #D4567A";
//         shadow = "0 0 0 3px #FCE4EC";
//       } else if (isFirst || inPrev) {
//         bg = isFirst ? "#D4567A" : "#F4A0BB"; fg = "#fff"; fw = "900";
//         shadow = isFirst ? "0 0 0 3px #FAB8CC" : "none";
//       } else if (isToday && phase) {
//         bg = "#D4567A"; fg = "#fff"; fw = "900";
//         shadow = "0 0 0 3px #FAB8CC";
//       } else if (ph) {
//         bg = ph.bg; fg = ph.color; fw = "700";
//         if (phase === "predicted") border = "1.5px dashed " + ph.color;
//       }

//       cells.push(
//         <button key={d}
//           onMouseEnter={() => selectFirst && setHoverDate(ds)}
//           onMouseLeave={() => setHoverDate(null)}
//           onClick={() => handleDayTap(ds)}
//           style={{
//             width:40, height:40, borderRadius:"50%",
//             border, cursor:"pointer",
//             background:bg, color:fg, fontWeight:fw,
//             fontSize:14, outline:"none",
//             boxShadow:shadow,
//             transition:"all 0.1s",
//             fontFamily:"'Nunito',sans-serif",
//           }}
//         >
//           {d}
//         </button>
//       );
//     }
//     return cells;
//   }

//   // ── UI ────────────────────────────────────────────────────────────────────
//   return (
//     <div style={{ minHeight:"100vh", background:"#FDF5F7", fontFamily:"'Nunito',sans-serif", maxWidth:480, margin:"0 auto" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
//         *{box-sizing:border-box;margin:0;padding:0;}
//         button{font-family:'Nunito',sans-serif;}
//         @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
//         @keyframes fadeIn{from{opacity:0}to{opacity:1}}
//         @keyframes popIn{from{transform:scale(0.9);opacity:0}to{transform:scale(1);opacity:1}}
//         @keyframes toastIn{0%{opacity:0;transform:translateX(-50%) translateY(16px)}15%{opacity:1;transform:translateX(-50%) translateY(0)}85%{opacity:1}100%{opacity:0}}
//         button:active{transform:scale(0.94);}
//         input[type=range]{accent-color:#D4567A;}
//       `}</style>

//       {/* TOP BAR */}
//       <div style={{ background:"#FDF5F7", padding:"52px 20px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10, borderBottom:"1px solid #FCE4EC" }}>
//         <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//           <div style={{ width:36,height:36,borderRadius:10, background:"linear-gradient(135deg,#D4567A,#E8855A)", display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>🌸</div>
//           <span style={{ fontWeight:900,fontSize:18,color:"#222" }}>Porla</span>
//         </div>
//         <span style={{ fontSize:15,fontWeight:800,color:"#D4567A" }}>Sikl kalendari</span>
//         <div style={{ width:36 }}/>
//       </div>

//       <div style={{ padding:"20px 18px 100px" }}>

//         {/* STATS */}
//         <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18 }}>
//           <div style={{ background:"linear-gradient(135deg,#D4567A,#B83060)",borderRadius:20,padding:"20px 16px",color:"#fff",boxShadow:"0 8px 28px rgba(212,86,122,0.38)" }}>
//             <p style={{ fontSize:10,opacity:.75,letterSpacing:2.5,textTransform:"uppercase",marginBottom:10 }}>KEYINGI HAYZGACHA</p>
//             <p style={{ fontSize:36,fontWeight:900,lineHeight:1 }}>
//               {daysUntilNext === null ? "—" : daysUntilNext <= 0 ? "🩸" : daysUntilNext}
//             </p>
//             <p style={{ fontSize:12,opacity:.8,marginTop:5 }}>
//               {daysUntilNext === null ? "Sanani kiriting" : daysUntilNext <= 0 ? "Bugun yoki kechikkan" : "kun qoldi"}
//             </p>
//           </div>
//           <div style={{ background:"#fff",borderRadius:20,padding:"20px 16px",boxShadow:"0 3px 16px rgba(0,0,0,0.08)" }}>
//             <p style={{ fontSize:10,color:"#ccc",letterSpacing:2.5,textTransform:"uppercase",marginBottom:8 }}>SIKL KUNI</p>
//             <div style={{ width:"50%",height:3,borderRadius:2,background:"#D4567A",marginBottom:10 }}/>
//             <p style={{ fontSize:13,color:"#bbb" }}>{cycleLen} kunlik sikl</p>
//             <p style={{ fontSize:34,fontWeight:900,color:"#D4567A",lineHeight:1.1 }}>
//               {currentCycleDay !== null ? currentCycleDay : "—"}
//             </p>
//           </div>
//         </div>

//         {/* INSTRUCTION + ADD BUTTON */}
//         <div style={{ display:"flex",gap:10,marginBottom:16 }}>
//           <div style={{
//             flex:1,
//             background: selectFirst ? "linear-gradient(135deg,#D4567A,#E8855A)" : "linear-gradient(135deg,#FFF0F5,#FDE8F0)",
//             borderRadius:16, padding:"14px 16px",
//             border: selectFirst ? "none" : "1.5px dashed #E8A0B4",
//             boxShadow: selectFirst ? "0 6px 24px rgba(212,86,122,0.4)" : "none",
//             transition:"all 0.3s",
//           }}>
//             {selectFirst ? (
//               <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
//                 <div>
//                   <p style={{ fontSize:12,color:"rgba(255,255,255,0.85)",marginBottom:2 }}>Boshlandi: <strong>{selectFirst}</strong></p>
//                   <p style={{ fontSize:13,fontWeight:800,color:"#fff" }}>Endi oxirgi kunni bosing 👇</p>
//                 </div>
//                 <button onClick={()=>setSelectFirst(null)}
//                   style={{ background:"rgba(255,255,255,0.25)",border:"none",borderRadius:10,padding:"6px 10px",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer" }}>
//                   ✕
//                 </button>
//               </div>
//             ) : (
//               <p style={{ fontSize:13,fontWeight:800,color:"#D4567A" }}>
//                 🩸 Kalendarda 1-kun → oxirgi kun bosing
//               </p>
//             )}
//           </div>

//           {/* + Qo'shish tugmasi */}
//           <button onClick={()=>{ setAddStart(TODAY); setAddDuration(5); setAddModal(true); }}
//             style={{ width:52,height:"100%",minHeight:52,borderRadius:16,background:"linear-gradient(135deg,#D4567A,#E8855A)",border:"none",color:"#fff",fontSize:24,cursor:"pointer",boxShadow:"0 4px 16px rgba(212,86,122,0.4)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
//             +
//           </button>
//         </div>

//         {/* CALENDAR */}
//         <div style={{ background:"#fff",borderRadius:24,padding:"20px",boxShadow:"0 3px 20px rgba(0,0,0,0.08)",marginBottom:16 }}>
//           <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
//             <button onClick={()=>{ if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); }}
//               style={{ width:38,height:38,borderRadius:12,background:"#FCE4EC",border:"none",fontSize:20,color:"#D4567A",cursor:"pointer",fontWeight:700 }}>‹</button>
//             <span style={{ fontSize:18,fontWeight:900,color:"#222" }}>{MONTHS_UZ[calMonth]}, {calYear}</span>
//             <button onClick={()=>{ if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); }}
//               style={{ width:38,height:38,borderRadius:12,background:"#FCE4EC",border:"none",fontSize:20,color:"#D4567A",cursor:"pointer",fontWeight:700 }}>›</button>
//           </div>
//           <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:10 }}>
//             {DAYS_UZ.map(d=><div key={d} style={{ textAlign:"center",fontSize:11,color:"#ccc",fontWeight:800,letterSpacing:1 }}>{d}</div>)}
//           </div>
//           <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5,justifyItems:"center" }}
//             onMouseLeave={()=>setHoverDate(null)}>
//             {renderCalendar()}
//           </div>

//           {/* mini legend */}
//           <div style={{ display:"flex",gap:16,justifyContent:"center",marginTop:16,flexWrap:"wrap" }}>
//             {[
//               { color:"#D4567A", label:"Hayz" },
//               { color:"#E8869E", label:"Taxminiy", dashed:true },
//               { color:"#C8900A", label:"Ovulatsiya" },
//               { color:"#7C5CBF", label:"Lyuteal" },
//             ].map(item=>(
//               <div key={item.label} style={{ display:"flex",alignItems:"center",gap:5 }}>
//                 <div style={{ width:10,height:10,borderRadius:"50%",background:item.color,
//                   boxShadow: item.dashed ? `0 0 0 1.5px ${item.color}` : "none",
//                   opacity: item.dashed ? 0.6 : 1 }}/>
//                 <span style={{ fontSize:11,color:"#aaa",fontWeight:700 }}>{item.label}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* KIRITILGAN HAYZLAR RO'YXATI */}
//         {periodRanges.length > 0 && (
//           <div style={{ background:"#fff",borderRadius:20,padding:"18px",boxShadow:"0 2px 14px rgba(0,0,0,0.06)" }}>
//             <p style={{ fontSize:10,color:"#ccc",fontWeight:800,letterSpacing:2.5,textTransform:"uppercase",marginBottom:14 }}>KIRITILGAN HAYZ KUNLARI</p>
//             {[...periodRanges].sort((a,b)=>parseD(b.start)-parseD(a.start)).map((r,i,arr)=>{
//               const days      = Math.round((parseD(r.end)-parseD(r.start))/86400000)+1;
//               const nextStart = toStr(addD(parseD(r.start), cycleLen));
//               return (
//                 <div key={i} style={{ paddingBottom:12,marginBottom:i<arr.length-1?12:0,borderBottom:i<arr.length-1?"1.5px solid #FCE4EC":"none" }}>
//                   <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
//                     <div style={{ display:"flex",alignItems:"center",gap:10 }}>
//                       <div style={{ width:40,height:40,borderRadius:12,background:"#FCE4EC",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>🩸</div>
//                       <div>
//                         <p style={{ fontSize:14,fontWeight:800,color:"#333" }}>{r.start} → {r.end}</p>
//                         <p style={{ fontSize:12,color:"#D4567A",fontWeight:700 }}>{days} kun</p>
//                       </div>
//                     </div>
//                     <button onClick={()=>{ setPeriodRanges(prev=>prev.filter((_,j)=>j!==i)); showToast("🗑️ O'chirildi"); }}
//                       style={{ background:"#FCE4EC",border:"none",borderRadius:10,width:34,height:34,cursor:"pointer",color:"#D4567A",fontSize:18,fontWeight:700 }}>×</button>
//                   </div>
//                   <div style={{ marginTop:8,background:"#FDE8F0",borderRadius:12,padding:"9px 13px",display:"flex",alignItems:"center",gap:8 }}>
//                     <span style={{ fontSize:14 }}>📅</span>
//                     <div>
//                       <p style={{ fontSize:10,color:"#E8869E",fontWeight:800,letterSpacing:1.5,textTransform:"uppercase" }}>Taxminiy keyingi hayz</p>
//                       <p style={{ fontSize:13,fontWeight:800,color:"#C4406A" }}>{nextStart}</p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* "+ Hayz qo'shish" MODAL */}
//       {addModal && (
//         <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.48)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center" }}
//           onClick={()=>setAddModal(false)}>
//           <div onClick={e=>e.stopPropagation()}
//             style={{ background:"#fff",borderRadius:"28px 28px 0 0",width:"100%",maxWidth:480,padding:"28px 24px 48px",animation:"slideUp 0.3s ease" }}>
//             <div style={{ width:40,height:4,borderRadius:2,background:"#eee",margin:"0 auto 24px" }}/>
//             <h2 style={{ fontSize:20,fontWeight:900,color:"#222",marginBottom:6 }}>🩸 Hayz kunlarini qo'shish</h2>
//             <p style={{ fontSize:13,color:"#aaa",marginBottom:24 }}>Boshlangan sana va necha kun davom etganini kiriting</p>

//             {/* Sana */}
//             <p style={{ fontSize:13,fontWeight:800,color:"#555",marginBottom:8 }}>Boshlanish sanasi</p>
//             <input type="date" value={addStart} onChange={e=>setAddStart(e.target.value)}
//               style={{ width:"100%",padding:"13px 16px",borderRadius:14,border:"2px solid #FCE4EC",fontSize:16,fontFamily:"'Nunito',sans-serif",color:"#333",background:"#FFF8FA",marginBottom:22 }}/>

//             {/* Necha kun */}
//             <p style={{ fontSize:13,fontWeight:800,color:"#555",marginBottom:12 }}>Necha kun davom etdi?</p>
//             <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:8 }}>
//               {[3,4,5,6,7,8,9,10].map(n=>(
//                 <button key={n} onClick={()=>setAddDuration(n)}
//                   style={{ width:52,height:52,borderRadius:14,border:`2px solid ${addDuration===n?"#D4567A":"#FCE4EC"}`,
//                     background:addDuration===n?"#D4567A":"#FFF8FA",color:addDuration===n?"#fff":"#D4567A",
//                     fontSize:18,fontWeight:800,cursor:"pointer",transition:"all 0.15s" }}>
//                   {n}
//                 </button>
//               ))}
//             </div>
//             <p style={{ fontSize:12,color:"#D4567A",marginBottom:24 }}>
//               📅 {addStart} → {toStr(addD(parseD(addStart || TODAY), addDuration - 1))}
//               &nbsp;({addDuration} kun)
//             </p>

//             <button onClick={handleAddModal}
//               style={{ width:"100%",background:"linear-gradient(135deg,#D4567A,#E8855A)",color:"#fff",border:"none",borderRadius:16,padding:"16px",fontSize:16,fontWeight:900,cursor:"pointer",boxShadow:"0 4px 20px rgba(212,86,122,0.4)" }}>
//               ✓ Saqlash
//             </button>
//           </div>
//         </div>
//       )}

//       {/* TOAST */}
//       {toast && (
//         <div style={{ position:"fixed",bottom:32,left:"50%",background:"#1A1A1A",color:"#fff",borderRadius:20,padding:"13px 26px",fontSize:14,fontWeight:700,zIndex:400,whiteSpace:"nowrap",animation:"toastIn 2.8s ease forwards",boxShadow:"0 6px 28px rgba(0,0,0,0.3)" }}>
//           {toast}
//         </div>
//       )}

//       {/* FAZA POPUP */}
//       {phasePopup && (
//         <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.52)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn 0.2s" }}
//           onClick={()=>setPhasePopup(null)}>
//           <div onClick={e=>e.stopPropagation()}
//             style={{ background:"#fff",borderRadius:28,padding:"28px 24px",maxWidth:400,width:"100%",animation:"popIn 0.25s ease",boxShadow:"0 24px 70px rgba(0,0,0,0.22)" }}>
//             {(() => {
//               const ph   = PHASES[phasePopup];
//               const info = PHASE_INFO[phasePopup];
//               return (
//                 <>
//                   <div style={{ width:58,height:58,borderRadius:18,background:ph.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,marginBottom:16 }}>{ph.emoji}</div>
//                   <h3 style={{ fontSize:21,fontWeight:900,color:"#222",marginBottom:10 }}>{info.title}</h3>
//                   <p style={{ fontSize:14,color:"#555",lineHeight:1.75,marginBottom:18 }}>{info.text}</p>
//                   <div style={{ background:ph.bg,borderRadius:16,padding:"16px" }}>
//                     <p style={{ fontSize:10,fontWeight:800,color:ph.color,letterSpacing:2.5,textTransform:"uppercase",marginBottom:12 }}>MASLAHATLAR</p>
//                     {info.tips.map((tip,i)=>(
//                       <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:10,marginBottom:8 }}>
//                         <div style={{ width:7,height:7,borderRadius:"50%",background:ph.color,marginTop:6,flexShrink:0 }}/>
//                         <p style={{ fontSize:14,color:"#333",lineHeight:1.55 }}>{tip}</p>
//                       </div>
//                     ))}
//                   </div>
//                   <button onClick={()=>setPhasePopup(null)}
//                     style={{ width:"100%",background:ph.color,color:"#fff",border:"none",borderRadius:16,padding:"15px",fontSize:15,fontWeight:800,cursor:"pointer",marginTop:20,boxShadow:`0 4px 16px ${ph.color}55` }}>
//                     Tushunarli ✓
//                   </button>
//                 </>
//               );
//             })()}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import api from "./api"; // adjust path as needed

// ================== Helper Functions ==================
const toStr = (d) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const parseD = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const addD = (d, n) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};
const TODAY = toStr(new Date());

// New helper: normalize any date string to YYYY-MM-DD
function normalizeDateStr(dateStr) {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return toStr(d);
  } catch {
    return null;
  }
}

const MONTHS_UZ = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
];
const DAYS_UZ = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

const PHASES = {
  hayz:        { label: "Hayz",        color: "#D4567A", bg: "#FCE4EC", emoji: "🩸" },
  predicted:   { label: "Taxminiy",    color: "#E8869E", bg: "#FDE8F0", emoji: "📅" },
  follikulyar: { label: "Follikulyar", color: "#E07840", bg: "#FFF0E8", emoji: "🌱" },
  ovulatsiya:  { label: "Ovulatsiya",  color: "#C8900A", bg: "#FFF8E1", emoji: "🌟" },
  lyuteal:     { label: "Lyuteal",     color: "#7C5CBF", bg: "#F0EAF8", emoji: "🌙" },
};

const PHASE_INFO = {
  hayz:        { title: "🩸 Hayz fazasi", text: "Hayz – bachadon shilliq qavatining to'kilishi. 3–7 kun davom etadi. Dam olish va issiq ovqat yeyish tavsiya etiladi.", tips: ["Issiq kompres qo'ying, yaxshi bo'ladi 🌡️", "Temir boy ovqatlar yeyish foydali", "Yengil cho'zilish og'riqni kamaytiradi", "Ko'p suv iching 💧"] },
  predicted:   { title: "📅 Taxminiy hayz", text: "Bu kunlar oldingi siklga asosan hisoblangan taxminiy sanalar. Aniq sanangiz farq qilishi mumkin — o'zingiz kiritib yangilang.", tips: ["Gigiyena narsalarini tayyorlang", "Issiq ovqat yeyish foydali", "Dam olishni rejalashtiring"] },
  follikulyar: { title: "🌱 Follikulyar faza", text: "Estrogen oshadi, energiyangiz ko'tariladi. Yangi narsalar o'rganishga eng yaxshi vaqt!", tips: ["Yangi narsalar o'rganishga eng zo'r vaqt!", "Uchrashuvlarni shu vaqtga rejalashtirsangiz yaxshi", "Sport va ijod uchun ideal davr 🚀", "Energiyangizdan to'liq foydalaning!"] },
  ovulatsiya:  { title: "🌟 Ovulatsiya", text: "Tuxumhujayra chiqadi — eng unumdor kun. Tuxumhujayra 12–24 soat, sperma 5 kungacha yashaydi.", tips: ["Eng unumdor kunlaringiz, e'tibor bering 🥚", "Kayfiyat va energiya cho'qqida!", "Muhim qarorlarni shu kunga qo'ying"] },
  lyuteal:     { title: "🌙 Lyuteal faza", text: "Progesteron ko'tariladi. PMS belgilari (shishish, kayfiyat o'zgarishi) bo'lishi mumkin.", tips: ["Shirin ishtaha oshsa — meva yeng 🍌", "Kayfiyat o'zgarsa o'zingizni ayblamang 💜", "Magniyga boy ovqatlar yeyish foydali", "Dam olishni ko'paytiring, katta qarorlarni keyinga qo'ying"] },
};

// ========== Build cycle map (unchanged logic) ==========
function buildCycleMap(periodRanges, cycleLen) {
  const map = {};
  if (!periodRanges.length) return map;

  const sorted = [...periodRanges].sort((a, b) => parseD(a.start) - parseD(b.start));

  sorted.forEach(({ start, end }) => {
    const s = parseD(start);
    const periodLen = Math.round((parseD(end) - s) / 86400000) + 1;
    for (let i = 0; i < periodLen; i++) {
      map[toStr(addD(s, i))] = "hayz";
    }
  });

  sorted.forEach(({ start, end }, idx) => {
    const s = parseD(start);
    const periodLen = Math.round((parseD(end) - s) / 86400000) + 1;

    const nextPeriodStart = sorted[idx + 1] ? parseD(sorted[idx + 1].start) : null;
    const cycleWindowEnd = nextPeriodStart
      ? toStr(addD(nextPeriodStart, -1))
      : toStr(addD(s, cycleLen - 1));

    const ovDay = cycleLen - 14;
    for (let day = periodLen + 1; day <= cycleLen; day++) {
      const ds = toStr(addD(s, day - 1));
      if (ds > cycleWindowEnd) break;
      if (map[ds] === "hayz") break;

      if (day < ovDay - 1) map[ds] = "follikulyar";
      else if (day >= ovDay - 1 && day <= ovDay + 1) map[ds] = "ovulatsiya";
      else map[ds] = "lyuteal";
    }
  });

  const latest = sorted[sorted.length - 1];
  if (latest) {
    const latestLen = Math.round((parseD(latest.end) - parseD(latest.start)) / 86400000) + 1;
    const latestStart = parseD(latest.start);

    for (let c = 1; c <= 6; c++) {
      const nextS = addD(latestStart, cycleLen * c);
      const alreadyLogged = sorted.some(r => {
        const diff = Math.abs(Math.round((parseD(r.start) - nextS) / 86400000));
        return diff < cycleLen / 2;
      });
      if (alreadyLogged) continue;

      for (let i = 0; i < latestLen; i++) {
        const ds = toStr(addD(nextS, i));
        if (!map[ds] && ds >= TODAY) map[ds] = "predicted";
      }
    }
  }

  return map;
}

// ================== Component ==================
export default function PorlaCalendar() {
  const [cycles, setCycles] = useState([]);
  const [periodRanges, setPeriodRanges] = useState([]);
  const [cycleLen, setCycleLen] = useState(28);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectFirst, setSelectFirst] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [phasePopup, setPhasePopup] = useState(null);
  const [toast, setToast] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [addStart, setAddStart] = useState(TODAY);
  const [addDuration, setAddDuration] = useState(5);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  // --- Process cycles from API (normalize dates) ---
  const processCycles = (cyclesData) => {
    const activeCycles = cyclesData.filter(c => {
      try {
        const notes = c.notes ? JSON.parse(c.notes) : {};
        return !notes.deleted;
      } catch {
        return true;
      }
    });

    const ranges = activeCycles.map(cycle => {
      let periodLength = 5;
      try {
        const notes = cycle.notes ? JSON.parse(cycle.notes) : {};
        if (notes.periodLength) periodLength = notes.periodLength;
      } catch {}
      const startRaw = cycle.startDate;
      const start = normalizeDateStr(startRaw);
      if (!start) return null;
      const startDate = parseD(start);
      const end = toStr(addD(startDate, periodLength - 1));
      return {
        start,
        end,
        cycleId: cycle._id,
        periodLength,
        cycleLength: cycle.cycleLength
      };
    }).filter(r => r !== null);

    ranges.sort((a, b) => parseD(a.start) - parseD(b.start));
    if (ranges.length > 0) {
      const latest = ranges[ranges.length - 1];
      setCycleLen(latest.cycleLength);
    } else {
      setCycleLen(28);
    }
    setPeriodRanges(ranges);
    return ranges;
  };

  // --- Fetch cycles from API ---
  const fetchCycles = async () => {
    setLoading(true);
    try {
      const data = await api.tracker.getCycles();
      setCycles(data.cycles || []);
      processCycles(data.cycles || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch cycles:", err);
      setError("Sikllarni yuklashda xatolik yuz berdi");
      showToast("⚠️ Sikllarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  // --- Save new period (create cycle) ---
  const savePeriod = async (start, end, days) => {
    const newStart = parseD(start);
    const newEnd = parseD(end);
    const overlappingCycles = cycles.filter(cycle => {
      if (cycle.notes && JSON.parse(cycle.notes).deleted) return false;
      const cycleStart = parseD(normalizeDateStr(cycle.startDate));
      let cycleEnd = cycleStart;
      try {
        const notes = cycle.notes ? JSON.parse(cycle.notes) : {};
        const periodLength = notes.periodLength || 5;
        cycleEnd = addD(cycleStart, periodLength - 1);
      } catch {}
      return !(cycleEnd < newStart || cycleStart > newEnd);
    });

    // Mark overlapping as deleted
    for (const cycle of overlappingCycles) {
      try {
        let notes = {};
        try { notes = cycle.notes ? JSON.parse(cycle.notes) : {}; } catch {}
        notes.deleted = true;
        await api.tracker.updateCycle(cycle._id, { notes: JSON.stringify(notes) });
      } catch (err) {
        console.error("Failed to mark cycle as deleted:", err);
        showToast("⚠️ Eski siklni o'chirishda xatolik");
      }
    }

    const notes = JSON.stringify({ periodLength: days });
    try {
      await api.tracker.startCycle(start, cycleLen, notes);
      await fetchCycles();
      showToast(`✅ ${days} kunlik hayz saqlandi!`);
    } catch (err) {
      console.error("Failed to create cycle:", err);
      showToast("⚠️ Hayz saqlashda xatolik");
    }
  };

  // --- Delete a period (soft delete) ---
  const deletePeriod = async (cycleId) => {
    const cycle = cycles.find(c => c._id === cycleId);
    if (!cycle) return;

    try {
      let notes = {};
      try { notes = cycle.notes ? JSON.parse(cycle.notes) : {}; } catch {}
      notes.deleted = true;
      await api.tracker.updateCycle(cycle._id, { notes: JSON.stringify(notes) });
      await fetchCycles();
      showToast("🗑️ Hayz o'chirildi");
    } catch (err) {
      console.error("Failed to delete cycle:", err);
      showToast("⚠️ O'chirishda xatolik");
    }
  };

  // --- Calendar interaction ---
  const handleDayTap = (ds) => {
    const phase = cycleMap[ds];
    if (phase && phase !== "predicted" && !selectFirst) {
      setPhasePopup(phase);
      return;
    }

    if (!selectFirst) {
      setSelectFirst(ds);
    } else {
      const a = parseD(selectFirst);
      const b = parseD(ds);
      const start = toStr(a <= b ? a : b);
      const end = toStr(a <= b ? b : a);
      const days = Math.round((parseD(end) - parseD(start)) / 86400000) + 1;
      if (days > 15) {
        showToast("⚠️ 15 kundan ko'p bo'lishi mumkin emas");
        setSelectFirst(null);
        return;
      }
      savePeriod(start, end, days);
      setSelectFirst(null);
    }
  };

  const handleAddModal = async () => {
    const end = toStr(addD(parseD(addStart), addDuration - 1));
    await savePeriod(addStart, end, addDuration);
    setAddModal(false);
  };

  // --- Derived data for calendar ---
  const cycleMap = buildCycleMap(periodRanges, cycleLen);

  // Stats calculations (using normalized dates)
  const sortedRanges = [...periodRanges].sort((a, b) => parseD(b.start) - parseD(a.start));
  const lastPeriod = sortedRanges[0];
  let currentCycleDay = null;
  let daysUntilNext = null;

  if (lastPeriod) {
    const lastStartNorm = normalizeDateStr(lastPeriod.start);
    if (lastStartNorm) {
      const diffDays = Math.round((parseD(TODAY) - parseD(lastStartNorm)) / 86400000);
      currentCycleDay = (diffDays % cycleLen) + 1;
      const cyclesPassed = Math.floor(diffDays / cycleLen);
      const nextStart = toStr(addD(parseD(lastStartNorm), (cyclesPassed + 1) * cycleLen));
      daysUntilNext = Math.round((parseD(nextStart) - parseD(TODAY)) / 86400000);
    }
  }

  // Preview range
  const inPreviewRange = (ds) => {
    if (!selectFirst || !hoverDate) return false;
    const a = parseD(selectFirst);
    const b = parseD(hoverDate);
    const cur = parseD(ds);
    const lo = a <= b ? a : b;
    const hi = a <= b ? b : a;
    return cur >= lo && cur <= hi;
  };

  // Calendar render
  const renderCalendar = () => {
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDow = new Date(calYear, calMonth, 1).getDay();
    const offset = firstDow === 0 ? 6 : firstDow - 1;
    const cells = [];

    for (let i = 0; i < offset; i++) cells.push(<div key={`e${i}`} />);

    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isToday = ds === TODAY;
      const isFirst = ds === selectFirst;
      const inPrev = inPreviewRange(ds);
      const phase = cycleMap[ds];
      const ph = phase ? PHASES[phase] : null;

      let bg = "transparent", fg = "#555", fw = "500", shadow = "none", border = "none";

      if (isToday && !phase && !isFirst && !inPrev) {
        bg = "transparent"; fg = "#D4567A"; fw = "900";
        border = "2.5px solid #D4567A";
        shadow = "0 0 0 3px #FCE4EC";
      } else if (isFirst || inPrev) {
        bg = isFirst ? "#D4567A" : "#F4A0BB"; fg = "#fff"; fw = "900";
        shadow = isFirst ? "0 0 0 3px #FAB8CC" : "none";
      } else if (isToday && phase) {
        bg = "#D4567A"; fg = "#fff"; fw = "900";
        shadow = "0 0 0 3px #FAB8CC";
      } else if (ph) {
        bg = ph.bg; fg = ph.color; fw = "700";
        if (phase === "predicted") border = "1.5px dashed " + ph.color;
      }

      cells.push(
        <button
          key={d}
          onMouseEnter={() => selectFirst && setHoverDate(ds)}
          onMouseLeave={() => setHoverDate(null)}
          onClick={() => handleDayTap(ds)}
          style={{
            width: 40, height: 40, borderRadius: "50%",
            border, cursor: "pointer",
            background: bg, color: fg, fontWeight: fw,
            fontSize: 14, outline: "none",
            boxShadow: shadow,
            transition: "all 0.1s",
            fontFamily: "'Nunito',sans-serif",
          }}
        >
          {d}
        </button>
      );
    }
    return cells;
  };

  // --- Loading and error states ---
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#FDF5F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#D4567A", fontSize: 20 }}>⏳ Yuklanmoqda...</div>
      </div>
    );
  }

  if (error && !cycles.length) {
    return (
      <div style={{ minHeight: "100vh", background: "#FDF5F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#D4567A", fontSize: 16 }}>
          {error}<br />
          <button onClick={fetchCycles} style={{ marginTop: 10, background: "#D4567A", color: "#fff", border: "none", borderRadius: 20, padding: "8px 16px", cursor: "pointer" }}>Qayta urinish</button>
        </div>
      </div>
    );
  }

  // --- UI (unchanged from original except for the fixes above) ---
  return (
    <div style={{ minHeight: "100vh", background: "#FDF5F7", fontFamily: "'Nunito',sans-serif", maxWidth: 480, margin: "0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        button{font-family:'Nunito',sans-serif;}
        @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes popIn{from{transform:scale(0.9);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes toastIn{0%{opacity:0;transform:translateX(-50%) translateY(16px)}15%{opacity:1;transform:translateX(-50%) translateY(0)}85%{opacity:1}100%{opacity:0}}
        button:active{transform:scale(0.94);}
        input[type=range]{accent-color:#D4567A;}
      `}</style>

      {/* TOP BAR */}
      <div style={{ background: "#FDF5F7", padding: "52px 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, borderBottom: "1px solid #FCE4EC" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#D4567A,#E8855A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌸</div>
          <span style={{ fontWeight: 900, fontSize: 18, color: "#222" }}>Porla</span>
        </div>
        <span style={{ fontSize: 15, fontWeight: 800, color: "#D4567A" }}>Sikl kalendari</span>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: "20px 18px 100px" }}>
        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
          <div style={{ background: "linear-gradient(135deg,#D4567A,#B83060)", borderRadius: 20, padding: "20px 16px", color: "#fff", boxShadow: "0 8px 28px rgba(212,86,122,0.38)" }}>
            <p style={{ fontSize: 10, opacity: .75, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 10 }}>KEYINGI HAYZGACHA</p>
            <p style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>
              {daysUntilNext === null ? "—" : daysUntilNext <= 0 ? "🩸" : daysUntilNext}
            </p>
            <p style={{ fontSize: 12, opacity: .8, marginTop: 5 }}>
              {daysUntilNext === null ? "Sanani kiriting" : daysUntilNext <= 0 ? "Bugun yoki kechikkan" : "kun qoldi"}
            </p>
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 16px", boxShadow: "0 3px 16px rgba(0,0,0,0.08)" }}>
            <p style={{ fontSize: 10, color: "#ccc", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 8 }}>SIKL KUNI</p>
            <div style={{ width: "50%", height: 3, borderRadius: 2, background: "#D4567A", marginBottom: 10 }} />
            <p style={{ fontSize: 13, color: "#bbb" }}>{cycleLen} kunlik sikl</p>
            <p style={{ fontSize: 34, fontWeight: 900, color: "#D4567A", lineHeight: 1.1 }}>
              {currentCycleDay !== null ? currentCycleDay : "—"}
            </p>
          </div>
        </div>

        {/* INSTRUCTION + ADD BUTTON */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <div style={{
            flex: 1,
            background: selectFirst ? "linear-gradient(135deg,#D4567A,#E8855A)" : "linear-gradient(135deg,#FFF0F5,#FDE8F0)",
            borderRadius: 16, padding: "14px 16px",
            border: selectFirst ? "none" : "1.5px dashed #E8A0B4",
            boxShadow: selectFirst ? "0 6px 24px rgba(212,86,122,0.4)" : "none",
            transition: "all 0.3s",
          }}>
            {selectFirst ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginBottom: 2 }}>Boshlandi: <strong>{selectFirst}</strong></p>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>Endi oxirgi kunni bosing 👇</p>
                </div>
                <button onClick={() => setSelectFirst(null)}
                  style={{ background: "rgba(255,255,255,0.25)", border: "none", borderRadius: 10, padding: "6px 10px", color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                  ✕
                </button>
              </div>
            ) : (
              <p style={{ fontSize: 13, fontWeight: 800, color: "#D4567A" }}>
                🩸 Kalendarda 1-kun → oxirgi kun bosing
              </p>
            )}
          </div>

          <button onClick={() => { setAddStart(TODAY); setAddDuration(5); setAddModal(true); }}
            style={{ width: 52, height: "100%", minHeight: 52, borderRadius: 16, background: "linear-gradient(135deg,#D4567A,#E8855A)", border: "none", color: "#fff", fontSize: 24, cursor: "pointer", boxShadow: "0 4px 16px rgba(212,86,122,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            +
          </button>
        </div>

        {/* CALENDAR */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "20px", boxShadow: "0 3px 20px rgba(0,0,0,0.08)", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
              style={{ width: 38, height: 38, borderRadius: 12, background: "#FCE4EC", border: "none", fontSize: 20, color: "#D4567A", cursor: "pointer", fontWeight: 700 }}>‹</button>
            <span style={{ fontSize: 18, fontWeight: 900, color: "#222" }}>{MONTHS_UZ[calMonth]}, {calYear}</span>
            <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
              style={{ width: 38, height: 38, borderRadius: 12, background: "#FCE4EC", border: "none", fontSize: 20, color: "#D4567A", cursor: "pointer", fontWeight: 700 }}>›</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 10 }}>
            {DAYS_UZ.map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, color: "#ccc", fontWeight: 800, letterSpacing: 1 }}>{d}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5, justifyItems: "center" }}
            onMouseLeave={() => setHoverDate(null)}>
            {renderCalendar()}
          </div>

          {/* mini legend */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
            {[
              { color: "#D4567A", label: "Hayz" },
              { color: "#E8869E", label: "Taxminiy", dashed: true },
              { color: "#C8900A", label: "Ovulatsiya" },
              { color: "#7C5CBF", label: "Lyuteal" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: "50%", background: item.color,
                  boxShadow: item.dashed ? `0 0 0 1.5px ${item.color}` : "none",
                  opacity: item.dashed ? 0.6 : 1
                }} />
                <span style={{ fontSize: 11, color: "#aaa", fontWeight: 700 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* KIRITILGAN HAYZLAR RO'YXATI */}
        {periodRanges.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 20, padding: "18px", boxShadow: "0 2px 14px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: 10, color: "#ccc", fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 14 }}>KIRITILGAN HAYZ KUNLARI</p>
            {[...periodRanges].sort((a, b) => parseD(b.start) - parseD(a.start)).map((r, i, arr) => {
              const days = Math.round((parseD(r.end) - parseD(r.start)) / 86400000) + 1;
              const nextStart = toStr(addD(parseD(r.start), cycleLen));
              return (
                <div key={i} style={{ paddingBottom: 12, marginBottom: i < arr.length - 1 ? 12 : 0, borderBottom: i < arr.length - 1 ? "1.5px solid #FCE4EC" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: "#FCE4EC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🩸</div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 800, color: "#333" }}>{r.start} → {r.end}</p>
                        <p style={{ fontSize: 12, color: "#D4567A", fontWeight: 700 }}>{days} kun</p>
                      </div>
                    </div>
                    <button onClick={() => deletePeriod(r.cycleId)}
                      style={{ background: "#FCE4EC", border: "none", borderRadius: 10, width: 34, height: 34, cursor: "pointer", color: "#D4567A", fontSize: 18, fontWeight: 700 }}>
                      ×
                    </button>
                  </div>
                  <div style={{ marginTop: 8, background: "#FDE8F0", borderRadius: 12, padding: "9px 13px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>📅</span>
                    <div>
                      <p style={{ fontSize: 10, color: "#E8869E", fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" }}>Taxminiy keyingi hayz</p>
                      <p style={{ fontSize: 13, fontWeight: 800, color: "#C4406A" }}>{nextStart}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal qo'shish */}
      {addModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.48)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
          onClick={() => setAddModal(false)}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: "28px 28px 0 0", width: "100%", maxWidth: 480, padding: "28px 24px 48px", animation: "slideUp 0.3s ease" }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "#eee", margin: "0 auto 24px" }} />
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#222", marginBottom: 6 }}>🩸 Hayz kunlarini qo'shish</h2>
            <p style={{ fontSize: 13, color: "#aaa", marginBottom: 24 }}>Boshlangan sana va necha kun davom etganini kiriting</p>

            <p style={{ fontSize: 13, fontWeight: 800, color: "#555", marginBottom: 8 }}>Boshlanish sanasi</p>
            <input type="date" value={addStart} onChange={e => setAddStart(e.target.value)}
              style={{ width: "100%", padding: "13px 16px", borderRadius: 14, border: "2px solid #FCE4EC", fontSize: 16, fontFamily: "'Nunito',sans-serif", color: "#333", background: "#FFF8FA", marginBottom: 22 }} />

            <p style={{ fontSize: 13, fontWeight: 800, color: "#555", marginBottom: 12 }}>Necha kun davom etdi?</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              {[3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <button key={n} onClick={() => setAddDuration(n)}
                  style={{
                    width: 52, height: 52, borderRadius: 14, border: `2px solid ${addDuration === n ? "#D4567A" : "#FCE4EC"}`,
                    background: addDuration === n ? "#D4567A" : "#FFF8FA", color: addDuration === n ? "#fff" : "#D4567A",
                    fontSize: 18, fontWeight: 800, cursor: "pointer", transition: "all 0.15s"
                  }}>
                  {n}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#D4567A", marginBottom: 24 }}>
              📅 {addStart} → {toStr(addD(parseD(addStart || TODAY), addDuration - 1))}
              &nbsp;({addDuration} kun)
            </p>

            <button onClick={handleAddModal}
              style={{ width: "100%", background: "linear-gradient(135deg,#D4567A,#E8855A)", color: "#fff", border: "none", borderRadius: 16, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(212,86,122,0.4)" }}>
              ✓ Saqlash
            </button>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 32, left: "50%", background: "#1A1A1A", color: "#fff", borderRadius: 20, padding: "13px 26px", fontSize: 14, fontWeight: 700, zIndex: 400, whiteSpace: "nowrap", animation: "toastIn 2.8s ease forwards", boxShadow: "0 6px 28px rgba(0,0,0,0.3)" }}>
          {toast}
        </div>
      )}

      {/* FAZA POPUP */}
      {phasePopup && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.52)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn 0.2s" }}
          onClick={() => setPhasePopup(null)}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: 28, padding: "28px 24px", maxWidth: 400, width: "100%", animation: "popIn 0.25s ease", boxShadow: "0 24px 70px rgba(0,0,0,0.22)" }}>
            {(() => {
              const ph = PHASES[phasePopup];
              const info = PHASE_INFO[phasePopup];
              return (
                <>
                  <div style={{ width: 58, height: 58, borderRadius: 18, background: ph.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, marginBottom: 16 }}>{ph.emoji}</div>
                  <h3 style={{ fontSize: 21, fontWeight: 900, color: "#222", marginBottom: 10 }}>{info.title}</h3>
                  <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: 18 }}>{info.text}</p>
                  <div style={{ background: ph.bg, borderRadius: 16, padding: "16px" }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: ph.color, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 12 }}>MASLAHATLAR</p>
                    {info.tips.map((tip, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: ph.color, marginTop: 6, flexShrink: 0 }} />
                        <p style={{ fontSize: 14, color: "#333", lineHeight: 1.55 }}>{tip}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setPhasePopup(null)}
                    style={{ width: "100%", background: ph.color, color: "#fff", border: "none", borderRadius: 16, padding: "15px", fontSize: 15, fontWeight: 800, cursor: "pointer", marginTop: 20, boxShadow: `0 4px 16px ${ph.color}55` }}>
                    Tushunarli ✓
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}