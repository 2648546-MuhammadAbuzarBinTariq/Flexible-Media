import React, { useRef, useEffect } from "react";

const VideoPlayer = ({ onCueChange }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const track = video.textTracks[0]; // assuming 1st track is metadata
    track.mode = "hidden";

    const handleCueChange = () => {
      const cue = track.activeCues[0];
      if (cue) {
        try {
          const data = JSON.parse(cue.text);
          onCueChange && onCueChange(data, cue.startTime);
        } catch (err) {
          console.warn("Failed to parse cue data", err);
        }
      }
    };

    track.addEventListener("cuechange", handleCueChange);

    return () => {
      track.removeEventListener("cuechange", handleCueChange);
    };
  }, [onCueChange]);

  return (
    <div className="video-container">
      <video ref={videoRef} width="100%" controls>
        <source src="/The_Living_Planet_Himalayas.mp4" type="video/mp4" />
        <track kind="metadata" src="/himalayas.vtt" default />
      </video>
    </div>
  );
};

export default VideoPlayer;
