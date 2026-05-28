"use client";

import dynamic from "next/dynamic";

const LeafletLocationMapInner = dynamic(() => import("./LeafletLocationMapInner"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
            Loading map...
        </div>
    ),
});

type LeafletLocationMapProps = {
    latitude: number;
    longitude: number;
    editable?: boolean;
    height?: number;
    zoom?: number;
    onLocationChange?: (location: { latitude: number; longitude: number }) => void;
};

const isValidCoordinate = (latitude: number, longitude: number) =>
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

export default function LeafletLocationMap({
    latitude,
    longitude,
    editable = false,
    height = 240,
    zoom = 14,
    onLocationChange,
}: LeafletLocationMapProps) {
    if (!isValidCoordinate(latitude, longitude)) {
        return null;
    }

    return (
        <div
            className="overflow-hidden rounded-xl border border-[#040947]/15 bg-slate-100"
            style={{ height }}
        >
            <LeafletLocationMapInner
                latitude={latitude}
                longitude={longitude}
                editable={editable}
                zoom={zoom}
                onLocationChange={onLocationChange}
            />
        </div>
    );
}
