from django.shortcuts import render
from apps.movies.models import Movie
from django.db.models import Avg

def home(request):
    featured_movies = Movie.objects.annotate(avg_rating=Avg('review__rating')).order_by('-avg_rating')[:6]
    return render(request, 'home.html', {'featured_movies': featured_movies})
