// Azerbaijani number conventions: decimal comma, no space before %.
// Formatted by hand because browsers without full ICU data fall back to a decimal point.
const integer = { format: (n: number) => String(Math.round(n)) };
const decimal = { format: (n: number) => n.toFixed(1).replace(".", ",") };

export const DASH = "-";

export function formatDecimal(value: number | null): string {
  return value === null ? DASH : decimal.format(value);
}

export function formatPercent(share: number | null): string {
  return share === null ? DASH : `${integer.format(share * 100)}%`;
}

export function formatSeconds(sec: number | null): string {
  if (sec === null) return DASH;
  if (sec < 60) return `${integer.format(sec)} san`;
  const minutes = Math.floor(sec / 60);
  const rest = Math.round(sec % 60);
  return `${minutes} dəq ${rest} san`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("az-Latn-AZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
