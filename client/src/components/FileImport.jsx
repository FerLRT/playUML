import React from "react";

import "../styles/fileImport.css";

export function FileImport({ onFileUpload }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const contents = e.target.result;
      if (!isValidJSONString(contents)) {
        console.error("El archivo no es un JSON válido");
        return;
      }

      const jsonData = JSON.parse(contents);
      onFileUpload(jsonData);
    };

    reader.readAsText(file);
  };

  const isValidJSONString = (text) => {
    try {
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="file-import-container">
      <h3 className="file-import-title">Importar datos desde JSON</h3>
      <label htmlFor="file" className="file-import-label">
        Seleccionar Archivo
      </label>
      <input
        id="file"
        className="file-import-input"
        type="file"
        accept=".json"
        onChange={handleFileChange}
      />
    </div>
  );
}
