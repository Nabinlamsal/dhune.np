
import { useVendorDashboard } from "@/src/hooks/orders/useDashboard";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

export function GraphVendor() {
    const { orders, offers, loading } = useVendorDashboard();

    const orderStats = orders.data?.data;
    const offerStats = offers.data?.data;
    const pendingOffers = offerStats?.pending_offers ?? 0;
    const acceptedOffers = offerStats?.accepted_offers ?? 0;
    // Chart Data
    const chartData = [
        {
            name: "Pending",
            value: pendingOffers,
        },
        {
            name: "Accepted",
            value: acceptedOffers,
        },
    ];
    return (

        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-[420px] flex flex-col">
            <h3 className="text-lg font-semibold mb-6">
                Offers vs Conversions
            </h3>

            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                        barCategoryGap="40%"
                    >
                        <CartesianGrid stroke="#f1f5f9" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#64748b", fontSize: 13 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: "rgba(0,0,0,0.03)" }}
                            contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                fontSize: "13px",
                            }}
                        />
                        <Bar
                            dataKey="value"
                            radius={[10, 10, 0, 0]}
                            fill="#f97316"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
