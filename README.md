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

- **3 niveles**, y cada nivel está dividido en **categorías** que se juegan
  en un orden fijo (ver más abajo). Dentro de la categoría actual, las
  preguntas salen en orden aleatorio y nunca se repiten durante la partida.
- Arriba siempre se ve el **Nivel** y la **Categoría** en la que estás.
- El turno de quién responde primero se alterna automáticamente en cada pregunta.
- Las preguntas de "Elige uno" (Nivel 1) piden que respondáis los dos a la vez.
- Botón **"Siguiente pregunta"**: saca otra pregunta al azar de la misma categoría.
- Botón **"Siguiente categoría"**: pasa manualmente a la siguiente categoría del
  nivel. Cuando ya estás en la última categoría del nivel, este mismo botón
  cambia automáticamente a **"Pasar al nivel N"**.
- Si se agotan las preguntas de una categoría, la app pasa sola a la siguiente
  categoría (o muestra la pantalla de fin de nivel si era la última).
- Cada 10 preguntas respondidas aparece una **Carta Especial** con una pregunta
  libre, alternando el turno entre los dos jugadores.
- En el **Nivel 3** se activa un sistema de valoración: después de cada
  respuesta, el otro jugador puntúa con ⭐ 👍 😐 🙈, sumando puntos a un
  marcador visible en la parte superior.
- Los jugadores deciden libremente cuándo pasar de nivel o terminar la partida
  con los botones correspondientes.

### Orden de las categorías

```
Nivel 1                        Nivel 2                       Nivel 3
1. Elige uno                   1. Test de compatibilidad     1. Cómo ve uno al otro
2. Minijuegos                  2. Conocerse mejor             2. Preguntas generales
3. Retos                       3. ¿Qué harías si...?             sobre relaciones
4. Yo nunca                    4. Filosofía                  3. Preguntas directas
5. Quién es más probable       5. Dilemas morales                sobre nosotros
```

Este orden se define en `preguntas.js`, dentro del objeto `ORDEN_CATEGORIAS`,
totalmente separado del contenido de las preguntas — así que puedes reordenar
las categorías sin tocar ni una sola pregunta.
