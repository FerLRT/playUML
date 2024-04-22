import React from "react";

export function SolarUserBold(props) {
  return (
    <div
      style={{
        width: "40px",
        minWidth: "40px",
        aspectRatio: "1 / 1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
        <circle cx="12" cy="6" r="5" fill="currentColor" />
        <path
          fill="currentColor"
          d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5"
        />
      </svg>
    </div>
  );
}
