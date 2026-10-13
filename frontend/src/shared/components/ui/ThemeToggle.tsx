import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark')
  function toggle() {
    const next = !dark
    document.documentElement.dataset.theme = next ? 'dark' : 'light'
    setDark(next)
    try { localStorage.setItem('portal-theme', next ? 'dark' : 'light') } catch { /* Works without storage. */ }
  }
  return <button type="button" className="theme-toggle" onClick={toggle} aria-label="Modo escuro" aria-pressed={dark} title={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}>
    {dark ? <Sun size={22} strokeWidth={1.8} aria-hidden="true" /> : <Moon size={22} strokeWidth={1.8} aria-hidden="true" />}
  </button>
}
