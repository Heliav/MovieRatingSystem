from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models


class CustomUser(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    objects = UserManager()
