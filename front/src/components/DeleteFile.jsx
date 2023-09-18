import React from "react";
import { requestAPI } from "../api/apiRequest";

const DeleteFile = () => {
  const handleDelete = async () => {
    const api = requestAPI;
    api.delete();
  };

  return (
    <div>
      <button onClick={handleDelete}>Eliminar comprobante</button>
    </div>
  );
};

export default DeleteFile;
