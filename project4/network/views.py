from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.urls import reverse

from .models import User, Post, Follow, Like, Comment
from .serializers import PostSerializer, LikeSerializer, CommentSerializer


def index(request):
    return render(request, "network/index.html", {
        "posts": Post.objects.order_by("-timestamp").all()
    })


@csrf_exempt
def like(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        post = Post.objects.get(pk=data["post_id"])
        try:
            likes = Like.objects.get(post=post, user=request.user)
            return JsonResponse({"liked": likes.is_liked})
        except Like.DoesNotExist:
            return JsonResponse({"liked": False})

    elif request.method == 'PUT':
        data = JSONParser().parse(request)

        if data["is_liked"]:
            post = Post.objects.get(pk=data["post_id"])
            post.increase_likes()

        else:
            post = Post.objects.get(pk=data["post_id"])
            post.decrease_likes()

        try:
            like = Like.objects.get(post=post, user=request.user)
            like.is_liked = data["is_liked"]
            like.save()
            return JsonResponse({"status": "Successful."}, status=201)
        except Like.DoesNotExist:
            like = Like(is_liked=data["is_liked"], post=post)
            like.save()
            like.user.add(request.user)
            return JsonResponse({"status": "Successful."}, status=201)


@csrf_exempt
def like_count(request):
    data = JSONParser().parse(request)
    post = Post.objects.get(pk=data["post_id"])
    serializer = PostSerializer(post, many=False)
    return JsonResponse(serializer.data, safe=False)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
