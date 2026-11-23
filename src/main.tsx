import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LangProvider, readLang } from './i18n'

// Old share links looked like "/#/work/<id>". Send them to the real page.
const legacy = window.location.hash.match(/^#\/work\/([\w-]+)/)?.[1]
if (legacy) window.history.replaceState(null, '', `/work/${legacy}`)

const root = document.getElementById('root')!
const lang = readLang() // the stored choice, or ?lang=ja
const app = (
  <StrictMode>
    <LangProvider initialLang={lang}>
      <App />
    </LangProvider>
  </StrictMode>
)

// Built pages already contain the rendered app, so attach to it. Render from scratch instead when the dev server
// gives an empty root, when the intro is about to play (the first screen is then the intro, not the page in the
// HTML), when the page is to be shown in Japanese (the HTML is English) or when the URL was just rewritten from an
// old link. Those would only fail to hydrate.
const renderFresh =
  !root.hasChildNodes() ||
  document.documentElement.classList.contains('intro-pending') ||
  lang !== 'en' ||
  Boolean(legacy)
if (renderFresh) createRoot(root).render(app)
else hydrateRoot(root, app)
