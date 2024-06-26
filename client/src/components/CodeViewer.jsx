import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

import "../styles/codeViewer.css";

export function CodeViewer({ code }) {
  const correctedCode = code.replace(/\\n/g, "\n");

  return (
    <div className="code-viewer-container">
      <SyntaxHighlighter
        language="javascript"
        style={docco}
        wrapLines={false}
        customStyle={{
          textAlign: "left",
          backgroundColor: "transparent",
          overflow: "auto",
          maxWidth: "100%",
        }}
      >
        {correctedCode}
      </SyntaxHighlighter>
    </div>
  );
}
