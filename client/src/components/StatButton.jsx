import React from "react";

import "../styles/statButton.css";

export function StatButton({ imageComponent, stat, value, openModal }) {
  return (
    <button className="stat-button" onClick={openModal}>
      <div className="stat-button-avatar-container">{imageComponent}</div>
      <div className="stat-button-text">
        <h1>{value}</h1>
        <p>{stat}</p>
      </div>
    </button>
  );
}
