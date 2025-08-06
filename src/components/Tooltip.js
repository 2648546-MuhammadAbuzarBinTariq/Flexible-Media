import React, { useState } from "react";
import ReactDOM from "react-dom";

function Tooltip({ text, position, bgColor = "#fff3e0", borderColor = "#ffa726", arrowDirection = "up", onClose }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const style = {
    position: "absolute",
    maxWidth: 480,
    padding: "40px 50px",
    background: bgColor,
    color: "#1a1a1a",
    borderRadius: "32px",
    boxShadow: "0 12px 36px rgba(0,0,50,0.2), inset 0 0 20px rgba(255,255,255,0.8)",
    fontSize: 36,
    lineHeight: 1.5,
    zIndex: 9999,
    ...position,
    cursor: "pointer",
    userSelect: "none",
    touchAction: "manipulation",
    fontWeight: 700,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    border: `3px solid ${borderColor}`,
    transition: "transform 0.3s ease",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: 18,
    right: 26,
    fontWeight: "bold",
    fontSize: 44,
    lineHeight: 1,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: borderColor,
    padding: 0,
    margin: 0,
    userSelect: "none",
    transition: "color 0.3s ease",
  };

  const handleCloseHover = (e, isHover) => {
    e.currentTarget.style.color = isHover ? "#161a55" : borderColor;
  };

  const tooltipContent = (
    <div
      style={style}
      onClick={() => {
        setVisible(false);
        if (onClose) onClose();
      }}
      role="button"
      tabIndex={0}
      aria-label="Dismiss tooltip"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setVisible(false);
          if (onClose) onClose();
        }
      }}
    >
      {text}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setVisible(false);
          if (onClose) onClose();
        }}
        style={closeButtonStyle}
        aria-label="Close tooltip"
        onMouseEnter={(e) => handleCloseHover(e, true)}
        onMouseLeave={(e) => handleCloseHover(e, false)}
      >
        ×
      </button>
      <style>
        {arrowDirection === "up"
          ? `
          div::after {
            content: "";
            position: absolute;
            top: -34px;
            right: 20px;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 17px 34px 17px;
            border-color: transparent transparent ${bgColor} transparent;
            filter: drop-shadow(0 -4px 6px rgba(0,0,50,0.15));
            transition: border-color 0.3s ease;
          }
          div:hover::after {
            border-color: transparent transparent ${borderColor} transparent;
          }
        `
          : `
          div::after {
            content: "";
            position: absolute;
            bottom: -34px;
            left: 56px;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 34px 34px 0 34px;
            border-color: ${bgColor} transparent transparent transparent;
            filter: drop-shadow(0 4px 6px rgba(0,0,50,0.15));
            transition: border-color 0.3s ease;
          }
          div:hover::after {
            border-color: ${borderColor} transparent transparent transparent;
          }
        `}
      </style>
    </div>
  );

  const tooltipRoot = document.getElementById("tooltip-root");
  return ReactDOM.createPortal(tooltipContent, tooltipRoot);
}

export default Tooltip;
