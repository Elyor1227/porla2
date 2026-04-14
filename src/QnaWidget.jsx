
import React from 'react'
import { useState, useEffect } from "react";
import api from "./api";
import { LOGO_MARK } from "./brandLogos";

export default function QnaWidget() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ question: "", topic: "", askedName: "", contact: "" });
  const [, setAnswers] = useState([]);
  const [, setLoadingAnswers] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!open) { setErr(""); setOk(""); setAnswers([]); }
  }, [open]);

  // Foydalanuvchi ma'lumotini olish (agar login bo'lgan bo'lsa)
  useEffect(() => {
    api.auth.me().then(res => {
      if (res && res.user && res.user.email) setUser(res.user);
      else setUser(null);
    }).catch(() => setUser(null));
  }, []);

  // Tizimga kirgan foydalanuvchi uchun faqat isPublished: false javoblarni olish (faqat o'ziga ko'rsatiladi)
  useEffect(() => {
    if (user && user.email) {
      setLoadingAnswers(true);
      api.qnaAnon.answers(user.email)
        .then(res => {
          const all = res.answers || res.qna || res.items || [];
          setAnswers(all.filter(a => a.isPublished === false));
        })
        .catch(() => setAnswers([]))
        .finally(() => setLoadingAnswers(false));
    } else {
      setAnswers([]);
    }
  }, [user]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit() {
    setErr(""); setOk("");
    if (!form.question.trim()) { setErr("Savol majburiy"); return; }
    setSending(true);
    try {
      await api.qna.postQuestion({
        question: form.question.trim(),
        topic: form.topic?.trim() || undefined,
        askedName: form.askedName?.trim() || undefined,
        contact: user && user.email ? user.email : undefined,
        askedBy: user && user._id ? user._id : undefined,
      });
      setOk("Savolingiz yuborildi! Rahmat ✨");
      setForm({ question: "", topic: "", askedName: "", contact: "" });
      setTimeout(() => setOpen(false), 1200);
    } catch (e) {
      const msg = e?.message || "Xatolik";
      setErr(msg.includes("limit") ? "Juda tez-tez yuborilmoqda. Iltimos, birozdan so'ng urinib ko'ring." : msg);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ position: "fixed", bottom: 80, right: 20, zIndex: 1000, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {!open && (
        <button onClick={() => setOpen(true)}
          aria-label="Savol yuborish"
          style={{ width: 56, height: 56, borderRadius: 16, border: "none", cursor: "pointer",
                   background: "linear-gradient(135deg,#d64f6e,#e8728a)", color: "white", fontSize: 22,
                   boxShadow: "0 12px 30px rgba(214,79,110,.35)" }}>
          <i className="fi fi-rs-comment-dots"></i>
        </button>
      )}

      {open && (
        <div style={{ width: 320, background: "#fff", borderRadius: 16, padding: 16,
                       boxShadow: "0 16px 60px rgba(0,0,0,.2)", border: "1px solid rgba(214,79,110,.15)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 34, height: 34, borderRadius: 8, background: "#fde8ec", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={LOGO_MARK} alt="" width={30} height={30} style={{ objectFit: "contain" }} />
              </span>
              <strong style={{ color: "#4a2535", fontSize: 14 }}>Tibbiy savollaringizni anonim yo’llang va doktordan javob oling </strong>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Yopish"
              style={{ width: 28, height: 28, borderRadius: 8, background: "#fde8ec", color: "#d64f6e",
                       border: "none", cursor: "pointer", fontWeight: 800 }}>✕</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <textarea value={form.question} onChange={set("question")} placeholder="Savolingiz..."
              style={{ width: "100%", minHeight: 88, resize: "vertical", borderRadius: 12,
                       border: `1.5px solid ${err && !form.question.trim() ? "#ef4444" : "rgba(214,79,110,.15)"}`,
                       padding: "10px 12px", outline: "none", fontSize: 13, background: "#fdf8f5" }} />
            {/* <input value={form.topic} onChange={set("topic")} placeholder="Mavzu (ixtiyoriy)"
              style={{ width: "100%", borderRadius: 12, border: "1.5px solid rgba(214,79,110,.15)", padding: "10px 12px",
                       outline: "none", fontSize: 13, background: "#fdf8f5" }} />
            <input value={form.askedName} onChange={set("askedName")} placeholder="Ism (ixtiyoriy)"
              style={{ width: "100%", borderRadius: 12, border: "1.5px solid rgba(214,79,110,.15)", padding: "10px 12px",
                       outline: "none", fontSize: 13, background: "#fdf8f5" }} />
            <input value={form.contact} onChange={set("contact")} placeholder="Aloqa (ixtiyoriy, masalan: email/telegram)"
              style={{ width: "100%", borderRadius: 12, border: "1.5px solid rgba(214,79,110,.15)", padding: "10px 12px",
                       outline: "none", fontSize: 13, background: "#fdf8f5" }} /> */}
          </div>

          {err && <p style={{ color: "#b91c1c", fontSize: 12, margin: "8px 2px 0" }}>⚠ {err}</p>}
          {ok  && <p style={{ color: "#0ea87a", fontSize: 12, margin: "8px 2px 0" }}>✓ {ok}</p>}

          <button onClick={submit} disabled={sending}
            style={{ marginTop: 10, width: "100%", border: "none", cursor: sending ? "not-allowed" : "pointer",
                     padding: "12px 14px", borderRadius: 12, fontWeight: 800, color: "white",
                     background: "linear-gradient(135deg,#d64f6e,#e8728a)", boxShadow: "0 8px 22px rgba(214,79,110,.35)" }}>
            {sending ? "Yuborilmoqda..." : "Yuborish →"}
          </button>

          <p style={{ color: "#9a7585", fontSize: 11, marginTop: 8 }}>
            Savolingiz shifokor tomonidan anonim ko'rib chiqiladi.
          </p>
        </div>
      )}
    </div>
  );
}
