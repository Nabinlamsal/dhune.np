"use client";

import { X } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface FilePreviewModalProps {
    open: boolean;
    onClose: () => void;
    url?: string;
    title?: string;
}

function isImageUrl(url: string) {
    return /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i.test(url);
}

export function FilePreviewModal({
    open,
    onClose,
    url,
    title = "File Preview",
}: FilePreviewModalProps) {
    if (!open || !url) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <div className="flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b p-4">
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex-1 bg-gray-50 p-3">
                    {isImageUrl(url) ? (
                        <img
                            src={url}
                            alt="Preview"
                            className="h-full w-full rounded-lg object-contain"
                        />
                    ) : (
                        <iframe
                            src={url}
                            title={title}
                            className="h-full w-full rounded-lg border bg-white"
                        />
                    )}
                </div>

                <div className="border-t p-3">
                    <a
                        href={url}
                        className="text-xs font-medium text-blue-600 hover:underline"
                    >
                        Open file directly
                    </a>
                </div>
            </div>
        </div>
    );
}
