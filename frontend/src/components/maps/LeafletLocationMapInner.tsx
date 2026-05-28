"use client";

import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";

type LeafletLocationMapInnerProps = {
    latitude: number;
    longitude: number;
    editable?: boolean;
    zoom?: number;
    onLocationChange?: (location: { latitude: number; longitude: number }) => void;
};

const markerIcon = L.divIcon({
    className: "",
    html: '<div style="width:18px;height:18px;border-radius:999px;background:#0b2457;border:3px solid #ffffff;box-shadow:0 4px 14px rgba(15,23,42,.35);"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
});

function PickerEvents({
    enabled,
    onLocationChange,
}: {
    enabled: boolean;
    onLocationChange?: (location: { latitude: number; longitude: number }) => void;
}) {
    useMapEvents({
        click(event) {
            if (!enabled || !onLocationChange) return;
            onLocationChange({
                latitude: event.latlng.lat,
                longitude: event.latlng.lng,
            });
        },
    });

    return null;
}

export default function LeafletLocationMapInner({
    latitude,
    longitude,
    editable = false,
    zoom = 14,
    onLocationChange,
}: LeafletLocationMapInnerProps) {
    return (
        <MapContainer
            center={[latitude, longitude]}
            zoom={zoom}
            scrollWheelZoom
            className="h-full w-full"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
                position={[latitude, longitude]}
                icon={markerIcon}
                draggable={editable}
                eventHandlers={
                    editable
                        ? {
                            dragend(event) {
                                const marker = event.target as L.Marker;
                                const position = marker.getLatLng();
                                onLocationChange?.({
                                    latitude: position.lat,
                                    longitude: position.lng,
                                });
                            },
                        }
                        : undefined
                }
            />
            <PickerEvents enabled={editable} onLocationChange={onLocationChange} />
        </MapContainer>
    );
}
