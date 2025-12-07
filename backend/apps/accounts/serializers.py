from rest_framework import serializers
from django.contrib.auth import get_user_model

from backend.apps.movies.models import Watchlist, Favorite, Review

User = get_user_model()

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'avatar', 'bio')

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ProfileSerializer(serializers.ModelSerializer):
    watchlist_count = serializers.SerializerMethodField()
    favorites_count = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'avatar', 'bio',
            'watchlist_count', 'favorites_count', 'reviews_count'
        )

    def get_watchlist_count(self, obj):
        return Watchlist.objects.filter(user=obj).count()

    def get_favorites_count(self, obj):
        return Favorite.objects.filter(user=obj).count()

    def get_reviews_count(self, obj):
        return Review.objects.filter(user=obj).count()
