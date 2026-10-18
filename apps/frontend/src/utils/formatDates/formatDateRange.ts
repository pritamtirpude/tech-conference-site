const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  // Date-only ISO strings ("2026-11-15") parse as midnight UTC, so format in UTC
  // to avoid off-by-one days and server/client hydration mismatches.
  timeZone: "UTC",
});

export function formatDateRange(start: string, end: string): string {
  return formatter
    .formatRangeToParts(new Date(start), new Date(end))
    .map((part) =>
      part.type === "literal" &&
      part.source === "shared" &&
      part.value.includes("–")
        ? "-"
        : part.value,
    )
    .join("");
}
