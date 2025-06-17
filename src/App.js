import React, { useState, useRef } from "react";
import VideoPlayer from "./components/VideoPlayer";
import InfoSection from "./components/InfoSection";
import MapComponent from "./components/MapComponent";
import LocationMarkers from "./components/LocationMarkers";
import "./styles/global.css";

function App() {
  const [cueData, setCueData] = useState(null);
  const [activeLabel, setActiveLabel] = useState("");
  const [allLocations, setAllLocations] = useState([]);
  const [cueTimes, setCueTimes] = useState({});
  const [cueTypes, setCueTypes] = useState({});

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
      videoRef.current.play(); // optional
    }
  };

  return (
    <div className="layout-container">
      <div className="layout-video">
        <VideoPlayer
          onCueChange={handleCueUpdate}
          onLoadLocations={handleLoadLocations}
          videoRef={videoRef}
        />
      </div>

      <div className="layout-info">
        <InfoSection activeLabel={activeLabel} cueType={cueData?.type} />

      </div>

      <div className="layout-bottom">
        <div className="map-box">
          <MapComponent
            cueData={cueData}
            cueTimes={cueTimes}
            onMapClick={handleLabelClick}
          />
        </div>
        <div className="markers-box">
          <LocationMarkers
            activeLabel={activeLabel}
            locations={allLocations}
            cueTypes={cueTypes}
            onLabelClick={handleLabelClick}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
