import React, { useState } from "react";
import { requestAPI } from "../api/apiRequest";

function ComprobanteForm() {
  const [archivo, setArchivo] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const buttonId = event.nativeEvent.submitter.id;

    if (archivo) {
      if (archivo.size <= 1000000) {
        if (
          archivo &&
          (archivo.type === "application/pdf" ||
            archivo.type === "image/png" ||
            archivo.type === "image/jpeg")
        ) {
          const api = requestAPI;

          if (buttonId === "1") {
            api.post(archivo);
          } else if (buttonId === "2") {
            api.put(archivo);
          }
        } else {
          alert("Formato es inalido, only PDF, PNG o JPEG.");
        }
      } else {
        alert("Supero los 2MB max de subida");
      }
    } else {
      alert("Debe cargar un archivo");
    }
  };

  const handleFileChange = (event) => {
    setArchivo(event.target.files[0]);
  };

  return (
    <form onSubmit={handleSubmit} id="comprobanteForm">
      <input type="file" id="archivoInput" onChange={handleFileChange} />
      <br />
      <br />
      <div>
        <button id="1" type="submit">
          Subir Comprobante
        </button>
      </div>
      <br />
      <div>
        <button id="2" type="submit">
          Actualizar Comprobante
        </button>
      </div>
    </form>
  );
}

export default ComprobanteForm;
