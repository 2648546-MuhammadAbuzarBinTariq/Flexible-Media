import React from "react";
import "../../styles/locationMarkers.css";

const LOCATIONS = [
  "Annapurna",
  "Manaslu",
  "Sagarmatha",
  "Kanchenjunga",
  "Zanskar Valley",
];

const LocationMarkers = ({ activeLabel }) => {
  return (
    <div className="location-marker-panel">
      {LOCATIONS.map((label) => (
        <div
          key={label}
          className={`location-marker ${activeLabel === label ? "active" : "inactive"}`}
          data-label={label}
        >
          <div className="marker-dot" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};

export default LocationMarkers;
