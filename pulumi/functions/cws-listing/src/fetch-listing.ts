import {
  CWS_ITEM_ID,
  CWS_ITEM_SLUG,
  CWS_LISTING_URL,
} from "./config";
import type { ListingDailyRow } from "./types";

function moscowDate(d = new Date()): string {
  // en-CA → YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function parseUsers(text: string): number | null {
  const m = text.match(/([\d,.]+)\s*users/i);
  if (!m) return null;
  return Number(m[1].replace(/,/g, ""));
}

function parseRating(text: string): { rating: number | null; count: number | null } {
  if (/No ratings/i.test(text)) return { rating: 0, count: 0 };
  const rated = text.match(/([\d.]+)\s+out of 5/i);
  const count = text.match(/([\d,]+)\s*ratings/i);
  return {
    rating: rated ? Number(rated[1]) : null,
    count: count ? Number(count[1].replace(/,/g, "")) : null,
  };
}

function fieldAfter(label: string, text: string): string | null {
  const re = new RegExp(`${label}\\s*\\n\\s*([^\\n]+)`, "i");
  const m = text.match(re);
  return m?.[1]?.trim() ?? null;
}

/**
 * Public store listing scrape — no developer auth.
 * Captures the small set of fields shown on the CWS item page (users, rating, version, …).
 * This is NOT Developer Dashboard analytics (installs/impressions/etc.).
 */
export async function fetchPublicListing(): Promise<ListingDailyRow> {
  const res = await fetch(CWS_LISTING_URL, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; cws-etl/0.1; +https://github.com/sargonpiraev)",
      "accept-language": "en-US,en;q=0.9",
    },
  });
  if (!res.ok) {
    throw new Error(`CWS listing HTTP ${res.status} for ${CWS_LISTING_URL}`);
  }
  const html = await res.text();
  // Prefer visible-text heuristics over brittle CSS class names.
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\n+/g, "\n");

  const { rating, count } = parseRating(text);

  return {
    snapshot_date: moscowDate(),
    item_id: CWS_ITEM_ID,
    item_slug: CWS_ITEM_SLUG,
    users: parseUsers(text),
    rating,
    rating_count: count,
    version: fieldAfter("Version", text),
    listing_updated: fieldAfter("Updated", text),
    size_label: fieldAfter("Size", text),
    offered_by: fieldAfter("Offered by", text),
    source: "public_listing",
    scraped_at: new Date().toISOString(),
  };
}
