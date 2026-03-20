export function formatDisplayId(id: string | undefined | null, prefix = "ID"): string {
    if (!id) return "--";
    if (id.toUpperCase().startsWith(`${prefix}-`)) return id.toUpperCase();

    const cleaned = id.replace(/[^a-zA-Z0-9]/g, "");
    if (!cleaned) return `${prefix}-0000`;

    const hash = cleaned
        .split("")
        .reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 10000, 0);

    return `${prefix}-${String(hash).padStart(4, "0")}`;
}

export function formatIdByLabel(label: string, id: string | undefined | null): string {
    const lower = label.toLowerCase();

    if (lower.includes("order")) return formatDisplayId(id, "ORD");
    if (lower.includes("request")) return formatDisplayId(id, "REQ");
    if (lower.includes("offer")) return formatDisplayId(id, "OFF");
    if (lower.includes("vendor")) return formatDisplayId(id, "VND");
    if (lower.includes("user") || lower.includes("customer")) return formatDisplayId(id, "USR");
    if (lower.includes("category")) return formatDisplayId(id, "CAT");

    return formatDisplayId(id, "ID");
}

export function formatPickupDuration(from: string | undefined, to: string | undefined): string {
    if (!from || !to) return "--";

    const fromDate = new Date(from);
    const toDate = new Date(to);

    const day = fromDate.toLocaleDateString(undefined, { weekday: "long" });
    const date = fromDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const fromTime = fromDate.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    const toTime = toDate.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

    return `${day}, ${date} from ${fromTime} to ${toTime}`;
}
