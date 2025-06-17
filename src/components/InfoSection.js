import React, { useEffect, useState } from "react";
import "../styles/info.css";

// Define Wikipedia suffixes
const subsections = {
  History: "history",
  People: "biography",
  Culture: "culture",
  Travel: "tourism",
};

// Custom campus-specific content for certain sections
const customContent = {
  "University of Dundee College Hall": {
    Travel:
      "College Hall is within walking distance of the Dalhousie Building and campus cafes. A perfect photo stop with student-friendly picnic space just outside.",
    Culture:
      "Home to decades of student debates, ceilidh dances, and whispered myths about a wandering cat spirit. Keep an ear out.",
  },
  "University of Dundee Museum": {
    Travel:
      "Admission is free and the east wing hosts rotating exhibitions. Tuesdays are usually quiet—ideal for reflective browsing.",
    Culture:
      "A creative hub for the Dundee School of Art. Grab a sketchpad and mingle during occasional live folk performances.",
  },
  "University of Dundee": {
    Travel:
      "Start your walk outside the main entrance on Perth Road. Local buses and bike stations are nearby.",
    Culture:
      "This campus has inspired generations, from medical breakthroughs to Dundee’s creative industries.",
  },
};

const InfoSection = ({ activeLabel, cueType }) => {
  const [visiblePanels, setVisiblePanels] = useState({
    History: true,
    People: true,
    Culture: true,
    Travel: true,
  });

  const [wikiContent, setWikiContent] = useState({
    History: "Start video",
    People: "Start video",
    Culture: "Start video",
    Travel: "Start video",
  });

  const togglePanel = (section) => {
    setVisiblePanels((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    if (!activeLabel) return;

    const fetchSummary = async (label, suffix) => {
      const searchTerms = [
        `${label} ${suffix}`,
        label,
      ];

      for (const term of searchTerms) {
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;
        try {
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data.extract) return data.extract;
          }
        } catch {
          // Fail silently
        }
      }

      return "No summary available.";
    };

    const loadWikiData = async () => {
      const updates = {};

      await Promise.all(
        Object.entries(subsections).map(async ([section, suffix]) => {
          const isLocationCue = cueType === "location";
          const isPersonCue = cueType === "person";

          const custom = customContent[activeLabel]?.[section];

          if (section === "Culture" || section === "Travel") {
            updates[section] = custom || "-";
          } else if (
            (isLocationCue && section !== "People") ||
            (isPersonCue && section === "People")
          ) {
            const summary = await fetchSummary(activeLabel, suffix);
            updates[section] = summary;
          } else {
            updates[section] = "-";
          }
        })
      );

      setWikiContent(updates);
    };

    // Reset while loading
    setWikiContent({
      History: "Loading...",
      People: "Loading...",
      Culture: "Loading...",
      Travel: "Loading...",
    });

    loadWikiData();
  }, [activeLabel, cueType]);

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
