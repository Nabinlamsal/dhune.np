import {
    BadgeDollarSign,
    CalendarClock,
    CircleUser,
    CreditCard,
    Hash,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    StickyNote,
    Truck,
} from "lucide-react";
import { formatIdByLabel } from "@/src/utils/display";

export function Detail({
    label,
    value,
}: {
    label: string;
    value?: string;
}) {
    const normalizedLabel = label.toLowerCase();
    const isIdLike = normalizedLabel.includes("id");

    const Icon = (() => {
        if (normalizedLabel.includes("status") || normalizedLabel.includes("approval") || normalizedLabel.includes("active")) return ShieldCheck;
        if (normalizedLabel.includes("price") || normalizedLabel.includes("amount") || normalizedLabel.includes("payment")) return BadgeDollarSign;
        if (normalizedLabel.includes("address") || normalizedLabel.includes("pickup") || normalizedLabel.includes("latitude") || normalizedLabel.includes("longitude")) return MapPin;
        if (normalizedLabel.includes("time") || normalizedLabel.includes("created") || normalizedLabel.includes("joined") || normalizedLabel.includes("expires")) return CalendarClock;
        if (normalizedLabel.includes("email")) return Mail;
        if (normalizedLabel.includes("phone")) return Phone;
        if (normalizedLabel.includes("vendor") || normalizedLabel.includes("customer") || normalizedLabel.includes("user") || normalizedLabel.includes("owner") || normalizedLabel.includes("name") || normalizedLabel.includes("role")) return CircleUser;
        if (normalizedLabel.includes("description") || normalizedLabel.includes("note")) return StickyNote;
        if (normalizedLabel.includes("method")) return CreditCard;
        if (normalizedLabel.includes("order") || normalizedLabel.includes("service")) return Truck;
        if (isIdLike) return Hash;
        return Hash;
    })();
    const displayValue = isIdLike ? formatIdByLabel(label, value) : (value ?? "--");

    return (
        <div className="grid grid-cols-1 gap-1 rounded-lg border border-[#040947]/15 bg-white px-2.5 py-1.5 text-xs md:grid-cols-[128px_1fr] md:items-center md:gap-2">
            <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-600">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-[#040947]/10 text-[#040947]">
                    <Icon className="h-3.5 w-3.5" />
                </span>
                {label}
            </p>
            <p
                className={`break-words font-medium text-slate-800 ${isIdLike ? "font-mono text-[11px] leading-5" : "text-[13px]"
                    }`}
            >
                {displayValue}
            </p>
        </div>
    );
}

