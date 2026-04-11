import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Serialises an object as JSON for use in an inline <script type="application/ld+json">.
 * Escapes `</` → `<\/` to prevent a farm name or description from closing the script tag
 * and injecting arbitrary HTML (CVE-class: JSON-LD XSS via dangerouslySetInnerHTML).
 */
export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/<\//g, '<\\/')
}
