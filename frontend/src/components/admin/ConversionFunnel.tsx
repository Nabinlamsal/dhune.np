"use client"

export function ConversionFunnel() {
    const data = [
        { label: "Requests Posted", value: 2400, color: "bg-orange-500", width: "100%" },
        { label: "Offers Received", value: 1840, color: "bg-orange-500", width: "76%" },
        { label: "Orders Placed", value: 1200, color: "bg-orange-500", width: "50%" },
        { label: "Completed Orders", value: 1080, color: "bg-orange-500", width: "45%" },
    ]

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full">
            <h3 className="font-bold text-lg">Conversion Funnel</h3>
            <p className="text-xs text-gray-400 mb-6">Users through the marketplace pipeline</p>

            <div className="space-y-6">
                {data.map((item) => (
                    <div key={item.label}>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-gray-700">{item.label}</span>
                            <span className="text-gray-400">{item.value}</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className={`${item.color} h-full rounded-full`} style={{ width: item.width }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}