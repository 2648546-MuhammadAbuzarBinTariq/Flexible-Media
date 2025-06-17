import React from "react";
import "../styles/locationMarkers.css";

const LocationMarkers = ({ activeLabel, locations, onLabelClick }) => {
  return (
    <div className="location-marker-panel">
      {locations.map((label) => (
        <div
          key={label}
          className={`location-marker ${
            label === activeLabel ? "active" : "inactive"
          }`}
          onClick={() => onLabelClick(label)}
          style={{ cursor: "pointer" }}
        >
          <div className="marker-dot" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};

export default LocationMarkers;
