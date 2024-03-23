import React, { useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";

import { DiagramModal } from "./DiagramModal";

import "../styles/diagramImage.css";

export function DiagramImage({ image }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleContainerClick = (event) => {
    event.stopPropagation(); // Evitar la propagación del evento al botón encapsulante
  };

  const Controls = () => {
    const { zoomIn, zoomOut } = useControls();

    const handleZoomIn = (event) => {
      event.stopPropagation(); // Evitar la propagación del evento al contenedor principal
      zoomIn();
    };

    const handleZoomOut = (event) => {
      event.stopPropagation(); // Evitar la propagación del evento al contenedor principal
      zoomOut();
    };

    return (
      <>
        <div className="diagram-image-controls-zoom">
          <div onClick={handleZoomIn}>
            <img src="/src/assets/ZoomIn.png" alt="Ampliar" />
          </div>
          <div
            className="diagram-image-controls-zoom-out"
            onClick={handleZoomOut}
          >
            <img src="/src/assets/ZoomOut.png" alt="Reducir" />
          </div>
        </div>
        <div onClick={handleOpen}>
          <img src="/src/assets/OpenImage.png" alt="Abrir" />
        </div>
      </>
    );
  };

  return (
    <div className="diagram-image" onClick={handleContainerClick}>
      <TransformWrapper
        maxScale={3}
        minScale={0.3}
        smooth="true"
        pinch={{ step: 10 }}
        doubleClick={{ disabled: true }}
        className="custom-transform-wrapper"
      >
        <div className="diagram-image-controls">
          <Controls />
        </div>
        <TransformComponent>
          <img src={image} alt="Diagrama UML" width="100%" />
        </TransformComponent>
      </TransformWrapper>

      <DiagramModal open={open} handleClose={handleClose} image={image} />
    </div>
  );
}
