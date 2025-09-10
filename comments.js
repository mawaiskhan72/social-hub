async function fetchComments(postId) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}&_limit=5`);
    return await response.json();
}

function addComment(postId, commentText) {
    return {
        postId: postId,
        id: Date.now(), 
        name: 'You',
        email: 'current@user.com',
        body: commentText
    };
}

export function initComments() {
    document.addEventListener('click', async function(event) {
        if (event.target.closest('.comment-btn')) {
            const button = event.target.closest('.comment-btn');
            const postId = button.getAttribute('data-post-id');
            const commentsContainer = document.getElementById(`comments-${postId}`);
            
            if (!commentsContainer) return;
          
            if (commentsContainer.classList.contains('hidden')) {
                commentsContainer.innerHTML = '<p class="text-center py-2 text-gray-500">Loading comments...</p>';
                commentsContainer.classList.remove('hidden');
                
                const comments = await fetchComments(postId);
  
                let commentsHtml = '';
                
                if (comments.length > 0) {
                    commentsHtml = comments.map(comment => `
                        <div class="comment bg-gray-50 dark:bg-gray-700/50 p-3 my-2 rounded-lg">
                            <div class="flex items-center mb-1">
                                <span class="font-medium text-sm text-gray-800 dark:text-gray-200">${comment.email.split('@')[0]}</span>
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-300">${comment.body}</p>
                        </div>
                    `).join('');
                } else {
                    commentsHtml = '<p class="text-center py-2 text-gray-500">No comments yet</p>';
                }
                
                commentsHtml += ` 
                    <div class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div class="flex items-center space-x-2">
                            <input type="text" 
                                   class="comment-input flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full py-2 px-4 text-sm focus:outline-none" 
                                   placeholder="Add a comment..."
                                   data-post-id="${postId}">
                            <button class="send-comment p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                                    data-post-id="${postId}">
                                <img src="assets/icons/upload.png" alt="Uploading comment" class="h-5 w-5">
                            </button>
                        </div>
                    </div>
                `;
                
                commentsContainer.innerHTML = commentsHtml;
                
                const commentInput = commentsContainer.querySelector('.comment-input');
                const sendButton = commentsContainer.querySelector('.send-comment');
                
                const sendComment = async () => {
                    const commentText = commentInput.value.trim();
                    if (!commentText) return;
                    
                    const originalButtonHTML = sendButton.innerHTML;
                    sendButton.innerHTML = `
                        <img src="assets/icons/upload.png" alt="Uploading..." class="h-5 w-5">
                    `;
                    
                    const newComment = addComment(postId, commentText);
                    const commentElement = document.createElement('div');
                    commentElement.className = 'comment bg-gray-50 dark:bg-gray-700/50 p-3 my-2 rounded-lg';
                    commentElement.innerHTML = `
                        <div class="flex items-center mb-1">
                            <span class="font-medium text-sm text-gray-800 dark:text-gray-200">${newComment.email.split('@')[0]}</span>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-300">${newComment.body}</p>
                    `;
                    
                    const firstComment = commentsContainer.querySelector('.comment');
                    if (firstComment) {
                        commentsContainer.insertBefore(commentElement, firstComment);
                    } else {
                        commentsContainer.insertBefore(commentElement, commentsContainer.firstChild);
                    }
                    
                    const commentButton = document.querySelector(`.comment-btn[data-post-id="${postId}"]`);
                    if (commentButton) {
                        const countSpan = commentButton.querySelector('span');
                        if (countSpan) {
                            const currentCount = parseInt(countSpan.textContent) || 0;
                            countSpan.textContent = `${currentCount + 1} Comments`;
                        }
                    }

                    commentInput.value = '';
                    sendButton.innerHTML = originalButtonHTML;
                };

                sendButton.addEventListener('click', sendComment);
                commentInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        sendComment();
                    }
                });
            } else {
                commentsContainer.classList.toggle('hidden');
            }
        }
    });
}
