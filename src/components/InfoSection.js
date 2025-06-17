import React, { useState } from "react";
import "../../styles/info.css";

const InfoSection = ({ content }) => {
  const [activeTab, setActiveTab] = useState("history");

  return (
    <div className="info-container">
      <div className="info-buttons">
        <button onClick={() => setActiveTab("history")}>History</button>
        <button onClick={() => setActiveTab("wildlife")}>Wildlife</button>
        <button onClick={() => setActiveTab("culture")}>Culture</button>
        <button onClick={() => setActiveTab("travel")}>Travel Tips</button>
      </div>

      <div className="info-panels">
        <div className={`panel ${activeTab === "history" ? "active" : ""}`}>
          {content.history}
        </div>
        <div className={`panel ${activeTab === "wildlife" ? "active" : ""}`}>
          {content.wildlife}
        </div>
        <div className={`panel ${activeTab === "culture" ? "active" : ""}`}>
          {content.culture}
        </div>
        <div className={`panel ${activeTab === "travel" ? "active" : ""}`}>
          {content.travel}
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
