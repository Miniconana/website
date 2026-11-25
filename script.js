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