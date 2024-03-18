import React from "react";
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
    const { zoomIn, zoomOut } = useControls();

    const handleZoomIn = (event) => {
      event.stopPropagation(); // Evita que el evento se propague al contenedor padre
      zoomIn();
    };

    const handleZoomOut = (event) => {
      event.stopPropagation(); // Evita que el evento se propague al contenedor padre
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
    <div className="diagram-image">
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
          <img src={imageData} alt="Diagrama UML" width="100%" />
        </TransformComponent>
      </TransformWrapper>

      <DiagramModal open={open} handleClose={handleClose} image={imageData} />
    </div>
  );
}
