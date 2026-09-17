import type { Metadata } from "next";
import "./globals.css";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
export const metadata: Metadata = { metadataBase:new URL(siteUrl), title:{ default:"Fieldwork — Proprietăți cu sens", template:"%s | Fieldwork" }, description:"O selecție discretă de proprietăți reprezentate în exclusivitate în Transilvania.", openGraph:{title:"Fieldwork — Proprietăți cu sens",description:"Locuri în care viața se așază frumos.",images:["/og.png"],locale:"ro_RO",type:"website"}, twitter:{card:"summary_large_image",images:["/og.png"]} };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ro"><body>{children}</body></html>}
