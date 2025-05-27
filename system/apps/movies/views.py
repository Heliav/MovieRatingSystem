from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Movie, Review
from .serializers import MovieSerializer, ReviewSerializer


class MovieListView(APIView):
    @staticmethod
    def get(request):
        movies = Movie.objects.all()
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)

    @staticmethod
    def post(request):
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MovieDetailView(APIView):
    @staticmethod
    def get(request, pk):
        try:
            movie = Movie.objects.get(pk=pk)
        except Movie.DoesNotExist:
            return Response(
                {"error": "Movie not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = MovieSerializer(movie)
        return Response(serializer.data)


class ReviewListView(APIView):
    @staticmethod
    def get(request, movie_id):
        reviews = Review.objects.filter(
            movie_id=movie_id
        )  # Get reviews for a specific movie
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    @staticmethod
    def post(request, movie_id):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            movie = Movie.objects.get(id=movie_id)
            serializer.save(user=request.user, movie=movie)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
