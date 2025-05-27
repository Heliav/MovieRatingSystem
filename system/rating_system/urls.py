from django.contrib import admin
from django.shortcuts import render
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('', include('movie_review.urls')),
    path("", lambda request: render(request, "home.html"), name="home"),

    path('', include('apps.movies.urls', namespace='movies')),  # API
]
