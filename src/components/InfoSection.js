import React, { useEffect, useState } from "react";
import "../styles/info.css";

const subsections = {
  History: "history",
  Wildlife: "wildlife",
  Culture: "culture",
  Travel: "tourism",
};

const InfoSection = ({ activeLabel }) => {
  const [visiblePanels, setVisiblePanels] = useState({
    History: true,
    Wildlife: true,
    Culture: true,
    Travel: true,
  });

  const [wikiContent, setWikiContent] = useState({
    History: "",
    Wildlife: "",
    Culture: "",
    Travel: "",
  });

  const togglePanel = (section) => {
    setVisiblePanels((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    if (!activeLabel) return;

    const fetchSummaries = async () => {
      const updates = {};

      await Promise.all(
        Object.entries(subsections).map(async ([section, suffix]) => {
          const query = `${activeLabel} ${suffix}`;
          const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            query
          )}`;

          try {
            const res = await fetch(url);
            const data = await res.json();
            updates[section] = data.extract || "No summary available.";
          } catch {
            updates[section] = "Failed to load content.";
          }
        })
      );

      setWikiContent(updates);
    };

    fetchSummaries();
  }, [activeLabel]);

  return (
    <div className="info-container">
      <div className="info-buttons">
        {Object.keys(subsections).map((section) => (
          <button key={section} onClick={() => togglePanel(section)}>
            {visiblePanels[section] ? `Hide ${section}` : `Show ${section}`}
          </button>
        ))}
      </div>

      <div className="info-panels">
        {Object.keys(subsections).map(
          (section) =>
            visiblePanels[section] && (
              <div className="panel" key={section}>
                <h3>{section}</h3>
                <p>{wikiContent[section]}</p>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default InfoSection;
