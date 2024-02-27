import React, { useEffect, useState } from "react";
import { sendFileData } from "../hooks/useUser";

export function FileImport() {
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    if (fileData) {
      console.log("El contenido es correcto");
      sendFileData(fileData);
    }
    setFileData(null);
  }, [fileData]);

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
      setFileData(jsonData);
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
    <div>
      <input type="file" accept=".json" onChange={handleFileChange} />
    </div>
  );
}
