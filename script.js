async function fetchPosts() {
    const container = document.getElementById('app');
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();
    
    let likes = JSON.parse(localStorage.getItem('postLikes')) || {};
    
    container.innerHTML = '';
    posts.forEach(post => {
        const postId = post.id;
        const isLiked = likes[postId] || false;
        const likeCount = Math.floor(Math.random() * 100); 
        
        const postElement = document.createElement('div');
        postElement.className = 'bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700/50';
        const userName = `User ${post.id}`; 
        const heartIconSrc = isLiked ? 'assets/icons/heart-red.svg' : 'assets/icons/heart-icon.svg';
        
        postElement.innerHTML = `
            <div class="flex items-center mb-4">
                <img src="https://ui-avatars.com/api/?name=${userName}&background=random" class="w-10 h-10 rounded-full mr-3" alt="User">
                <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">User ${post.id}</h3>
                    <p class="text-xs text-gray-500">Just now</p>
                </div>
            </div>
            <img src="https://picsum.photos/800/600?random=${post.id}" class="w-full h-64 object-cover rounded-lg mb-4" alt="Post">
            <div class="flex space-x-4 mb-3">
                <button class="like-btn flex items-center space-x-1 group" data-post-id="${postId}">
                    <img src="${heartIconSrc}" class="w-6 h-6 ${isLiked ? 'text-red-500' : 'text-gray-500 group-hover:text-red-400'} transition-colors" alt="Like" />
                    <span class="like-count">${likeCount}</span>
                </button>
                <button class="flex items-center space-x-1 text-gray-500  dark:hover:text-gray-300">
                    <img src="assets/icons/comment.svg" class="w-6 h-6" alt="Comment" />
                    <span>Comment</span>
                </button>
            </div>
            <div class="post-content">
                <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">${post.title}</h2>
                <p class="text-gray-600 dark:text-gray-300 mb-4">${post.body}</p>
            </div>

            </div>
        `;
        container.appendChild(postElement);
    });

    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            const likeIcon = this.querySelector('svg');
            const likeCount = this.querySelector('.like-count');

            const isLiked = likeIcon.classList.toggle('text-red-500');
            likeIcon.classList.toggle('fill-current', isLiked);
            
            let currentLikes = parseInt(likeCount.textContent);
            likeCount.textContent = isLiked ? currentLikes + 1 : currentLikes - 1;

            const likes = JSON.parse(localStorage.getItem('postLikes')) || {};
            likes[postId] = isLiked;
            localStorage.setItem('postLikes', JSON.stringify(likes));

            likeIcon.classList.add('animate-heart');       // Add animation class
            setTimeout(() => {
                likeIcon.classList.remove('animate-heart'); // Remove animation class
            }, 500);
        });
    });
      
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            const likeIcon = this.querySelector('img');
            const likeCount = this.querySelector('.like-count');
            let currentLikes = parseInt(likeCount.textContent);
            
            if (likeIcon.src.includes('heart-red')) {
                likeIcon.src = 'assets/icons/heart-icon.svg';
                likeIcon.classList.remove('text-red-500');
                likeIcon.classList.add('text-gray-500');
                likeCount.textContent = currentLikes - 1;
            } else {
                likeIcon.src = 'assets/icons/heart-red.svg';
                likeIcon.classList.remove('text-gray-500');
                likeIcon.classList.add('text-red-500');
                likeCount.textContent = currentLikes + 1;
            }
            
            const likes = JSON.parse(localStorage.getItem('postLikes')) || {};
            likes[postId] = likeIcon.src.includes('heart-red');
            localStorage.setItem('postLikes', JSON.stringify(likes));
        });
    });

}

// Fetch posts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchPosts().catch(error => {
        console.error('Error fetching posts:', error);
        const container = document.getElementById('app');
        if (container) {
            container.innerHTML = '<div class="text-center text-red-500 p-4">Error loading posts. Please try again later.</div>';
        }
    });
});



