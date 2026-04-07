import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { storage } from './api'
import Seo from './Seo'

const PorlaLanding = lazy(() => import('./porla-landing'))
const PorlaShell = lazy(() => import('./porla-web-updated'))
const QnaPublic = lazy(() => import('./QnaPublic'))

function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fdf8f5',
        fontFamily: 'system-ui, sans-serif',
        color: '#4a2535',
      }}
    >
      Yuklanmoqda…
    </div>
  )
}

function ProtectedRoute({ children }) {
  return storage.getToken() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Seo />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<PorlaLanding />} />
          <Route path="/qna" element={<QnaPublic />} />
          <Route path="/login" element={<PorlaShell />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <PorlaShell />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
