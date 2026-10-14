# La Mazmorra del Tiempo

Plataformas 2D para navegador, hecho con JavaScript y Canvas sin dependencias.
El jugador debe cruzar tres salas, evitar trampas y alcanzar la puerta de salida.

## Ejecutar

Sirve el repositorio desde un navegador moderno (los módulos JavaScript requieren
HTTP; no abras el archivo `index.html` directamente). Desde la raíz puedes usar:

```bash
python -m http.server 8000
```

Luego visita `http://localhost:8000`. No se requiere instalación ni compilación.

## Controles

- **A / D** o **← / →**: moverse.
- **W**, **↑** o **Espacio**: saltar.
- **R**: reiniciar la partida actual.
- **Enter**: comenzar, continuar o volver a jugar desde las pantallas de menú.

La partida empieza con tres vidas. Al tocar pinchos o caer, se pierde una vida y
se reinicia la sala actual. Completar los tres niveles registra la puntuación y
el mejor resultado queda guardado en el navegador.

## Estructura

- `index.html`, `styles.css`: página y presentación.
- `js/main.js`: inicialización, teclado, bucle de animación y dibujo.
- `js/game.js`: movimiento, colisiones, vidas, tiempo, puntuación y transiciones.
- `js/levels/level-1.js`: tutorial con plataformas y salida.
- `js/levels/level-2.js`: sala de dificultad media con pinchos.
- `js/levels/level-3.js`: sala final con ruta de plataformas y trampas.

Cada nivel es un módulo de datos independiente: se puede ajustar su mapa sin
modificar la lógica del jugador ni el contenido de los otros niveles.

## Colaboración del equipo

Trabajen en ramas `feature/*` y `fix/*`; no hagan commits directos a `main`.
Cada cambio se integra mediante Pull Request con captura o GIF, pruebas realizadas
y aprobación de al menos un compañero. Consulten [BRANCHING.md](BRANCHING.md).

En GitHub, creen un Project de equipo con las vistas/columnas **To Do**,
**In Progress**, **In Review** y **Done**. Añadan issues para movimiento y
colisiones, nivel 1, nivel 2, nivel 3 y UI/menú; asignen cada issue a quien lo
implemente y vincúlenlo a la tarjeta correspondiente. La creación del tablero,
la asignación de compañeros y las aprobaciones requieren acceso a la cuenta del
equipo y se completan en GitHub.

## Validación rápida

1. Inicia una partida y comprueba que el personaje camina y salta sobre las
   plataformas.
2. Toca los pinchos o cae: debe perderse una vida y reaparecer en la sala actual.
3. Llega a cada puerta: debe cargarse el nivel siguiente.
4. Completa el nivel 3: debe aparecer la pantalla de victoria y guardarse el
   récord en el mismo navegador.
