from django.db import models
from django.conf import settings
from django.utils import timezone

User = settings.AUTH_USER_MODEL

class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    poster = models.URLField(blank=True)
    release_date = models.DateField(null=True, blank=True)
    genre = models.CharField(max_length=100, blank=True)
    rating = models.FloatField(null=True, blank=True)
    director = models.CharField(max_length=255, blank=True)
    cast = models.TextField(blank=True)
    trailer_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="reviews")
    comment = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"


class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="watchlist")
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "movie")


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "movie")
