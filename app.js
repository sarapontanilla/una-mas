/**
 * ============================================================
 *  CERCA — LÓGICA DE LA APLICACIÓN
 * ============================================================
 * Este archivo controla todo el funcionamiento del juego:
 * - Gestión de niveles, categorías y mezcla aleatoria de
 *   preguntas SOLO dentro de la categoría actual.
 * - Navegación manual entre categorías (botón "Siguiente
 *   categoría", que se convierte en "Pasar al siguiente nivel"
 *   cuando estamos en la última categoría del nivel).
 * - Alternancia de turnos entre los dos jugadores.
 * - Sistema de valoración y puntuación (Nivel 3).
 * - Cartas especiales cada 10 preguntas.
 * - Navegación entre pantallas ("vistas").
 *
 * PARA CAMBIAR LOS NOMBRES DE LOS JUGADORES:
 *   Modifica las dos constantes JUGADOR_1 y JUGADOR_2 aquí abajo.
 *
 * PARA CAMBIAR EL ORDEN DE LAS CATEGORÍAS:
 *   Modifica el objeto ORDEN_CATEGORIAS en preguntas.js.
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
  categoriaIndiceActual: 0,    // índice de la categoría actual dentro de ORDEN_CATEGORIAS del nivel
  mazosPorCategoria: {},       // { 1: [ [preguntasCat1...], [preguntasCat2...], ... ], 2: [...], 3: [...] } ya mezclados por categoría
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

/** Nombres de las categorías de un nivel, en el orden de juego definido en preguntas.js */
function nombresCategorias(numeroNivel) {
  const clave = `nivel${numeroNivel}`;
  return (window.ORDEN_CATEGORIAS && window.ORDEN_CATEGORIAS[clave]) || [];
}

/**
 * Construye, para un nivel, un array de mazos ya mezclados —uno por
 * categoría— siguiendo el orden de ORDEN_CATEGORIAS. Cada mazo contiene
 * únicamente las preguntas de su propia categoría (no se mezclan entre sí).
 */
function construirMazosPorCategoria(numeroNivel) {
  const clave = `nivel${numeroNivel}`;
  const nivelData = window.BASE_DE_DATOS[clave];
  if (!nivelData) return [];

  const categoriasPorNombre = {};
  nivelData.categorias.forEach(categoria => {
    categoriasPorNombre[categoria.nombre] = categoria;
  });

  return nombresCategorias(numeroNivel).map(nombre => {
    const categoria = categoriasPorNombre[nombre];
    if (!categoria) return { nombre, tipo: "normal", mazo: [] };

    const preguntas = categoria.preguntas.map(texto => ({
      texto,
      tipo: categoria.tipo || "normal"
    }));

    return {
      nombre: categoria.nombre,
      tipo: categoria.tipo || "normal",
      mazo: mezclar(preguntas)
    };
  });
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
  categoriaActualNombre: document.getElementById("categoria-actual-nombre"),
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
  btnSiguienteCategoria: document.getElementById("btn-siguiente-categoria"),
  btnSiguienteCategoriaTexto: document.getElementById("btn-siguiente-categoria-texto"),
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
  estado.categoriaIndiceActual = 0;
  estado.mazosPorCategoria = {
    1: construirMazosPorCategoria(1),
    2: construirMazosPorCategoria(2),
    3: construirMazosPorCategoria(3),
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
// NIVEL Y CATEGORÍA — estado derivado y UI
// ---------------------------------------------------------------

/** Array de mazos (uno por categoría) del nivel actual */
function mazosDelNivelActual() {
  return estado.mazosPorCategoria[estado.nivelActual] || [];
}

/** Objeto { nombre, tipo, mazo } de la categoría en la que estamos ahora mismo */
function categoriaActual() {
  return mazosDelNivelActual()[estado.categoriaIndiceActual] || null;
}

/** ¿Es la categoría actual la última del nivel actual? */
function esUltimaCategoriaDelNivel() {
  return estado.categoriaIndiceActual >= mazosDelNivelActual().length - 1;
}

function actualizarNivelUI() {
  el.nivelActualNum.textContent = estado.nivelActual;
  el.app.dataset.nivel = estado.nivelActual;

  const categoria = categoriaActual();
  if (categoria && el.categoriaActualNombre) {
    el.categoriaActualNombre.textContent = categoria.nombre;
  }

  actualizarBotonSiguienteCategoria();

  const hayNivelSiguiente = estado.nivelActual < 3;
  el.btnMenuSiguienteNivel.style.display = hayNivelSiguiente ? "inline-flex" : "none";
}

/**
 * El botón dinámico de la pantalla de juego muestra "Siguiente categoría"
 * mientras queden más categorías en el nivel, y se convierte en
 * "Pasar al siguiente nivel" cuando estamos en la última categoría.
 * En el último nivel y última categoría, se oculta (ya no hay a dónde ir
 * manualmente; el fin llegará solo cuando se acaben las preguntas).
 */
function actualizarBotonSiguienteCategoria() {
  if (!el.btnSiguienteCategoria) return;

  const esUltima = esUltimaCategoriaDelNivel();
  const hayNivelSiguiente = estado.nivelActual < 3;

  if (esUltima && !hayNivelSiguiente) {
    // Última categoría del último nivel: no hay más sitio al que avanzar manualmente.
    el.btnSiguienteCategoria.style.display = "none";
    return;
  }

  el.btnSiguienteCategoria.style.display = "inline-flex";
  el.btnSiguienteCategoriaTexto.textContent = esUltima
    ? `Pasar al nivel ${estado.nivelActual + 1}`
    : "Siguiente categoría";
}

function actualizarMarcadorUI() {
  const mostrarMarcador = estado.nivelesConValoracion.includes(estado.nivelActual);
  el.scoreboard.classList.toggle("is-hidden", !mostrarMarcador);
  el.scoreValue1.textContent = estado.puntuaciones[1];
  el.scoreValue2.textContent = estado.puntuaciones[2];
}

function irANivel(numero) {
  estado.nivelActual = numero;
  estado.categoriaIndiceActual = 0;
  estado.turnoInicial = 1; // cada nivel reinicia quién empieza, por claridad
  actualizarNivelUI();
  actualizarMarcadorUI();
  mostrarVista(el.viewJuego);
  siguientePregunta();
}

/**
 * Avanza manualmente a la siguiente categoría del nivel actual.
 * Si ya estábamos en la última categoría, en vez de eso pasa al
 * siguiente nivel (mismo comportamiento que el botón de fin de nivel).
 */
function irASiguienteCategoria() {
  if (esUltimaCategoriaDelNivel()) {
    if (estado.nivelActual < 3) {
      irANivel(estado.nivelActual + 1);
    }
    return;
  }

  estado.categoriaIndiceActual += 1;
  actualizarNivelUI();
  siguientePregunta();
}

// ---------------------------------------------------------------
// PREGUNTAS — obtención y renderizado
// ---------------------------------------------------------------

/** ¿Quedan preguntas sin usar en la categoría actual? */
function quedanPreguntasEnCategoriaActual() {
  const categoria = categoriaActual();
  return !!categoria && categoria.mazo.length > 0;
}

/**
 * Saca la siguiente pregunta de la categoría actual.
 * Si la categoría actual ya no tiene preguntas:
 *   - si hay más categorías en el nivel, pasa automáticamente
 *     a la siguiente y saca una pregunta de ahí.
 *   - si era la última categoría del nivel, muestra la pantalla
 *     de fin de nivel (igual que antes).
 */
function siguientePregunta() {
  if (!quedanPreguntasEnCategoriaActual()) {
    if (!esUltimaCategoriaDelNivel()) {
      estado.categoriaIndiceActual += 1;
      actualizarNivelUI();
      siguientePregunta();
      return;
    }
    mostrarFinDeNivel();
    return;
  }

  const categoria = categoriaActual();
  estado.preguntaActual = categoria.mazo.pop();
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

el.btnSiguienteCategoria.addEventListener("click", irASiguienteCategoria);

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
