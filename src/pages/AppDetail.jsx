import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { marked } from 'marked'
import { fetchAppData } from '../services/fdroidApi'

const REPO = 'https://github.com/satirrdev/drapp/issues/new'

marked.setOptions({ breaks: true, gfm: true })

export default function AppDetail({ appId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const qrRef = useRef(null)
  const pageUrl = useMemo(() => `${window.location.origin}${window.location.pathname}#/app/${appId}`, [appId])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchAppData(appId)
      .then((d) => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [appId])

  useEffect(() => {
    if (!data) return
    const el = qrRef.current
    if (!el) return
    const render = () => {
      if (typeof OpenQTR !== 'undefined' && el.childNodes.length === 0) {
        OpenQTR.generate({
          text: pageUrl,
          element: el,
          size: 200,
        })
      }
    }
    if (typeof OpenQTR !== 'undefined') { render(); return }
    const iv = setInterval(() => { if (typeof OpenQTR !== 'undefined') { clearInterval(iv); render() } }, 200)
    return () => clearInterval(iv)
  }, [data, pageUrl])

  if (loading) return <div className="loading">Loading...</div>
  if (!data) return <div className="error">App not found</div>

  return (
    <div className="detail-page">
      <Link to="/" className="back-btn">&larr; Back to list</Link>

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
          {data.a && (
            <div className="detail-info-item">
              <strong>Developer</strong>
              <span>{data.a}</span>
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

      <div className="detail-section" style={{ textAlign: 'center' }}>
        <h3>Scan to Open</h3>
        <p style={{ fontSize: 12, marginBottom: 12 }}>
          Scan with your phone to open this app page
        </p>
        <div
          ref={qrRef}
          style={{ display: 'inline-block' }}
        />
      </div>

      <div className="detail-section">
        <h3>Actions</h3>
        <div className="detail-actions">
          <a
            href={`${REPO}?title=${encodeURIComponent('Submit App: ' + data.n)}&body=${encodeURIComponent(
              '## App Submission\n\n' +
              '**App Name:** ' + data.n + '\n' +
              '**Package ID:** ' + appId + '\n' +
              '**Version:** ' + (data.v || '-') + '\n' +
              '**Developer:** ' + (data.a || '') + '\n' +
              '**Repository URL:** ' + (data.src || '') + '\n' +
              '**Description:** ' + (data.d ? data.d.replace(/\n/g, ' ').substring(0, 500) : '') + '\n' +
              '**App Icon:** ' + (data.i || '') + '\n' +
              '**APK Direct Link:** ' + `https://f-droid.org/repo/${appId}_${data.vc}.apk` + '\n' +
              '**Reason for inclusion:** \n' +
              '**Additional Info:** '
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn"
          >
            Submit App
          </a>
          <a
            href={`${REPO}?title=${encodeURIComponent('Update Request: ' + data.n)}&body=${encodeURIComponent(
              '## Update Request\n\n' +
              '**App Name:** ' + data.n + '\n' +
              '**Package ID:** ' + appId + '\n' +
              '**Current Version:** ' + (data.v || '-') + '\n' +
              '**Requested Version:** \n' +
              '**Developer:** ' + (data.a || '') + '\n' +
              '**Description:** ' + (data.d ? data.d.replace(/\n/g, ' ').substring(0, 500) : '') + '\n' +
              '**App Icon:** ' + (data.i || '') + '\n' +
              '**APK Direct Link:** ' + `https://f-droid.org/repo/${appId}_${data.vc}.apk` + '\n' +
              '**Reason:** '
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn"
          >
            Request Update
          </a>
        </div>
      </div>
    </div>
  )
}
