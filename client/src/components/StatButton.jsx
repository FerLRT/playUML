import React from "react";

import "../styles/statButton.css";

export function StatButton({
  imageComponent,
  stat,
  value,
  openModal,
  cursorPointer,
}) {
  return (
    <button
      className={`stat-button ${
        cursorPointer ? "cursor-pointer" : "cursor-default"
      }`}
      onClick={openModal}
    >
      <div className="stat-button-avatar-container">{imageComponent}</div>
      <div className="stat-button-text">
        <h1>{value}</h1>
        <p>{stat}</p>
      </div>
    </button>
  );
}
