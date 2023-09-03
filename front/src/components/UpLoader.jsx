import React, { useCallback, useState, useEffect, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import styles from "./UpLoader.module.css";

function UpLoader() {
  // const ListItem = styled("li")(({ theme }) => ({
  //   margin: theme.spacing(1.5),
  // }));

  const [selectedFiles, setSelectedFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const updatedFiles = acceptedFiles.map((file, index) => ({
        key: `${selectedFiles.length + index}`,
        label: file.name,
      }));
      setSelectedFiles([...selectedFiles, ...updatedFiles]);
    },
    [selectedFiles, setSelectedFiles]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleDelete = (chipToDelete) => () => {
    setSelectedFiles((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );
  };

  return (
    <>
      {/* <div {...getRootProps()} className="dropzoneStyles"> */}
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {/* <p>
          Arrastra y suelta archivos aquí o haz clic en "Upload" para
          seleccionar archivos
        </p>
      <br /> */}
        <button>Upload</button>
      </div>
      <div>
        <h2>Archivos seleccionados:</h2>
        {selectedFiles.length == 0 ? (
          <div>
            <p>Cargue datos...</p>
          </div>
        ) : (
          selectedFiles.map((data) => {
            let icon;

            return (
              // <ListItem key={data.key}>
              <div className={styles.chip}>
                <Chip 
                  key={data.key}
                  style={{ background: "white" }}
                  icon={icon}
                  label={data.label}
                  onDelete={handleDelete(data)}
                />
                </div>
              // </ListItem>
            );
          })
        )}
      </div>
    </>
  );
}

export default UpLoader;
