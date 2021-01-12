document.addEventListener('DOMContentLoaded', () => {
    const postsView = document.querySelector('#posts-view');
    const followersView = document.querySelector('#followers-view');
    const followingView = document.querySelector('#following-view');

    // Load the post view by default
    postsView.style.display = 'block';

    document.querySelector('.single-profile-row').addEventListener('click', event => {
        if (event.target.id === 'single-posts') {
            
            // Hide other views and show the posts view
            followersView.style.display = 'none';
            followingView.style.display = 'none';
            postsView.style.display = 'block';
        } else if (event.target.id === 'single-followers') {
            
            // Hide other views and show the followers view
            followingView.style.display = 'none';
            postsView.style.display = 'none';
            followersView.style.display = 'block';
        } else if (event.target.id === 'single-following') {
            
            // Hide other views and show the following view
            followersView.style.display = 'none';
            postsView.style.display = 'none';
            followingView.style.display = 'block';
        }
    })
})