"use client";

import { useState, useEffect } from "react";
import { Settings2, Percent } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useSettings, useUpdateSettings } from "@/src/hooks/queries/useSettings";

export function CommissionSettingsCard() {
    const { data, isLoading } = useSettings();
    const updateSettings = useUpdateSettings();
    
    const [percentage, setPercentage] = useState("");

    useEffect(() => {
        if (data?.settings?.commissionPercentage) {
            setPercentage(data.settings.commissionPercentage);
        }
    }, [data]);

    const handleSave = () => {
        if (!percentage) return;
        updateSettings.mutate({ commission_percentage: percentage });
    };

    return (
        <div className="overflow-hidden rounded-[28px] border border-[#d8d0bf] bg-white shadow-[0_18px_40px_rgba(54,42,20,0.06)]">
            <div className="flex items-center justify-between border-b border-[#ece5d6] px-6 py-4 bg-[#fcfaf5]">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5efe3] text-[#4e4434]">
                        <Settings2 className="size-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-[#2f2618]">Platform Settings</h3>
                        <p className="text-sm text-[#7a6f5e]">
                            Global configurations for the marketplace
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {isLoading ? (
                    <div className="animate-pulse flex gap-4">
                        <div className="h-12 w-48 bg-slate-200 rounded-xl"></div>
                        <div className="h-12 w-24 bg-slate-200 rounded-xl"></div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                        <div className="space-y-2 max-w-xs w-full">
                            <label className="text-sm font-semibold text-[#4e4434]">
                                Global Commission Percentage (%)
                            </label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={percentage}
                                    onChange={(e) => setPercentage(e.target.value)}
                                    className="pl-9 h-12 border-[#d8d0bf] bg-[#fcfaf5] text-slate-900 focus-visible:ring-[#8a7f6c]"
                                />
                                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#8a7f6c]" />
                            </div>
                            <p className="text-xs text-[#7a6f5e]">
                                Deducted automatically from vendor earnings on completed orders.
                            </p>
                        </div>
                        
                        <Button 
                            onClick={handleSave}
                            disabled={updateSettings.isPending || percentage === data?.settings?.commissionPercentage}
                            className="h-12 rounded-xl bg-[#2f2618] px-6 text-white hover:bg-[#211a11]"
                        >
                            {updateSettings.isPending ? "Saving..." : "Save Settings"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
