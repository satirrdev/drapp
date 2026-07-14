import React, { useState, useEffect, useMemo } from 'react'
import { marked } from 'marked'
import { fetchAppData } from '../services/fdroidApi'

marked.setOptions({ breaks: true, gfm: true })

export default function AppDetail({ appId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchAppData(appId)
      .then((d) => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [appId])

  if (loading) return <div className="loading">Loading...</div>
  if (!data) return <div className="error">App not found</div>

  return (
    <div className="detail-page">
      <a href="/" className="back-btn">&larr; Back to list</a>

      <div className="detail-header">
        {data.i ? (
          <img className="detail-icon" src={data.i} alt="" />
        ) : (
          <svg className="detail-icon" viewBox="0 0 96 96" fill="none">
            <rect x="4" y="4" width="88" height="88" rx="0" fill="#333" stroke="#000" strokeWidth="3"/>
            <rect x="20" y="24" width="56" height="8" rx="0" fill="#666"/>
            <rect x="20" y="40" width="56" height="8" rx="0" fill="#666"/>
            <rect x="20" y="56" width="36" height="8" rx="0" fill="#666"/>
            <circle cx="72" cy="60" r="12" fill="#555" stroke="#000" strokeWidth="2"/>
          </svg>
        )}
        <div>
          <h1 className="detail-title">{data.n}</h1>
          <p className="detail-summary">{data.s}</p>
        </div>
      </div>

      {data.d && (
        <div className="detail-section">
          <h3>Description</h3>
          <div
            className="md-content"
            dangerouslySetInnerHTML={{ __html: marked.parse(data.d) }}
          />
        </div>
      )}

      <div className="detail-section">
        <h3>Info</h3>
        <div className="detail-info-grid">
          <div className="detail-info-item">
            <strong>Latest Version</strong>
            <span>{data.v || '-'}</span>
          </div>
          {data.vc && (
            <div className="detail-info-item">
              <strong>Version Code</strong>
              <span>{data.vc}</span>
            </div>
          )}
          {data.c && data.c.length > 0 && (
            <div className="detail-info-item">
              <strong>Categories</strong>
              <span>{data.c.join(', ')}</span>
            </div>
          )}
          {data.lic && (
            <div className="detail-info-item">
              <strong>License</strong>
              <span>{data.lic}</span>
            </div>
          )}
          {data.up && (
            <div className="detail-info-item">
              <strong>Last Updated</strong>
              <span>{new Date(data.up).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {(data.web || data.src) && (
        <div className="detail-section">
          <h3>Links</h3>
          <p>
            {data.web && <a href={data.web} target="_blank" rel="noopener noreferrer">Website</a>}
            {data.web && data.src && ' | '}
            {data.src && <a href={data.src} target="_blank" rel="noopener noreferrer">Source Code</a>}
          </p>
        </div>
      )}

      <div className="detail-section">
        <h3>Download</h3>
        <p style={{ fontSize: 12, marginBottom: 8 }}>
          APK downloads are served directly from F-Droid.
        </p>
        <a
          href={`https://f-droid.org/repo/${appId}_${data.vc}.apk`}
          className="download-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download APK
        </a>
        <a
          href={`https://f-droid.org/packages/${appId}/`}
          className="download-btn"
          style={{ marginLeft: 12, background: 'var(--fg)', color: 'var(--bg)' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on F-Droid
        </a>
      </div>
    </div>
  )
}
