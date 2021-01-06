document.addEventListener('DOMContentLoaded', () => {
    const postsView = document.querySelector('#posts-view');
    const profileView = document.querySelector('#profile-view');
    const followersView = document.querySelector('#followers-view');
    const followingView = document.querySelector('#following-view');
    const successfulView = document.querySelector('#successful-view');

    // Load the post view by default
    postsView.style.display = 'block';

    document.querySelector('.single-profile-row').addEventListener('click', event => {
        if (event.target.id === 'single-posts') {
            
            // Hide other views and show the posts view
            profileView.style.display = 'none';
            followersView.style.display = 'none';
            followingView.style.display = 'none';
            successfulView.style.display = 'none';
            postsView.style.display = 'block';
        } else if (event.target.id === 'single-profile') {
            
            // Hide other views and show the profile view
            followersView.style.display = 'none';
            followingView.style.display = 'none';
            postsView.style.display = 'none';
            successfulView.style.display = 'none';
            profileView.style.display = 'block';
        } else if (event.target.id === 'single-followers') {
            
            // Hide other views and show the followers view
            profileView.style.display = 'none';
            followingView.style.display = 'none';
            postsView.style.display = 'none';
            successfulView.style.display = 'none';
            followersView.style.display = 'block';
        } else if (event.target.id === 'single-following') {
            
            // Hide other views and show the following view
            profileView.style.display = 'none';
            followersView.style.display = 'none';
            postsView.style.display = 'none';
            successfulView.style.display = 'none';
            followingView.style.display = 'block';
        } else if (event.target.id == 'change-pwd-btn') {

            prevPassword = document.querySelector('#prev-pwd').value;
            newPassword = document.querySelector('#new-pwd').value;
            confirmPassword = document.querySelector('#confirm-pwd').value;
        
            fetch('/change-password', {
                method: 'PUT',
                body: JSON.stringify({
                    prev_pwd: prevPassword,
                    new_pwd: newPassword,
                    confirm_pwd: confirmPassword
                })
            })
            .then(response => response.json())
            .then(results => {
                if (results.message === 'Successful') {
                    
                    // Hide other views and show the successful view
                    profileView.style.display = 'none';
                    followersView.style.display = 'none';
                    postsView.style.display = 'none';
                    followingView.style.display = 'none';
                    successfulView.style.display = 'block';
                } else {
                    // TODO
                }
            })
        }
    })
})