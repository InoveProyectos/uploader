import axios from "axios";

export const requestAPI = {
  get: async function () {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/cuota/1/comprobante/",
        {
          responseType: "blob",
        }
      );

      if (response.status !== 200) {
        throw new Error("Error al descargar el comprobante.");
      }

      const disposition = response.headers["content-disposition"];
      const fileNameMatch = disposition && disposition.match(/filename="(.+)"/);
      const fileName =
        fileNameMatch && fileNameMatch[1]
          ? fileNameMatch[1]
          : "comprobante.png";

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const file = new File([blob], fileName, { type: blob.type });

      const url = window.URL.createObjectURL(file);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      link.click();

      window.URL.revokeObjectURL(url);

      return response.data;
    } catch (error) {
      console.error("Error:", error);
      alert("No hay archivo para descargar");
      throw error;
    }
  },
  /* Este endpoint lo dejo por si tengo que verificar si el archivo ya esta en el back, para no volverlo a subir*/
  getResponse: async function () {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/cuota/1/comprobante/",
        {
          responseType: "blob",
        }
      );

      if (response.status !== 200) {
        throw new Error("Error al descargar el comprobante.");
      }

      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
  post: async function (archivo) {
    try {
      if (archivo) {
        const formData = new FormData();
        formData.append("file", archivo);

        const response = await axios.post(
          `http://127.0.0.1:8000/api/cuota/1/comprobante/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          console.log("Archivo subido correctamente");
          alert("Comprobante subido con éxito!");
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          console.error("Error al subir el archivo.");
        }
      } else {
        console.error("Error: No se proporcionó un archivo válido");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  },

  put: async function (archivoActualizado) {
    try {
      if (archivoActualizado) {
        const formData = new FormData();
        formData.append("archivo_actualizado", archivoActualizado);

        const response = await axios.put(
          `http://127.0.0.1:8000/api/cuota/1/comprobante/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          console.log("Archivo actualizado correctamente");
          alert("Archivo actualizado correctamente!");
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          console.error("Error al actualizar el archivo.");
        }
      } else {
        console.error(
          "Error: No se proporcionó un archivo válido para la actualización"
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  },
  delete: async function () {
    try {
      const response = await axios.delete(
        "http://127.0.0.1:8000/api/cuota/1/comprobante/"
      );

      if (response.status === 200) {
        console.log(response.status);
        alert("Comprobante eliminado con éxito!");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        console.error("Error al eliminar el comprobante.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Comprobante no encontrado");
    }
  },
};
