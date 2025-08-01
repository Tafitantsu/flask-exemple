// --- Page Loader ---
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.classList.add('hidden');
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // --- Audio Control ---
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const sounds = {};
    let isMuted = localStorage.getItem('isMuted') === 'true';

    const audioToggleButton = document.getElementById('toggleAudio');
    const audioIcon = audioToggleButton ? audioToggleButton.querySelector('i') : null;

    function updateAudioButton() {
        if (!audioIcon) return;
        if (isMuted) {
            audioIcon.classList.remove('fa-volume-up');
            audioIcon.classList.add('fa-volume-mute');
        } else {
            audioIcon.classList.remove('fa-volume-mute');
            audioIcon.classList.add('fa-volume-up');
        }
    }

    function loadSound(name, url) {
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                sounds[name] = audioBuffer;
            })
            .catch(e => console.error(`Error loading sound ${name}:`, e));
    }

    // Function to play sound
    window.playSound = function(name) {
        if (isMuted || !sounds[name] || audioContext.state === 'suspended') return;
        const source = audioContext.createBufferSource();
        source.buffer = sounds[name];
        source.connect(audioContext.destination);
        source.start(0);
    }

    if (audioToggleButton) {
        audioToggleButton.addEventListener('click', () => {
            // Resume AudioContext if it was suspended
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            isMuted = !isMuted;
            localStorage.setItem('isMuted', isMuted);
            updateAudioButton();
            playSound('click'); // Play a click sound on toggle
        });
    }

    // Preload sounds defined in the layout
    if (document.querySelector("link[href*='click.mp3']")) {
        loadSound('click', '/static/audio/click.mp3');
    }
    if (document.querySelector("link[href*='success.mp3']")) {
        loadSound('success', '/static/audio/success.mp3');
    }
    // Add more sounds here as needed
    // loadSound('error', '/static/audio/error.mp3');


    // --- Bootstrap Tooltips ---
    // Initialize tooltips for better UX
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // --- Initializations ---
    updateAudioButton();

});
