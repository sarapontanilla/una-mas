# UNA MÁS — juego de preguntas para dos

Una web-app para conocerse mejor, jugando entre dos personas y pasándose el móvil.

## Cómo abrirla

Solo tienes que abrir `index.html` en el navegador del móvil (o del ordenador).
No necesita servidor ni instalación: son solo HTML, CSS y JavaScript puros.

> Si la abres directamente desde el explorador de archivos y algo no carga bien
> por las restricciones de seguridad del navegador con archivos locales, puedes
> subir los 4 archivos a cualquier hosting estático gratuito (GitHub Pages,
> Netlify, Vercel...) y funcionará sin problema.

## Archivos

- **`index.html`** — estructura de la app y todas las "pantallas".
- **`styles.css`** — todo el diseño visual (colores, tipografía, animaciones).
- **`preguntas.js`** — la base de datos de preguntas, organizada por nivel y categoría.
- **`app.js`** — toda la lógica del juego (turnos, niveles, valoración, cartas especiales).

## Cómo cambiar los nombres de los jugadores

Abre `app.js` y modifica estas dos líneas al principio del archivo:

```js
const JUGADOR_1 = "Sara";
const JUGADOR_2 = "David";
```

Se mostrarán siempre en **mayúsculas** en toda la aplicación automáticamente,
sin que tengas que escribirlos en mayúsculas aquí.

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

El nombre de la categoría sí se muestra al jugador, en la barra superior,
junto al nivel actual.

## Cómo funciona el juego (resumen)

- **3 niveles**, y cada nivel está dividido en **categorías** que se juegan
  en un orden fijo (ver más abajo). Dentro de la categoría actual, las
  preguntas salen en orden aleatorio y nunca se repiten durante la partida.
- Arriba siempre se ve el **Nivel** y la **Categoría** en la que estás.
- El turno de quién responde primero se alterna automáticamente en cada pregunta.
- Las preguntas de "Elige uno" (Nivel 1) piden que respondáis los dos a la vez.
- Botón **"Siguiente pregunta"**: saca otra pregunta al azar de la misma categoría
  (en Nivel 3 este mismo botón guía todo el flujo de doble respuesta, ver abajo).
- Botón **"Siguiente categoría"**: pasa manualmente a la siguiente categoría del
  nivel. Cuando ya estás en la última categoría del nivel, este mismo botón
  cambia automáticamente a **"Pasar al nivel N"**.
- Si se agotan las preguntas de una categoría, la app pasa sola a la siguiente
  categoría (o muestra la pantalla de fin de nivel si era la última).
- Cada **20 preguntas** respondidas aparece una **Carta Especial ✨** con una
  pregunta libre, alternando el turno entre los dos jugadores.
- Los jugadores deciden libremente cuándo pasar de nivel o terminar la partida
  con los botones correspondientes.

### Sistema de doble valoración (solo Nivel 3)

En el Nivel 3 cada pregunta sigue este flujo completo antes de pasar a la
siguiente:

1. Responde el primer jugador.
2. El otro jugador valora esa respuesta (⭐ 🤘🏼 🌼 🫠) y se suman los puntos
   automáticamente. La pregunta en pantalla **no cambia**.
3. Ahora responde el segundo jugador, a la misma pregunta.
4. El primer jugador valora esa segunda respuesta, sumando sus puntos.
5. Solo entonces la app pasa a una pregunta nueva.

El marcador de puntos, visible arriba solo durante el Nivel 3, se actualiza
en cada valoración. El botón principal no deja avanzar de fase sin haber
elegido antes una valoración.

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

## Identidad visual

Paleta de marca — únicamente estos colores en toda la aplicación, sin
degradados, sin transparencias decorativas y sin sombras:

| Color           | Hex       |
|-----------------|-----------|
| Naranja         | `#EB4213` |
| Rosa            | `#FF99DC` |
| Lila            | `#E3D4F4` |
| Amarillo claro  | `#FFFED2` |

Más blanco (`#FFFFFF`) y negro (`#000000`) como únicos neutros. Estos
seis son los ÚNICOS colores que aparecen en toda la aplicación: sin
tonos derivados, sin variaciones más claras/oscuras, sin transparencias
decorativas ni colores de apoyo adicionales.

Cada pantalla usa como máximo dos colores de marca a la vez (además de
blanco/negro para texto), siguiendo siempre una de estas combinaciones:

- Naranja + Rosa (principal)
- Lila + Amarillo (principal)
- Naranja + Lila (opcional)
- Rosa + Amarillo (opcional)

Nunca se mezclan tres o más colores de marca en la misma pantalla:

- **Portada y pantallas de fin** → fondo Amarillo, acento Lila
- **Pantalla de juego (Niveles 1 y 2)** → fondo Rosa, acento Naranja
- **Pantalla de juego (Nivel 3)** → fondo Lila, acento Naranja
- **Carta especial** → fondo Naranja sólido (color único, sin pareja)

Tipografía: **Plus Jakarta Sans** (sans-serif) en toda la aplicación, sin
ninguna fuente con serifa.
