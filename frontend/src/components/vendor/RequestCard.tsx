"use client"

import { Clock, MapPin, Package } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { StatusBadge } from "@/src/components/common/StatusBadge"

interface RequestCardProps {
    id: string
    categorySummary: string
    quantitySummary: string
    pickupAddress: string
    completionTime: string
    expiresInMinutes?: number
    onView: () => void
    onBid: () => void
}

export default function RequestCard({
    id,
    categorySummary,
    quantitySummary,
    pickupAddress,
    completionTime,
    expiresInMinutes,
    onView,
    onBid,
}: RequestCardProps) {

    const isUrgent = expiresInMinutes && expiresInMinutes <= 30

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between">

            {/* Top Section */}
            <div className="space-y-4">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                            {categorySummary}
                        </h3>
                        <p className="text-xs text-gray-400">
                            Request ID: {id.slice(0, 8)}...
                        </p>
                    </div>

                    {expiresInMinutes !== undefined && (
                        <StatusBadge
                            status={isUrgent ? "error" : "info"}
                        />
                    )}
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package size={16} />
                    <span>{quantitySummary}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span>{pickupAddress}</span>
                </div>

                {/* Completion */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>
                        Complete by:{" "}
                        <span className="font-medium">
                            {new Date(completionTime).toLocaleString()}
                        </span>
                    </span>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3 mt-6">
                <Button
                    variant="outline"
                    className="flex-1"
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