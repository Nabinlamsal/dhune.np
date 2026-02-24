"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { X } from "lucide-react"
import { useCreateOffer } from "@/src/hooks/orders/useOffer"
import { CreateOfferPayload } from "@/src/types/orders/offers"

interface VendorSendOfferModalProps {
    requestId: string | null
    open: boolean
    onClose: () => void
}

export default function VendorSendOfferModal({
    requestId,
    open,
    onClose,
}: VendorSendOfferModalProps) {

    const { mutate, isPending } = useCreateOffer()

    const [price, setPrice] = useState("")
    const [completionTime, setCompletionTime] = useState("")
    const [description, setDescription] = useState("")

    if (!open) return null

    const handleSubmit = () => {
        if (!requestId || !price || !completionTime) return

        const payload: CreateOfferPayload = {
            request_id: requestId,
            bid_price: Number(price),
            completion_time: new Date(completionTime).toISOString(),
            description: description || undefined,
        }

        mutate(payload)

        // reset
        setPrice("")
        setCompletionTime("")
        setDescription("")
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <Card className="w-full max-w-md">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="font-semibold text-lg">
                        Submit Your Offer
                    </h3>
                    <button onClick={onClose}>
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                <CardContent className="space-y-4 pt-6">

                    {/* Price */}
                    <div>
                        <label className="text-sm font-medium">
                            Offer Price (NPR)
                        </label>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    {/* Completion Time */}
                    <div>
                        <label className="text-sm font-medium">
                            Completion Time
                        </label>
                        <Input
                            type="datetime-local"
                            value={completionTime}
                            onChange={(e) => setCompletionTime(e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium">
                            Description (Optional)
                        </label>
                        <textarea
                            className="w-full border rounded-md px-3 py-2 text-sm"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                </CardContent>

                <CardFooter className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button
                        disabled={isPending || !price || !completionTime}
                        onClick={handleSubmit}
                    >
                        {isPending ? "Submitting..." : "Submit Offer"}
                    </Button>
                </CardFooter>

            </Card>
        </div>
    )
}