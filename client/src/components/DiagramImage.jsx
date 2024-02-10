import React, { useEffect } from "react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";

import { DiagramModal } from "./DiagramModal";

import "../styles/diagramImage.css";

export function DiagramImage({ image }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const imageData = image.startsWith("data:image/jpeg;base64,")
    ? image
    : `data:image/jpeg;base64,${image}`;

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    return (
      <>
        <button onClick={() => zoomIn()}>Zoom In</button>
        <button onClick={() => zoomOut()}>Zoom Out</button>
        <button onClick={() => resetTransform()}>Reset</button>
        <button onClick={handleOpen}>Open</button>
      </>
    );
  };

  return (
    <div className="diagram-image">
      <TransformWrapper
        maxScale={3}
        smooth="true"
        pinch={{ step: 10 }}
        className="custom-transform-wrapper"
      >
        <div className="diagram-image-controls">
          <Controls />
        </div>
        <TransformComponent>
          <img src={imageData} alt="Diagrama UML" width="100%" />
        </TransformComponent>
      </TransformWrapper>

      <DiagramModal open={open} handleClose={handleClose} image={imageData} />
    </div>
  );
}
