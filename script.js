let snoopy = document.getElementById("snoopy");
let puntos = document.getElementById("puntos");
let juego = document.querySelector(".juego");
let score = 0;
let saltando = false;
let gameOver = false;
let crearObstaculoInterval;

function saltar() {
  if (saltando || gameOver) return;

  const audioSalto = document.getElementById('audioSalto');
  if (audioSalto) {
    audioSalto.currentTime = 0;
    audioSalto.play().catch(() => {});
  }

  saltando = true;
  snoopy.style.bottom = "230px";
  snoopy.style.transition = "bottom 0.35s cubic-bezier(0.1, 0.7, 0.1, 1)";
  setTimeout(() => {
    snoopy.style.bottom = "40px";
    snoopy.style.transition = "bottom 0.35s ease-in"; 
    setTimeout(() => saltando = false, 400);
  }, 400);
}

function crearObstaculo() {
  if (gameOver) return;

  let obs = document.createElement("div");
  obs.classList.add("obstaculo");
  juego.appendChild(obs);

  let yaSumoPunto = false;

  let colisionCheck = setInterval(() => {
    if (gameOver) {
      clearInterval(colisionCheck);
      return;
    }

    let snoopyRect = snoopy.getBoundingClientRect();
    let obsRect = obs.getBoundingClientRect();
    let snoopyBottom = parseInt(window.getComputedStyle(snoopy).bottom);

    if (
      obsRect.left < snoopyRect.right &&
      obsRect.right > snoopyRect.left &&
      obsRect.top < snoopyRect.bottom &&
      obsRect.bottom > snoopyRect.top &&
      snoopyBottom <= 75
    ) {
      mostrarMensajePerdida("¡Perdiste! :c Puntaje: " + score);
      reiniciarJuego();
      clearInterval(colisionCheck);
    }

    if (!yaSumoPunto && obsRect.right < snoopyRect.left && saltando) {
      score++;
      puntos.innerText = score;
      yaSumoPunto = true;

      if (score >= 21) {
        terminarJuego();
      }
    }
  }, 10);

  setTimeout(() => {
    obs.remove();
    clearInterval(colisionCheck);
  }, 3000);
}

function reiniciarJuego() {
  // SUENA EL BONK/PIEDRA AL CHOACAR
  const audioPiedra = document.getElementById('audioPiedra');
  if (audioPiedra) {
    audioPiedra.currentTime = 0;
    audioPiedra.play().catch(() => {});
  }

  gameOver = true;
  document.querySelectorAll(".obstaculo").forEach(obs => obs.remove());
  score = 0;
  puntos.innerText = score;
  saltando = false;

  clearInterval(crearObstaculoInterval);

  setTimeout(() => {
    gameOver = false;
    crearObstaculoInterval = setInterval(crearObstaculo, 2500);
  }, 1000);
}

function terminarJuego() {
  gameOver = true;
  clearInterval(crearObstaculoInterval);
  document.querySelectorAll(".obstaculo").forEach(obs => obs.remove());

  let mensajeFinal = document.createElement("div");
  mensajeFinal.classList.add("modal-flores");

  mensajeFinal.innerHTML = `
    <div class="tarjeta-flores">
      <div class="contenedor-imagen">
        <img src="img/snoopy flor amarilla.png" class="imagen-snoopy-flores" alt="Snoopy con flores amarillas" />
      </div>
      <div class="texto-victoria">
        <h2>Hecho con cada break jskds</h2>
        <h1>!Feliz dia! ^^ </h1>
        <p>~Mar ♥</p>
      </div>
    </div>
  `;

  document.body.appendChild(mensajeFinal);
}

// Control música
const btnMusica = document.getElementById('btnMusica');
const musica = document.getElementById("musicaFondo");
const btnJugar = document.getElementById('btnJugar');

btnJugar.addEventListener('click', () => {
  btnJugar.style.display = 'none';
  crearObstaculoInterval = setInterval(crearObstaculo, 2500);

  if (musica && musica.paused) {
    musica.volume = 0.5;
    musica.play().catch(() => {});
  }
});

btnMusica.addEventListener('click', () => {
  if (musica.paused) {
    musica.play();
    btnMusica.textContent = '🔈 Pausar';
  } else {
    musica.pause();
    btnMusica.textContent = '🎵 Música';
  }
});

document.addEventListener("keydown", saltar);
document.addEventListener("touchstart", saltar);

function mostrarMensajePerdida(texto) {
  let mensaje = document.createElement("div");
  mensaje.classList.add("mensaje-perdida");
  mensaje.innerText = texto;
  document.body.appendChild(mensaje);

  setTimeout(() => {
    mensaje.remove();
  }, 3000);
}

window.addEventListener("load", () => {
  if (musica) {
    musica.volume = 0.5;
    musica.play().catch(() => {
      document.addEventListener("click", () => {
        musica.play().catch(() => {});
      }, { once: true });
    });
  }

  btnMusica.textContent = musica.paused ? '🎵 Música' : '🔈 Pausar';
});