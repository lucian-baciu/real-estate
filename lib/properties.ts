import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";

const text = z.string().trim().min(1);
const slug = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens");
const imageSource = text.refine((value) => {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try { const url = new URL(value); return url.protocol === "https:" && url.hostname === "images.unsplash.com"; } catch { return false; }
}, "Use a local /images/... path or an https://images.unsplash.com URL");

export const propertySchema = z.object({
  slug, name: text, location: text, region: text, eyebrow: text, headline: text, intro: text,
  status: z.enum(["For sale", "Under offer", "Sold"]),
  price: z.number().positive(), currency: z.enum(["EUR", "RON", "USD", "GBP"]),
  areaSqm: z.number().positive(), landSqm: z.number().nonnegative(),
  bedrooms: z.number().int().nonnegative(), bathrooms: z.number().int().nonnegative(),
  yearBuilt: z.number().int().min(1000).max(2200), energyRating: text,
  storyTitle: text, story: z.array(text).min(1),
  coverImage: imageSource.optional(),
  images: z.array(z.object({ src: imageSource, alt: text, caption: text })).min(2),
  features: z.array(text).min(1), locationTitle: text, locationDescription: text,
  mapQuery: text,
  mapLatitude: z.number().min(-90).max(90),
  mapLongitude: z.number().min(-180).max(180),
  nearby: z.array(z.object({ name: text, time: text })).min(1),
});
export type Property = z.infer<typeof propertySchema>;

export const siteSchema = z.object({
  brand: text, tagline: text, defaultProperty: slug, contactName: text,
  contactNote: text, footerNote: text, demo: z.boolean(),
  seller: z.object({ name: text, role: text, phone: text, image: imageSource.nullable() }),
});
export type Site = z.infer<typeof siteSchema>;

// Only read known files from the content directory. Never use a request slug as a file path.
export function loadContent(root = path.join(process.cwd(), "content")) {
  const site = siteSchema.parse(JSON.parse(readFileSync(path.join(root, "site.json"), "utf8")));
  const directory = path.join(root, "properties");
  const properties = readdirSync(directory).filter((file) => file.endsWith(".json")).sort().map((file) => {
    const result = propertySchema.safeParse(JSON.parse(readFileSync(path.join(directory, file), "utf8")));
    if (!result.success) throw new Error(`Invalid property ${file}: ${result.error.message}`);
    return result.data;
  });
  const slugs = new Set<string>();
  for (const property of properties) {
    if (slugs.has(property.slug)) throw new Error(`Duplicate property slug: ${property.slug}`);
    slugs.add(property.slug);
  }
  if (!slugs.has(site.defaultProperty)) throw new Error(`Default property "${site.defaultProperty}" was not found`);
  return { site, properties };
}

export function formatPrice(property: Pick<Property, "price" | "currency">) {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: property.currency, maximumFractionDigits: 0 }).format(property.price);
}
