import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import Header from './components/Header'
import Page from './pages/Page'
import AppDetail from './pages/AppDetail'
import './App.css'

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('dr-app-theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('dr-app-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  return (
    <BrowserRouter>
      <div className="container">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Navigate to="/page/1" replace />} />
          <Route path="/page/:num" element={<PageWrapper />} />
          <Route path="/app/:appId" element={<DetailWrapper />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

function PageWrapper() {
  const { num } = useParams()
  return <Page pageNum={parseInt(num, 10) || 1} />
}

function DetailWrapper() {
  const { appId } = useParams()
  return <AppDetail appId={decodeURIComponent(appId)} />
}
