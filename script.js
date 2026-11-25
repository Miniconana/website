const actionBtn = document.getElementById('actionBtn');
const jumpscareVideo = document.getElementById('jumpscareVideo');

if (actionBtn && jumpscareVideo) {
    actionBtn.addEventListener('click', () => {
        jumpscareVideo.style.display = 'block';
        jumpscareVideo.currentTime = 0;
        jumpscareVideo.play();

        jumpscareVideo.onended = () => {
            jumpscareVideo.style.display = 'none';
        };
    });
}

const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.tab;

        tabButtons.forEach((b) => {
            const isSelected = b === btn;
            b.classList.toggle('active', isSelected);
            b.setAttribute('aria-selected', String(isSelected));
        });

        tabPanels.forEach((panel) => {
            const isMatch = panel.id === targetId;
            panel.classList.toggle('active', isMatch);
            panel.hidden = !isMatch;
        });
    });
});

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('senderName');
        const sender = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'there';
        formStatus.textContent = `Thanks, ${sender}! Your message draft has been recorded locally.`;
        contactForm.reset();
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

audio.addEventListener("ended", () => {
    loadTrack(currentIndex + 1, true);
});

function unlockAudioOnFirstInteraction() {
    if (!autoplaySucceeded && audio.paused) {
        tryPlayAudio();
    }
    window.removeEventListener("pointerdown", unlockAudioOnFirstInteraction);
    window.removeEventListener("keydown", unlockAudioOnFirstInteraction);
}

window.addEventListener("pointerdown", unlockAudioOnFirstInteraction);
window.addEventListener("keydown", unlockAudioOnFirstInteraction);

loadTrack(0, true);