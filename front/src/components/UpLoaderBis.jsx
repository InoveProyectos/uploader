import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import styles from "./UpLoader.module.css";

function UpLoader() {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setSelectedFiles(acceptedFiles);
    },
    [selectedFiles]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleDelete = (chipToDelete) => () => {
    setSelectedFiles((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );
    window.location.reload();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "application/pdf" ||
        selectedFile.type === "image/png" ||  
        selectedFile.type === "image/jpeg")
    ) {
      setFile(selectedFile);

      // Crear el Blob URL cuando se selecciona un archivo válido
      const blob = new Blob([selectedFile], { type: selectedFile.type });
      const url = window.URL.createObjectURL(blob);
      setBlobUrl(url);
    } else {
      alert("Por favor, seleccione un archivo PDF, PNG o JPEG.");
    }
  };

  const handleDownload = () => {
    if (blobUrl) {
      // Descargar el archivo utilizando el Blob URL
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = file.name;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Revocar el Blob URL después de la descarga
      window.URL.revokeObjectURL(blobUrl);
    }
  };

  // return (
  //   <>
  //     {selectedFiles === null ? (
  //       <>
  //         {/* <div {...getRootProps()}>
  //           <input {...getInputProps()} />
  //           <button onChange={handleFileChange} >Upload</button>
  //         </div> */}
  //          <button type="file" accept=".pdf,image/*" onChange={handleFileChange} />
  //       </>
  //     ) : (
  //       <>
  //         <button onClick={() => handleDownload()}>
  //           Descargar
  //         </button>
  //       </>
  //     )}
  //     <div>
  //       <h2>Archivos seleccionados:</h2>
  //       {selectedFiles == null ? (
  //         <div>
  //           <p>Cargue datos...</p>
  //         </div>
  //       ) : (
  //         <div className={styles.chip}>
  //           {selectedFiles.length > 0 && (
  //             <Chip
  //               style={{ background: "white" }}
  //               label={selectedFiles[0].name}
  //               onDelete={handleDelete(selectedFiles[0])}
  //             />
  //           )}
  //         </div>
  //       )}
  //     </div>
  //     <br />
  //   </>
  // );
  return (
    <div>
      {/* Input de tipo archivo invisible */}
      <input
        type="file"
        accept=".pdf,image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {/* Botón personalizado para cargar archivo */}
      <button onClick={() => fileInputRef.current.click()}>
        Cargar Archivo
      </button>
      <button onClick={handleDownload} disabled={!file}>
        Descargar Archivo
      </button>
    </div>
  );
}

export default UpLoader;
