import { useState } from "react";
import api from "./api";

export default function QnaAnonCheck() {
  const [contact, setContact] = useState("");
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.qnaAnon.checkAnswers(contact);
      if (res && res.answers && res.answers.length > 0) {
        setAnswers(res.answers);
      } else {
        setAnswers([]);
        setError("Javoblar topilmadi yoki hali javob berilmagan.");
      }
    } catch {
      setError("Xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, borderRadius: 16, background: "#f9f7ff", boxShadow: "0 2px 12px rgba(34,18,25,.06)" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Anonim javoblarni tekshirish</h2>
      <input
        type="text"
        value={contact}
        onChange={e => setContact(e.target.value)}
        placeholder="Email yoki telefon"
        style={{ width: "100%", padding: "10px 14px", fontSize: 15, borderRadius: 8, border: "1.5px solid #ddd", marginBottom: 12 }}
      />
      <button
        onClick={handleCheck}
        disabled={loading || !contact.trim()}
        style={{ width: "100%", padding: "10px 0", fontSize: 16, borderRadius: 8, background: "#4c2fa0", color: "white", fontWeight: 700, border: "none", cursor: "pointer", marginBottom: 16 }}
      >
        {loading ? "Tekshirilmoqda..." : "Javoblarni ko'rish"}
      </button>
      {error && <div style={{ color: "#ef4444", marginBottom: 12 }}>{error}</div>}
      {answers.length > 0 && (
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Sizga javob berilgan savollar:</h3>
          <ul style={{ paddingLeft: 0 }}>
            {answers.map((a, i) => (
              <li key={i} style={{ marginBottom: 14, background: "#fff", borderRadius: 8, padding: "12px 10px", boxShadow: "0 2px 8px rgba(34,18,25,.04)" }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{a.question}</div>
                <div style={{ color: "#0ea87a", marginBottom: 4 }}>{a.answer}</div>
                <div style={{ fontSize: 12, color: "#8b7aac" }}>Javob berilgan sana: {a.answeredAt ? new Date(a.answeredAt).toLocaleString("uz-UZ") : "-"}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
