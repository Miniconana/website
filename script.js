const actionBtn = document.getElementById('actionBtn');
const jumpscareVideo = document.getElementById('jumpscareVideo');

if (actionBtn && jumpscareVideo) {
    actionBtn.addEventListener('click', () => {
        jumpscareVideo.style.display = 'block';
        jumpscareVideo.currentTime = 0;
        jumpscareVideo.play();

        // Hide again once the video finishes
        jumpscareVideo.onended = () => {
            jumpscareVideo.style.display = 'none';
        };
    });
}

const tracks = [
    { title: "I will stand (BG musicvideo)", src: "I will stand (BG musicvideo).mp3" },
    { title: "Favorite Track 2", src: "track2.mp3" }
];

const audio = document.getElementById("audioPlayer");
const trackTitle = document.getElementById("trackTitle");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const seekBar = document.getElementById("seekBar");

let currentIndex = 0;
let autoplaySucceeded = false;

function tryPlayAudio() {
    return audio.play().then(() => {
        autoplaySucceeded = true;
    }).catch(() => {
        autoplaySucceeded = false;
    });
}

function loadTrack(index, shouldPlay = false) {
    currentIndex = (index + tracks.length) % tracks.length;
    const track = tracks[currentIndex];
    audio.src = track.src;
    trackTitle.textContent = track.title;
    seekBar.value = 0;

    if (shouldPlay) {
        tryPlayAudio();
    }
}

playPauseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (audio.paused) {
        tryPlayAudio();
    } else {
        audio.pause();
    }
});

prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    loadTrack(currentIndex - 1, !audio.paused || !autoplaySucceeded);
});

nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    loadTrack(currentIndex + 1, !audio.paused || !autoplaySucceeded);
});

audio.addEventListener("play", () => {
    playPauseBtn.textContent = "Pause";
    autoplaySucceeded = true;
});

audio.addEventListener("pause", () => {
    playPauseBtn.textContent = "Play";
});

audio.addEventListener("timeupdate", () => {
    if (!Number.isNaN(audio.duration) && audio.duration > 0) {
        seekBar.value = Math.floor((audio.currentTime / audio.duration) * 100);
    }
});

seekBar.addEventListener("input", () => {
    if (!Number.isNaN(audio.duration) && audio.duration > 0) {
        audio.currentTime = (seekBar.value / 100) * audio.duration;
    }
});

// Auto-advance to the next track when one finishes
audio.addEventListener("ended", () => {
    loadTrack(currentIndex + 1, true);
});

// Fallback: if the browser blocked immediate autoplay on load, start on first user gesture
function unlockAudioOnFirstInteraction() {
    if (!autoplaySucceeded && audio.paused) {
        tryPlayAudio();
    }
    window.removeEventListener("pointerdown", unlockAudioOnFirstInteraction);
    window.removeEventListener("keydown", unlockAudioOnFirstInteraction);
}

window.addEventListener("pointerdown", unlockAudioOnFirstInteraction);
window.addEventListener("keydown", unlockAudioOnFirstInteraction);

// Attempt to start the first track immediately on load
loadTrack(0, true);