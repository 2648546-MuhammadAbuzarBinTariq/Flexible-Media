import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/map.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapComponent = ({ cueData, cueTimes, onMapClick }) => {
  const mapRef = useRef(null);
  const routeRef = useRef([]);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map").setView([56.458, -2.981], 16);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
      mapRef.current = map;
    }
  }, []);

  useEffect(() => {
    if (!cueData || cueData.type !== "location") return;

    const { lat, lng, label } = cueData;
    if (typeof lat !== "number" || typeof lng !== "number") return;

    const coords = [lat, lng];
    routeRef.current.push(coords);

    const marker = L.marker(coords)
      .addTo(mapRef.current)
      .bindPopup(label)
      .openPopup();

    marker.on("click", () => {
      if (cueTimes[label] !== undefined) {
        onMapClick(label);
      }
    });

    marker.on("mouseover", () => {
      const imagePath = `/images/${label}.png`;
      const html = `
        <div style="text-align:center; max-width:220px;">
          <strong>${label}</strong><br/>
          <img src="${imagePath}" alt="${label}" style="width:200px; height:auto; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.3);" />
        </div>
      `;
      marker.bindPopup(html).openPopup();
    });

    marker.on("mouseout", () => {
      marker.closePopup();
    });

    markersRef.current.push(marker);

    L.polyline(routeRef.current, { color: "blue", weight: 4 }).addTo(mapRef.current);
    mapRef.current.setView(coords, 16, { animate: true });
  }, [cueData, cueTimes, onMapClick]);

  return <div id="map" className="map-container" />;
};

export default MapComponent;
