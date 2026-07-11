/* Music card carousel and player. */
const pokerCarousel = {
  songs: [
    {
      img: "img/5.png",
      songId: "1471322462",
      name: "무지개는 있다",
      artist: "雨片 · Cover",
    },
    {
      img: "img/2.png",
      songId: "1993846994",
      name: "다시 너를",
      artist: "柠柠柠奈 · Cover",
    },
    {
      img: "img/3.png",
      songId: "1831265632",
      name: "Baby, Don't Cry",
      artist: "RinGo · Cover",
    },
    {
      img: "img/4.png",
      songId: "2010336994",
      name: "눈, 코, 입",
      artist: "Säga · Cover",
    },
    {
      img: "img/1.png",
      songId: "3371230609",
      name: "첫 눈",
      artist: "后来的你 · Cover",
    },
  ],

  cards: [],
  currentSongIdx: 0,
  isPlaying: false,
  audio: null,
  nowPlayingTimer: null,
  els: {},

  init() {
    this.audio = document.getElementById("poker-audio");
    this.cards = [...document.querySelectorAll(".melody-page .poker-card")];
    this.els = {
      player: document.getElementById("poker-player"),
      songName: document.getElementById("player-title"),
      artistName: document.getElementById("player-artist"),
      playBtn: document.getElementById("player-play-btn"),
      prevBtn: document.getElementById("player-prev-btn"),
      nextBtn: document.getElementById("player-next-btn"),
      miniCover: document.getElementById("player-mini-cover"),
      currentTime: document.getElementById("player-current-time"),
      durationEl: document.getElementById("player-duration"),
      progress: document.getElementById("player-progress"),
      nowPlaying: document.getElementById("poker-now-playing"),
      melodyPage: document.querySelector(".melody-page"),
      cardStage: document.querySelector(".melody-card-stage"),
      officialPlayer: document.getElementById("music-official-player"),
      officialFrame: document.getElementById("music-official-frame"),
    };

    if (!this.audio || !this.els.player || !this.cards.length) return;
    if (this.els.nowPlaying && this.els.cardStage) {
      this.els.cardStage.appendChild(this.els.nowPlaying);
      this.els.nowPlaying.classList.add("poker-now-playing--card-top");
    }

    this.cards.forEach((card) => {
      card._songIndex = Number.parseInt(card.dataset.songIndex, 10) || 0;
    });
    this.updatePlayerUI(0);
    this.updateActiveCard();
    this.bindEvents();
  },

  bindEvents() {
    this.els.playBtn?.addEventListener("click", () => this.togglePlay());
    this.els.prevBtn?.addEventListener("click", () => this.prevSong());
    this.els.nextBtn?.addEventListener("click", () => this.nextSong());
    this.cards.forEach((card) => {
      card.addEventListener("click", () => this.playSong(card._songIndex));
    });
    this.els.progress?.addEventListener("input", () => {
      const time = Number.parseFloat(this.els.progress.value);
      if (Number.isFinite(time)) this.audio.currentTime = time;
      this.setProgressFill();
    });

    this.audio.addEventListener("loadedmetadata", () => this.updateProgress());
    this.audio.addEventListener("timeupdate", () => this.updateProgress());
    this.audio.addEventListener("ended", () => this.nextSong());
    this.audio.addEventListener("play", () => this.setPlayingState(true));
    this.audio.addEventListener("pause", () => this.setPlayingState(false));
    this.audio.addEventListener("error", () => {
      this.setPlayingState(false);
      this.showOfficialPlayer();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.isPlaying) this.audio.pause();
    });
  },

  playSong(songIndex) {
    if (songIndex < 0 || songIndex >= this.songs.length) return;
    this.currentSongIdx = songIndex;
    const song = this.songs[songIndex];
    this.hideOfficialPlayer();
    this.audio.src = `https://music.163.com/song/media/outer/url?id=${song.songId}.mp3`;
    this.audio.load();
    this.updatePlayerUI(songIndex);
    this.updateActiveCard();
    this.showNowPlaying(song.name);
    this.audio.play().catch(() => {
      this.setPlayingState(false);
      this.showOfficialPlayer();
    });
  },

  prevSong() {
    this.playSong((this.currentSongIdx - 1 + this.songs.length) % this.songs.length);
  },

  nextSong() {
    this.playSong((this.currentSongIdx + 1) % this.songs.length);
  },

  togglePlay() {
    if (!this.audio.src || this.audio.src === window.location.href) {
      this.playSong(this.currentSongIdx);
      return;
    }
    if (this.isPlaying) {
      this.audio.pause();
      return;
    }
    this.audio.play().catch(() => {
      this.showOfficialPlayer();
    });
  },

  setPlayingState(playing) {
    this.isPlaying = playing;
    this.els.player?.classList.toggle("is-playing", playing);
    this.els.player?.classList.toggle("poker-player--paused", !playing);
    this.els.melodyPage?.classList.toggle("is-playing", playing);
    this.updateActiveCard();
  },

  updateActiveCard() {
    this.cards.forEach((card) => {
      card.classList.toggle("is-active", card._songIndex === this.currentSongIdx);
    });
  },

  showOfficialPlayer() {
    const song = this.songs[this.currentSongIdx];
    if (!song || !this.els.officialPlayer || !this.els.officialFrame) return;
    this.els.officialFrame.src =
      `https://music.163.com/outchain/player?type=2&id=${song.songId}&auto=0&height=66`;
    this.els.officialPlayer.hidden = false;
    this.els.player?.classList.add("has-official-player");
    if (this.els.artistName) this.els.artistName.textContent = "请在下方官方播放器中播放";
  },

  hideOfficialPlayer() {
    if (!this.els.officialPlayer || !this.els.officialFrame) return;
    this.els.officialPlayer.hidden = true;
    this.els.officialFrame.removeAttribute("src");
    this.els.player?.classList.remove("has-official-player");
  },

  updatePlayerUI(songIndex) {
    const song = this.songs[songIndex];
    if (!song) return;
    if (this.els.songName) this.els.songName.textContent = song.name;
    if (this.els.artistName) this.els.artistName.textContent = song.artist;
    if (this.els.miniCover) {
      this.els.miniCover.src = song.img;
      this.els.miniCover.alt = `${song.name} cover`;
    }
    if (this.els.currentTime) this.els.currentTime.textContent = "0:00";
    if (this.els.durationEl) this.els.durationEl.textContent = "0:00";
    if (this.els.progress) {
      this.els.progress.value = 0;
      this.els.progress.max = 0;
      this.els.progress.style.setProperty("--progress", "0%");
    }
  },

  updateProgress() {
    const current = Number.isFinite(this.audio.currentTime) ? this.audio.currentTime : 0;
    const duration = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
    if (this.els.currentTime) this.els.currentTime.textContent = this.formatTime(current);
    if (this.els.durationEl) this.els.durationEl.textContent = this.formatTime(duration);
    if (this.els.progress) {
      this.els.progress.max = duration;
      this.els.progress.value = current;
      this.setProgressFill();
    }
  },

  setProgressFill() {
    if (!this.els.progress) return;
    const max = Number.parseFloat(this.els.progress.max);
    const value = Number.parseFloat(this.els.progress.value);
    const percent = max > 0 ? (value / max) * 100 : 0;
    this.els.progress.style.setProperty("--progress", `${percent}%`);
  },

  formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  },

  showNowPlaying(name) {
    const element = this.els.nowPlaying;
    if (!element) return;
    element.textContent = `Now playing: ${name}`;
    element.classList.add("poker-now-playing--show");
    window.clearTimeout(this.nowPlayingTimer);
    this.nowPlayingTimer = window.setTimeout(() => {
      element.classList.remove("poker-now-playing--show");
    }, 3000);
  },
};

document.addEventListener("DOMContentLoaded", () => pokerCarousel.init());
