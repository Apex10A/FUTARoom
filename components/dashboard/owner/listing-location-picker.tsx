"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

import { getAreaLabel } from "@/lib/constants/areas";
import { getAreaCentroid } from "@/lib/constants/futa-geo";
import type { NearbyListingPin } from "@/lib/listings/nearby-listings";
import { cn } from "@/lib/utils";

import "leaflet/dist/leaflet.css";

type ListingLocationPickerProps = {
  areaId: string;
  latitude: number;
  longitude: number;
  onChange: (latitude: number, longitude: number) => void;
  className?: string;
  heightClassName?: string;
  zoom?: number;
  /** Bump this (e.g. Date.now()) to fly the map to the current lat/lng — used after an address search match. */
  focusVersion?: number;
  /** Other approved FUTARoom lodges nearby, shown as fixed reference pins. */
  nearbyListings?: NearbyListingPin[];
};

/**
 * Draggable-pin map used during listing creation so the property owner sets the
 * lodge's real location themselves, instead of the app guessing one.
 */
export function ListingLocationPicker({
  areaId,
  latitude,
  longitude,
  onChange,
  className,
  heightClassName = "h-[360px]",
  zoom = 16,
  focusVersion,
  nearbyListings = [],
}: ListingLocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const nearbyLayerRef = useRef<L.LayerGroup | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const lastFocusVersionRef = useRef(focusVersion);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = L.map(containerRef.current, {
      center: [latitude, longitude],
      zoom,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // OpenStreetMap rarely has named labels for FUTA's surrounding communities,
    // so we draw our own reference marker for the selected area instead of
    // relying on the base map to label it.
    const areaLabel = getAreaLabel(areaId) ?? areaId;
    const centroid = getAreaCentroid(areaId);
    L.circleMarker([centroid.lat, centroid.lng], {
      radius: 6,
      color: "#60a5fa",
      weight: 2,
      fillColor: "#60a5fa",
      fillOpacity: 0.6,
    })
      .bindTooltip(`<strong>${areaLabel}</strong> (approx. area centre)`, {
        permanent: true,
        direction: "top",
        offset: [0, -6],
      })
      .addTo(map);

    const marker = L.marker([latitude, longitude], {
      draggable: true,
    }).addTo(map);

    marker.on("dragend", () => {
      const { lat, lng } = marker.getLatLng();
      onChangeRef.current(lat, lng);
    });

    map.on("click", (event: L.LeafletMouseEvent) => {
      marker.setLatLng(event.latlng);
      onChangeRef.current(event.latlng.lat, event.latlng.lng);
    });

    mapRef.current = map;
    markerRef.current = marker;
    nearbyLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      nearbyLayerRef.current = null;
    };
    // Map is created once; area changes remount this component via a `key` prop instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!markerRef.current || !mapRef.current) {
      return;
    }
    markerRef.current.setLatLng([latitude, longitude]);
  }, [latitude, longitude]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    // Only fly the view when focusVersion actually changes (e.g. a search
    // result was picked) — not on every drag-triggered lat/lng update.
    if (focusVersion == null || focusVersion === lastFocusVersionRef.current) {
      return;
    }
    lastFocusVersionRef.current = focusVersion;
    mapRef.current.flyTo([latitude, longitude], zoom, { duration: 0.75 });
  }, [focusVersion, latitude, longitude, zoom]);

  useEffect(() => {
    const layer = nearbyLayerRef.current;
    if (!layer) {
      return;
    }
    layer.clearLayers();
    nearbyListings.forEach((pin) => {
      L.circleMarker([pin.latitude, pin.longitude], {
        radius: 6,
        color: "#2dd4bf",
        weight: 2,
        fillColor: "#2dd4bf",
        fillOpacity: 0.7,
      })
        .bindPopup(
          `<strong style="display:block;margin-bottom:2px">${pin.title}</strong><span>${pin.priceLabel}</span>`
        )
        .addTo(layer);
    });
  }, [nearbyListings]);

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className={cn(
          "overflow-hidden rounded-xl border border-white/15 bg-muted",
          heightClassName,
          className
        )}
      />
      <p className="text-xs text-white/45">
        <span className="text-[#E8B84A]">●</span> Your pin ·{" "}
        <span className="text-[#60a5fa]">●</span> Selected area (reference) ·{" "}
        <span className="text-[#2dd4bf]">●</span> Other FUTARoom lodges nearby
      </p>
    </div>
  );
}
