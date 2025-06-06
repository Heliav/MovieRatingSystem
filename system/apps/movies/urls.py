from django.urls import path
from . import views

app_name = 'movies'

urlpatterns = [
    path('', views.MovieListView.as_view(), name='movies-list'),  # 👈 root of movies/
    path('<int:pk>/', views.MovieDetailView.as_view(), name='movie-detail'),
    path('<int:movie_id>/reviews/', views.ReviewListView.as_view(), name='movie-reviews'),
]
