import React from "react";
import { requestAPI } from "../api/apiRequest";

function DownLoader() {
  const api = requestAPI;
  const handleDownload = async () => {
    api.get();
  };

  return (
    <div>
      <button onClick={handleDownload}>Descargar Comprobante</button>
    </div>
  );
}

export default DownLoader;
