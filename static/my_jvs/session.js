function checkSessionAndReload() {
    const initialIdElement = document.getElementById('initial-user-id');
    if (!initialIdElement) return;

    const initialUserId = initialIdElement.value;
    if (!initialUserId) return; 

    fetch('/api/whoami')
        .then(response => {
            if (response.status === 401) {
                throw new Error('Session Logged Out'); 
            }
            return response.json();
        })
        .then(data => {
            const currentUserId = data.id ? String(data.id) : null;
            
            
            if (currentUserId !== initialUserId) {
                console.warn(`[Session Mismatch] Reloading...`);
                window.location.href = '/';
            }
        })
        .catch(error => {
            console.error("Session Check Error:", error.message);
            if (error.message === 'Session Logged Out') {
                window.location.href = '/';
            }
        });
}

window.addEventListener('focus', checkSessionAndReload); 

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        checkSessionAndReload();
    }
}, false);