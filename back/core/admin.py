from django.contrib import admin

from .models import *

# Register your models here.
@admin.register(Cuota)
class CuotaAdmin(admin.ModelAdmin):
    # Campos en la tabla de registros
    list_display = ('id', 'numero', 'comprobante')

@admin.register(Comprobante)
class Comprobante(admin.ModelAdmin):
    # Campos en la tabla de registros
    list_display = ('id', 'archivo', 'creado_en', 'actualizado_en')