let postsArray = [];
function getNextUserNumber() {
    return 101;
}

async function fetchPosts() {
    const container = document.getElementById('feed');
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();
    
    let likes = {};
    postsArray = [...posts];
    
    const feed = document.getElementById('feed');
    feed.innerHTML = '';
    
    postsArray.forEach(post => {  
        const postId = post.id;
        const isLiked = likes[postId] || false; 
        const likeCount = post.likes || Math.floor(Math.random() * 100); 
        
        const postElement = document.createElement('div');
        postElement.className = 'bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6 mb-4 border border-gray-100 dark:border-gray-700/50';
        const userName = `User ${post.userId || 1}`; 
        const heartIconSrc = isLiked ? 'assets/icons/heart-red.svg' : 'assets/icons/heart-icon.svg';
        const postImage = post.image || `https://picsum.photos/800/600?random=${postId}`;
        
        postElement.innerHTML = `
            <div class="flex items-center mb-4">
                <img src="https://ui-avatars.com/api/?name=${userName}&background=random" class="w-10 h-10 rounded-full mr-3" alt="User">
                <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">User ${post.id}</h3>
                    <p class="text-xs text-gray-500">Just now</p>
                </div>
            </div>
            <img src="${postImage}" class="w-full h-64 object-cover rounded-lg mb-4" alt="Post">
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
                <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">${post.title || 'Untitled Post'}</h2>
                <p class="text-gray-600 dark:text-gray-300 mb-4">${post.body || post.description || ''}</p>
            </div>

            </div>
            
        `;
        feed.appendChild(postElement);
    });

    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            const likeIcon = this.querySelector('img');
            const likeCount = this.querySelector('.like-count');
 
            const isLiked = likeIcon.src.includes('heart-red');
            likeIcon.src = isLiked ? 'assets/icons/heart-icon.svg' : 'assets/icons/heart-red.svg';
            
            let currentLikes = parseInt(likeCount.textContent);
            likeCount.textContent = isLiked ? currentLikes - 1 : currentLikes + 1;
     
            likeIcon.classList.add('animate-heart');
            setTimeout(() => likeIcon.classList.remove('animate-heart'), 500);
        });
    });

}


document.addEventListener('DOMContentLoaded', () => {
    fetchPosts().catch(error => {
        console.error('Error fetching posts:', error);
        const container = document.getElementById('app');
        if (container) {
            container.innerHTML = '<div class="text-center text-red-500 p-4">Error loading posts. Please try again later.</div>';
        }
    });
});


const uploadBtn = document.getElementById("uploadBtn");

    uploadBtn.addEventListener("click", () => {
      const imageInput = document.getElementById("imageInput");
      const title = document.getElementById("titleInput").value;
      const desc = document.getElementById("descInput").value;

      if (!imageInput.files[0] || !title || !desc) {
        alert("Please select image, enter title and description!");
        return;
      }

        const reader = new FileReader();
        reader.onload = function (event) {
            const userNumber = getNextUserNumber();
            const newPost = {
                id: Date.now(),
                userId: userNumber,
                title: title,
                body: desc,
                image: event.target.result,
                likes: 0
            };
            
            // Add to the beginning of postsArray
            postsArray.unshift(newPost);
            
            // Create the post element directly
            const feed = document.getElementById('feed');
            const postElement = document.createElement('div');
            postElement.className = 'bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6 mb-4 border border-gray-100 dark:border-gray-700/50';
            
            postElement.innerHTML = `
                <div class="flex items-center mb-4">
                    <img src="https://ui-avatars.com/api/?name=User+${newPost.userId}&background=random" class="w-10 h-10 rounded-full mr-3" alt="User">
                    <div>
                        <h3 class="font-medium text-gray-900 dark:text-white">User ${newPost.userId}</h3>
                        <p class="text-xs text-gray-500">Just now</p>
                    </div>
                </div>
                <img src="${event.target.result}" class="w-full h-64 object-cover rounded-lg mb-4" alt="Post">
                <div class="flex space-x-4 mb-3">
                    <button class="like-btn flex items-center space-x-1 group" data-post-id="${newPost.id}">
                        <img src="assets/icons/heart-icon.svg" class="w-6 h-6 text-gray-500 group-hover:text-red-400 transition-colors" alt="Like" />
                        <span class="like-count">0</span>
                    </button>
                    <button class="flex items-center space-x-1 text-gray-500 dark:hover:text-gray-300">
                        <img src="assets/icons/comment.svg" class="w-6 h-6" alt="Comment" />
                        <span>Comment</span>
                    </button>
                </div>
                <div class="post-content">
                    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">${title || 'Untitled Post'}</h2>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">${desc || ''}</p>
                </div>
            `;
            
            if (feed.firstChild) {
                feed.insertBefore(postElement, feed.firstChild);
            } else {
                feed.appendChild(postElement);
            }
            
            const likeBtn = postElement.querySelector('.like-btn');
            likeBtn.addEventListener('click', function() {
                const likeIcon = this.querySelector('img');
                const likeCount = this.querySelector('.like-count');
                
                const isLiked = likeIcon.src.includes('heart-red');
                likeIcon.src = isLiked ? 'assets/icons/heart-icon.svg' : 'assets/icons/heart-red.svg';
                
                let currentLikes = parseInt(likeCount.textContent);
                likeCount.textContent = isLiked ? currentLikes - 1 : currentLikes + 1;
                
                likeIcon.classList.add('animate-heart');
                setTimeout(() => likeIcon.classList.remove('animate-heart'), 500);
            });
            
            imageInput.value = "";
            document.getElementById("titleInput").value = "";
            document.getElementById("descInput").value = "";
            uploadForm.classList.add("hidden");
        };
      
      reader.readAsDataURL(imageInput.files[0]);
    });


const createPostBtn = document.getElementById("createPostBtn");
const uploadForm = document.getElementById("uploadForm");
const cancelBtn = document.getElementById("cancelBtn");

const toggleForm = () => {
    uploadForm.classList.toggle("hidden");
};

createPostBtn.addEventListener("click", toggleForm);
cancelBtn.addEventListener("click", toggleForm);
cancelBtn.addEventListener("click", () => {
    document.getElementById("imageInput").value = "";
    document.getElementById("titleInput").value = "";
    document.getElementById("descInput").value = "";
});

// stories

