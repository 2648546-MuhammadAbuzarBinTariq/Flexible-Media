import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "../styles/map.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const redIcon = L.divIcon({
  className: "custom-marker",
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48" width="32" height="48">
      <path fill="#d60000" d="M16 0C7 0 0 7 0 16c0 12 16 32 16 32s16-20 16-32c0-9-7-16-16-16zm0 24a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/>
    </svg>
  `,
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -40],
});


// Default blue icon
const blueIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
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

    markersRef.current.forEach((m) => m.setIcon(blueIcon));
    const marker = L.marker(currentCoords, { icon: redIcon }).addTo(mapRef.current);

    const imagePath = `/images/${label}.png`;
    const html = `
      <div style="text-align:center; max-width:220px;">
        <strong>${label}</strong><br/>
        <img src="${imagePath}" alt="${label}" style="width:200px; height:auto; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.3);" />
      </div>
    `;

    marker.bindPopup(html, { autoClose: false, closeOnClick: false });

    marker.on("mouseover", () => marker.openPopup());
    marker.on("mouseout", () => marker.closePopup());

    let tapTimeout = null;

marker.on("click", () => {
  if (tapTimeout) {
    // Double tap detected
    clearTimeout(tapTimeout);
    tapTimeout = null;
    if (cueTimes[label] !== undefined) {
      onMapClick(label); // Seek video
    }
  } else {
    // Start single tap timer
    tapTimeout = setTimeout(() => {
      marker.openPopup(); // Show image
      tapTimeout = null;
    }, 250); // Delay to detect second tap
  }
});


    markersRef.current.push(marker);

    /*
    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
    }
    if (prevCoordsRef.current) {
      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(prevCoordsRef.current[0], prevCoordsRef.current[1]),
          L.latLng(currentCoords[0], currentCoords[1]),
        ],
        createMarker: () => null,
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        show: false,
        fitSelectedRoutes: false,
        lineOptions: {
          styles: [{ color: "blue", weight: 4 }],
        },
      }).addTo(mapRef.current);
    } */

    prevCoordsRef.current = currentCoords;
    mapRef.current.setView(currentCoords, 16, { animate: true });

  }, [cueData, cueTimes, onMapClick]);

  return <div id="map" className="map-container" />;
};

export default MapComponent;
