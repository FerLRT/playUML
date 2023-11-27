import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "../styles/DiagramImage.css";

function DiagramImage({ image }) {
  const imageData = image.startsWith("data:image/jpeg;base64,")
    ? image
    : `data:image/jpeg;base64,${image}`;

  return (
    <div className="image-container">
      <TransformWrapper
        defaultScale={1}
        smooth="true"
        maxScale={3}
        pinch={{ step: 10 }}
        onDoubleClick={(e) => e.preventDefault()}
      >
        <TransformComponent onDoubleClick={(e) => e.preventDefault()}>
          <img src={imageData} alt="Diagrama UML" />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

export default DiagramImage;
