import { CONTACT } from "../constants/contact";
import { fill, useContent } from "../i18n";

const LINK =
  "inline-block rounded py-2 transition-colors hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-fuchsia-400";

/** Shown on every page */
export default function SiteFooter() {
  const t = useContent();
  return (
    <footer className="mt-4 border-t border-white/10 py-10 text-sm text-zinc-500">
      <div className="flex flex-wrap items-start justify-between gap-8">
        <div>
          <p className="font-semibold text-zinc-300">Ikrar Hesa Prasetya</p>
          <p className="mt-1">{t.shell.footer.tagline}</p>
        </div>
        <nav aria-label={t.shell.footer.nav} className="flex flex-wrap gap-x-6">
          <a href="/#work" className={LINK}>{t.shell.nav.work}</a>
          <a href="/#about" className={LINK}>{t.shell.nav.about}</a>
          <a href="/#contact" className={LINK}>{t.shell.nav.contact}</a>
          {CONTACT.email && <a href={`mailto:${CONTACT.email}`} className={LINK}>{t.shell.footer.email}</a>}
          {CONTACT.linkedin && (
            <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className={LINK}>{t.shell.footer.linkedin}</a>
          )}
          {CONTACT.cv && <a href={CONTACT.cv} download className={LINK}>{t.shell.footer.cv}</a>}
        </nav>
      </div>
      <p className="mt-8">{fill(t.shell.footer.copyright, { year: new Date().getFullYear() })}</p>
    </footer>
  );
}
