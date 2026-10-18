export function money(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100);
}

export function dateTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(iso));
}

export const STATUS_STYLES: Record<string, string> = {
  open: "bg-ink/10 text-ink",
  delivered: "bg-ink/10 text-ink",
  accepted: "bg-accent/15 text-accent",
  disputed: "bg-loss/10 text-loss",
  ruled: "bg-ink/10 text-ink",
  settled: "bg-accent/15 text-accent",
  cancelled: "bg-surface-2 text-muted",
};
