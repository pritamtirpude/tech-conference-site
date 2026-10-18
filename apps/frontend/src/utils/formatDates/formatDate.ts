const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  // Date-only ISO strings ("2026-11-15") parse as midnight UTC, so format in UTC
  // to avoid off-by-one days and server/client hydration mismatches.
  timeZone: "UTC",
});

/**
 * Formats an ISO date-only string as "Nov 15".
 */
export function formatDate(date: string): string {
  return formatter.format(new Date(date));
}
