"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Offer } from "@/src/types/orders/offers";
import { Clock3, HandCoins, StickyNote, X } from "lucide-react";

interface Props {
    open: boolean;
    offer: Offer | null;
    onClose: () => void;
    onSubmit: (data: {
        bid_price: number;
        completion_time: string;
        description?: string;
    }) => void;
}

export default function EditOfferModal({
    open,
    offer,
    onClose,
    onSubmit,
}: Props) {
    const [bidPrice, setBidPrice] = useState<number>(
        offer?.bid_price ?? 0
    );
    const [completionTime, setCompletionTime] =
        useState<string>(offer?.completion_time ?? "");
    const [description, setDescription] =
        useState<string>(offer?.description ?? "");

    if (!open || !offer) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_72px_rgba(15,23,42,0.28)]">
                <div className="h-1.5 w-full bg-gradient-to-r from-[#040947] via-[#0b2a78] to-amber-400" />

                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Update Offer</h3>
                        <p className="text-xs text-slate-500">Adjust your pricing and completion estimate</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="space-y-5 bg-gradient-to-b from-slate-50/80 to-white px-6 py-6">
                    <div>
                        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                            <HandCoins className="h-4 w-4 text-[#040947]" />
                            Bid Price
                        </label>
                        <Input
                            type="number"
                            value={bidPrice}
                            onChange={(e) =>
                                setBidPrice(Number(e.target.value))
                            }
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
                            onChange={(e) =>
                                setCompletionTime(e.target.value)
                            }
                            className="bg-white"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                            <StickyNote className="h-4 w-4 text-[#040947]" />
                            Description
                        </label>
                        <Textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="Optional notes about your revised offer..."
                            className="min-h-24 bg-white"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="border-slate-300 text-slate-700"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={() =>
                            onSubmit({
                                bid_price: bidPrice,
                                completion_time: completionTime,
                                description,
                            })
                        }
                        className="bg-[#040947] text-white hover:bg-[#030736]"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}

