const textarea = document.getElementById('commentText');
function adjustTextareaHeight() {
    // Calculate the height based on the scrollHeight  
    textarea.style.height = 'auto';
    if (textarea.scrollHeight >= 135) {
        textarea.style.overflowY = 'auto';
        textarea.style.height = '135px';
    }
    else {
        textarea.style.overflowY = 'hidden';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }
}

// Add event listeners for input and keyup to adjust height  
textarea.addEventListener('input', adjustTextareaHeight);
textarea.addEventListener('keyup', adjustTextareaHeight);