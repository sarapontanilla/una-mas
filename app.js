/**
 * ============================================================
 *  CERCA — LÓGICA DE LA APLICACIÓN
 * ============================================================
 * Este archivo controla todo el funcionamiento del juego:
 * - Gestión de niveles y mezcla aleatoria de preguntas.
 * - Alternancia de turnos entre los dos jugadores.
 * - Sistema de valoración y puntuación (Nivel 3).
 * - Cartas especiales cada 10 preguntas.
 * - Navegación entre pantallas ("vistas").
 *
 * PARA CAMBIAR LOS NOMBRES DE LOS JUGADORES:
 *   Modifica las dos constantes JUGADOR_1 y JUGADOR_2 aquí abajo.
 * ============================================================
 */

// ---------------------------------------------------------------
// CONFIGURACIÓN — fácil de modificar
// ---------------------------------------------------------------
const JUGADOR_1 = "Sara";
const JUGADOR_2 = "David";
const PREGUNTAS_POR_CARTA_ESPECIAL = 10;

// ---------------------------------------------------------------
// ESTADO DE LA PARTIDA
// ---------------------------------------------------------------
const estado = {
  nivelActual: 1,              // 1, 2 o 3
  mazos: {},                   // { 1: [preguntas...], 2: [...], 3: [...] } ya mezclados
  preguntaActual: null,        // objeto { texto, tipo }
  turnoInicial: 1,             // qué jugador empieza en la pregunta actual (1 o 2, alterna)
  contadorPreguntasPartida: 0, // total de preguntas respondidas en toda la partida (para cartas especiales)
  turnoCartaEspecial: 1,       // a quién le toca la próxima carta especial (alterna)
  puntuaciones: { 1: 0, 2: 0 },
  nivelesConValoracion: [3],   // en qué niveles se activa la valoración
};

// ---------------------------------------------------------------
// UTILIDADES
// ---------------------------------------------------------------

/** Mezcla un array in-place usando Fisher-Yates */
function mezclar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/** Construye y mezcla el mazo de preguntas de un nivel a partir de la base de datos */
function construirMazo(numeroNivel) {
  const clave = `nivel${numeroNivel}`;
  const nivelData = window.BASE_DE_DATOS[clave];
  if (!nivelData) return [];

  const todas = [];
  nivelData.categorias.forEach(categoria => {
    categoria.preguntas.forEach(texto => {
      todas.push({ texto, tipo: categoria.tipo || "normal" });
    });
  });

  return mezclar(todas);
}

/** Nombre del jugador según su número (1 o 2) */
function nombreJugador(numero) {
  return numero === 1 ? JUGADOR_1 : JUGADOR_2;
}

// ---------------------------------------------------------------
// REFERENCIAS AL DOM
// ---------------------------------------------------------------
const el = {
  app: document.getElementById("app"),

  scoreboard: document.getElementById("scoreboard"),
  scoreName1: document.getElementById("score-name-1"),
  scoreName2: document.getElementById("score-name-2"),
  scoreValue1: document.getElementById("score-value-1"),
  scoreValue2: document.getElementById("score-value-2"),

  viewPortada: document.getElementById("view-portada"),
  viewJuego: document.getElementById("view-juego"),
  viewCarta: document.getElementById("view-carta"),
  viewFinNivel: document.getElementById("view-fin-nivel"),
  viewFinal: document.getElementById("view-final"),

  portadaNombre1: document.getElementById("portada-nombre-1"),
  portadaNombre2: document.getElementById("portada-nombre-2"),
  btnEmpezar: document.getElementById("btn-empezar"),

  nivelActualNum: document.getElementById("nivel-actual-num"),
  btnMenu: document.getElementById("btn-menu"),

  questionCard: document.getElementById("question-card"),
  turnCompass: document.getElementById("turn-compass"),
  turnText: document.getElementById("turn-text"),
  eligeUnoTag: document.getElementById("elige-uno-tag"),
  questionText: document.getElementById("question-text"),

  ratingBox: document.getElementById("rating-box"),
  ratingLabel: document.getElementById("rating-label"),
  ratingButtons: document.querySelectorAll(".rating-btn"),

  btnSiguientePregunta: document.getElementById("btn-siguiente-pregunta"),
  btnSiguienteNivel: document.getElementById("btn-siguiente-nivel"),
  btnSiguienteNivelNum: document.getElementById("btn-siguiente-nivel-num"),
  btnTerminar: document.getElementById("btn-terminar"),

  specialCardFor: document.getElementById("special-card-for"),
  btnContinuarTrasCarta: document.getElementById("btn-continuar-tras-carta"),

  finNivelTitulo: document.getElementById("fin-nivel-titulo"),
  finNivelSubtitulo: document.getElementById("fin-nivel-subtitulo"),
  btnAvanzarNivel: document.getElementById("btn-avanzar-nivel"),
  btnAvanzarNivelNum: document.getElementById("btn-avanzar-nivel-num"),
  btnTerminarDesdeFin: document.getElementById("btn-terminar-desde-fin"),

  finalResumen: document.getElementById("final-resumen"),
  finalScores: document.getElementById("final-scores"),
  finalNombre1: document.getElementById("final-nombre-1"),
  finalNombre2: document.getElementById("final-nombre-2"),
  finalPuntos1: document.getElementById("final-puntos-1"),
  finalPuntos2: document.getElementById("final-puntos-2"),
  btnJugarDeNuevo: document.getElementById("btn-jugar-de-nuevo"),

  menuBackdrop: document.getElementById("menu-backdrop"),
  btnMenuSiguienteNivel: document.getElementById("btn-menu-siguiente-nivel"),
  btnMenuTerminar: document.getElementById("btn-menu-terminar"),
  btnMenuCerrar: document.getElementById("btn-menu-cerrar"),
};

// ---------------------------------------------------------------
// NAVEGACIÓN ENTRE VISTAS
// ---------------------------------------------------------------
const TODAS_LAS_VISTAS = [el.viewPortada, el.viewJuego, el.viewCarta, el.viewFinNivel, el.viewFinal];

function mostrarVista(vista) {
  TODAS_LAS_VISTAS.forEach(v => {
    if (v === vista) return;
    v.classList.remove("view--active", "view--entering");
  });
  vista.classList.add("view--active", "view--entering");
  requestAnimationFrame(() => {
    setTimeout(() => vista.classList.remove("view--entering"), 450);
  });
}

// ---------------------------------------------------------------
// INICIO DE PARTIDA
// ---------------------------------------------------------------
function inicializarPartida() {
  estado.nivelActual = 1;
  estado.mazos = {
    1: construirMazo(1),
    2: construirMazo(2),
    3: construirMazo(3),
  };
  estado.turnoInicial = 1;
  estado.contadorPreguntasPartida = 0;
  estado.turnoCartaEspecial = 1;
  estado.puntuaciones = { 1: 0, 2: 0 };

  el.portadaNombre1.textContent = JUGADOR_1;
  el.portadaNombre2.textContent = JUGADOR_2;
  el.scoreName1.textContent = JUGADOR_1;
  el.scoreName2.textContent = JUGADOR_2;
}

function empezarPartida() {
  actualizarNivelUI();
  actualizarMarcadorUI();
  mostrarVista(el.viewJuego);
  siguientePregunta();
}

// ---------------------------------------------------------------
// NIVEL — UI y transición
// ---------------------------------------------------------------
function actualizarNivelUI() {
  el.nivelActualNum.textContent = estado.nivelActual;
  el.app.dataset.nivel = estado.nivelActual;

  const hayNivelSiguiente = estado.nivelActual < 3;
  el.btnSiguienteNivel.style.display = hayNivelSiguiente ? "inline-flex" : "none";
  if (hayNivelSiguiente) {
    el.btnSiguienteNivelNum.textContent = estado.nivelActual + 1;
  }
  el.btnMenuSiguienteNivel.style.display = hayNivelSiguiente ? "inline-flex" : "none";
}

function actualizarMarcadorUI() {
  const mostrarMarcador = estado.nivelesConValoracion.includes(estado.nivelActual);
  el.scoreboard.classList.toggle("is-hidden", !mostrarMarcador);
  el.scoreValue1.textContent = estado.puntuaciones[1];
  el.scoreValue2.textContent = estado.puntuaciones[2];
}

function irANivel(numero) {
  estado.nivelActual = numero;
  estado.turnoInicial = 1; // cada nivel reinicia quién empieza, por claridad
  actualizarNivelUI();
  actualizarMarcadorUI();
  mostrarVista(el.viewJuego);
  siguientePregunta();
}

// ---------------------------------------------------------------
// PREGUNTAS — obtención y renderizado
// ---------------------------------------------------------------
function quedanPreguntas(nivel) {
  return estado.mazos[nivel] && estado.mazos[nivel].length > 0;
}

function siguientePregunta() {
  const mazo = estado.mazos[estado.nivelActual];

  if (!mazo || mazo.length === 0) {
    mostrarFinDeNivel();
    return;
  }

  estado.preguntaActual = mazo.pop();
  renderizarPregunta();
}

function renderizarPregunta() {
  const pregunta = estado.preguntaActual;
  const esEligeUno = pregunta.tipo === "elige_uno";

  // Texto de la pregunta
  el.questionText.textContent = pregunta.texto;

  // Indicador de turno
  if (esEligeUno) {
    el.turnCompass.dataset.turno = "ambos";
    el.turnText.textContent = "Respondéis los dos a la vez";
    el.eligeUnoTag.classList.add("is-visible");
  } else {
    el.turnCompass.dataset.turno = String(estado.turnoInicial);
    el.turnText.textContent = `Responde primero ${nombreJugador(estado.turnoInicial)}`;
    el.eligeUnoTag.classList.remove("is-visible");
  }

  // Valoración: solo en niveles configurados, y no para "elige uno"
  const activarValoracion = estado.nivelesConValoracion.includes(estado.nivelActual) && !esEligeUno;
  el.ratingBox.classList.toggle("is-hidden", !activarValoracion);
  limpiarSeleccionValoracion();

  // Micro-animación de entrada de la tarjeta
  el.questionCard.classList.remove("card--enter");
  void el.questionCard.offsetWidth; // fuerza reflow para reiniciar animación
  el.questionCard.classList.add("card--enter");

  // Alterna quién empezará en la siguiente pregunta
  estado.turnoInicial = estado.turnoInicial === 1 ? 2 : 1;
}

function limpiarSeleccionValoracion() {
  el.ratingButtons.forEach(btn => btn.classList.remove("is-selected"));
}

// ---------------------------------------------------------------
// VALORACIÓN (Nivel 3)
// ---------------------------------------------------------------
function manejarValoracion(puntos, boton) {
  limpiarSeleccionValoracion();
  boton.classList.add("is-selected");

  // Se suma la puntuación al jugador que ACABA de responder,
  // es decir, el que respondió en segundo lugar en esta pregunta.
  // Como turnoInicial ya se alternó al renderizar, el que respondió
  // segundo en la pregunta actual es el turno que quedó "actual" antes de alternar.
  const jugadorValorado = estado.ultimoJugadorEnResponder;
  if (jugadorValorado) {
    estado.puntuaciones[jugadorValorado] += puntos;
    const valueEl = jugadorValorado === 1 ? el.scoreValue1 : el.scoreValue2;
    valueEl.textContent = estado.puntuaciones[jugadorValorado];
    valueEl.classList.remove("bump");
    void valueEl.offsetWidth;
    valueEl.classList.add("bump");
  }
}

// ---------------------------------------------------------------
// AVANZAR PREGUNTA (botón "Siguiente pregunta")
// ---------------------------------------------------------------
function avanzarPregunta() {
  estado.contadorPreguntasPartida += 1;

  const tocaCartaEspecial =
    estado.contadorPreguntasPartida > 0 &&
    estado.contadorPreguntasPartida % PREGUNTAS_POR_CARTA_ESPECIAL === 0;

  if (tocaCartaEspecial) {
    mostrarCartaEspecial();
  } else {
    siguientePregunta();
  }
}

// ---------------------------------------------------------------
// CARTA ESPECIAL
// ---------------------------------------------------------------
function mostrarCartaEspecial() {
  const jugador = estado.turnoCartaEspecial;
  el.specialCardFor.textContent = `Turno de ${nombreJugador(jugador)}`;
  estado.turnoCartaEspecial = jugador === 1 ? 2 : 1; // alterna para la próxima
  mostrarVista(el.viewCarta);
}

function continuarTrasCartaEspecial() {
  mostrarVista(el.viewJuego);
  siguientePregunta();
}

// ---------------------------------------------------------------
// FIN DE NIVEL
// ---------------------------------------------------------------
function mostrarFinDeNivel() {
  const hayNivelSiguiente = estado.nivelActual < 3;

  el.finNivelTitulo.textContent = hayNivelSiguiente
    ? `¡Nivel ${estado.nivelActual} completo!`
    : "¡Habéis terminado el último nivel!";

  el.finNivelSubtitulo.textContent = hayNivelSiguiente
    ? "No quedan más preguntas en este nivel. ¿Seguimos?"
    : "Ya no quedan más preguntas. Habéis llegado hasta el final.";

  el.btnAvanzarNivel.style.display = hayNivelSiguiente ? "inline-flex" : "none";
  if (hayNivelSiguiente) {
    el.btnAvanzarNivelNum.textContent = estado.nivelActual + 1;
  }

  mostrarVista(el.viewFinNivel);
}

// ---------------------------------------------------------------
// FIN DE PARTIDA
// ---------------------------------------------------------------
function terminarPartida() {
  const huboValoracion = estado.puntuaciones[1] > 0 || estado.puntuaciones[2] > 0;

  el.finalResumen.textContent = huboValoracion
    ? "Esta ha sido la puntuación final de la partida."
    : "Gracias por jugar y por conoceros un poco más.";

  el.finalScores.classList.toggle("is-hidden", !huboValoracion);
  if (huboValoracion) {
    el.finalNombre1.textContent = JUGADOR_1;
    el.finalNombre2.textContent = JUGADOR_2;
    el.finalPuntos1.textContent = estado.puntuaciones[1];
    el.finalPuntos2.textContent = estado.puntuaciones[2];
  }

  cerrarMenu();
  mostrarVista(el.viewFinal);
}

// ---------------------------------------------------------------
// MENÚ DE OPCIONES (modal)
// ---------------------------------------------------------------
function abrirMenu() {
  el.menuBackdrop.classList.remove("is-hidden");
}
function cerrarMenu() {
  el.menuBackdrop.classList.add("is-hidden");
}

// ---------------------------------------------------------------
// SEGUIMIENTO DE "QUIÉN RESPONDIÓ SEGUNDO" (para la valoración)
// ---------------------------------------------------------------
// Nota: turnoInicial se alterna dentro de renderizarPregunta() justo
// después de fijar quién empieza. Por tanto, antes de alternar,
// guardamos quién fue el segundo en responder (el que no empezó).
const _renderizarPreguntaOriginal = renderizarPregunta;
renderizarPregunta = function () {
  const empezo = estado.turnoInicial;
  _renderizarPreguntaOriginal();
  estado.ultimoJugadorEnResponder = empezo === 1 ? 2 : 1;
};

// ---------------------------------------------------------------
// EVENTOS
// ---------------------------------------------------------------
el.btnEmpezar.addEventListener("click", empezarPartida);

el.btnSiguientePregunta.addEventListener("click", avanzarPregunta);

el.btnSiguienteNivel.addEventListener("click", () => {
  if (estado.nivelActual < 3) irANivel(estado.nivelActual + 1);
});

el.btnTerminar.addEventListener("click", terminarPartida);

el.btnContinuarTrasCarta.addEventListener("click", continuarTrasCartaEspecial);

el.btnAvanzarNivel.addEventListener("click", () => {
  if (estado.nivelActual < 3) irANivel(estado.nivelActual + 1);
});
el.btnTerminarDesdeFin.addEventListener("click", terminarPartida);

el.btnJugarDeNuevo.addEventListener("click", () => {
  inicializarPartida();
  mostrarVista(el.viewPortada);
});

el.ratingButtons.forEach(boton => {
  boton.addEventListener("click", () => {
    const puntos = parseInt(boton.dataset.rating, 10);
    manejarValoracion(puntos, boton);
  });
});

el.btnMenu.addEventListener("click", abrirMenu);
el.btnMenuCerrar.addEventListener("click", cerrarMenu);
el.menuBackdrop.addEventListener("click", (e) => {
  if (e.target === el.menuBackdrop) cerrarMenu();
});
el.btnMenuSiguienteNivel.addEventListener("click", () => {
  cerrarMenu();
  if (estado.nivelActual < 3) irANivel(estado.nivelActual + 1);
});
el.btnMenuTerminar.addEventListener("click", () => {
  cerrarMenu();
  terminarPartida();
});

// ---------------------------------------------------------------
// ARRANQUE
// ---------------------------------------------------------------
inicializarPartida();
