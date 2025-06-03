import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const TravelVideoMap = () => {
  const videoRef = useRef(null);
  const mapRef = useRef(null);
  const [wikiContent, setWikiContent] = useState("Click play to begin...");

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([28.6, 83.8], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const track = video.textTracks[0];
    track.mode = "hidden";

    track.addEventListener("cuechange", () => {
      const cue = track.activeCues[0];
      if (cue) {
        const data = JSON.parse(cue.text);
        const { lat, lng, label, type } = data;

        if (type === "location") {
          const customIcon = L.icon({
            iconUrl: markerIcon,
            shadowUrl: markerShadow,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          });

          const marker = L.marker([lat, lng], { icon: customIcon })
            .addTo(mapRef.current)
            .bindPopup(label)
            .openPopup();

          const timestamp = cue.startTime;
          marker.on("click", () => {
            video.currentTime = timestamp;
            video.play();
          });
        }

        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(label)}`)
          .then(res => res.json())
          .then(data => {
            setWikiContent(
              `<h3>${data.title}</h3><p>${data.extract}</p><a href="${data.content_urls.desktop.page}" target="_blank">Read more</a>`
            );
          })
          .catch(() => {
            setWikiContent(`<p>Could not load Wikipedia content for ${label}.</p>`);
          });
      }
    });
  }, []);

  return (
    <div style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      <div style={{ flex: 1 }}>
        <video ref={videoRef} width="100%" controls>
          <source src="/The_Living_Planet_Himalayas.mp4" type="video/mp4" />
          <track kind="metadata" src="/himalayas.vtt" default />
        </video>
        <div id="map" style={{ height: "400px", marginTop: "1rem" }}></div>
      </div>
      <div
        style={{
          flex: 1,
          border: "1px solid #ccc",
          padding: "1rem",
          overflowY: "auto",
          height: "500px",
        }}
        dangerouslySetInnerHTML={{ __html: wikiContent }}
      />
    </div>
  );
};

export default TravelVideoMap;
