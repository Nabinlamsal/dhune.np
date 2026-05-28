"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { cn } from "@/lib/utils";

type ConfirmTone = "primary" | "danger" | "success";

export function ConfirmActionDialog({
    open,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    tone = "primary",
    isLoading = false,
    onCancel,
    onConfirm,
}: {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    tone?: ConfirmTone;
    isLoading?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-md border-slate-200 bg-white shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-lg text-slate-900">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm leading-6 text-slate-600">{message}</p>
                    <div className="mt-6 flex justify-end gap-2">
                        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                            {cancelLabel}
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={cn(
                                tone === "danger" && "bg-red-600 text-white hover:bg-red-700",
                                tone === "success" && "bg-emerald-600 text-white hover:bg-emerald-700",
                                tone === "primary" && "bg-[#040947] text-white hover:bg-[#09106a]"
                            )}
                        >
                            {isLoading ? "Working..." : confirmLabel}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
