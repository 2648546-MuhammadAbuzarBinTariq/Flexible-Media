import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../styles/map.css";

const MapComponent = ({ cueData }) => {
  const mapRef = useRef(null);
  const routeRef = useRef([]); // Stores coordinates for drawing a polyline

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map").setView([28.6, 83.8], 6); // Center around Himalayas

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

    // Draw updated route
    L.polyline(routeRef.current, { color: "blue", weight: 4 }).addTo(mapRef.current);
  }, [cueData]);

  return (
    <div id="map" className="map-container" />
  );
};

export default MapComponent;
