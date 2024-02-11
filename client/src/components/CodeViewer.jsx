import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

import "../styles/codeViewer.css";

export function CodeViewer({ code }) {
  const correctedCode = code.replace(/\\n/g, "\n");

  console.log("correctedCode", correctedCode);

  return (
    <div className="code-viewer-container">
      <SyntaxHighlighter
        language="javascript"
        style={docco}
        wrapLines={false}
        showLineNumbers={true}
      >
        {correctedCode}
      </SyntaxHighlighter>
    </div>
  );
}
