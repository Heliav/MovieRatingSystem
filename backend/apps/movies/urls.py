from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'reviews', ReviewViewSet, basename='review')


urlpatterns = [
    path('movies/', MovieListView.as_view(), name='movie-list'),
    path('movies/<int:pk>/', MovieDetailView.as_view(), name='movie-detail'),
    path('watchlist/', WatchlistListView.as_view(), name='watchlist-list'),
    path('watchlist/<int:movie_id>/toggle/', WatchlistToggleView.as_view(), name='watchlist-toggle'),
    path('favorites/', FavoriteListView.as_view(), name='favorite-list'),
    path('favorites/<int:movie_id>/toggle/', FavoriteToggleView.as_view(), name='favorite-toggle'),
    path('', include(router.urls)),
]
