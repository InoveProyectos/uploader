import os

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import FileUploadParser

from django.core.files import File
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist

from .models import Cuota, Comprobante  # Importa tu modelo de comprobante

class ComprobantePagoView(APIView):
    parser_classes = (FileUploadParser,)

    def post(self, request, pk, format=None):
        cuota = Cuota.objects.filter(pk=pk).first()
        if cuota is None:
            return Response({'error': 'Cuota no encontrada'}, status=status.HTTP_404_NOT_FOUND)
            
        archivo = request.FILES.get('archivo')  # Obtener el archivo de la solicitud
        if archivo:
            # Guardar el archivo en el sistema de archivos utilizando default_storage
            file_path = default_storage.save(archivo.name, ContentFile(archivo.read()))

            # Crear una instancia de Comprobante en la base de datos
            comprobante = Comprobante(archivo=file_path, descripcion=request.data.get('descripcion'))
            comprobante.save()

            cuota.comprobante = comprobante
            cuota.save()
            
            return Response(data={}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'No se proporcionó ningún archivo'}, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, pk, format=None):
        try:
            cuota = Cuota.objects.get(pk=pk)
            if cuota.comprobante is None:
                return Response({'error': 'Comprobante no encontrado'}, status=status.HTTP_404_NOT_FOUND)
            
            comprobante = cuota.comprobante
            # Verificar que el archivo existe
            file_path = comprobante.archivo.path
            if os.path.exists(file_path):
                # Abre el archivo y configura la respuesta HTTP para la descarga
                with open(file_path, 'rb') as file:
                    response = HttpResponse(file.read(), content_type='application/pdf')  # Ajusta el tipo de contenido según tu archivo
                    response['Content-Disposition'] = f'attachment; filename="{os.path.basename(file_path)}"'
                    return response
            else:
                return Response({'error': 'El archivo no existe'}, status=status.HTTP_404_NOT_FOUND)
        except ObjectDoesNotExist:
            return Response({'error': 'Cuota no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk, format=None):
        try:
            cuota = Cuota.objects.get(pk=pk)
            if cuota.comprobante is None:
                return Response({'error': 'Comprobante no encontrado'}, status=status.HTTP_404_NOT_FOUND)
            
            comprobante = cuota.comprobante
            archivo_actualizado = request.FILES.get('archivo_actualizado')

            if archivo_actualizado:
                comprobante.archivo = archivo_actualizado
                comprobante.save()

                return Response({'mensaje': 'Archivo actualizado correctamente'})
            else:
                return Response({'error': 'No se proporcionó un archivo válido para la actualización'}, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            return Response({'error': 'Cuota no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk, format=None):
        try:
            cuota = Cuota.objects.get(pk=pk)           
            if cuota.comprobante is None:
                return Response({'error': 'Comprobante no encontrado'}, status=status.HTTP_404_NOT_FOUND)
            
            comprobante = cuota.comprobante
            # Verificar que el archivo existe
            file_path = comprobante.archivo.path
            if os.path.exists(file_path):
                # Eliminar el archivo del sistema de archivos
                os.remove(file_path)
                
                # Eliminar el comprobante de la base de datos
                comprobante.delete()
                
                return Response({'mensaje': 'El comprobante y el archivo asociado fueron eliminados correctamente'})
            else:
                return Response({'error': 'El archivo no existe'}, status=status.HTTP_404_NOT_FOUND)
        except ObjectDoesNotExist:
            return Response({'error': 'Cuota no encontrada'}, status=status.HTTP_404_NOT_FOUND)
