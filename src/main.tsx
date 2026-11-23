import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Old share links looked like "/#/work/<id>". Send them to the real page.
const legacy = window.location.hash.match(/^#\/work\/([\w-]+)/)?.[1]
if (legacy) window.history.replaceState(null, '', `/work/${legacy}`)

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Built pages already contain the rendered app, so attach to it. Render from scratch instead when the dev server
// gives an empty root, when the intro is about to play (the first screen is then the intro, not the page in the
// HTML) or when the URL was just rewritten from an old link. Those would only fail to hydrate.
const renderFresh =
  !root.hasChildNodes() || document.documentElement.classList.contains('intro-pending') || Boolean(legacy)
if (renderFresh) createRoot(root).render(app)
else hydrateRoot(root, app)
