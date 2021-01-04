function isLiked(post) {
    const likeStatus = document.querySelector('.likes');

    statusContainer = document.querySelector('.like-status');

    const unLikeLink = document.createElement('a');
    unLikeLink.className = 'unlike-link';

    const likeLink = document.createElement('a');
    likeLink.className = 'like-link';

    // Send a POST request to know whether user has liked this post
    fetch('/like', {
        method: 'POST',
        body: JSON.stringify({
            post_id: post.id
        })
    })
    .then(response => response.json())
    .then(result => {

        // Create an unlike icon and add it to the DOM
        const unLike = document.createElement('i');
        unLike.className = 'material-icons unliked';
        unLike.innerText = 'favorite_border';
        unLikeLink.append(unLike);
        statusContainer.append(unLikeLink);
        likeStatus.append((statusContainer));

        // Creat a like icon and add it to the DOM
        const like = document.createElement('i');
        like.className = 'material-icons liked';
        like.innerText = 'favorite';
        // likeContainer.append(like);
        likeLink.append(like);
        statusContainer.append(likeLink);
        likeStatus.append(statusContainer);

        console.log(result.liked);

        // Give user and unlike option if the user already liked this post
        if (result.liked) {

            // Show the unlike icon and hide the like icon
            unLikeLink.style.display = 'none';
            likeLink.style.display = 'block';
        } else {

            // Show the like icon and hide the unlike icon
            likeLink.style.display = 'none';
            unLikeLink.style.display = 'block';
        }
    })

    // User clicks on the like status container to like or dislike a post
    likeStatus.addEventListener('click', event => {
        
        // If the user clicked on the already liked post dislike it, otherwise like it
        if (event.target.className === 'material-icons liked') {

            // Show the like icon and hide the unlike icon
            likeLink.style.display = 'none';
            unLikeLink.style.display = 'block';

            // Send a PUT request to update the database
            fetch('/like', {
                method: 'PUT',
                body: JSON.stringify({
                    post_id: post.id,
                    is_liked: false
                })
            })
            .then(response => response.json())
            .then(result => {
                
                // Update the number of likes on the client side
                console.log(document.querySelector('.num-of-likes'));
                let numOfLikes = document.querySelector('.num-of-likes').innerText;
                numOfLikes--;
                document.querySelector('.num-of-likes').innerText = numOfLikes;
            })
        } else {

            // Show the unlike icon and hide the like icon
            unLikeLink.style.display = 'none';
            likeLink.style.display = 'block';

            // Send a PUT request to update the database
            fetch('/like', {
                method: 'PUT',
                body: JSON.stringify({
                    post_id: post.id,
                    is_liked: true
                })
            })
            .then(response => response.json())
            .then(result => {

                // Update the number of likes on the client side
                console.log(document.querySelector('.num-of-likes'));
                let numOfLikes = document.querySelector('.num-of-likes').innerText;
                numOfLikes++;
                document.querySelector('.num-of-likes').innerText = numOfLikes;
            })
        }
    })

    likeCount(post);
}

function likeCount(post) {

    // Send a POST request to know how many likes this post has
    fetch('/like-count', {
        method: 'POST',
        body: JSON.stringify({
            post_id: post.id
        })
    })
    .then(response => response.json())
    .then(result => {

        // Create a span for the number of likes and add it to the DOM
        // const numberOfLikes = document.createElement('span');
        // numberOfLikes.className = 'number-of-likes';
        document.querySelector('.num-of-likes').innerText = result.num_of_likes;
        // document.querySelector('.likes').append(numberOfLikes);
    })
}