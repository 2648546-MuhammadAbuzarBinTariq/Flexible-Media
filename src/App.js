import React, { useState } from "react";
import VideoPlayer from "./components/VideoPlayer";
import MapComponent from "./components/MapComponent";
import InfoSection from "./components/InfoSection";
import LocationMarkers from "./components/LocationMarkers";
import "./styles/global.css";

function App() {
  const [cueData, setCueData] = useState(null);     // Current cue
  const [currentLocation, setCurrentLocation] = useState(""); // Active location label

  // Handler passed to VideoPlayer: triggered on cue change
  const handleCueUpdate = (data, startTime) => {
    setCueData(data);
    if (data.type === "location") {
      setCurrentLocation(data.label); // Highlight right-side marker
    }
    // In a real build, you'd update InfoSection content here too
  };

  return (
    <div className="app-container">
      <h1 className="app-title">The Living Planet – Interactive Himalayas Map</h1>

      <div className="video-map-wrapper">
        {/* Video player with cue listener */}
        <VideoPlayer onCueChange={handleCueUpdate} />
        {/* Embedded map that updates as video plays */}
        <MapComponent cueData={cueData} />
      </div>

      {/* Marker panel showing active locations */}
      <LocationMarkers activeLabel={currentLocation} />

      {/* Info panel with multiple sections */}
      <InfoSection
        content={{
          history: <p>The Himalayas formed over 50 million years ago as India collided with Asia...</p>,
          wildlife: <p>This region is home to rare species like snow leopards and red pandas...</p>,
          culture: <p>Rich cultural heritage includes Tibetan Buddhism and sacred mountain shrines...</p>,
          travel: <p>Best months to visit are March–May and September–November. Pack layers!</p>
        }}
      />
    </div>
  );
}

export default App;
