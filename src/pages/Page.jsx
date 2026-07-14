import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { fetchPage, fetchSearchIndex, searchIndex, getCategories } from '../services/fdroidApi'
import AppCard from '../components/AppCard'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'

const PER_PAGE = 20

export default function Page({ pageNum }) {
  const [pageData, setPageData] = useState([])
  const [searchIdx, setSearchIdx] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [loadIdx, setLoadIdx] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const didInit = useRef(false)

  const zeroIdx = pageNum - 1

  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
    setLoading(true)
    Promise.all([fetchPage(zeroIdx), fetchSearchIndex()])
      .then(([page, idx]) => {
        setPageData(page)
        setSearchIdx(idx)
        setTotalPages(Math.ceil(idx.length / PER_PAGE))
        setLoading(false)
      })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [pageNum])

  useEffect(() => {
    if (query || category) return
    fetchPage(zeroIdx).then(setPageData).catch(() => {})
  }, [pageNum, query, category, zeroIdx])

  useEffect(() => {
    if (loading || pageData.length === 0) return
    if (loadIdx >= pageData.length) return
    const t = setTimeout(() => setLoadIdx((i) => Math.min(i + 1, pageData.length)), 120)
    return () => clearTimeout(t)
  }, [loading, loadIdx, pageData])

  useEffect(() => { setLoadIdx(0) }, [pageNum, query, category])

  const categories = useMemo(() => searchIdx ? getCategories(searchIdx) : [], [searchIdx])

  const searchResults = useMemo(() => {
    if (!searchIdx || (!query && !category)) return null
    return searchIndex(searchIdx, { query, category })
  }, [searchIdx, query, category])

  const handleFilterChange = useCallback(({ query: q, category: cat }) => {
    setQuery(q); setCategory(cat)
  }, [])

  if (loading) return (
    <div className="skeleton-grid">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="skeleton-card">
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="skeleton-icon" />
            <div style={{ flex: 1 }}>
              <div className="skeleton-line" style={{ width: '70%' }} />
              <div className="skeleton-line-sm" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  if (error) return (
    <div className="error">
      <p>Failed to load apps.</p>
      <p style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>{error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  )

  const isSearching = !!(query || category)
  const displayData = isSearching
    ? (searchResults || []).slice(0, PER_PAGE)
    : pageData
  const displayTotal = isSearching
    ? Math.ceil((searchResults || []).length / PER_PAGE)
    : totalPages
  const displayLoadIdx = isSearching ? displayData.length : loadIdx

  return (
    <div>
      <SearchBar
        query={query}
        category={category}
        categories={categories}
        onChange={handleFilterChange}
        pageNum={pageNum}
      />
      {displayData.length === 0 ? (
        <div className="empty">No apps found</div>
      ) : (
        <>
          <p style={{ fontSize: 11, marginBottom: 12, opacity: 0.5 }}>
            Page {pageNum} / {displayTotal}
          </p>
          <div className="grid">
            {displayData.map((entry, idx) => (
              <AppCard key={entry.id} app={entry} loadNow={idx < displayLoadIdx} />
            ))}
          </div>
          {displayTotal > 1 && !isSearching && (
            <Pagination page={pageNum} totalPages={displayTotal} onPageChange={(p) => window.location.href = `/page/${p}`} />
          )}
        </>
      )}
    </div>
  )
}
