import json
import os

from django.http import JsonResponse
from rest_framework import viewsets, status, permissions, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Movie, Review, Watchlist, Favorite
from .serializers import MovieSerializer, ReviewSerializer, ReviewCreateSerializer
from ... import settings


class MovieListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get("q", "").strip().lower()
        fixture_path = os.path.join(settings.BASE_DIR, "backend/apps/movies/fixtures/movies.json")

        try:
            with open(fixture_path, "r") as f:
                data = json.load(f)
        except Exception as e:
            return JsonResponse({"error": "Could not load movies fixture", "details": str(e)}, status=500)

        # Transform fixture into DRF-like JSON
        movies = [
            {"id": item["pk"], **item["fields"]}
            for item in data
        ]

        # Filter by query if any
        if query:
            movies = [m for m in movies if query in m["title"].lower()]

        return JsonResponse(movies, safe=False)

class MovieDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        movie = get_object_or_404(Movie, pk=pk)
        serializer = MovieSerializer(movie)
        return Response(serializer.data)

class ReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        Optionally filter by movie_id query parameter.
        """
        movie_id = self.request.query_params.get("movie_id")
        if movie_id:
            return Review.objects.filter(movie_id=movie_id).order_by('-created_at')
        return Review.objects.all().order_by('-created_at')

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ReviewCreateSerializer
        return ReviewSerializer

    def perform_create(self, serializer):
        """
        Save a review for the given movie by the logged-in user.
        """
        movie_id = self.request.data.get('movie')  # frontend should send 'movie' key
        if not movie_id:
            raise serializers.ValidationError({"movie": "Movie ID is required"})
        movie = get_object_or_404(Movie, pk=movie_id)
        serializer.save(user=self.request.user, movie=movie)

class WatchlistListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        watchlist = Watchlist.objects.filter(user=request.user)
        data = [{"movie": MovieSerializer(item.movie).data, "added_at": item.added_at} for item in watchlist]
        return Response(data)


class WatchlistToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, movie_id):
        movie = get_object_or_404(Movie, pk=movie_id)
        watchlist_item, created = Watchlist.objects.get_or_create(user=request.user, movie=movie)
        if not created:
            watchlist_item.delete()
            return Response({"detail": "Removed from watchlist"})
        return Response({"detail": "Added to watchlist"})


class FavoriteListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        data = [{"movie": MovieSerializer(item.movie).data, "added_at": item.added_at} for item in favorites]
        return Response(data)


class FavoriteToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, movie_id):
        movie = get_object_or_404(Movie, pk=movie_id)
        favorite_item, created = Favorite.objects.get_or_create(user=request.user, movie=movie)
        if not created:
            favorite_item.delete()
            return Response({"detail": "Removed from favorites"})
        return Response({"detail": "Added to favorites"})
