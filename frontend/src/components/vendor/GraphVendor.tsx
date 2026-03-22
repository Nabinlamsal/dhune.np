import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
} from "recharts";

type DashboardStats = {
    total_offers?: number;
    rejected_offers?: number;
    withdrawn_offers?: number;
    expired_offers?: number;
    total_orders?: number;
    pending_offers?: number;
    accepted_offers?: number;
    accepted_orders?: number;
    picked_up_orders?: number;
    in_progress_orders?: number;
    delivering_orders?: number;
    completed_orders?: number;
    cancelled_orders?: number;
};

type GraphVendorProps = {
    offerStats?: DashboardStats;
    orderStats?: DashboardStats;
    loading: boolean;
};

const PIE_COLORS = ["#f97316", "#0ea5e9", "#16a34a", "#6366f1"];
const MOCK_OFFER_FLOW = [
    { name: "Pending", value: 34 },
    { name: "Accepted", value: 52 },
    { name: "Rejected", value: 11 },
    { name: "Withdrawn", value: 7 },
    { name: "Expired", value: 6 },
];
const MOCK_ORDER_FLOW = [
    { name: "Accepted", value: 44 },
    { name: "Picked Up", value: 31 },
    { name: "In Progress", value: 24 },
    { name: "Delivering", value: 19 },
    { name: "Completed", value: 58 },
    { name: "Cancelled", value: 4 },
];
const MOCK_MIX = [
    { name: "Offers Pending", value: 28 },
    { name: "Offers Accepted", value: 46 },
    { name: "Active Orders", value: 37 },
    { name: "Completed Orders", value: 54 },
];

export function GraphVendor({ offerStats, orderStats, loading }: GraphVendorProps) {
    const useMock = true;
    const offerFlowData = useMock
        ? MOCK_OFFER_FLOW
        : [
            { name: "Pending", value: offerStats?.pending_offers ?? 0 },
            { name: "Accepted", value: offerStats?.accepted_offers ?? 0 },
            { name: "Rejected", value: offerStats?.rejected_offers ?? 0 },
            { name: "Withdrawn", value: offerStats?.withdrawn_offers ?? 0 },
            { name: "Expired", value: offerStats?.expired_offers ?? 0 },
        ];

    const orderFlowData = useMock
        ? MOCK_ORDER_FLOW
        : [
            { name: "Accepted", value: orderStats?.accepted_orders ?? 0 },
            { name: "Picked Up", value: orderStats?.picked_up_orders ?? 0 },
            { name: "In Progress", value: orderStats?.in_progress_orders ?? 0 },
            { name: "Delivering", value: orderStats?.delivering_orders ?? 0 },
            { name: "Completed", value: orderStats?.completed_orders ?? 0 },
            { name: "Cancelled", value: orderStats?.cancelled_orders ?? 0 },
        ];

    const mixData = useMock
        ? MOCK_MIX
        : [
            { name: "Offers Pending", value: offerStats?.pending_offers ?? 0 },
            { name: "Offers Accepted", value: offerStats?.accepted_offers ?? 0 },
            {
                name: "Active Orders",
                value:
                    (orderStats?.accepted_orders ?? 0) +
                    (orderStats?.picked_up_orders ?? 0) +
                    (orderStats?.in_progress_orders ?? 0) +
                    (orderStats?.delivering_orders ?? 0),
            },
            { name: "Completed Orders", value: orderStats?.completed_orders ?? 0 },
        ];
    const totalMix = mixData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Vendor Analytics</h3>
                <p className="text-xs text-gray-500">{loading ? "Loading..." : "Mock analytics preview"}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Offer Conversion</p>
                    <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={offerFlowData} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                                <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24} fill="#f97316" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Order Flow</p>
                    <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={orderFlowData} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24} fill="#0ea5e9" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:col-span-2">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Workload Mix</p>
                        <p className="text-xs text-gray-500">Small snapshot</p>
                    </div>
                    <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={mixData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={50}
                                    outerRadius={75}
                                    paddingAngle={4}
                                    labelLine={false}
                                    label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                                >
                                    {mixData.map((entry, index) => (
                                        <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs sm:grid-cols-4">
                        {mixData.map((item, index) => (
                            <div key={item.name} className="flex items-center gap-2 rounded-md bg-gray-50 px-2 py-1.5">
                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                                />
                                <span className="text-gray-600">{item.name}</span>
                                <span className="ml-auto font-semibold text-gray-900">
                                    {totalMix ? Math.round((item.value / totalMix) * 100) : 0}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
