import React from "react";
import Modal from "@mui/material/Modal";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";

import { MaterialSymbolsZoomInRounded } from "../assets/icons/ZoomIn";
import { MaterialSymbolsZoomOut } from "../assets/icons/ZoomOut";

import { arrayBufferToUrl } from "../utils/arrayBufferToUrl";

import "../styles/diagramModal.css";

export function DiagramModal({ open, handleClose, image }) {
  const Controls = () => {
    const { zoomIn, zoomOut } = useControls();
    return (
      <>
        <div className="diagram-modal-image-controls-zoom">
          <div onClick={() => zoomIn()}>
            <MaterialSymbolsZoomInRounded />
          </div>
          <div
            className="diagram-modal-image-controls-zoom-out"
            onClick={() => zoomOut()}
          >
            <MaterialSymbolsZoomOut />
          </div>
        </div>
        <div
          className="diagram-modal-image-controls-close"
          onClick={handleClose}
        >
          &times;
        </div>
      </>
    );
  };

  return (
    <div className="diagram-modal-container">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="diagram-modal-image-container">
          <TransformWrapper
            maxScale={3}
            minScale={0.3}
            smooth="true"
            pinch={{ step: 10 }}
            className="diagram-modal-custom-transform-wrapper"
          >
            <div className="diagram-image-controls">
              <Controls />
            </div>
            <TransformComponent>
              <img
                className="diagram-modal-image"
                src={arrayBufferToUrl(image)}
                alt="Diagrama UML"
                width="auto"
                height="auto"
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
      </Modal>
    </div>
  );
}

function Controls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="diagram-modal-controls">
      <button onClick={() => zoomIn()}>Zoom In</button>
      <button onClick={() => zoomOut()}>Zoom Out</button>
      <button onClick={() => resetTransform()}>Reset</button>
    </div>
  );
}
