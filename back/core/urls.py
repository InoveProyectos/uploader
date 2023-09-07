from django.urls import path, include

from .views import ComprobantePagoView


urlpatterns = [
    path('cuota/<int:pk>/comprobante/', ComprobantePagoView.as_view(), name='comprobante-pago'),

]