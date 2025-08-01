// static/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Page Loader ---
    const loader = document.getElementById('page-loader');
    if (loader) {
        // Hide loader once the page is fully loaded
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            // Remove from DOM after transition
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        });
    }

    // --- Audio Control ---
    const toggleAudioBtn = document.getElementById('toggleAudio');
    const clickSound = new Audio('/static/audio/click.mp3');
    const successSound = new Audio('/static/audio/success.mp3');
    let isAudioEnabled = true;

    // Preload sounds
    clickSound.preload = 'auto';
    successSound.preload = 'auto';

    if (toggleAudioBtn) {
        toggleAudioBtn.addEventListener('click', () => {
            isAudioEnabled = !isAudioEnabled;
            const icon = toggleAudioBtn.querySelector('i');
            if (isAudioEnabled) {
                icon.classList.remove('fa-volume-mute');
                icon.classList.add('fa-volume-up');
                playClickSound();
            } else {
                icon.classList.remove('fa-volume-up');
                icon.classList.add('fa-volume-mute');
            }
        });
    }

    // Global sound functions
    window.playClickSound = () => {
        if (isAudioEnabled) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.error("Error playing click sound:", e));
        }
    };

    window.playSuccessSound = () => {
        if (isAudioEnabled) {
            successSound.currentTime = 0;
            successSound.play().catch(e => console.error("Error playing success sound:", e));
        }
    };
    
    // Add click sound to all buttons and links
    document.querySelectorAll('a, button, .nav-link').forEach(el => {
        el.addEventListener('click', () => {
            window.playClickSound();
        });
    });

    // --- Confetti ---
    window.triggerConfetti = () => {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 150,
                spread: 90,
                origin: { y: 0.6 }
            });
        }
    };

    // --- Animate cards on scroll ---
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        observer.observe(card);
    });
});