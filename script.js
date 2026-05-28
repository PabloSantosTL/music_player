player.js


console.clear();

console.log("JS carregado");

document.addEventListener("DOMContentLoaded", () => {

  console.log("DOM carregado");

  if (typeof YT === "undefined") {

    console.error("YT API NAO CARREGOU");

    return;

  }

  console.log("YT API encontrada");

  // =========================
  // ELEMENTOS
  // =========================

  const playerTrack =
    document.getElementById("player-track");

  const bgArtwork =
    document.getElementById("player-bg-artwork");

  const albumName =
    document.getElementById("album-name");

  const trackName =
    document.getElementById("track-name");

  const albumArt =
    document.getElementById("album-art");

  const sArea =
    document.getElementById("seek-bar-container");

  const seekBar =
    document.getElementById("seek-bar");

  const trackTime =
    document.getElementById("track-time");

  const seekTime =
    document.getElementById("seek-time");

  const sHover =
    document.getElementById("s-hover");

  const playPauseButton =
    document.getElementById("play-pause-button");

  const tProgress =
    document.getElementById("current-time");

  const tTime =
    document.getElementById("track-length");

  const icon =
    playPauseButton.querySelector("i");

  console.log("Elementos carregados");


  // =========================
  // URL PARAMS
  // =========================

  const params =
    new URLSearchParams(window.location.search);

  const musicName =
    params.get("name") ||
    "Dawn";

  const artistName =
    params.get("artist") ||
    "Skylike";

  const imageUrl =
    params.get("image") ||
    "https://singhimalaya.github.io/Codepen/assets/img/album-arts/2.jpg";

  const youtubeUrl =
    params.get("link") ||
    "https://youtu.be/dQw4w9WgXcQ";

  console.log(
    "URL recebida:",
    youtubeUrl
  );


  // =========================
  // GET VIDEO ID
  // =========================

  function getYoutubeId(url) {

    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

    const match =
      url.match(regExp);

    return (
      match &&
      match[2].length === 11
    )
      ? match[2]
      : null;

  }

  const videoId =
    getYoutubeId(youtubeUrl);

  console.log(
    "VIDEO ID:",
    videoId
  );

  if (!videoId) {

    console.error(
      "VIDEO ID INVALIDO"
    );

    return;

  }


  // =========================
  // VARIAVEIS
  // =========================

  let player;

  let seekT;
  let seekLoc;
  let seekBarPos;

  let firstPlay = true;


  // =========================
  // TEXT SCROLL
  // =========================

  function setupScrollingText() {

    console.log(
      "Setup texto"
    );

    albumName.innerHTML =
      musicName;

    trackName.innerHTML =
      artistName;

  }


  // =========================
  // PLAY / PAUSE
  // =========================

  function playPause() {

    console.log("=================================");
    console.log("BOTAO PLAY");
    console.log("=================================");

    if (!player) {

      console.error(
        "PLAYER NAO EXISTE"
      );

      return;

    }

    const state =
      player.getPlayerState();

    console.log(
      "Player State:",
      state
    );

    // =========================
    // PLAY
    // =========================

    if (state !== 1) {

      console.log("PLAY");

      playerTrack.classList.add(
        "active"
      );

      albumArt.classList.add(
        "active"
      );

      icon.className =
        "fas fa-pause";

      // PRIMEIRO PLAY
      if (firstPlay) {

        console.log(
          "Primeiro play"
        );

        // IMPORTANTE:
        // loadVideoById inicia
        // corretamente o stream

        player.loadVideoById({
          videoId: videoId,
          startSeconds: 0
        });

        // garante play
        setTimeout(() => {

          console.log(
            "Forcando play"
          );

          player.playVideo();

        }, 300);

        // desmuta DEPOIS
        // do video tocar

       // desmuta DEPOIS
// do video tocar

setTimeout(() => {

  try {

    player.unMute();

    player.setVolume(100);

  } catch (e) {

    console.error(
      "Erro ao desmutar",
      e
    );

  }

}, 1500);

// verifica se o navegador pausou
// automaticamente ao liberar audio

setTimeout(() => {

  if (
    player &&
    player.getPlayerState() === 2 &&
    player.getCurrentTime() < 2
  ) {

    console.warn(
      "PLAYER NAO SUPORTADO"
    );

    playerTrack.classList.remove(
      "active"
    );

    albumArt.classList.remove(
      "active"
    );

    icon.className =
      "fas fa-play";

    alert(
      "Player não suportado neste navegador."
    );

  }

}, 2600);

firstPlay = false;

        

      }

      // PLAY NORMAL
      else {

        console.log(
          "Retomando"
        );

        player.playVideo();

      }

    }

    // =========================
    // PAUSE
    // =========================

    else {

      console.log(
        "PAUSANDO"
      );

      player.pauseVideo();

      playerTrack.classList.remove(
        "active"
      );

      albumArt.classList.remove(
        "active"
      );

      icon.className =
        "fas fa-play";

    }

  }


  // =========================
  // SEEK HOVER
  // =========================

  function showHover(event) {

    if (!player) return;

    const duration =
      player.getDuration();

    seekBarPos =
      sArea.getBoundingClientRect();

    seekT =
      event.clientX -
      seekBarPos.left;

    seekLoc =
      duration *
      (seekT / sArea.offsetWidth);

    sHover.style.width =
      seekT + "px";

  }


  // =========================
  // HIDE HOVER
  // =========================

  function hideHover() {

    sHover.style.width =
      "0px";

  }


  // =========================
  // SEEK CLICK
  // =========================

  function playFromClickedPos() {

    if (!player) return;

    console.log(
      "SEEK:",
      seekLoc
    );

    player.seekTo(
      seekLoc,
      true
    );

  }


  // =========================
  // UPDATE TIME
  // =========================

  function updateCurrTime() {

    if (!player) return;

    const duration =
      player.getDuration();

    if (!duration) return;

    const current =
      player.getCurrentTime();

    const progress =
      (current / duration) * 100;

    seekBar.style.width =
      progress + "%";

    const curMinutes =
      Math.floor(current / 60);

    const curSeconds =
      Math.floor(current % 60);

    const durMinutes =
      Math.floor(duration / 60);

    const durSeconds =
      Math.floor(duration % 60);

    tProgress.innerText =
      `${String(curMinutes).padStart(2, "0")}:${String(curSeconds).padStart(2, "0")}`;

    tTime.innerText =
      `${String(durMinutes).padStart(2, "0")}:${String(durSeconds).padStart(2, "0")}`;

  }


  // =========================
  // LOAD TRACK
  // =========================

  function selectTrack() {

    console.log(
      "Selecionando track"
    );

    setupScrollingText();

    const oldImages =
      albumArt.querySelectorAll(
        "img"
      );

    oldImages.forEach(img => {

      img.remove();

    });

    const newImage =
      document.createElement("img");

    newImage.src =
      imageUrl;

    newImage.classList.add(
      "active"
    );

    albumArt.appendChild(
      newImage
    );

    bgArtwork.style.backgroundImage =
      `url(${imageUrl})`;

  }


  // =========================
  // INIT PLAYER
  // =========================

  function initPlayer() {

    console.log(
      "INIT PLAYER"
    );

    selectTrack();

    playPauseButton.addEventListener(
      "click",
      playPause
    );

    sArea.addEventListener(
      "mousemove",
      showHover
    );

    sArea.addEventListener(
      "mouseout",
      hideHover
    );

    sArea.addEventListener(
      "click",
      playFromClickedPos
    );

    setInterval(() => {

      updateCurrTime();

    }, 500);

    console.log(
      "Eventos registrados"
    );

  }


  // =========================
  // YOUTUBE INIT
  // =========================

  window.onYouTubeIframeAPIReady =
    function () {

      console.log(
        "YT IFRAME API READY"
      );

      player =
        new YT.Player(
          "youtube-player",
          {

            videoId: videoId,

            height: "200",
            width: "300",

            playerVars: {

              autoplay: 0,
              controls: 1,
              rel: 0,
              modestbranding: 1,

              // MUITO IMPORTANTE
              playsinline: 1,

              // autoplay policy
              mute: 1

            },

            events: {

              onReady: () => {

                console.log(
                  "PLAYER READY"
                );

                // IMPORTANTE:
                // libera autoplay

                const iframe =
                  player.getIframe();

                iframe.setAttribute(
                  "allow",
                  "autoplay"
                );

                console.log(
                  "Video Data:",
                  player.getVideoData()
                );

                initPlayer();

              },

              onError: (err) => {

                console.error("=================================");
                console.error("ERRO PLAYER");
                console.error("=================================");

                console.error(
                  "Codigo erro:",
                  err.data
                );

              },

              onStateChange:
                (event) => {

                  console.log("=================================");
                  console.log("STATE CHANGE");
                  console.log("=================================");

                  console.log(
                    "Novo State:",
                    event.data
                  );

                  if (
                    event.data === -1
                  ) {

                    console.warn(
                      "VIDEO NAO INICIOU"
                    );

                  }

                  if (
                    event.data === 3
                  ) {

                    console.warn(
                      "VIDEO BUFFERING"
                    );

                  }

                  if (
                    event.data === 1
                  ) {

                    console.warn(
                      "VIDEO TOCANDO"
                    );

                  }

                  if (
                    event.data === 2
                  ) {

                    console.warn(
                      "VIDEO PAUSADO"
                    );

                  }

                  if (
                    event.data === 5
                  ) {

                    console.warn(
                      "VIDEO CUED"
                    );

                  }

                  console.log(
                    "Tempo atual:",
                    player.getCurrentTime()
                  );

                  console.log(
                    "Duracao:",
                    player.getDuration()
                  );

                  console.log(
                    "Loaded Fraction:",
                    player.getVideoLoadedFraction()
                  );

                }

            }

          }
        );

    };


  // =========================
  // START API
  // =========================

  if (
    typeof YT !==
      "undefined" &&
    YT.Player
  ) {

    console.log(
      "YT JA ESTAVA PRONTO"
    );

    window.onYouTubeIframeAPIReady();

  }

});