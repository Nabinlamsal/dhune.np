//detail
export function Detail({
    label,
    value,
}: {
    label: string;
    value?: string;
}) {
    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <p className="text-gray-500">{label}</p>
            <p className="font-medium">{value ?? "—"}</p>
        </div>
    );
}
