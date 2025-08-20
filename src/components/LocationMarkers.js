import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../styles/locationMarkers.css";

const normalizeLabel = (str) => str.trim().normalize();

const LocationMarkers = ({ activeLabel, locations, cueTypes, onLabelClick }) => {
  const [qrSize, setQrSize] = useState(getQRSize());

  useEffect(() => {
    const handleResize = () => setQrSize(getQRSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function getQRSize() {
    const width = window.innerWidth;
    if (width < 480) return 128;
    if (width < 768) return 192;
    return 256;
  }

  return (
    <div className="location-marker-panel">
      {/* Scrollable marker list */}
      <div className="marker-scroll-section">
        {locations.map((label) => {
          const type = cueTypes[label];
          const isActive = normalizeLabel(label) === normalizeLabel(activeLabel);

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

      {/* QR code*/}
      <div className="qr-code-box">
        <QRCodeCanvas
          value="https://flexiblefeedback.web.app"
          size={qrSize}
          level="H"
        />
        <div className="qr-label">Scan to provide feedback</div>
      </div>
    </div>
  );
};

export default LocationMarkers;
