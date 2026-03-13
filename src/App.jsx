import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PorlaLanding from "./porla-landing";
import AuthPage from "./porla-web-updated";   // faqat login/register qismi
import PorlaApp from "./porla-web-updated";   // faqat app qismi
import { storage } from "./api";

// Token bor bo'lsa /app ga, yo'q bo'lsa /login ga yo'naltiradi
function ProtectedRoute({ children }) {
  return storage.getToken() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"      element={<PorlaLanding />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/app"   element={
          <ProtectedRoute>
            <PorlaApp />
          </ProtectedRoute>
        } />
        {/* Noto'g'ri URL → landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}