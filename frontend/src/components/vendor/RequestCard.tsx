"use client"

import { Clock, MapPin, Package } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { StatusBadge } from "@/src/components/common/StatusBadge"

interface MarketplaceServiceItem {
    category_id: string
    category_name: string
    selected_unit: string
    quantity_value: number
}

interface RequestCardProps {
    id: string
    pickupAddress: string
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

            {/* Top Section */}
            <div className="space-y-4">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                            Laundry Request
                        </h3>
                        <p className="text-xs text-gray-400">
                            Request ID: {id.slice(0, 8)}...
                        </p>
                    </div>

                    <StatusBadge
                        status={isUrgent ? "error" : "info"}
                    />
                </div>

                {/* Services Breakdown */}
                <div className="space-y-1">
                    {services.map((service) => (
                        <div
                            key={service.category_id}
                            className="flex items-center gap-2 text-sm text-gray-700"
                        >
                            <Package size={16} />
                            <span>
                                {service.category_name} —{" "}
                                <span className="font-medium">
                                    {service.quantity_value} {service.selected_unit}
                                </span>
                            </span>
                        </div>
                    ))}
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span>{pickupAddress}</span>
                </div>

                {/* Pickup Window */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>
                        Pickup:{" "}
                        <span className="font-medium text-blue-950">
                            {new Date(pickupTimeFrom).toLocaleString()} –{" "}
                            {new Date(pickupTimeTo).toLocaleTimeString()}
                        </span>
                    </span>
                </div>

                {/* Expiry */}
                <div className="text-sm font-medium text-gray-900">
                    Expires in{" "}
                    <span className={`font-medium text-red-600`}>
                        {expiresInMinutes} minutes
                    </span>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3 mt-6">
                <Button
                    variant="outline"
                    className="flex-1 bg-gray-100"
                    onClick={onView}
                >
                    View Details
                </Button>

                <Button
                    className="flex-1 bg-[#040956] hover:bg-orange-600"
                    onClick={onBid}
                >
                    Place Bid
                </Button>
            </div>
        </div>
    )
}