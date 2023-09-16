document.getElementById('descargarEnlace').addEventListener('click', function(event) {
  event.preventDefault();  // Previene la acción por defecto del enlace

  // Realiza la solicitud GET para descargar el comprobante
  let disposition;
  fetch('http://127.0.0.1:8000/api/cuota/1/comprobante/', {
    method: 'GET',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al descargar el comprobante.');
    }
    disposition = response.headers.get('Content-Disposition');
    return response.blob();  // Convierte la respuesta a un blob
  })
  .then(blob => {
    // Obtener el nombre del disposition tomado del header
    // o definir uno por defecto
    const fileNameMatch = disposition && disposition.match(/filename="(.+)"/);
    const fileName = fileNameMatch && fileNameMatch[1] ? fileNameMatch[1] : 'comprobante.png';

    // Crea un objeto File
    const file = new File([blob], fileName, { type: 'image/png' });

    // Crea un enlace temporal para descargar el archivo
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    
    // Establece el nombre del archivo para la descarga
    a.download = fileName;

    // Simula un clic en el enlace para comenzar la descarga
    a.click();

    // Limpia y libera los objetos URL y File creados
    URL.revokeObjectURL(a.href);
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
