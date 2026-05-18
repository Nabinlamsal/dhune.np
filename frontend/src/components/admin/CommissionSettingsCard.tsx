"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { useSettings, useUpdateSettings } from "@/src/hooks/queries/useSettings";

const getCommissionPercentage = (settings: unknown) => {
    if (!settings || typeof settings !== "object") return "";
    const record = settings as Record<string, unknown>;
    const value =
        "commission_percentage" in record
            ? record.commission_percentage
            : "commissionPercentage" in record
                ? record.commissionPercentage
                : "";
    return typeof value === "number" || typeof value === "string" ? String(value) : "";
};

export function CommissionSettingsCard() {
    const { data, isLoading } = useSettings();
    const savedPercentage = getCommissionPercentage(data);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Commission Settings</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <p className="text-sm text-gray-500">Loading settings...</p>
                ) : (
                    <CommissionSettingsForm key={savedPercentage} savedPercentage={savedPercentage} />
                )}
            </CardContent>
        </Card>
    );
}

function CommissionSettingsForm({ savedPercentage }: { savedPercentage: string }) {
    const updateSettings = useUpdateSettings();
    const [percentage, setPercentage] = useState(savedPercentage);

    const percentageNumber = Number(percentage);
    const canSave =
        percentage.trim() !== "" &&
        Number.isFinite(percentageNumber) &&
        percentageNumber >= 0 &&
        percentageNumber <= 100 &&
        percentage !== savedPercentage;

    const handleSave = () => {
        if (!canSave) return;
        updateSettings.mutate({ commission_percentage: percentageNumber });
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="w-full max-w-xs space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    Global Commission Percentage (%)
                </label>
                <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={percentage}
                    onChange={(event) => setPercentage(event.target.value)}
                />
            </div>

            <Button onClick={handleSave} disabled={!canSave || updateSettings.isPending}>
                {updateSettings.isPending ? "Saving..." : "Save Settings"}
            </Button>
        </div>
    );
}
