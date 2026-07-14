import React from 'react'
import { Link } from 'react-router-dom'

const PLACEHOLDER = (
  <svg className="card-icon" viewBox="0 0 48 48" fill="none">
    <rect x="2" y="2" width="44" height="44" rx="0" fill="#333" stroke="#000" strokeWidth="2"/>
    <rect x="10" y="12" width="28" height="4" rx="0" fill="#666"/>
    <rect x="10" y="20" width="28" height="4" rx="0" fill="#666"/>
    <rect x="10" y="28" width="18" height="4" rx="0" fill="#666"/>
    <circle cx="36" cy="30" r="6" fill="#555" stroke="#000" strokeWidth="1.5"/>
  </svg>
)

export default function AppCard({ app, loadNow }) {
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    if (!loadNow || !app.i || loaded) return
    const img = new Image()
    img.onload = () => setLoaded(true)
    img.onerror = () => setLoaded(false)
    img.src = app.i
  }, [loadNow, app.i])

  return (
    <Link to={`/app/${encodeURIComponent(app.id)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card">
        <div className="card-top">
          <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
            {(!app.i || !loaded) && PLACEHOLDER}
            {app.i && (
              <img
                className="card-icon"
                src={loaded ? app.i : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E'}
                alt=""
                style={{
                  position: 'absolute', inset: 0,
                  opacity: loaded ? 1 : 0,
                  transition: 'opacity 0.25s',
                }}
              />
            )}
          </div>
          <div className="card-info">
            <div className="card-name">{app.n}</div>
            <div className="card-summary">{app.s}</div>
          </div>
        </div>
        <div className="card-meta">
          <span className="version">{app.v || '-'}</span>
          {app.c && app.c.length > 0 && <span>{app.c[0]}</span>}
        </div>
      </div>
    </Link>
  )
}
