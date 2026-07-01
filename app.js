/**
 * ============================================================
 *  UNA MÁS — LÓGICA DE LA APLICACIÓN
 * ============================================================
 * Este archivo controla todo el funcionamiento del juego:
 * - Gestión de niveles, categorías y mezcla aleatoria de
 *   preguntas SOLO dentro de la categoría actual.
 * - Navegación manual entre categorías (botón "Siguiente
 *   categoría", que se convierte en "Pasar al siguiente nivel"
 *   cuando estamos en la última categoría del nivel).
 * - Alternancia de turnos entre los dos jugadores.
 * - Sistema de doble valoración y puntuación (Nivel 3): cada
 *   pregunta se responde y valora dos veces (una por jugador)
 *   antes de pasar a la siguiente pregunta.
 * - Cartas especiales cada 20 preguntas.
 * - Navegación entre pantallas ("vistas").
 *
 * PARA CAMBIAR LOS NOMBRES DE LOS JUGADORES:
 *   Modifica las dos constantes JUGADOR_1 y JUGADOR_2 aquí abajo.
 *   Se mostrarán siempre en mayúsculas automáticamente.
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
const PREGUNTAS_POR_CARTA_ESPECIAL = 20;

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

  // --- Flujo de doble valoración del Nivel 3 ---
  // fase: "responder_1" | "valorar_1" | "responder_2" | "valorar_2"
  // jugadorQueResponde: 1 o 2 — quién está respondiendo en la fase actual
  fase: "responder_1",
  jugadorQueResponde: 1,
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

/** Nombre del jugador según su número (1 o 2), siempre en MAYÚSCULAS */
function nombreJugador(numero) {
  return (numero === 1 ? JUGADOR_1 : JUGADOR_2).toUpperCase();
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

  el.portadaNombre1.textContent = nombreJugador(1);
  el.portadaNombre2.textContent = nombreJugador(2);
  el.scoreName1.textContent = nombreJugador(1);
  el.scoreName2.textContent = nombreJugador(2);
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

/** ¿El nivel actual usa el sistema de valoración? */
function nivelConValoracion() {
  return estado.nivelesConValoracion.includes(estado.nivelActual);
}

/**
 * Pinta la pregunta actual desde cero: se llama una única vez por
 * pregunta (no en cada cambio de fase). Fija quién responde primero,
 * arranca siempre en fase "responder_1" y oculta la valoración.
 */
function renderizarPregunta() {
  const pregunta = estado.preguntaActual;
  const esEligeUno = pregunta.tipo === "elige_uno";

  el.questionText.textContent = pregunta.texto;

  if (esEligeUno) {
    el.eligeUnoTag.classList.add("is-visible");
  } else {
    el.eligeUnoTag.classList.remove("is-visible");
  }

  if (nivelConValoracion() && !esEligeUno) {
    // Nivel 3: arrancamos el flujo de doble respuesta + doble valoración.
    estado.fase = "responder_1";
    estado.jugadorQueResponde = estado.turnoInicial;
    estado.valoracionYaAplicada = null;
  } else {
    // Resto de niveles: comportamiento de siempre, sin fases.
    estado.fase = null;
    estado.jugadorQueResponde = null;
    estado.valoracionYaAplicada = null;
  }

  actualizarTurnoUI();
  limpiarSeleccionValoracion();
  el.ratingBox.classList.add("is-hidden");
  actualizarTextoBotonPrincipal();

  // Micro-animación de entrada de la tarjeta
  el.questionCard.classList.remove("card--enter");
  void el.questionCard.offsetWidth; // fuerza reflow para reiniciar animación
  el.questionCard.classList.add("card--enter");

  // Alterna quién empezará en la siguiente pregunta
  estado.turnoInicial = estado.turnoInicial === 1 ? 2 : 1;
}

/**
 * Actualiza el texto que indica quién responde ahora mismo, según
 * la fase en la que estemos (solo relevante con fases en Nivel 3;
 * en el resto de niveles simplemente indica quién responde primero).
 */
function actualizarTurnoUI() {
  const pregunta = estado.preguntaActual;
  const esEligeUno = pregunta.tipo === "elige_uno";

  if (esEligeUno) {
    el.turnText.textContent = "Respondéis los dos a la vez";
    return;
  }

  if (estado.fase === "responder_1") {
    el.turnText.textContent = `Responde ${nombreJugador(estado.jugadorQueResponde)}`;
  } else if (estado.fase === "valorar_1" || estado.fase === "valorar_2") {
    el.turnText.textContent = `${nombreJugador(estado.jugadorQueResponde)} ha respondido`;
  } else if (estado.fase === "responder_2") {
    el.turnText.textContent = `Ahora responde ${nombreJugador(estado.jugadorQueResponde)}`;
  } else {
    // Niveles sin fases: mantenemos el texto original "Responde primero X"
    el.turnText.textContent = `Responde primero ${nombreJugador(estado.jugadorQueResponde ?? estado.turnoInicial)}`;
  }
}

function limpiarSeleccionValoracion() {
  el.ratingButtons.forEach(btn => btn.classList.remove("is-selected"));
}

// ---------------------------------------------------------------
// VALORACIÓN (Nivel 3)
// ---------------------------------------------------------------

/**
 * Aplica la puntuación elegida al jugador que acaba de responder
 * en la fase de valoración actual ("valorar_1" valora a quien
 * respondió en "responder_1", y "valorar_2" a quien respondió en
 * "responder_2"). Guarda que ya hay una valoración elegida, para
 * poder confirmar con el botón principal.
 */
function manejarValoracion(puntos, boton) {
  // Si ya había una valoración elegida para esta fase, deshacemos su
  // puntuación antes de aplicar la nueva (por si el jugador cambia de opinión).
  if (estado.valoracionYaAplicada) {
    estado.puntuaciones[estado.jugadorQueResponde] -= estado.valoracionYaAplicada;
  }

  limpiarSeleccionValoracion();
  boton.classList.add("is-selected");

  const jugadorValorado = estado.jugadorQueResponde;
  estado.puntuaciones[jugadorValorado] += puntos;
  estado.valoracionYaAplicada = puntos;

  const valueEl = jugadorValorado === 1 ? el.scoreValue1 : el.scoreValue2;
  valueEl.textContent = estado.puntuaciones[jugadorValorado];
  valueEl.classList.remove("bump");
  void valueEl.offsetWidth;
  valueEl.classList.add("bump");

  actualizarTextoBotonPrincipal();
}

/**
 * Texto y estado (habilitado/deshabilitado) del botón principal según
 * la fase actual. Fuera del flujo de valoración (niveles 1 y 2, o
 * preguntas "elige uno") siempre dice "Siguiente pregunta" y está activo.
 */
function actualizarTextoBotonPrincipal() {
  if (estado.fase === "responder_1" || estado.fase === "responder_2") {
    el.btnSiguientePregunta.textContent = `${nombreJugador(estado.jugadorQueResponde)} ha respondido`;
    el.btnSiguientePregunta.disabled = false;
  } else if (estado.fase === "valorar_1" || estado.fase === "valorar_2") {
    el.btnSiguientePregunta.textContent = "Confirmar valoración";
    el.btnSiguientePregunta.disabled = !estado.valoracionYaAplicada;
  } else {
    el.btnSiguientePregunta.textContent = "Siguiente pregunta";
    el.btnSiguientePregunta.disabled = false;
  }
}

/**
 * Avanza de fase dentro de la misma pregunta del Nivel 3:
 * responder_1 -> valorar_1 -> responder_2 -> valorar_2 -> (pregunta siguiente)
 */
function avanzarFaseNivel3() {
  if (estado.fase === "responder_1") {
    estado.fase = "valorar_1";
    estado.valoracionYaAplicada = null;
    // Quien valora es el otro jugador (el que aún no ha respondido en esta pregunta)
    el.ratingLabel.textContent = `${nombreJugador(otroJugador(estado.jugadorQueResponde))} valora la respuesta de ${nombreJugador(estado.jugadorQueResponde)}`;
    el.ratingBox.classList.remove("is-hidden");
    limpiarSeleccionValoracion();
    actualizarTurnoUI();
    actualizarTextoBotonPrincipal();
    return;
  }

  if (estado.fase === "valorar_1") {
    if (!estado.valoracionYaAplicada) return; // no se puede confirmar sin elegir una opción
    estado.fase = "responder_2";
    estado.jugadorQueResponde = otroJugador(estado.jugadorQueResponde);
    el.ratingBox.classList.add("is-hidden");
    actualizarTurnoUI();
    actualizarTextoBotonPrincipal();
    return;
  }

  if (estado.fase === "responder_2") {
    estado.fase = "valorar_2";
    estado.valoracionYaAplicada = null;
    el.ratingLabel.textContent = `${nombreJugador(otroJugador(estado.jugadorQueResponde))} valora la respuesta de ${nombreJugador(estado.jugadorQueResponde)}`;
    el.ratingBox.classList.remove("is-hidden");
    limpiarSeleccionValoracion();
    actualizarTurnoUI();
    actualizarTextoBotonPrincipal();
    return;
  }

  if (estado.fase === "valorar_2") {
    if (!estado.valoracionYaAplicada) return; // no se puede confirmar sin elegir una opción
    // Ambos jugadores ya respondieron y fueron valorados: pasamos a la pregunta siguiente de verdad.
    estado.fase = null;
    estado.jugadorQueResponde = null;
    estado.valoracionYaAplicada = null;
    continuarConSiguientePreguntaReal();
    return;
  }
}

/** Devuelve el número del jugador contrario (1<->2) */
function otroJugador(numero) {
  return numero === 1 ? 2 : 1;
}

// ---------------------------------------------------------------
// AVANZAR PREGUNTA (botón "Siguiente pregunta" / "Confirmar valoración")
// ---------------------------------------------------------------
function avanzarPregunta() {
  // Si estamos dentro del flujo de fases del Nivel 3, el botón avanza
  // de fase en vez de saltar directamente a la siguiente pregunta.
  if (estado.fase) {
    avanzarFaseNivel3();
    return;
  }

  continuarConSiguientePreguntaReal();
}

/**
 * Lógica original de "pasar a la siguiente pregunta real": cuenta la
 * pregunta para la carta especial y decide si toca carta especial o
 * directamente la siguiente pregunta. Se usa tanto para niveles sin
 * fases como al terminar el flujo completo de valoración del Nivel 3.
 */
function continuarConSiguientePreguntaReal() {
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
    el.finalNombre1.textContent = nombreJugador(1);
    el.finalNombre2.textContent = nombreJugador(2);
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
