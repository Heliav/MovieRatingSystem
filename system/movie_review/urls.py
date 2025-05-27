from django.urls import path
from movie_review.views import home

urlpatterns = [
    path('', home, name='home'),
]
