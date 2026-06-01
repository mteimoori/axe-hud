import { AxeHudProvider } from 'axe-hud/react'
import { useEffect, useState, type ReactNode } from 'react'

interface Page {
  path: string
  label: string
  render: () => ReactNode
}

/** Minimal hash router so navigation triggers axe-hud's re-audit-on-navigation. */
function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash || '#/')
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

/* -------------------------------------------------------------------------- */
/* Pages — each intentionally seeds real accessibility violations.            */
/* -------------------------------------------------------------------------- */

function HomePage() {
  return (
    <section>
      <h2>Overview</h2>
      <p>
        This page is intentionally inaccessible so axe-hud has something to report. Open the widget
        in the corner, then navigate between pages to watch it re-audit.
      </p>
      {/* Violation: insufficient colour contrast. */}
      <p className="low-contrast">This faint paragraph fails the WCAG colour-contrast threshold.</p>
    </section>
  )
}

function FormsPage() {
  return (
    <section>
      <h2>Form</h2>
      {/* Violation: form field with no associated label. */}
      <input type="text" placeholder="Your name" />
      {/* Violation: select with no accessible name. */}
      <select>
        <option>Option one</option>
        <option>Option two</option>
      </select>
    </section>
  )
}

function MediaPage() {
  return (
    <section>
      <h2>Media</h2>
      {/* Violation: image without alt text. */}
      <img src="https://placehold.co/120" width={120} height={120} />
      <p>
        {/* Violation: link with no discernible text. */}
        <a href="https://example.com" />
      </p>
      {/* Violation: button with no accessible name. */}
      <button type="button" className="icon-button" />
    </section>
  )
}

const PAGES: Page[] = [
  { path: '#/', label: 'Home', render: () => <HomePage /> },
  { path: '#/forms', label: 'Form', render: () => <FormsPage /> },
  { path: '#/media', label: 'Media', render: () => <MediaPage /> },
]

export function App() {
  const hash = useHashRoute()
  const active = PAGES.find((page) => page.path === hash) ?? PAGES[0]

  return (
    // `enabled` forces the HUD on even on the production-like Pages host, for demo purposes.
    <AxeHudProvider enabled>
      <header className="site-header">
        <h1>axe-hud</h1>
        <nav aria-label="Demo pages">
          {PAGES.map((page) => (
            <a key={page.path} href={page.path} aria-current={page === active ? 'page' : undefined}>
              {page.label}
            </a>
          ))}
        </nav>
      </header>
      <main>{active.render()}</main>
    </AxeHudProvider>
  )
}
