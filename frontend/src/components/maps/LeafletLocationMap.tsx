"use client";

import dynamic from "next/dynamic";

const LeafletLocationMapInner = dynamic(() => import("./LeafletLocationMapInner"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-500 dark:bg-[#07111f] dark:text-slate-300">
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
            className="relative z-0 overflow-hidden rounded-xl border border-[#040947]/15 bg-slate-100 dark:border-white/10 dark:bg-[#07111f] [&_.leaflet-bottom]:z-[1] [&_.leaflet-control]:z-[1] [&_.leaflet-control-container]:z-[1] [&_.leaflet-marker-icon]:z-[2] [&_.leaflet-pane]:z-0 [&_.leaflet-popup-pane]:z-[3] [&_.leaflet-tile]:transition-[filter] [&_.leaflet-top]:z-[1] dark:[&_.leaflet-control-attribution]:bg-[#07111f]/85 dark:[&_.leaflet-control-attribution]:text-slate-300 dark:[&_.leaflet-control-attribution_a]:text-cyan-200 dark:[&_.leaflet-tile]:brightness-[0.62] dark:[&_.leaflet-tile]:contrast-[1.18] dark:[&_.leaflet-tile]:grayscale-[0.25] dark:[&_.leaflet-tile]:hue-rotate-[180deg] dark:[&_.leaflet-tile]:invert"
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
