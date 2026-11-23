import { CONTACT } from "../constants/contact";

const LINK =
  "inline-block rounded py-2 transition-colors hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-fuchsia-400";

/** Shown on every page */
export default function SiteFooter() {
  return (
    <footer className="mt-4 border-t border-white/10 py-10 text-sm text-zinc-500">
      <div className="flex flex-wrap items-start justify-between gap-8">
        <div>
          <p className="font-semibold text-zinc-300">Ikrar Hesa Prasetya</p>
          <p className="mt-1">Designer of digital products and creative systems</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6">
          <a href="#work" className={LINK}>Work</a>
          <a href="#about" className={LINK}>About</a>
          <a href="#contact" className={LINK}>Contact</a>
          {CONTACT.email && <a href={`mailto:${CONTACT.email}`} className={LINK}>Email</a>}
          {CONTACT.linkedin && (
            <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className={LINK}>LinkedIn</a>
          )}
          {CONTACT.cv && <a href={CONTACT.cv} download className={LINK}>Download CV</a>}
        </nav>
      </div>
      <p className="mt-8">© {new Date().getFullYear()} Ikrar Hesa Prasetya</p>
    </footer>
  );
}
