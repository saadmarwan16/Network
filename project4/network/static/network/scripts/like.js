function isLiked(post) {
    const statusContainer = document.querySelector(`#like${post.id}`);

    // const unLikeLink = document.createElement('a');
    // unLikeLink.className = 'unlike-link';

    // const likeLink = document.createElement('a');
    // likeLink.className = 'like-link';

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
        // const unLike = document.createElement('i');
        // unLike.className = 'material-icons unliked';
        // unLike.title = 'Like';
        // unLike.innerText = 'favorite_border';
        // unLikeLink.append(unLike);
        // statusContainer.append(unLikeLink);

        // Creat a like icon and add it to the DOM
        // const like = document.createElement('i');
        // like.className = 'material-icons liked';
        // like.title = 'Unlike';
        // like.innerText = 'favorite';
        // likeLink.append(like);
        // statusContainer.append(likeLink);

        console.log(result);

        // Give user and unlike option if the user already liked this post
        if (result.liked) {

            // Show the unlike icon and hide the like icon
            document.querySelector(`#unlike-icon${post.id}`).style.display = 'none';
            document.querySelector(`#like-icon${post.id}`).style.display = 'block';
            // likeLink.style.display = 'block';
        } else {

            // Show the like icon and hide the unlike icon
            // likeLink.style.display = 'none';
            document.querySelector(`#like-icon${post.id}`).style.display = 'none';
            document.querySelector(`#unlike-icon${post.id}`).style.display = 'block';
        }
    })

    // User clicks on the like status container to like or dislike a post
    statusContainer.addEventListener('click', event => {
        
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
                let numOfLikes = document.querySelector(`#num-like${post.id}`).innerText;
                console.log(numOfLikes)
                numOfLikes--;
                console.log(numOfLikes)
                document.querySelector(`#num-like${post.id}`).innerText = numOfLikes;
            })
        } else if (event.target.className === 'material-icons unliked') {

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
                let numOfLikes = document.querySelector(`#num-like${post.id}`).innerText;
                console.log(numOfLikes)
                numOfLikes++;
                console.log(numOfLikes)
                document.querySelector(`#num-like${post.id}`).innerText = numOfLikes;
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

        // Set the number of likes on the client side
        document.querySelector(`#num-like${post.id}`).innerText = result.num_of_likes;
    })
}