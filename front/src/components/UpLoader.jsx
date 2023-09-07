import React, { useState, useRef } from "react";
import Chip from "@mui/material/Chip";
import styles from "./UpLoader.module.css";
import { Button } from "@mui/material";
import { Link } from "react-router-dom"

function UpLoader() {
  const [blobUrl, setBlobUrl] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDelete = (chipToDelete) => () => {
    setFile((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    window.location.reload();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile.size < 2600000) {
      if (
        selectedFile &&
        (selectedFile.type === "application/pdf" ||
          selectedFile.type === "image/png" ||
          selectedFile.type === "image/jpeg")
      ) {
        setFile(selectedFile);

        const blob = new Blob([selectedFile], { type: selectedFile.type });
        console.log(selectedFile);
        const url = window.URL.createObjectURL(blob);
        setBlobUrl(url);
      } else {
        alert("Formato es inalido, only PDF, PNG o JPEG.");
        window.location.reload();
      }
    } else {
      alert("Supero los 2MB max de subida");
      window.location.reload();
    }
  };

  const handleDownload = () => {
    if (blobUrl) {
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = file.name;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    }
  };

  return (
    <>
      {file === null ? (
        <>
          <input
            type="file"
            accept=".pdf,image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button onClick={() => fileInputRef.current.click()}>
            Cargar Archivo
          </button>
        </>
      ) : (
        <>
          <button onClick={handleDownload} disabled={!file}>
            Descargar Archivo
          </button>
        </>
      )}
      <div>
        <h2>Archivo seleccionado:</h2>
        {file == null ? (
          <div>
            <p>Cargue un archivo...</p>
          </div>
        ) : (
          <div className={styles.chip}>
            <Chip
              style={{ background: "white" }}
              label={file.name}
              onDelete={handleDelete(file[0])}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default UpLoader;
