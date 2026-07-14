import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'

export default function SearchBar({ query, category, categories, onChange, pageNum }) {
  const handleQuery = useCallback(
    (e) => onChange({ query: e.target.value, category }), [category, onChange]
  )
  const handleCategory = useCallback(
    (e) => onChange({ query, category: e.target.value }), [query, onChange]
  )

  return (
    <div className="filters">
      <input type="text" placeholder="Search apps..." value={query} onChange={handleQuery} />
      <select value={category} onChange={handleCategory}>
        <option value="">All Categories</option>
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <Link to="/page/1" style={{
        display: 'inline-flex', alignItems: 'center',
        background: 'var(--fg)', color: 'var(--bg)',
        border: 'var(--border)', padding: '10px 14px',
        fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase',
        textDecoration: 'none',
      }}>Clear</Link>
    </div>
  )
}
