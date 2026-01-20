(function () {
  // Single global music reference
  let globalMusic = window.globalMusic || null;

  function initMusic() {
    // Page-specific audio
    const pageAudio = document.getElementById("bg-music");
    const muteBtn = document.getElementById("mute-btn");
    const volumeSlider = document.getElementById("volume-slider");

    if (!muteBtn || !volumeSlider) return;

    const savedVolume = localStorage.getItem("musicVolume");
    const savedMuted = localStorage.getItem("musicMuted");

    if (!globalMusic) {
      // First time: assign the page audio
      if (pageAudio) {
        globalMusic = pageAudio;
        window.globalMusic = globalMusic; // persist globally
        setupMusic(globalMusic, savedVolume, savedMuted, muteBtn, volumeSlider);
      }
    } else {
      // Global music exists
      const newTrack = pageAudio?.dataset.track || null;
      if (newTrack && newTrack !== globalMusic.dataset.track) {
        // Stop old music
        globalMusic.pause();
        globalMusic.currentTime = 0;

        // Replace global music
        globalMusic = pageAudio;
        window.globalMusic = globalMusic;
        setupMusic(globalMusic, savedVolume, savedMuted, muteBtn, volumeSlider);
      }
      // else: same track or page has no audio => keep playing
    }
  }

  function setupMusic(music, savedVolume, savedMuted, muteBtn, volumeSlider) {
    music.volume = savedVolume !== null ? savedVolume : 0.3;
    music.muted = savedMuted === "true";
    volumeSlider.value = music.volume;
    updateIcon();

    let hasStarted = false;

    // Start on first user interaction
    function startMusic() {
      if (hasStarted) return;
      hasStarted = true;
      music.muted = savedMuted === "true";
      music.play().catch(() => {});
      updateIcon();
      document.removeEventListener("click", startMusic);
      document.removeEventListener("keydown", startMusic);
      document.removeEventListener("touchstart", startMusic);
    }

    document.addEventListener("click", startMusic);
    document.addEventListener("keydown", startMusic);
    document.addEventListener("touchstart", startMusic);

    // Loop safeguard
    music.addEventListener("ended", () => {
      music.currentTime = 0;
      music.play();
    });

    // Mute button
    muteBtn.onclick = (e) => {
      e.stopPropagation();
      music.muted = !music.muted;
      localStorage.setItem("musicMuted", music.muted);
      updateIcon();
    };

    // Volume slider
    volumeSlider.oninput = () => {
      music.volume = volumeSlider.value;
      music.muted = music.volume === 0;
      localStorage.setItem("musicVolume", music.volume);
      localStorage.setItem("musicMuted", music.muted);
      updateIcon();
    };

    function updateIcon() {
      muteBtn.textContent =
        music.muted || music.volume === 0 ? "🔇" : "🔊";
    }
  }

  // Run on initial page load
  document.addEventListener("DOMContentLoaded", initMusic);

