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

    return (
        <div className="flex h-full flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 text-right shadow-sm transition hover:shadow-md">
            <div className="space-y-4">
                <div className="flex items-center justify-end">
                    <StatusBadge
                        status={isUrgent ? "error" : "info"}
                        label={isUrgent ? "EXPIRING_SOON" : "OPEN"}
                    />
                </div>

                <div>
                    <h3 className="text-base font-semibold text-gray-900">Laundry Request</h3>
                    <p className="text-xs text-gray-400">Request ID: {formatDisplayId(id, "REQ")}</p>
                </div>

                <div className="space-y-2 text-right">
                    {services.map((service) => (
                        <div
                            key={service.category_id}
                            className="flex items-center justify-between rounded-md border border-gray-100 px-2 py-1.5 text-sm text-gray-700"
                        >
                            <div className="flex items-center gap-2">
                                <Package size={14} />
                                <span>{service.category_name}</span>
                            </div>
                            <span>
                                <span className="font-medium">{service.quantity_value} {service.selected_unit}</span>
                            </span>
                        </div>
                    ))}
                </div>

                <div className="space-y-2 text-right text-sm text-gray-600">
                    <div className="flex items-center justify-end gap-2">
                        <MapPin size={15} />
                        <span className="truncate">{pickupAddress}</span>
                    </div>
                    <div className="text-xs text-gray-500">{pickupLat}, {pickupLng}</div>
                </div>

                <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                    <Clock size={15} />
                    <span>
                        Pickup window: <span className="font-medium text-[#040947]">{formatPickupDuration(pickupTimeFrom, pickupTimeTo)}</span>
                    </span>
                </div>

                <div className="text-sm font-medium text-gray-900">
                    Expires in <span className="font-medium text-red-600">{Math.max(expiresInMinutes, 0)} minutes</span>
                </div>
            </div>

            <div className="mt-5 flex gap-2">
                <Button
                    variant="outline"
                    className="flex-1 bg-gray-50"
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

