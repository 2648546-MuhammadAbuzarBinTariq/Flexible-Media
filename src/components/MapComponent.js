import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
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
  const prevCoordsRef = useRef(null);
  const routingControlRef = useRef(null);
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

    const currentCoords = [lat, lng];

    // Create marker
    const marker = L.marker(currentCoords).addTo(mapRef.current);

    // Custom preview content
    const imagePath = `/images/${label}.png`;
    const html = `
      <div style="text-align:center; max-width:220px;">
        <strong>${label}</strong><br/>
        <img src="${imagePath}" alt="${label}" style="width:200px; height:auto; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.3);" />
      </div>
    `;

    // Bind popup but only trigger manually
    marker.bindPopup(html, { autoClose: false, closeOnClick: false });

    // Hover preview
    marker.on("mouseover", () => {
      marker.openPopup();
    });

    marker.on("mouseout", () => {
      marker.closePopup();
    });

    // Touch support
    marker.on("click", () => {
      marker.openPopup();
      if (cueTimes[label] !== undefined) {
        onMapClick(label);
      }
    });

    markersRef.current.push(marker);

    // Remove previous routing control
    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
    }

    // Show route between previous and current location
    if (prevCoordsRef.current) {
      routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(prevCoordsRef.current[0], prevCoordsRef.current[1]),
        L.latLng(currentCoords[0], currentCoords[1]),
      ],
      createMarker: () => null, // <- Add this line to suppress internal markers
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
      fitSelectedRoutes: false,
      lineOptions: {
        styles: [{ color: "blue", weight: 4 }],
      },
    }).addTo(mapRef.current);

    }

    // Store current for next segment
    prevCoordsRef.current = currentCoords;

    // Recenter
    mapRef.current.setView(currentCoords, 16, { animate: true });
  }, [cueData, cueTimes, onMapClick]);

  return <div id="map" className="map-container" />;
};

export default MapComponent;
