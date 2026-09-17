import { redirect } from "next/navigation";
import { loadContent } from "@/lib/properties";
export default function Home(){redirect(`/${loadContent().site.defaultProperty}`)}
