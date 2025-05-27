# from django.contrib.auth.models import AbstractUser
# from django.db import models
#
#
# class CustomUser(AbstractUser):
#     email = models.EmailField(unique=True)
#     profile_pic = models.ImageField(
#         upload_to='profiles/',
#         null=True,
#         blank=True,
#     )
#     bio = models.TextField(max_length=500, blank=True)
#
#     def __str__(self):
#         return self.username