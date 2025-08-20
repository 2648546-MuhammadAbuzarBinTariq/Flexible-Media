import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "../styles/map.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import poiData from "../poiData";


const redIcon = L.divIcon({           //Map marker icons
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

const blueIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


const magnifyingGlassIcon = L.divIcon({           //POI icons
  className: "poi-marker",
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="32" height="32">
      <circle cx="27" cy="27" r="16" stroke="#333" stroke-width="4" fill="#fff"/>
      <line x1="40" y1="40" x2="60" y2="60" stroke="#333" stroke-width="4" />
    </svg>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28],
});

const MapComponent = ({ cueData, cueTimes, onMapClick }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const poiMarkersRef = useRef([]);

  
  useEffect(() => {           //Initialize map
    if (!mapRef.current) {
      const map = L.map("map").setView([56.458, -2.981], 16);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
      mapRef.current = map;

      map.on("popupopen", () => {
        const closeBtn = document.querySelector(".leaflet-popup-close-button");
        if (closeBtn) closeBtn.removeAttribute("href");
      });
    }
  }, []);

  
  useEffect(() => {           //Update markers when cueData changes
    if (!cueData || cueData.type !== "location" || !mapRef.current) return;

    const { lat, lng, label } = cueData;
    if (typeof lat !== "number" || typeof lng !== "number") return;

    const currentCoords = [lat, lng];

    
    if (markersRef.current.length > 0) {            //Turn previous main marker blue
      const prevMarker = markersRef.current[markersRef.current.length - 1];
      prevMarker.setIcon(blueIcon);
    }

    poiMarkersRef.current.forEach((m) => mapRef.current.removeLayer(m));            //Remove old POIs
    poiMarkersRef.current = [];

    const marker = L.marker(currentCoords, { icon: redIcon }).addTo(mapRef.current);          //Add main red marker

    const imagePath = `/images/${label}.png`;
    const html = `
      <div style="text-align:center; max-width:220px;">
        <strong>${label}</strong><br/>
        <img src="${imagePath}" alt="${label}" style="width:200px; height:auto; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.3);" />
      </div>
    `;

    marker.bindPopup(html, { autoClose: false, closeOnClick: false });

    marker.on("click", () => marker.openPopup());           //Click to open / double-click to trigger cue
    marker.on("dblclick", () => {
      if (cueTimes[label] !== undefined) {
        onMapClick(label);
      }
    });

    markersRef.current.push(marker);

    
    if (poiData[label]) {           // Add POIs
      poiData[label].forEach((poi) => {
        const popupHtml = `
          <div class="poi-popup">
            <div class="poi-popup-title">${poi.label}</div>
            <img src="${poi.image}" alt="${poi.label}" />
            <div class="poi-popup-section"><strong>History:</strong><br/>${poi.description.history}</div>
            <div class="poi-popup-section"><strong>Culture:</strong><br/>${poi.description.culture}</div>
            <div class="poi-popup-section"><strong>Influential People:</strong><br/>${poi.description.influentialPeople}</div>
            <div class="poi-popup-section"><strong>Travel Tips:</strong><br/>${poi.description.travelTips}</div>
          </div>
        `;

        const poiMarker = L.marker([poi.lat, poi.lng], { icon: magnifyingGlassIcon })
          .addTo(mapRef.current)
          .bindPopup(popupHtml, {
            autoPan: true,
            autoPanPadding: [80, 80],
          });

        
        poiMarker.on("click", () => {
          setTimeout(() => {
            const latLng = poiMarker.getLatLng();
            const map = mapRef.current;

            
            const offsetLatLng = L.latLng(latLng.lat + 0.0008, latLng.lng);
            map.panTo(offsetLatLng, { animate: true });

            poiMarker.openPopup();
          }, 50);
        });

        poiMarkersRef.current.push(poiMarker);
      });
    }


    mapRef.current.setView(currentCoords, 16, { animate: true });

  }, [cueData, cueTimes, onMapClick]);

  return <div id="map" className="map-container" />;
};

export default MapComponent;
