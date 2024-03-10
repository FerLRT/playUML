import React from "react";

import "../styles/statButton.css";

export function StatButton({ image_src, stat, value, openModal }) {
  return (
    <button className="stat-button" onClick={openModal}>
      <div className="stat-button-avatar-container">
        <img className="stat-button-avatar" src={image_src} alt="Imagen" />
      </div>
      <div className="stat-button-text">
        <h1>{value}</h1>
        <p>{stat}</p>
      </div>
    </button>
  );
}
