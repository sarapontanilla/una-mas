/**
 * ============================================================
 *  BASE DE DATOS DE PREGUNTAS — UNA MÁS
 * ============================================================
 * Aquí están todas las preguntas del juego, organizadas por
 * NIVEL y, dentro de cada nivel, por CATEGORÍA.
 *
 * Las categorías son solo para organizar el archivo:
 * el juego NUNCA las muestra al jugador tal cual el nombre interno,
 * pero SÍ muestra el nombre de la categoría actual en la topbar.
 *
 * CÓMO AÑADIR UNA PREGUNTA NUEVA:
 *   Busca la categoría que quieras y añade un nuevo objeto
 *   dentro de su array `preguntas`, siguiendo el mismo formato.
 *
 * CÓMO CREAR UNA CATEGORÍA NUEVA:
 *   Copia el bloque de una categoría existente dentro del nivel
 *   que quieras y cambia su `nombre` y sus `preguntas`. Recuerda
 *   añadirla también a ORDEN_CATEGORIAS, al final de este archivo.
 *
 * TIPOS DE PREGUNTA (campo "tipo"):
 *   "normal"     -> responde primero uno, luego el otro (por defecto)
 *   "elige_uno"  -> responden los dos a la vez (Nivel 1, "Elige uno")
 * ============================================================
 */

const BASE_DE_DATOS = {

  nivel1: {
    numero: 1,
    categorias: [
      {
        nombre: "Elige uno",
        tipo: "elige_uno",
        preguntas: [
          "¿Madrugar o trasnochar?",
          "¿Saber toda la verdad o vivir más tranquilo?",
          "¿Estabilidad o aventura?",
          "¿Seguir siempre el corazón o siempre la cabeza?",
          "¿Hablar todo al momento o esperar a calmarte?",
          "¿Perdonar fácilmente o confiar poco?",
          "¿Vivir cerca de tu familia o en el país de tus sueños?",
          "¿Muchos amigos o dos amigos para toda la vida?",
          "¿Planificarlo todo o improvisar casi siempre?",
          "¿Trabajar en algo que te apasiona o ganar mucho dinero?",
          "¿Una vida muy intensa o una vida muy tranquila?",
          "¿Viajar constantemente o tener un hogar perfecto?",
          "¿Que te recuerden por ser buena persona o por tener éxito?",
          "¿Pasar desapercibido o llamar la atención?",
          "¿Mensajes todo el día o una buena conversación de dos horas?",
          "¿Conocer muy bien a pocas personas o superficialmente a muchísimas?",
          "¿Arriesgarte y fallar o no intentarlo nunca?",
          "¿Vivir en una ciudad enorme o en un pueblo pequeño?",
          "¿Dar siempre una segunda oportunidad o pasar página?",
          "¿Amar mucho aunque puedas sufrir o no enamorarte nunca?"
        ]
      },
      {
        nombre: "Minijuegos",
        tipo: "normal",
        preguntas: [
          "Descríbete en 5 palabras",
          "Describe al otro en 5 palabras",
          "Di tres ciudades donde vivirías.",
          "Di tres países a los que te gustaría viajar.",
          "¿A dónde irías en tu próximo viaje?",
          "Di tres cosas que siempre meterías en una maleta.",
          "Di tres comidas que nunca te cansarías de comer.",
          "Di tres personas con las que te irías de viaje.",
          "Di tres cosas que te hacen reír.",
          "Di tres manías que tienes.",
          "Di tres cosas que sabes hacer muy bien.",
          "Di tres cosas que se te dan fatal.",
          "Di tres lugares a los que volverías una y otra vez.",
          "Di tres cosas que te gustaría aprender algún día.",
          "Di tres cualidades que valoras en alguien.",
          "Di tres planes que nunca rechazarías.",
          "Di tres momentos que recuerdas con mucho cariño.",
          "Di tres palabras que definan vuestro plan perfecto juntos.",
          "Si fueras una estación del año, ¿cuál serías?",
          "Di un lugar al que llevarías a la otra persona.",
          "Di una palabra que crees que define al otro.",
          "Edad del lío más mayor / más pequeño.",
          "Lugar más raro donde lo hayas hecho.",
          "Di una regla que tendrías en pareja."
        ]
      },
      {
        nombre: "Retos",
        tipo: "normal",
        preguntas: [
          "Describe tu infancia usando solo cinco palabras.",
          "Enséñale una foto de tu móvil que tenga una historia interesante.",
          "Describe tu habitación en tres palabras.",
          "Enséñame la última foto que hiciste (si quieres).",
          "Cuéntame el mejor viaje de tu vida en menos de un minuto.",
          "Describe cómo te imaginas dentro de diez años.",
          "Enséñame la última captura de pantalla que hiciste (si quieres).",
          "Busca la foto más antigua que tengas en el móvil y cuéntanos la historia.",
          "Describe tu día perfecto en menos de 30 segundos.",
          "Busca una foto de la que nunca te cansas y explica por qué.",
          "Enseña el último vídeo que grabaste (si quieres).",
          "Describe a tu mejor amigo en cinco palabras.",
          "Enseña el fondo de pantalla de tu móvil y explica por qué lo tienes.",
          "Di tres cosas que siempre llevas contigo.",
          "Lee en voz alta el último mensaje que te ha llegado.",
          "Dale like a una foto del chico que te gusta.",
          "Lee el último mensaje destacado de WhatsApp."
        ]
      },
      {
        nombre: "Yo nunca",
        tipo: "normal",
        preguntas: [
          "Yo nunca lo he hecho con más de una persona en un mismo día.",
          "Yo nunca he querido tirarme a la madre/padre de un amigo/a.",
          "Yo nunca he querido tirarme al hermano/a de un amigo/a.",
          "Yo nunca me he querido liar con alguien presente.",
          "Yo nunca he querido tirarme al novio/a de un amigo/a.",
          "Yo nunca me he liado con alguien y me he arrepentido inmediatamente después.",
          "Yo nunca me he tirado a mi ex.",
          "A mí nunca me han pillado en el acto.",
          "Yo nunca lo he hecho en un lugar público.",
          "Yo nunca lo he hecho en la cama de una tercera persona.",
          "Yo nunca he intentado anal, pero no salió bien.",
          "Yo nunca me he liado/tirado a alguien que tenía mínimo 5 años más que yo.",
          "Yo nunca he hecho algo sexual en el colegio/universidad.",
          "Yo nunca he intentado emborrachar a alguien para liarme con esa persona.",
          "Yo nunca me he grabado con alguien en la cama.",
          "Yo nunca he tenido un gatillazo.",
          "Yo nunca lo he hecho con la regla.",
          "Yo nunca he parado de liarme/tirarme a alguien para preguntarle a la persona cómo se llamaba.",
          "Yo nunca me he liado/tirado a un extranjero/a.",
          "A mí nunca me ha puesto la violencia en la cama.",
          "Yo nunca he conseguido liarme/tirarme a un amor platónico.",
          "A mí nunca me han hecho una cobra de verdad.",
          "Yo nunca he estado en la friendzone con alguien presente."
        ]
      },
      {
        nombre: "Quién es más probable",
        tipo: "normal",
        preguntas: [
          "¿Quién crees que saldría desnudo a la calle?",
          "¿Quién crees que sería capaz de follar delante de su familia por bastante dinero?",
          "¿Quién crees que sería capaz de hacer un baile sexy en la barra de un bar?",
          "¿Quién es más probable que se tire en paracaídas?",
          "¿Quién crees que es más probable que se beba más cubatas?",
          "¿Quién es más probable que sea infiel?",
          "¿Quién es la persona que siempre acaba peor cuando bebe?",
          "¿Quién es la que más liga?",
          "¿Quién crees que es la persona a la que mandan más a la friendzone?",
          "¿Quién es el/la maestro/a del ligoteo?",
          "¿Quién de aquí crees que es el más celoso?"
        ]
      }
    ]
  },

  nivel2: {
    numero: 2,
    categorias: [
      {
        nombre: "Conocerse mejor",
        tipo: "normal",
        preguntas: [
          "¿Qué valor buscas en una amistad?",
          "¿Qué te da más miedo perder: tiempo, personas o oportunidades?",
          "¿Qué parte de tu vida actual soñaba tu yo de hace cinco años?",
          "¿Qué te hace perder el interés por alguien?",
          "¿Cuál ha sido un momento que te cambió?",
          "¿Cuál crees que es la mayor virtud del otro?",
          "¿Qué has aprendido de ti en el último año?",
          "¿Qué tipo de personas te agotan y qué tipo te recargan?",
          "¿Hay algo que la gente suele malinterpretar de ti?",
          "¿Qué hábito te gustaría tener y aún no consigues mantener?",
          "¿Qué conversación podrías tener durante horas?",
          "¿Qué miedo tienes que casi nunca cuentas?",
          "¿Qué te gustaría que la gente entendiera de ti?",
          "¿Cuál ha sido la decisión más difícil de tu vida?",
          "¿Qué significa para ti tener una vida «buena»?",
          "¿Prefieres estabilidad o emoción si tuvieras que elegir?",
          "¿Qué es algo que nunca negociarías en una relación?",
          "¿Qué cualidad admiras más en otras personas?",
          "¿Qué te gustaría que la gente recordara de ti?",
          "¿Qué miedo te cuesta reconocer en voz alta?",
          "¿Cuándo fue la última vez que cambiaste de opinión sobre algo importante?",
          "¿Qué te habría gustado escuchar más cuando eras más joven?",
          "¿Qué haces cuando necesitas desconectar del mundo?",
          "¿Qué parte de ti enseñas poco al principio?",
          "¿Qué te hace sentir química con alguien?",
          "¿Qué detalle romántico te parece más atractivo: palabras, tiempo, gestos o sorpresas?",
          "¿Qué tipo de cita te parece inolvidable aunque sea sencilla?",
          "¿Qué es algo que te conquista más rápido de lo que debería?",
          "¿Crees más en el flechazo o en la conexión que se construye?",
          "¿Cuál o cómo sería tu cita perfecta?",
          "¿Qué pequeño detalle hace que alguien te caiga bien enseguida?",
          "¿Qué es algo que tus padres hicieron muy bien contigo?",
          "¿Qué es algo que harías diferente si algún día tienes hijos?",
          "¿Qué experiencia de tu infancia crees que más ha influido en quién eres hoy?",
          "¿Cuál ha sido el momento más difícil que recuerdas haber vivido?",
          "¿Qué situación te hizo madurar antes de tiempo?"
        ]
      },
      {
        nombre: "Test de compatibilidad",
        tipo: "normal",
        preguntas: [
          "¿Prefieres planificar un viaje o improvisarlo?",
          "¿Eres de hablar los problemas al momento o esperar?",
          "¿Necesitas mucho tiempo para confiar?",
          "¿Te gusta tener mucho espacio personal?",
          "¿Te cuesta pedir perdón?",
          "¿Te gusta improvisar los planes o prefieres tenerlos organizados?",
          "¿Eres más detallista o más práctico?",
          "¿Necesitas tiempo para responder cuando te enfadas?",
          "¿Te cuesta decir que no?",
          "¿Prefieres demostrar cariño con palabras o con hechos?",
          "¿Necesitas pasar tiempo a solas para recargar energía?",
          "¿Eres más de demostrar lo que sientes o de decirlo?",
          "¿Te cuesta confiar después de que te fallen?",
          "¿Prefieres resolver un conflicto el mismo día o dejar que pase un poco de tiempo?",
          "¿Te gusta que te sorprendan o prefieres saber los planes de antemano?",
          "¿Sueles seguir la razón o la intuición cuando tomas decisiones importantes?",
          "¿Eres de los que da muchas oportunidades o pocas?",
          "¿Prefieres una rutina estable o que cada semana sea diferente?",
          "¿Necesitas sentir admiración por alguien para enamorarte?",
          "¿Te enamoras más de cómo te trata una persona o de cómo es?",
          "¿Te cuesta expresar cuando algo te molesta?",
          "¿Eres más de demostrar cariño en público o en privado?",
          "¿Prefieres hacer muchos planes juntos o mantener cada uno su espacio?",
          "¿Te gusta que tu pareja sea muy independiente?",
          "¿Te cuesta más pedir ayuda o aceptar ayuda?",
          "Cuando tienes un problema, ¿prefieres hablarlo o resolverlo tú solo primero?",
          "¿Le das mucha importancia a los pequeños detalles?",
          "¿Te resulta fácil cambiar de opinión cuando alguien te convence?",
          "¿Necesitas sentir mariposas al principio o prefieres que el cariño aparezca poco a poco?",
          "¿Prefieres tener pocas conversaciones muy profundas o muchas conversaciones ligeras?"
        ]
      },
      {
        nombre: "¿Qué harías si...?",
        tipo: "normal",
        preguntas: [
          "Te ofrecen un trabajo en otro país. ¿Qué harías?",
          "Tu pareja quiere irse a vivir fuera. ¿Qué harías?",
          "Un amigo te falla. ¿Qué harías?",
          "Te toca la lotería. ¿Qué harías?",
          "Tu familia no acepta una decisión importante tuya. ¿Qué harías?",
          "Si ganas un millón de euros, ¿seguirías trabajando?",
          "Si tu pareja quiere tener hijos y tú no, ¿qué harías?",
          "Si un amigo muy cercano comete un error grave, ¿lo defenderías?",
          "Si pudieras borrar un recuerdo doloroso, ¿lo harías?",
          "Si supieras que vas a fracasar, ¿lo intentarías igualmente?"
        ]
      },
      {
        nombre: "Filosofía",
        tipo: "normal",
        preguntas: [
          "¿Crees que todo pasa por alguna razón?",
          "¿Existe el destino o lo construimos nosotros?",
          "¿Qué crees que ocurre después de morir?",
          "¿Somos realmente libres para decidir?",
          "¿Qué crees que da sentido a una vida?",
          "¿Preferirías vivir muchos años o vivir pocos pero intensamente?",
          "¿Crees que una persona puede cambiar de verdad?",
          "¿Crees que existe el amor para toda la vida?",
          "Si pudieras conocer una verdad absoluta sobre el universo, ¿cuál elegirías?"
        ]
      },
      {
        nombre: "Dilemas morales",
        tipo: "normal",
        preguntas: [
          "¿Salvarías a una persona que quieres antes que a cinco desconocidos?",
          "¿Mentirías si con eso haces más feliz a alguien?",
          "¿Es mejor ser siempre sincero o proteger los sentimientos?",
          "¿Perdonarías una infidelidad si fue solo una vez?",
          "¿Es peor traicionar o ser traicionado?",
          "Si nadie fuera a descubrirlo, ¿harías algo ilegal por un millón de euros?"
        ]
      }
    ]
  },

  nivel3: {
    numero: 3,
    categorias: [
      {
        nombre: "Cómo ve uno al otro",
        tipo: "normal",
        preguntas: [
          "¿Qué crees que más valora la otra persona en una relación?",
          "¿Qué crees que más miedo le da?",
          "¿Qué crees que sería incapaz de perdonar?",
          "¿Qué crees que elegiría si pudiera mudarse mañana?",
          "¿Qué crees que es lo que más orgulloso le hace sentirse?",
          "¿Cuál crees que es su mayor virtud?",
          "¿Cuál dirías que es uno de sus mayores defectos?",
          "¿Qué crees que busca realmente en una pareja?",
          "¿Qué crees que hace cuando está realmente triste?",
          "¿Qué crees que dirían sus amigos que le define?",
          "¿Qué crees que es lo mejor que puede aportar a una relación?",
          "¿Qué crees que es lo primero que notaste de él/ella?",
          "Si tuvieras que resumir su personalidad en una frase, ¿cuál sería?"
        ]
      },
      {
        nombre: "Preguntas generales sobre relaciones",
        tipo: "normal",
        preguntas: [
          "¿Cómo te das cuenta de que alguien te gusta de verdad?",
          "¿Qué tipo de persona te engancha sin que tú lo elijas mucho?",
          "¿Tú eres de los que se abren fácil o te cuesta bastante enseñar cómo eres?",
          "¿Qué te hace sentir cómodo con alguien?",
          "¿Cómo notas tú que hay química con alguien?",
          "¿Eres de insistir cuando algo te interesa o de dejarlo ir?",
          "¿Qué haces cuando notas que alguien se está alejando?",
          "¿Qué te suele atraer primero de alguien: cómo habla, cómo es o cómo te hace sentir?",
          "¿Te pasa más que te enganches rápido o que te cueste engancharte?",
          "¿Eres más de conexiones rápidas o de que cueste pero luego enganche?",
          "¿Qué te cuesta más: soltar a alguien o empezar con alguien nuevo?",
          "¿Te ha pasado de decir «este/a no es mi tipo» y luego cambiar de opinión?",
          "¿Qué te parece más importante: la confianza o la atracción al principio?",
          "¿Tú cómo sabes cuando alguien no es para ti?",
          "¿Qué hace que una conversación pase de interesante a especial?",
          "¿Qué es una «red flag» que antes ignorabas y ahora no?",
          "¿Qué te hace sentir admiración por alguien?",
          "¿Qué es lo más importante que te ha enseñado una relación?",
          "¿Qué tipo de persona te transmite paz?",
          "¿Cuál crees que es la mayor virtud del otro?",
          "¿Qué buscas en una pareja?"
        ]
      },
      {
        nombre: "Preguntas directas sobre nosotros",
        tipo: "normal",
        preguntas: [
          "¿Qué es lo que más te gusta en mí?",
          "¿Qué fue lo primero que pensaste de mí?",
          "¿Qué es lo que más te ha sorprendido de mí?",
          "¿Te apetece seguir conociéndome?",
          "¿Hay algo que todavía tengas curiosidad por preguntarme?",
          "¿Qué momento de estas quedadas recuerdas mejor?",
          "¿Qué es lo que más te ha sorprendido de la otra persona hasta ahora?",
          "¿Qué crees que tenemos en común?",
          "¿Qué diferencia entre nosotros te parece más interesante?",
          "¿Crees que nos llevaríamos bien si nos hubiéramos conocido hace cinco años?",
          "¿Qué crees que podría aprender de ti?",
          "¿Qué fue lo primero en lo que te fijaste de mí?",
          "¿Qué pensaste de mí la primera vez que me viste?",
          "¿Qué cambió entre la primera impresión que tuviste y la que tienes ahora?",
          "¿Hubo algo que te sorprendió de mí desde el principio?",
          "¿Qué hizo que quisieras seguir hablando conmigo?",
          "¿Qué hizo que aceptaras quedar conmigo?",
          "¿Hubo algún momento en el que dijeras: «Quiero conocer más a esta persona»?",
          "¿Qué detalle recuerdas de nuestra primera conversación?",
          "¿Qué pensabas que iba a ser diferente de mí?",
          "¿Qué es lo que más curiosidad te genera de mí?",
          "¿Hay algo de mí que todavía no termines de entender?",
          "¿Qué fue lo que hizo que quisieras tener una segunda cita?",
          "¿Qué momento recuerdas con más cariño hasta ahora?",
          "¿Qué crees que podríamos hacer juntos y lo pasaríamos muy bien?",
          "¿Qué es algo que todavía te gustaría descubrir de mí?",
          "¿Hay algo que te haya sorprendido para bien desde que nos conocemos?",
          "¿Qué dirías que ha sido lo más inesperado de conocerme?",
          "¿Qué crees que nos diferencia más?",
          "¿Qué crees que fue lo que más me llamó la atención de ti?",
          "¿Qué crees que fue lo que más te llamó la atención de mí?",
          "¿Qué detalle mío recuerdas sin que yo me diera cuenta?",
          "¿Qué momento hizo que pensaras: «Esta persona merece otra cita»?",
          "¿Hubo algún momento en el que te pusieras un poco nervioso/a conmigo?",
          "¿Qué crees que podría sorprenderme de ti si seguimos quedando?",
          "¿Qué impresión crees que doy cuando estoy cómodo contigo?",
          "¿Qué es lo que más disfrutas cuando hablamos?",
          "¿Qué plan te apetecería hacer conmigo que todavía no hemos hecho?",
          "¿Qué crees que todavía no sabes de mí y tienes ganas de descubrir?"
        ]
      }
    ]
  }

};

// Exponemos la base de datos de forma global para que app.js la use.
window.BASE_DE_DATOS = BASE_DE_DATOS;

/**
 * ============================================================
 *  ORDEN DE JUEGO DE LAS CATEGORÍAS
 * ============================================================
 * Este array NO modifica el contenido de BASE_DE_DATOS.
 * Solo define en qué orden se juegan las categorías de cada
 * nivel (de la primera a la última). Los nombres deben coincidir
 * exactamente con el campo "nombre" de cada categoría de arriba.
 *
 * Para cambiar el orden en el futuro, simplemente reordena los
 * nombres dentro de cada nivel.
 * ============================================================
 */
const ORDEN_CATEGORIAS = {
  nivel1: [
    "Elige uno",
    "Minijuegos",
    "Retos",
    "Yo nunca",
    "Quién es más probable"
  ],
  nivel2: [
    "Test de compatibilidad",
    "Conocerse mejor",
    "¿Qué harías si...?",
    "Filosofía",
    "Dilemas morales"
  ],
  nivel3: [
    "Cómo ve uno al otro",
    "Preguntas generales sobre relaciones",
    "Preguntas directas sobre nosotros"
  ]
};

window.ORDEN_CATEGORIAS = ORDEN_CATEGORIAS;
