import "../styles/video.css";
import React, { useEffect } from "react";

const VideoPlayer = ({ onCueChange, onLoadLocations, videoRef }) => {         //Handle video playback and metadata cue tracking
  useEffect(() => {
    const video = videoRef.current;
    const track = video.textTracks[0];
    track.mode = "hidden";

    const handleCueChange = () => {         //Monitor active cue
      const cue = track.activeCues[0];
      if (cue) {
        try {
          const data = JSON.parse(cue.text);
          onCueChange && onCueChange(data);
        } catch (err) {
          console.warn("Failed to parse cue", err);
        }
      }
    };

    const handleLoadedData = () => {          //Extract location labels and timing from all cues
      const labels = new Set();
      const cueMeta = [];

      for (const cue of track.cues) {
        try {
          const data = JSON.parse(cue.text);
          if (data.type === "location") {
            labels.add(data.label);
            cueMeta.push({ label: data.label, start: cue.startTime });
          }
        } catch {}
      }

      onLoadLocations && onLoadLocations([...labels], cueMeta);
    };

    track.addEventListener("cuechange", handleCueChange);         //Handle cue changes
    video.addEventListener("loadeddata", handleLoadedData);

    return () => {
      track.removeEventListener("cuechange", handleCueChange);
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [onCueChange, onLoadLocations, videoRef]);

  return (          //Render Video element
    <div className="video-container">         
      <video ref={videoRef} width="100%" controls>
        <source
          src="/UOD.mp4"
          type="video/mp4"
        />
        <track kind="metadata" src="/dundee_campus.vtt" default />
      </video>
    </div>
  );
};

export default VideoPlayer;