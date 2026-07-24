"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import L from "leaflet";

import { FUTA_CAMPUS } from "@/lib/constants/futa-geo";
import type { ListingMapPin } from "@/lib/listings/to-map-pins";
import { cn } from "@/lib/utils";

import "leaflet/dist/leaflet.css";

type ListingMapProps = {
  pins: ListingMapPin[];
  className?: string;
  heightClassName?: string;
  zoom?: number;
  showCampusMarker?: boolean;
};

function createPinMarker(pin: ListingMapPin): L.LayerGroup {
  const group = L.layerGroup();
  const marker = L.circleMarker([pin.latitude, pin.longitude], {
    radius: 9,
    color: "#E8B84A",
    weight: 2,
    fillColor: "#E8B84A",
    fillOpacity: 0.85,
  });

  marker.bindPopup(
    `<div style="min-width:160px">
      <strong style="display:block;margin-bottom:4px">${pin.title}</strong>
      <span style="color:#666;font-size:12px">${pin.areaLabel}</span><br/>
      <span style="font-weight:600;margin-top:6px;display:inline-block">${pin.priceLabel}</span>
    </div>`
  );

  marker.on("click", () => {
    window.location.href = pin.href;
  });

  group.addLayer(marker);
  return group;
}

export function ListingMap({
  pins,
  className,
  heightClassName = "h-[420px]",
  zoom = 14,
  showCampusMarker = true,
}: ListingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const center =
      pins.length > 0
        ? [pins[0].latitude, pins[0].longitude]
        : [FUTA_CAMPUS.lat, FUTA_CAMPUS.lng];

    const map = L.map(containerRef.current, {
      center: center as L.LatLngExpression,
      zoom,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    if (showCampusMarker) {
      L.circleMarker([FUTA_CAMPUS.lat, FUTA_CAMPUS.lng], {
        radius: 7,
        color: "#22c55e",
        weight: 2,
        fillColor: "#22c55e",
        fillOpacity: 0.9,
      })
        .bindPopup(`<strong>${FUTA_CAMPUS.label}</strong>`)
        .addTo(map);
    }

    const layers = pins.map((pin) => createPinMarker(pin));
    layers.forEach((layer) => layer.addTo(map));

    if (pins.length > 1) {
      const bounds = L.latLngBounds(
        pins.map((pin) => [pin.latitude, pin.longitude] as L.LatLngTuple)
      );
      bounds.extend([FUTA_CAMPUS.lat, FUTA_CAMPUS.lng]);
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 15 });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [pins, showCampusMarker, zoom]);

  return (
    <div className={cn("space-y-2", className)}>
      <div
        ref={containerRef}
        className={cn(
          "overflow-hidden rounded-xl border border-white/10 bg-muted",
          heightClassName
        )}
      />
      <p className="text-xs text-muted-foreground">
        Pins are set by property owners when they list a lodge.{" "}
        <Link href="/listings" className="text-[#E8B84A] hover:underline">
          Green dot
        </Link>{" "}
        = campus.
      </p>
    </div>
  );
}
