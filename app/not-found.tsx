import { ContactSection } from "@/components/contact-section";
import { loadContent } from "@/lib/properties";
export default function NotFound(){const {site}=loadContent();return <main><section className="contact-panel not-found"><p className="kicker">404</p><h2>Proprietatea nu<br/>a fost găsită.</h2></section><ContactSection site={site}/></main>}
