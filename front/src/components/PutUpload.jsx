import React, { useState } from 'react';
import axios from 'axios';

const ActualizarComprobante = () => {
  const [archivoActualizado, setArchivoActualizado] = useState(null);

  const handleArchivoChange = (event) => {
    setArchivoActualizado(event.target.files[0]);
  };

  const handleActualizarClick = async () => {
    try {
      if (archivoActualizado) {
        const formData = new FormData();
        formData.append('archivo_actualizado', archivoActualizado);

        const response = await axios.put(
          `http://127.0.0.1:8000/api/cuota/1/comprobante/`, // Asegúrate de proporcionar el ID correcto de la cuota
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data', // Asegúrate de establecer el tipo de contenido adecuado
            },
          }
        );

        if (response.status === 200) {
          console.log('Archivo actualizado correctamente');
          // Realiza cualquier acción adicional que necesites después de la actualización
        } else {
          console.error('Error al actualizar el archivo.');
        }
      } else {
        console.error('Error: No se proporcionó un archivo válido para la actualización');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="archivoActualizadoInput"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleArchivoChange}
      />
      <br />
      <br />
      <button onClick={handleActualizarClick}>Actualizar Comprobante</button>
    </div>
  );
};

export default ActualizarComprobante;
