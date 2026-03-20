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
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between">
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                            Laundry Request
                        </h3>
                        <p className="text-xs text-gray-400">
                            Request ID: {formatDisplayId(id, "REQ")}
                        </p>
                    </div>

                    <StatusBadge
                        status={isUrgent ? "error" : "info"}
                        label={isUrgent ? "EXPIRING_SOON" : "OPEN"}
                    />
                </div>

                <div className="space-y-1">
                    {services.map((service) => (
                        <div
                            key={service.category_id}
                            className="flex items-center gap-2 text-sm text-gray-700"
                        >
                            <Package size={16} />
                            <span>
                                {service.category_name} -{" "}
                                <span className="font-medium">
                                    {service.quantity_value} {service.selected_unit}
                                </span>
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span>{pickupAddress}</span>
                </div>
                <div className="text-xs text-gray-500">
                    {pickupLat}, {pickupLng}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>
                        Pickup Duration:{" "}
                        <span className="font-medium text-[#040947]">
                            {formatPickupDuration(pickupTimeFrom, pickupTimeTo)}
                        </span>
                    </span>
                </div>

                <div className="text-sm font-medium text-gray-900">
                    Expires in{" "}
                    <span className="font-medium text-red-600">
                        {expiresInMinutes} minutes
                    </span>
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <Button
                    variant="outline"
                    className="flex-1 bg-gray-100"
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

