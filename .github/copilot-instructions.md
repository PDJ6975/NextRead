# Copilot Instructions for NextRead_NOAI

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

## Arquitectura General

- **Monorepo** con dos apps principales:
  - `apps/web`: Frontend Next.js 14 (JavaScript, App Router, Tailwind CSS)
  - `apps/api`: Backend Spring Boot (Java, Maven)
- Comunicación frontend-backend vía API REST (ver `NEXT_PUBLIC_API_URL` en `.env.local`).
- Flujo principal: autenticación, encuesta de preferencias, dashboard con estadísticas, biblioteca y recomendaciones.

## Workflows y Comandos Clave

- **Frontend** (`apps/web`):
  - Instalar dependencias: `npm install`
  - Desarrollo: `npm run dev`
  - Build producción: `npm run build`
  - Linter: `npm run lint`
  - Configuración API: `.env.local` con `NEXT_PUBLIC_API_URL`
- **Backend** (`apps/api`):
  - Build/test: `mvn clean install`
  - Ejecutar local: `mvn spring-boot:run`
  - Configuración: `application.properties`

## Patrones y Convenciones Específicas

- **Gestión de estado**: Context API (`src/contexts/AuthContext.js`)
- **Validación**: Zod (`src/lib/validationSchemas.js`)
- **HTTP**: Axios con interceptores (`src/lib/apiClient.js`)
- **Protección de rutas**: `ProtectedRoute.js` (permite navegación anónima en dashboard, muestra datos de ejemplo si no autenticado)
- **Componentes UI**: Reutilizables en `src/components/ui/`
- **Servicios API**: Lógica de acceso a endpoints en `src/services/`
- **Hooks personalizados**: En `src/hooks/`
- **Flujo de onboarding**: Registro → Verificación → Encuesta → Dashboard
- **Recomendaciones**: Botón destacado en dashboard, integración visual en biblioteca, feedback visual moderno

## Integraciones y Dependencias

- **Frontend**: Next.js, Tailwind CSS, Axios, Zod, Lucide React
- **Backend**: Spring Boot, JWT, PostgreSQL, JPA, Lombok, Supabase (DB)
- **Ambos**: JWT para autenticación, endpoints REST documentados en `docs/PLAN_ACCION_FRONTEND.md`

## Flujos frontend-backend detallados

### 1. Autenticación y gestión de sesión

- **Registro:**
  - Formulario en `/auth/register` validado con Zod (`registerSchema`).
  - POST `/auth/signup` vía `authService.register`. Si éxito, redirige a verificación.
- **Verificación:**
  - Formulario en `/auth/verify` validado con Zod (`verifySchema`).
  - POST `/auth/verify` vía `authService.verify`. Si éxito, redirige a login.
- **Login:**
  - Formulario en `/auth/login` validado con Zod (`loginSchema`).
  - POST `/auth/login` vía `authService.login`. Si éxito, guarda JWT en localStorage y refresca usuario (`AuthContext`).
- **Gestión de sesión:**
  - El JWT se añade automáticamente a cada request vía `apiClient` (interceptor Axios).
  - El usuario se refresca con `/users/me` (`userProfileService.getProfile`).
  - Si el token expira, se elimina y se redirige a login.

### 2. Onboarding y encuesta de preferencias

- **Flujo:**
  - Tras registro/login, si `firstTime`, redirige a `/survey`.
  - El wizard de encuesta (`SurveyWizard`) guía por pasos: preferencias, libros leídos, abandonados, confirmación.
  - GET `/surveys/find` para cargar encuesta previa (`surveyService.getSurvey`).
  - PUT `/surveys/update` para guardar preferencias (`surveyService.updateSurvey`).
  - Por cada libro añadido en la encuesta:
    - POST `/userbooks` con datos de libro y relación usuario-libro (`userBookService.addBook`).
  - Al finalizar, refresca usuario y redirige a dashboard.

### 3. Dashboard principal

- **Estadísticas:**
  - GET `/userbooks` para obtener todos los libros del usuario (`userBookService.getUserBooks`).
  - Para cada libro leído, GET `/books/{bookId}` para obtener páginas y sumar totales (`userStatsService`).
  - Calcula libros leídos, páginas leídas, rating promedio, etc.
- **Recomendaciones:**
  - GET `/recommendations` para cargar recomendaciones guardadas (`recommendationService.getRecommendations`).
  - POST `/recommendations/generate` para generar nuevas recomendaciones (`recommendationService.generateNewRecommendations`).
  - Las recomendaciones pueden añadirse a la biblioteca (POST `/userbooks`).
- **Biblioteca:**
  - GET `/userbooks` para mostrar libros agrupados por estado (`UserLibrarySection`).
  - POST `/userbooks` para añadir manualmente un libro.
  - PUT `/userbooks/{id}` para actualizar estado/rating.
  - DELETE `/userbooks/{id}` para eliminar libro.
  - GET `/userbooks/{id}` para detalles de un libro concreto.
- **Edición de perfil:**
  - PUT `/users/nickname` y `/users/avatar` para actualizar datos de usuario (`userProfileService`).

### 4. Navegación anónima y protección de rutas

- El dashboard (`/home`) permite acceso anónimo (ver `ProtectedRoute.js` con `allowAnonymous`).
- Si no hay sesión, se muestran datos de ejemplo y se ocultan acciones sensibles.
- El botón "Generar recomendaciones" abre login/modal si el usuario no está autenticado.
- Tras login/registro, se redirige automáticamente a encuesta o dashboard según corresponda.

### 5. Validación y UX

- Todos los formularios usan Zod para validación (`validationSchemas.js`).
- El hook `useValidation` centraliza la gestión de errores de validación.
- Feedback visual moderno en acciones clave (añadir libro, recomendaciones, etc.).

### 6. Servicios y patrones clave

- Todos los accesos a API están centralizados en `/src/services/` y usan `apiClient` (Axios con JWT).
- Los endpoints y lógica de integración están documentados en los servicios correspondientes.
- El Context API (`AuthContext.js`) gestiona la sesión y refresco de usuario.
- Los hooks personalizados (`/src/hooks/`) encapsulan lógica reutilizable.

### 7. Ejemplo de flujo completo (usuario nuevo)

1. Usuario se registra (`/auth/register` → `/auth/verify` → `/auth/login`).
2. Tras login, si es su primer acceso, va a `/survey` y completa preferencias y libros.
3. Al finalizar, se redirige a `/home` (dashboard):
   - Se cargan estadísticas (`/userbooks`, `/books/{id}`), recomendaciones (`/recommendations`), biblioteca (`/userbooks`).
   - Puede generar nuevas recomendaciones, añadir libros, editar perfil, etc.

---

¿Hay alguna sección poco clara o incompleta? Indica qué parte necesitas que amplíe o detalle.
