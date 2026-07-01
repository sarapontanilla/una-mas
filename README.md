# Cerca — juego de preguntas para dos

Una web-app para conocerse mejor, jugando entre dos personas y pasándose el móvil.

## Cómo abrirla

Solo tienes que abrir `index.html` en el navegador del móvil (o del ordenador).
No necesita servidor ni instalación: son solo HTML, CSS y JavaScript puros.

> Si la abres directamente desde el explorador de archivos y algo no carga bien
> por las restricciones de seguridad del navegador con archivos locales, puedes
> subir los 3 archivos a cualquier hosting estático gratuito (GitHub Pages,
> Netlify, Vercel...) y funcionará sin problema.

## Archivos

- **`index.html`** — estructura de la app y todas las "pantallas".
- **`styles.css`** — todo el diseño visual (colores, tipografía, animaciones).
- **`preguntas.js`** — la base de datos de preguntas, organizada por nivel y categoría.
- **`app.js`** — toda la lógica del juego (turnos, niveles, puntuación, cartas especiales).

## Cómo cambiar los nombres de los jugadores

Abre `app.js` y modifica estas dos líneas al principio del archivo:

```js
const JUGADOR_1 = "Sara";
const JUGADOR_2 = "David";
```

## Cómo añadir o editar preguntas

Abre `preguntas.js`. Cada nivel tiene varias categorías, y cada categoría es
simplemente una lista de textos. Para añadir una pregunta nueva, añade una
línea más dentro del array `preguntas` de la categoría que quieras:

```js
{
  nombre: "Conocerse mejor",
  tipo: "normal",
  preguntas: [
    "¿Qué valor buscas en una amistad?",
    "Tu nueva pregunta aquí",   // <-- así de fácil
    ...
  ]
}
```

Las categorías nunca se muestran al jugador: solo sirven para organizar el
archivo. El juego mezcla todas las preguntas de un nivel entre sí.

## Cómo funciona el juego (resumen)

- **3 niveles**, cada uno con sus propias preguntas mezcladas aleatoriamente.
- Ninguna pregunta se repite durante la partida.
- El turno de quién responde primero se alterna automáticamente en cada pregunta.
- Las preguntas de "Elige uno" (Nivel 1) piden que respondáis los dos a la vez.
- Cada 10 preguntas respondidas aparece una **Carta Especial** con una pregunta
  libre, alternando el turno entre los dos jugadores.
- En el **Nivel 3** se activa un sistema de valoración: después de cada
  respuesta, el otro jugador puntúa con ⭐ 👍 😐 🙈, sumando puntos a un
  marcador visible en la parte superior.
- Los jugadores deciden libremente cuándo pasar de nivel o terminar la partida
  con los botones correspondientes.
