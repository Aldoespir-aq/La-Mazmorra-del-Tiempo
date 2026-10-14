# Estrategia de Branches (BRANCHING.md)

Rama principal

- `main` debe contener solo versiones estables y jugables del proyecto.
- No hacer commits directos a `main`.

Convención de ramas

- feature/<descripcion> — ramas para implementar nuevas características (p. ej. feature/movimiento-jugador)
- fix/<descripcion> — correcciones rápidas
- chore/<descripcion> — tareas de mantenimiento (ej. actualizar README)

Flujo de trabajo

1. Cada desarrollador crea su rama feature a partir de `main`.
2. Trabajar y commitear localmente.
3. Abrir Pull Request hacia `main` cuando la funcionalidad esté lista.
4. Incluir en el PR: descripción corta, criterios de aceptación, y una captura/GIF demostrando la funcionalidad.
5. Necesaria una revisión aprobada por al menos otro miembro antes de merge.

Protecciones recomendadas

- Proteger `main` para requerir PRs y aprobaciones.
- Requerir que las pruebas (si existieran) pasen antes del merge.

Nombres de ramas de ejemplo

- feature/movimiento-jugador
- feature/nivel-1
- feature/interfaz-menu

