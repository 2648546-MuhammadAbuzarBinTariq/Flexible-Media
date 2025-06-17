import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/map.css";

// Fix for default marker icons
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
      const map = L.map("map").setView([56.458, -2.981], 16); // Dundee area
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

    markersRef.current.push(marker);

    L.polyline(routeRef.current, { color: "red", weight: 4 }).addTo(mapRef.current);
    mapRef.current.setView(coords, 16, { animate: true });
  }, [cueData, cueTimes, onMapClick]);

  return <div id="map" className="map-container" />;
};

export default MapComponent;
