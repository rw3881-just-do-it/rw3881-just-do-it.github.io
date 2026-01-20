(function() {
  const music = document.getElementById("global-music");
  const stopBtn = document.getElementById("mute-btn"); // we reuse the same element
  const volumeSlider = document.getElementById("volume-slider");

  if (!music || !stopBtn || !volumeSlider) return;

  // Restore user settings
  const savedVolume = localStorage.getItem("musicVolume");
  music.volume = savedVolume !== null ? savedVolume : 0.3;
  volumeSlider.value = music.volume;

  let isPlaying = false;

  function updateIcon() {
    stopBtn.textContent = isPlaying ? "⏸️" : "▶️";
  }

  function playMusic() {
    music.play().then(() => {
      isPlaying = true;
      updateIcon();
    }).catch(() => {});
  }

  function pauseMusic() {
    music.pause();
    isPlaying = false;
    updateIcon();
  }

  // Start on first user gesture
  function startMusic() {
    if (!isPlaying) playMusic();
    document.removeEventListener("click", startMusic);
    document.removeEventListener("keydown", startMusic);
    document.removeEventListener("touchstart", startMusic);
  }

  document.addEventListener("click", startMusic);
  document.addEventListener("keydown", startMusic);
  document.addEventListener("touchstart", startMusic);

  // Stop / play toggle button
  stopBtn.onclick = (e) => {
    e.stopPropagation();
    if (isPlaying) pauseMusic();
    else playMusic();
  };

  // Volume control
  volumeSlider.oninput = () => {
    music.volume = volumeSlider.value;
    localStorage.setItem("musicVolume", music.volume);
  };

  // Loop safeguard
  music.addEventListener("ended", () => {
    music.currentTime = 0;
    music.play();
    isPlaying = true;
    updateIcon();
  });

  // SPA navigation
  window.addEventListener("spa:navigation", () => {
    const pageAudio = document.querySelector('[data-track]');
    if (pageAudio) {
      const track = pageAudio.dataset.track;
      const src = pageAudio.src || pageAudio.getAttribute('src');

      if (music.src !== src) {
        music.src = src;
        music.dataset.track = track;
        music.currentTime = 0;
        if (isPlaying) playMusic();
      }
    }
  });

  // Initialize icon
  updateIcon();

})();
