import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "../styles/map.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import L from "leaflet";

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
      const map = L.map("map").setView([28.6, 83.8], 6);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      mapRef.current = map;
    }
  }, []);

  useEffect(() => {
    if (!cueData || cueData.type !== "location") return;

    const { lat, lng, label } = cueData;
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

    L.polyline(routeRef.current, { color: "blue", weight: 4 }).addTo(mapRef.current);
    mapRef.current.setView(coords, 8, { animate: true });
  }, [cueData, cueTimes, onMapClick]);

  return <div id="map" className="map-container" />;
};

export default MapComponent;
