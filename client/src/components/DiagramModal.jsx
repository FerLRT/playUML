import React from "react";
import Modal from "@mui/material/Modal";

import "../styles/diagramModal.css";

export function DiagramModal({ open, handleClose, image }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="diagram-modal-image-container">
        <img src={image} alt="Diagrama UML" width="auto" height="auto" />
      </div>
    </Modal>
  );
}
