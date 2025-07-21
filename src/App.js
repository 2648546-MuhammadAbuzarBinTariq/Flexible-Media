import React, { useState, useRef } from "react";
import VideoPlayer from "./components/VideoPlayer";
import InfoSection from "./components/InfoSection";
import MapComponent from "./components/MapComponent";
import LocationMarkers from "./components/LocationMarkers";
import "./styles/global.css";

// Tooltip component with interactive tap-to-dismiss
function Tooltip({
  text,
  position,
  bgColor = "#f0f4ff",
  borderColor = "#a3b0ff",
  arrowDirection = "down", // new prop to control arrow direction
}) {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  const style = {
    position: "absolute",
    maxWidth: 480,
    padding: "40px 50px",
    background: bgColor,
    color: "#1a1a1a",
    borderRadius: "32px",
    boxShadow:
      "0 12px 36px rgba(0,0,50,0.2), inset 0 0 20px rgba(255,255,255,0.8)",
    fontSize: 36,
    lineHeight: 1.5,
    zIndex: 9999,
    ...position,
    cursor: "pointer",
    userSelect: "none",
    touchAction: "manipulation",
    fontWeight: 700,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    border: `3px solid ${borderColor}`,
    transition: "transform 0.3s ease",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: 18,
    right: 26,
    fontWeight: "bold",
    fontSize: 44,
    lineHeight: 1,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: borderColor,
    padding: 0,
    margin: 0,
    userSelect: "none",
    transition: "color 0.3s ease",
  };

  const handleCloseHover = (e, isHover) => {
    e.currentTarget.style.color = isHover ? "#161a55" : borderColor;
  };

  return (
    <div
      style={style}
      onClick={() => setVisible(false)}
      role="button"
      tabIndex={0}
      aria-label="Dismiss tooltip"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setVisible(false);
      }}
    >
      {text}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setVisible(false);
        }}
        style={closeButtonStyle}
        aria-label="Close tooltip"
        onMouseEnter={(e) => handleCloseHover(e, true)}
        onMouseLeave={(e) => handleCloseHover(e, false)}
      >
        ×
      </button>
      <style>
        {arrowDirection === "down"
          ? `
          div::after {
            content: "";
            position: absolute;
            bottom: -34px;
            left: 56px;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 34px 34px 0 34px;
            border-color: ${bgColor} transparent transparent transparent;
            filter: drop-shadow(0 4px 6px rgba(0,0,50,0.15));
            transition: border-color 0.3s ease;
          }
          div:hover::after {
            border-color: ${borderColor} transparent transparent transparent;
          }
        `
          : `
          div::after {
            content: "";
            position: absolute;
            top: -34px;
            left: 56px;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 34px 34px 34px;
            border-color: transparent transparent ${bgColor} transparent;
            filter: drop-shadow(0 -4px 6px rgba(0,0,50,0.15));
            transition: border-color 0.3s ease;
          }
          div:hover::after {
            border-color: transparent transparent ${borderColor} transparent;
          }
        `}
      </style>
    </div>
  );
}

function App() {
  const [cueData, setCueData] = useState(null);
  const [activeLabel, setActiveLabel] = useState("");
  const [allLocations, setAllLocations] = useState([]);
  const [cueTimes, setCueTimes] = useState({});
  const [cueTypes, setCueTypes] = useState({});

  // Tutorial mode on/off
  const [tutorialActive, setTutorialActive] = useState(false);

  const videoRef = useRef(null);

  const handleCueUpdate = (data) => {
    setCueData(data);
    if (data.label) {
      setActiveLabel(data.label);
    }
  };

  const handleLoadLocations = (labels, cueMeta) => {
    setAllLocations(labels);

    const timeMap = {};
    const typeMap = {};

    cueMeta.forEach(({ label, start, type }) => {
      if (start !== undefined) timeMap[label] = start;
      if (type) typeMap[label] = type;
    });

    setCueTimes(timeMap);
    setCueTypes(typeMap);
  };

  const handleLabelClick = (label) => {
    if (cueTimes[label] !== undefined && videoRef.current) {
      videoRef.current.currentTime = cueTimes[label];
      videoRef.current.play();
    }
  };

  return (
    <div
      className="layout-container"
      style={{
        filter: tutorialActive ? "grayscale(100%)" : "none",
        position: "relative",
        minHeight: "100vh",  backgroundImage: "url('/background.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
      }}
    >
      {/* Tutorial toggle button */}
      <button
        onClick={() => setTutorialActive(!tutorialActive)}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 10000,
          padding: "40px 60px", // Increased padding
          background: tutorialActive ? "#555" : "#0077cc",
          color: "white",
          border: "none",
          borderRadius: 20, // Slightly bigger border radius
          cursor: "pointer",
          fontSize: 32, // Larger font size
          userSelect: "none",
          boxShadow: "0 5px 12px rgba(0,0,0,0.4)",
          fontWeight: "700",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          transition: "background-color 0.3s ease",
        }}
        aria-pressed={tutorialActive}
        aria-label={tutorialActive ? "Hide tooltips" : "Show tooltips"}
      >
        {tutorialActive ? "Hide Tooltips" : "Show Tooltips"}
      </button>

      {/* Video Player Section */}
      <div className="layout-video" style={{ position: "relative" }}>
        <VideoPlayer
          onCueChange={handleCueUpdate}
          onLoadLocations={handleLoadLocations}
          videoRef={videoRef}
        />
        {tutorialActive && (
          <Tooltip
            text="This is the video player where you will be watching the video."
            position={{ top: 350, left: 320 }}
            bgColor="#fff3e0"
            borderColor="#ffa726"
          />
        )}
      </div>

      {/* Info Section */}
      <div className="layout-info" style={{ position: "relative" }}>
        <InfoSection activeLabel={activeLabel} cueType={cueData?.type} />
        {tutorialActive && (
          <Tooltip
            text="This section shows detailed information about the featured locations, people and more. Tap the panel to display information related to each label."
            position={{ bottom: 10, right: 180 }}
            bgColor="#e3f2fd"
            borderColor="#42a5f5"
          />
        )}
      </div>

      {/* Bottom Section */}
      <div className="layout-bottom" style={{ position: "relative" }}>
        <div className="map-box" style={{ position: "relative" }}>
          <MapComponent
            cueData={cueData}
            cueTimes={cueTimes}
            onMapClick={handleLabelClick}
          />
          {tutorialActive && (
            <Tooltip
              text="Map showing locations related to the video. Single tap a marker to show an image, double tap to seek the video."
              position={{ bottom: 800, left: 110 }}
              bgColor="#e8f5e9"
              borderColor="#66bb6a"
            />
          )}
        </div>
        <div className="markers-box" style={{ position: "relative" }}>
          <LocationMarkers
            activeLabel={activeLabel}
            locations={allLocations}
            cueTypes={cueTypes}
            onLabelClick={handleLabelClick}
          />
          {tutorialActive && (
            <Tooltip
              text="Interactive labels representing locations. Tap a label to jump to that point in the video."
              position={{ bottom: 900, right: 20 }}
              bgColor="#f3e5f5"
              borderColor="#ab47bc"
              arrowDirection="up"  // Arrow facing up here
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
