import React from "react";
import "../styles/locationMarkers.css";

const LocationMarkers = ({ activeLabel, locations, cueTypes, onLabelClick }) => {
  return (
    <div className="location-marker-panel">
      {locations.map((label) => {
        const type = cueTypes[label];
        const isActive = label === activeLabel;

        return (
          <div
            key={label}
            className={`location-marker ${type} ${isActive ? "active" : "inactive"}`}
            onClick={() => onLabelClick(label)}
            style={{ cursor: type === "location" ? "pointer" : "default" }}
          >
            <div className="marker-dot" />
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default LocationMarkers;
