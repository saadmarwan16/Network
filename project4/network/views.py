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
    """ 
    Load the home page
    """

    return render(request, "network/index.html", {
        "posts": Post.objects.order_by("-timestamp").all()
    })


def new_post(request):
    """
    Create a new post and redirect the user to the home page
    """

    content = request.POST["content"]
    post = Post(content=content, poster=request.user)
    post.save()

    return HttpResponseRedirect(reverse('index'))


def profile(request, poster_id):
    """
    Load the profile of the user who is clicked on
    """

    return render(request, "network/profile.html", {
        "posts": Post.objects.filter(poster_id=poster_id)
    })


@csrf_exempt
def like(request):
    """
    Allow users to like and unlike posts
    """

    # User loading the page
    if request.method == 'POST':
        data = JSONParser().parse(request)
        post = Post.objects.get(pk=data["post_id"])
        
        # Set users who haven't logged in like status to not liked
        if str(request.user) == "AnonymousUser":
            return JsonResponse({"liked": False})

        # Users who have logged in
        else:

            # Return whether user have liked post or not
            try:
                likes = Like.objects.get(post=post, user=request.user)
                return JsonResponse({"liked": likes.is_liked})

            # If user have never liked or unliked a post set it to not liked
            except Like.DoesNotExist:
                return JsonResponse({"liked": False})

    # User trying to toggle between like and dislike
    elif request.method == 'PUT':
        
        # User haven't logged in
        if str(request.user) == "AnonymousUser":
            return JsonResponse({"status": "Anonymous User"}, status=201)

        # User have logged in
        else:
            data = JSONParser().parse(request)
            post = Post.objects.get(pk=data["post_id"])

            if data["is_liked"]:
                post.increase_likes()
            else:
                post.decrease_likes()

            # Attempt to toggle between like and unlike of a post
            try:
                like = Like.objects.get(post=post, user=request.user)
                like.is_liked = data["is_liked"]
                like.save()

            # User have never like or unliked post
            except Like.DoesNotExist:
                like = Like(is_liked=data["is_liked"], post=post)
                like.save()
                like.user.add(request.user)

            return JsonResponse({"status": "Successful"}, status=201)


@csrf_exempt
def like_count(request):
    """
    Get the number of likes a post have
    """

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
