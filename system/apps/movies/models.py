from django.db import models
from django.contrib.auth.models import User


class Movie(models.Model):
    name = models.CharField(max_length=300)
    director = models.CharField(max_length=300)
    cast = models.CharField(max_length=300)
    release_date = models.DateField()
    description = models.TextField(max_length=5000)
    rating = models.FloatField(default=0)
    image = models.URLField(default=None, null=True, blank=True)

    def __str__(self):
        return self.name


class Review(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField(max_length=1000, null=True, blank=True)
    rating = models.FloatField(default=0)

    class Meta:
        unique_together = ('movie', 'user')

    def __str__(self):
        return f"{self.user.username} - {self.movie.name}"
