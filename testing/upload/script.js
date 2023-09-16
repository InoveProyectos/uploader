document.getElementById('comprobanteForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const archivoInput = document.getElementById('archivoInput');
    const archivo = archivoInput.files[0];  // Obtiene el archivo seleccionado
  
    if (archivo) {
      const formData = new FormData();
      formData.append('file', archivo);
  
      fetch('http://127.0.0.1:8000/api/cuota/1/comprobante/', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // 'Content-Type': 'multipart/form-data', // Configurar para subir archivo
          // 'Content-Disposition': `attachment; filename="${archivo.name}"`, // nombre del archivo
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al subir el comprobante.');
        }
        return response.json();
      })
      .then(data => {
        console.log('Comprobante subido exitosamente:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  });
  