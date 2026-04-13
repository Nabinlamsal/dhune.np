"use client"

import { Clock, MapPin, Package } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { StatusBadge } from "@/src/components/common/StatusBadge"
import { formatDisplayId, formatPickupDuration } from "@/src/utils/display"

interface MarketplaceServiceItem {
    category_id: string
    category_name: string
    selected_unit: string
    quantity_value: number
}

interface RequestCardProps {
    id: string
    pickupAddress: string
    pickupLat: number
    pickupLng: number
    distanceKm?: number
    pickupTimeFrom: string
    pickupTimeTo: string
    expiresAt: string
    services: MarketplaceServiceItem[]
    onView: () => void
    onBid: () => void
}

export default function RequestCard({
    id,
    pickupAddress,
    pickupLat,
    pickupLng,
    distanceKm,
    pickupTimeFrom,
    pickupTimeTo,
    expiresAt,
    services,
    onView,
    onBid,
}: RequestCardProps) {
    const expiresDate = new Date(expiresAt)
    const now = new Date()
    const diffMs = expiresDate.getTime() - now.getTime()
    const expiresInMinutes = Math.floor(diffMs / (1000 * 60))

    const isUrgent = expiresInMinutes <= 30
    const safeMinutes = Math.max(expiresInMinutes, 0)

    return (
        <div className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(4,9,71,0.06),rgba(255,255,255,0.96))] px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Open Request
                        </p>
                        <h3 className="text-base font-semibold text-slate-900">Laundry Request</h3>
                        <p className="text-xs text-slate-500">ID {formatDisplayId(id, "REQ")}</p>
                    </div>
                    <StatusBadge
                        status={isUrgent ? "error" : "info"}
                        label={isUrgent ? "EXPIRING_SOON" : "OPEN"}
                    />
                </div>
            </div>

            <div className="space-y-5 px-5 py-5">
                <div className="space-y-2">
                    {services.map((service) => (
                        <div
                            key={service.category_id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-700"
                        >
                            <div className="min-w-0 flex items-center gap-2">
                                <Package size={14} className="shrink-0 text-[#040947]" />
                                <span className="truncate font-medium text-slate-800">{service.category_name}</span>
                            </div>
                            <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                                {service.quantity_value} {service.selected_unit}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="grid gap-3 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-start gap-3 border-b border-slate-100 px-4 py-3 text-sm text-slate-600">
                        <MapPin size={15} className="mt-0.5 shrink-0 text-[#040947]" />
                        <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                Pickup Address
                            </p>
                            <p className="mt-1 truncate text-sm text-slate-700">{pickupAddress}</p>
                        </div>
                    </div>

                    <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2">
                        <div className="space-y-1 text-sm text-slate-600">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Clock size={15} className="text-[#040947]" />
                                <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                                    Pickup Window
                                </span>
                            </div>
                            <p className="font-medium text-slate-800">
                                {formatPickupDuration(pickupTimeFrom, pickupTimeTo)}
                            </p>
                        </div>

                        <div className="space-y-1 text-sm text-slate-600">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                Location
                            </p>
                            {distanceKm !== undefined && (
                                <p className="font-medium text-[#040947]">{distanceKm.toFixed(1)} km away</p>
                            )}
                            <p className="text-xs text-slate-500">{pickupLat}, {pickupLng}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3 text-sm">
                    <span className="text-slate-300">Time left to bid</span>
                    <span className="font-semibold text-white">{safeMinutes} minutes</span>
                </div>
            </div>

            <div className="mt-auto flex gap-2 border-t border-slate-100 px-5 py-4">
                <Button
                    variant="outline"
                    className="flex-1 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    onClick={onView}
                >
                    View Details
                </Button>

                <Button
                    className="flex-1 bg-[#040947] hover:bg-[#030736]"
                    onClick={onBid}
                >
                    Place Bid
                </Button>
            </div>
        </div>
    )
}

