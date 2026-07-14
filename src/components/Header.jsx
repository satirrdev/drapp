import React from 'react'
import { Link } from 'react-router-dom'

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <h1><Link to="/">Dr. App</Link></h1>
      <div className="header-actions">
        <button onClick={onToggleTheme}>
          {theme === 'dark' ? '☀ Light' : '☾ Dark'}
        </button>
      </div>
    </header>
  )
}
