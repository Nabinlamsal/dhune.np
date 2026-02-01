
"use client"

import { Card } from "@/src/components/ui/card"

interface Column<T> {
    key: string
    header: string
    render?: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
    columns: Column<T>[]
    data: T[]
    onRowClick?: (row: T) => void   // ✅ ADD THIS
}

export function DataTable<T>({
    columns,
    data,
    onRowClick,
}: DataTableProps<T>) {
    return (
        <Card className="overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-6 py-4 text-left font-semibold text-gray-600"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row, idx) => (
                        <tr
                            key={idx}
                            onClick={() => onRowClick?.(row)}   // ✅ USE IT
                            className={`border-b last:border-b-0 hover:bg-gray-50 ${onRowClick ? "cursor-pointer" : ""
                                }`}
                        >
                            {columns.map((col) => (
                                <td key={col.key} className="px-6 py-4">
                                    {col.render
                                        ? col.render(row)
                                        : (row as any)[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    )
}

