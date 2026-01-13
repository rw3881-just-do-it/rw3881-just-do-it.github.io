(function () {
  function initMusic() {
    const music = document.getElementById("bg-music");
    if (!music) return;

    const muteBtn = document.getElementById("mute-btn");
    const volumeSlider = document.getElementById("volume-slider");

    // Stop any other audio (SPA safety)
    document.querySelectorAll("audio").forEach(a => {
      if (a !== music) {
        a.pause();
        a.currentTime = 0;
      }
    });

    // Restore user settings
    const savedVolume = localStorage.getItem("musicVolume");
    const savedMuted = localStorage.getItem("musicMuted");

    music.volume = savedVolume !== null ? savedVolume : 0.3;
    music.muted = savedMuted === "true";
    volumeSlider.value = music.volume;

    updateIcon();

    // Autoplay after interaction
    document.addEventListener("click", () => {
      music.muted = savedMuted === "true";
      music.play().catch(() => {});
      updateIcon();
    }, { once: true });

    // Loop safeguard
    music.addEventListener("ended", () => {
      music.currentTime = 0;
      music.play();
    });

    // Mute toggle
    muteBtn.onclick = (e) => {
      e.stopPropagation();
      music.muted = !music.muted;
      localStorage.setItem("musicMuted", music.muted);
      updateIcon();
    };

    // Volume control
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

  // Run once on load
  document.addEventListener("DOMContentLoaded", initMusic);

  // Run again on SPA navigation
  window.addEventListener("spa:navigation", initMusic);
})();
