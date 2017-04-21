from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from images.views import home

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', home, name='home'),
    url(r'^i18n/', include('django.conf.urls.i18n')),
    url(r'^seasonalife/', include('seasonalife.urls', namespace='seasonalife')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
