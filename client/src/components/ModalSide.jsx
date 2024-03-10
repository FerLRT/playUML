import React from "react";

import "../styles/modalSide.css";

export function ModalSide({ isModalVisible, closeModal, children }) {
  return (
    <>
      <div className={`modal ${isModalVisible ? "modal-visible" : ""}`}>
        <div className="modal-content">
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          {children}
        </div>
      </div>

      <div
        className={`modal-background ${
          isModalVisible ? "background-visible" : ""
        }`}
        onClick={closeModal}
      />
    </>
  );
}
