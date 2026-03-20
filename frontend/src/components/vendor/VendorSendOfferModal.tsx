"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Clock3, HandCoins, StickyNote, X } from "lucide-react"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 shadow-[0_24px_72px_rgba(15,23,42,0.28)]">
                <div className="h-1.5 w-full bg-gradient-to-r from-[#040947] via-[#0b2a78] to-amber-400" />

                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Submit Your Offer</h3>
                        <p className="text-xs text-slate-500">Share your best quote and delivery timeline</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <CardContent className="space-y-5 bg-gradient-to-b from-slate-50/80 to-white pt-6">

                    <div>
                        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                            <HandCoins className="h-4 w-4 text-[#040947]" />
                            Offer Price (NPR)
                        </label>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="e.g. 4500"
                            className="bg-white"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                            <Clock3 className="h-4 w-4 text-[#040947]" />
                            Completion Time
                        </label>
                        <Input
                            type="datetime-local"
                            value={completionTime}
                            onChange={(e) => setCompletionTime(e.target.value)}
                            className="bg-white"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                            <StickyNote className="h-4 w-4 text-[#040947]" />
                            Description (Optional)
                        </label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add notes about materials, timeline, or service scope..."
                            className="min-h-24 bg-white"
                        />
                    </div>

                </CardContent>

                <CardFooter className="flex justify-end gap-3 border-t border-slate-100 bg-white">
                    <Button variant="outline" onClick={onClose} className="border-slate-300 text-slate-700">
                        Cancel
                    </Button>

                    <Button
                        disabled={isPending || !price || !completionTime}
                        onClick={handleSubmit}
                        className="bg-[#040947] text-white hover:bg-[#030736]"
                    >
                        {isPending ? "Submitting..." : "Submit Offer"}
                    </Button>
                </CardFooter>

            </Card>
        </div>
    )
}

