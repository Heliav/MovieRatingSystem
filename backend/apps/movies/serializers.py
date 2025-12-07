from rest_framework import serializers
from .models import Movie, Review, Watchlist, Favorite

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = "__all__"

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()  # to include username

    class Meta:
        model = Review
        fields = ['id', 'user', 'comment', 'rating', 'created_at']

    def get_user(self, obj):
        return {"id": obj.user.id, "username": obj.user.username}


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['movie', 'comment', 'rating']

class WatchlistSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)

    class Meta:
        model = Watchlist
        fields = "__all__"
        read_only_fields = ("user", "movie", "added_at")

class FavoriteSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = "__all__"
        read_only_fields = ("user", "movie", "added_at")
