import React, { useEffect, useState, useRef } from "react";
import "../styles/info.css";

const subsections = {
  History: "history",
  People: "biography",
  Culture: "culture",
  Travel: "tourism",
};

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
    History: ";)",
    People: ";)",
    Culture: ";)",
    Travel: ";)",
  });

  const lastLocationContent = useRef({
    History: "No summary available.",
    Culture: "No summary available.",
    Travel: "No summary available.",
  });

  const togglePanel = (section) => {
    setVisiblePanels((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const fetchSummary = async (label, suffix) => {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      `${label} ${suffix}`
    )}&format=json&origin=*`;

    try {
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      const topTitle = searchData?.query?.search?.[0]?.title;
      if (!topTitle) return "No summary available.";

      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        topTitle
      )}`;
      const summaryRes = await fetch(summaryUrl);
      const summaryData = await summaryRes.json();

      return summaryData?.extract || "No summary available.";
    } catch {
      return "No summary available.";
    }
  };

  useEffect(() => {
    if (!activeLabel) return;

    const loadWikiData = async () => {
      const updates = { ...wikiContent };

      await Promise.all(
        Object.entries(subsections).map(async ([section, suffix]) => {
          const isCultureOrTravel = section === "Culture" || section === "Travel";
          const isPersonCue = cueType === "person";
          const isLocationCue = cueType === "location";

          if (isCultureOrTravel) {
            const custom = customContent[activeLabel]?.[section];
            if (isLocationCue && custom) {
              updates[section] = custom;
              lastLocationContent.current[section] = custom;
            } else {
              updates[section] =
                isPersonCue && lastLocationContent.current[section]
                  ? lastLocationContent.current[section]
                  : "No summary available.";
            }
            return;
          }

          if (section === "People" && isPersonCue) {
            const summary = await fetchSummary(activeLabel, suffix);
            updates[section] = summary;
            return;
          }

          if (section === "History" && isLocationCue) {
            const summary = await fetchSummary(activeLabel, suffix);
            updates[section] = summary;
            lastLocationContent.current[section] = summary;
            return;
          }

          updates[section] = wikiContent[section];
        })
      );

      setWikiContent(updates);
    };

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
        {Object.keys(subsections).map((section) => (
        <div
          key={section}
          className={`panel ${visiblePanels[section] ? "active" : ""}`}
        >
          <h3>{section}</h3>
          <p>{wikiContent[section]}</p>
        </div>
      ))}

      </div>
    </div>
  );
};

export default InfoSection;
