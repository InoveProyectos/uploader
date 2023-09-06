from django.db import models

# Create your models here.

class Comprobante(models.Model):
    # Campo para almacenar el archivo del comprobante
    archivo = models.FileField(upload_to='comprobantes/')

    # Campos de control de auditoría
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)


class Cuota(models.Model):
    id = models.BigAutoField(primary_key=True)
    numero = models.IntegerField()
    challenge = models.ForeignKey(Comprobante, on_delete=models.SET_NULL, blank=True, null=True)