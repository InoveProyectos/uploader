import os
import sys
import io
from PIL import Image

from django.core.files import File
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.base import ContentFile

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import FileUploadParser, MultiPartParser


from .models import Cuota, Comprobante  # Importa tu modelo de comprobante


def convert_image_to_pdf_data(image):
    buffer = io.BytesIO(image.read())
    img = Image.open(buffer)
    imgc = img.convert("RGB")
    pdfdata = io.BytesIO()
    imgc.save(pdfdata, format="PDF")
    return pdfdata.getvalue()


class ComprobantePagoView(APIView):
    parser_classes = (MultiPartParser,)

    def post(self, request, pk, format=None):
        try:
            cuota = Cuota.objects.filter(pk=pk).first()
            if cuota is None:
                print("Error: Cuota no encontrada")
                return Response({'error': 'Cuota no encontrada'}, status=status.HTTP_404_NOT_FOUND)

            archivo = request.FILES.get('file')  # Obtener el archivo de la solicitud
            if archivo:
                # if "png" in archivo.name or "jpg" in archivo.name:
                #     filedata = convert_image_to_pdf_data(archivo)
                #     filename = archivo.name
                #     filename = filename.replace("png", "pdf")
                #     filename = filename.replace("jpg", "pdf")
                # else:
                #     filedata = archivo.read()
                #     filename = archivo.name

                filedata = archivo.read()
                filename = archivo.name

                # Guardar el archivo en el sistema
                content_file = ContentFile(filedata, name=filename)
                comprobante = Comprobante(archivo=content_file)
                comprobante.save()

                cuota.comprobante = comprobante
                cuota.save()

                return Response(data={}, status=status.HTTP_201_CREATED)
            else:
                print("Error: No se proporcionó ningún archivo")
                return Response({'error': 'No se proporcionó ningún archivo'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            exc_type, exc_obj, exc_tb = sys.exc_info()
            print(f"Error: No se pudo subir el comprobante en linea {exc_tb.tb_lineno}: {e}")
            return Response({'error': 'No se pudo subir el comprobante'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get(self, request, pk, format=None):
        try:
            cuota = Cuota.objects.get(pk=pk)
            if cuota.comprobante is None:
                print("Error: Cuota no encontrada")
                return Response({'error': 'Comprobante no encontrado'}, status=status.HTTP_404_NOT_FOUND)
            
            comprobante = cuota.comprobante
            # Verificar que el archivo existe
            file_path = comprobante.archivo.path
            if os.path.exists(file_path):
                filename = os.path.basename(comprobante.archivo.name)
                if "pdf" in filename:
                    content_type = "application/pdf"
                elif "png" in filename:
                    content_type = "image/png"
                elif "jpg" in filename:
                    content_type = "image/jpeg"
                else:
                    print("Error: Formato no soportado")
                    return Response({'error': f'Formato no soportado, archivo {filename}'}, status=status.HTTP_400_BAD_REQUEST)

                # Abre el archivo y configura la respuesta HTTP para la descarga
                with open(file_path, 'rb') as file:
                    response = HttpResponse(file.read(), content_type=content_type)  # Ajusta el tipo de contenido según tu archivo
                    response['Content-Disposition'] = f'attachment; filename="{filename}"'
                    return response
            else:
                print("Error: No se proporcionó ningún archivo")
                return Response({'error': 'El archivo no existe'}, status=status.HTTP_404_NOT_FOUND)
        except ObjectDoesNotExist:
            print("Error: Cuota no encontrada")
            return Response({'error': 'Cuota no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk, format=None):
        try:
            cuota = Cuota.objects.get(pk=pk)
            if cuota.comprobante is None:
                print("Error: Comprobante no encontrado")
                return Response({'error': 'Comprobante no encontrado'}, status=status.HTTP_404_NOT_FOUND)
            
            comprobante = cuota.comprobante
            archivo_actualizado = request.FILES.get('archivo_actualizado')

            if archivo_actualizado:
                comprobante.archivo = archivo_actualizado
                comprobante.save()

                return Response({'mensaje': 'Archivo actualizado correctamente'})
            else:
                print("Error: No se proporcionó un archivo válido para la actualización")
                return Response({'error': 'No se proporcionó un archivo válido para la actualización'}, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            print("Error: Cuota no encontrada")
            return Response({'error': 'Cuota no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk, format=None):
        try:
            cuota = Cuota.objects.get(pk=pk)           
            if cuota.comprobante is None:
                print("Error: Comprobante no encontrado")
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
                print("Error: El archivo no existe")
                return Response({'error': 'El archivo no existe'}, status=status.HTTP_404_NOT_FOUND)
        except ObjectDoesNotExist:
            print("Error: Cuota no encontrada")
            return Response({'error': 'Cuota no encontrada'}, status=status.HTTP_404_NOT_FOUND)
