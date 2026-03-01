"use client";

import { useState } from "react";
import { Offer } from "@/src/types/orders/offers";

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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-5">
                <h3 className="text-lg font-semibold">
                    Update Offer
                </h3>

                <div className="space-y-3">
                    <div>
                        <label className="text-sm text-gray-600">
                            Bid Price
                        </label>
                        <input
                            type="number"
                            value={bidPrice}
                            onChange={(e) =>
                                setBidPrice(Number(e.target.value))
                            }
                            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">
                            Completion Time
                        </label>
                        <input
                            type="datetime-local"
                            value={completionTime}
                            onChange={(e) =>
                                setCompletionTime(e.target.value)
                            }
                            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-lg border"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() =>
                            onSubmit({
                                bid_price: bidPrice,
                                completion_time: completionTime,
                                description,
                            })
                        }
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}