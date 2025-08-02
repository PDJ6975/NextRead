# Plan de Acción Frontend NextRead (MVP)

## Estado Actual

- **Autenticación y registro**: 100% funcional.
- **Encuesta de preferencias y libros**: 100% funcional.
- **Dashboard principal**:
  - Estadísticas de usuario (libros leídos, páginas leídas, rating promedio) funcionando.
  - Recomendaciones personalizadas funcionando.
  - Biblioteca del usuario funcionando (añadir, marcar como leído/abandonado).
- **Interfaz responsive y moderna**.
- **Eliminados componentes no esenciales (acciones rápidas, progreso anual, etc.)**.
- **Obtención de páginas leídas**: Funcional, aunque requiere petición adicional por libro (mejorable en backend).

---

## Qué queda por hacer (Prioridad MVP)

1. **Optimizar obtención de páginas leídas**

   - Mejorar el endpoint `/userbooks` para incluir el campo `pages` y evitar múltiples peticiones por libro.

2. **Feedback visual y UX**

   - Añadir toasts o mensajes de confirmación en acciones clave (añadir libro, marcar como leído, etc.).
   - Mejorar mensajes de error y estados vacíos.

3. **Pulir detalles visuales y responsividad**

   - Revisar alineación y espaciado de componentes en todos los tamaños de pantalla.
   - Ajustar el ancho de las estadísticas para que coincida con el resto del dashboard.

4. **QA y pruebas**
   - Pruebas manuales de todos los flujos principales.
   - Corregir posibles bugs visuales o de flujo detectados.

---

## Cambios a analizar como prioridad para el MVP

1. **Perfil de usuario** (COMPLETADO)

   - Analizar si es necesario un perfil completo o basta con un pequeño componente para cambiar foto y nombre de usuario.

2. **Botón de configuración** (COMPLETADO)

   - Definir la utilidad real del botón de configuración. Valorar si debe ocultarse, dejarse como placeholder o reconvertirse para cambiar tema/idioma en el futuro.

3. **Navegación anónima y botón de generar recomendaciones** (COMPLETADO)

   - Permitir que el usuario navegue por el dashboard sin iniciar sesión, mostrando la funcionalidad básica de la app.
   - Solicitar inicio de sesión solo al intentar generar recomendaciones o guardar progreso.
   - Añadir un botón grande y visualmente destacado en el dashboard, visible para usuarios anónimos y autenticados.
   - Si el usuario no está autenticado, al pulsar el botón debe abrirse el modal/login o redirigir a la página de registro/login.

4. **Integración del botón de generar recomendaciones** (COMPLETADO)
   - Mejorar la integración visual y funcional del botón de generar recomendaciones.
   - Centrar el botón y reducir su tamaño.
   - Mostrar las recomendaciones generadas directamente en la sección de biblioteca, con portadas adaptadas y coherentes.

---

## Flujo frontend-backend de las funcionalidades principales

### 1. Autenticación y registro

- **Frontend:** El usuario se registra o inicia sesión desde el formulario.
- **Backend:**
  - POST `/auth/register` o `/auth/login`
  - Devuelve JWT y datos básicos del usuario.
- **Frontend:** Guarda el JWT en localStorage y gestiona la sesión.

### 2. Encuesta de preferencias y libros

- **Frontend:** El usuario responde preguntas sobre géneros y libros favoritos.
- **Backend:**
  - POST `/survey/preferences` y `/survey/books`
  - Guarda las preferencias y libros seleccionados en la base de datos.

### 3. Dashboard principal

#### a) Estadísticas de usuario

- **Frontend:** Solicita la lista de libros del usuario.
- **Backend:**
  - GET `/userbooks`
  - Devuelve los libros del usuario (solo con `bookId` y estado).
- **Frontend:** Para cada libro leído, hace GET `/books/{bookId}` para obtener el número de páginas y sumar el total.
- **Frontend:** Calcula y muestra libros leídos, páginas leídas y rating promedio.

#### b) Recomendaciones personalizadas

- **Frontend:** Solicita recomendaciones.
- **Backend:**
  - GET `/recommendations`
  - Devuelve una lista de libros recomendados según el perfil y preferencias del usuario.
- **Frontend:** Permite añadir libros recomendados a la biblioteca del usuario (POST `/userbooks`).

#### c) Biblioteca del usuario

- **Frontend:** Muestra los libros del usuario agrupados por estado (por leer, leídos, abandonados).
- **Backend:**
  - GET `/userbooks`
  - POST `/userbooks` para añadir un libro.
  - PATCH `/userbooks/{id}` para cambiar el estado (leído, abandonado, etc.).
- **Frontend:** Permite cambiar el estado de los libros y ver detalles.

---

## Mejoras opcionales (para después del MVP)

- Permitir edición/eliminación de libros desde la biblioteca.
- Sistema de notificaciones a través del icono de campana del dashboard.
- Página de perfil de usuario y edición de preferencias.
- Mejorar sistema de recomendaciones (feedback, refresco, etc.).
- Añadir meta de lectura anual y estadísticas avanzadas.

---

## Cómo se debe desarrollar cada tarea

Para asegurar calidad, coherencia y eficiencia, **toda tarea de desarrollo debe seguir estos pasos**:

1. **Análisis de la tarea**

   - Entender y definir claramente qué se debe lograr y cuál es el objetivo de la tarea.

2. **Análisis del flujo existente**

   - Revisar cómo funciona actualmente el flujo completo en frontend y backend (si aplica).
   - Identificar dependencias, puntos de integración y posibles impactos.

3. **Especificación de la solución**

   - Describir de forma clara y concisa cómo se va a implementar la solución.
   - Justificar la elección técnica y detallar los cambios necesarios.

4. **Implementación profesional**
   - Aplicar la solución siguiendo buenas prácticas de ingeniería de software.
   - Mantener el código limpio, directo y sin lógica innecesaria.
   - Documentar brevemente los cambios si es relevante para el equipo.

Este proceso debe aplicarse a cualquier nueva funcionalidad, mejora o corrección en el frontend para mantener la calidad y facilitar el trabajo colaborativo.

---

## Resumen

El frontend ya es funcional para el MVP. Las tareas prioritarias son optimizar la obtención de páginas leídas, mejorar la experiencia de usuario, pulir detalles visuales y analizar los cambios propuestos arriba. El resto de mejoras pueden planificarse tras el MVP.

---

## Navegación anónima y botón de generar recomendaciones

### Pasos técnicos para implementar correctamente

1. **Permitir acceso anónimo al dashboard**

   - Modificar la lógica de rutas protegidas para que el dashboard sea accesible sin autenticación.
   - Mostrar datos de ejemplo o estados vacíos en estadísticas y biblioteca si el usuario no está autenticado. (tal y como está ahora)

2. **Botón "Generar recomendaciones" llamativo y centrado**

   - Añadir un botón grande y visualmente destacado en el dashboard, visible para usuarios anónimos y autenticados, eliminando la sección propia de recomendaciones
   - Si el usuario no está autenticado, al pulsar el botón debe abrirse el modal/login o redirigir a la página de registro/login.

3. **Redirección tras login/registro**

   - Tras autenticarse, redirigir automáticamente a la encuesta de preferencias inicial (si es registro), si es login, simplemente vuelve al dashboard.
   - Al completar la encuesta, redirigir de vuelta al dashboard.

4. **Integración de recomendaciones en la biblioteca**

   - Si el usuario ya ha completado la encuesta y está autenticado, al volver a pulsar el botón se muestran las recomendaciones directamente en una sección de la biblioteca.
   - Las recomendaciones deben integrarse visualmente con el resto de la biblioteca, usando portadas y acciones coherentes.

5. **UX y feedback**

   - Asegurarse de que el botón y las recomendaciones tengan animaciones y feedback visual moderno.
   - Mostrar mensajes claros si el usuario intenta generar recomendaciones sin estar autenticado.

---

**Nota:**  
Este flujo debe implementarse siguiendo el proceso de análisis, revisión de flujo actual, especificación clara y desarrollo profesional descrito en este documento.
