import { useEffect, useState, useMemo } from "react";
import api from "./api";

export default function QnaPublic() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("");

  const pages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      if (!mounted) return;
      setLoading(true);
      setErr("");
      try {
        const d = await api.qna.getPublic({ page, limit, search, topic });
        if (!mounted) return;
        setItems(d.items || d.qna || d.data || []);
        setTotal(d.total || d.count || 0);
      } catch (e) {
        if (mounted) setErr(e.message || "Xatolik");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, [page, limit, search, topic]);

  return (
    <div style={{ minHeight: "100vh", background: "#fdf8f5", padding: "80px 16px 40px", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg,#d64f6e,#e8728a)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>❓</div>
            <h1 style={{ margin: 0, fontSize: 24, color: "#221219" }}>Savol-javoblar</h1>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} placeholder="Qidirish..."
              style={{ padding: "10px 12px", borderRadius: 10, border: "1.5px solid rgba(214,79,110,.18)", background: "#fff" }} />
            <input value={topic} onChange={(e) => { setPage(1); setTopic(e.target.value); }} placeholder="Mavzu"
              style={{ padding: "10px 12px", borderRadius: 10, border: "1.5px solid rgba(214,79,110,.18)", background: "#fff" }} />
          </div>
        </div>

        {err && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 12, padding: "10px 14px", marginBottom: 14 }}>⚠ {err}</div>}

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
            <div style={{ width: 36, height: 36, border: "3px solid rgba(214,79,110,.2)", borderTopColor: "#d64f6e", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
          </div>
        ) : items.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(214,79,110,.12)", padding: 24, textAlign: "center" }}>
            Hech narsa topilmadi
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((q) => (
              <div key={q._id} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(214,79,110,.12)", padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: "#fde8ec", display: "flex", alignItems: "center", justifyContent: "center" }}>❓</span>
                  <strong style={{ color: "#221219" }}>{q.question}</strong>
                </div>
                {q.answer ? (
                  <p style={{ margin: 0, color: "#4a2535", lineHeight: 1.6 }}>{q.answer}</p>
                ) : (
                  <p style={{ margin: 0, color: "#9a7585" }}>Javob tayyorlanmoqda...</p>
                )}
                <div style={{ marginTop: 8, color: "#9a7585", fontSize: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {q.topic && <span># {q.topic}</span>}
                  {q.answeredAt && <span>{new Date(q.answeredAt).toLocaleDateString("uz-UZ", { day: "2-digit", month: "long" })}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 16 }}>
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{ padding: "8px 12px", borderRadius: 10, border: "1.5px solid rgba(214,79,110,.2)", background: page <= 1 ? "#f5e8ea" : "#fff", cursor: page <= 1 ? "not-allowed" : "pointer" }}>←</button>
            <span style={{ color: "#9a7585", fontSize: 13 }}>{page} / {pages}</span>
            <button disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))}
              style={{ padding: "8px 12px", borderRadius: 10, border: "1.5px solid rgba(214,79,110,.2)", background: page >= pages ? "#f5e8ea" : "#fff", cursor: page >= pages ? "not-allowed" : "pointer" }}>→</button>
          </div>
        )}
      </div>
    </div>
  );
}
