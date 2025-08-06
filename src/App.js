import React, { useState, useRef } from "react";
import VideoPlayer from "./components/VideoPlayer";
import InfoSection from "./components/InfoSection";
import MapComponent from "./components/MapComponent";
import LocationMarkers from "./components/LocationMarkers";
import Tooltip from "./components/Tooltip";
import "./styles/global.css";

function App() {
  const [cueData, setCueData] = useState(null);
  const [activeLabel, setActiveLabel] = useState("");
  const [allLocations, setAllLocations] = useState([]);
  const [cueTimes, setCueTimes] = useState({});
  const [cueTypes, setCueTypes] = useState({});
  const [tutorialActive, setTutorialActive] = useState(false);

  const [visibleTooltips, setVisibleTooltips] = useState({
    video: true,
    info: true,
    map: true,
    markers: true,
  });

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

  // Close individual tooltip
  const closeTooltip = (key) => {
    setVisibleTooltips((prev) => ({ ...prev, [key]: false }));
  };

  // When toggling tutorial, reset all tooltips to visible
  const toggleTutorial = () => {
    const newActive = !tutorialActive;
    setTutorialActive(newActive);
    if (newActive) {
      setVisibleTooltips({
        video: true,
        info: true,
        map: true,
        markers: true,
      });
    }
  };

  return (
    <div
      className="layout-container"
      style={{
        filter: tutorialActive ? "grayscale(100%)" : "none",
        position: "relative",
        minHeight: "100vh",
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Tutorial toggle button */}
      <button
        onClick={toggleTutorial}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 10000,
          padding: "40px 60px",
          background: tutorialActive ? "#555" : "#0077cc",
          color: "white",
          border: "none",
          borderRadius: 20,
          cursor: "pointer",
          fontSize: 32,
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
        {tutorialActive && visibleTooltips.video && (
          <Tooltip
            text="This is the video player where you will be watching the video."
            position={{ top: 350, left: 320 }}
            
            onClose={() => closeTooltip("video")}
          />
        )}
      </div>

      {/* Info Section */}
      <div className="layout-info" style={{ position: "relative" }}>
        <InfoSection activeLabel={activeLabel} cueType={cueData?.type} />
        {tutorialActive && visibleTooltips.info && (
          <Tooltip
            text="This section shows detailed information about the featured locations, people and more. Tap the panel to display information related to each label."
            position={{ bottom: 1100, right: 180 }}
            
            onClose={() => closeTooltip("info")}
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
          {tutorialActive && visibleTooltips.map && (
            <Tooltip
              text="Map showing locations related to the video. Single tap a marker to show an image, double tap to seek the video. Magnifying glass represents point of interest close to the location, tap to find details."
              position={{ bottom: 400, left: 110 }}
             
              onClose={() => closeTooltip("map")}
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
          {tutorialActive && visibleTooltips.markers && (
            <Tooltip
              text="Interactive labels representing locations. Tap a label to jump to that point in the video."
              position={{ bottom: 500, right: 150 }}
              
              arrowDirection="up"
              onClose={() => closeTooltip("markers")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
