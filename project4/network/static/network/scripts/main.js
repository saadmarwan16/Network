document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.all-posts-jumbotron').forEach(post => {
        isLiked(post);
    })
})