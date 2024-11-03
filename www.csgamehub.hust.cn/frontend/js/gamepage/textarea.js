const textarea = document.getElementById('commentText');
function adjustTextareaHeight() {
    // Calculate the height based on the scrollHeight  
    this.style.height = 'auto';
    if (this.scrollHeight >= 135) {
        this.style.overflowY = 'auto';
        this.style.height = '135px';
    }
    else {
        this.style.overflowY = 'hidden';
        this.style.height = `${this.scrollHeight}px`;
    }
}

// Add event listeners for input and keyup to adjust height  
textarea.addEventListener('input', adjustTextareaHeight);
textarea.addEventListener('keyup', adjustTextareaHeight);