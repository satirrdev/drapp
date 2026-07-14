import React from 'react'

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <h1><a href="/">Dr. App</a></h1>
      <div className="header-actions">
        <button onClick={onToggleTheme}>
          {theme === 'dark' ? '☀ Light' : '☾ Dark'}
        </button>
      </div>
    </header>
  )
}
