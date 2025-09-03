# NextRead Frontend

Sistema de recomendaciones de libros desarrollado con Next.js 14 y JavaScript.

## Características

- **Autenticación completa**: Registro, verificación de email, inicio de sesión
- **Interfaz moderna**: Diseño responsive con Tailwind CSS
- **Validación de formularios**: Validación robusta con Zod
- **Gestión de estado**: Context API para autenticación
- **Rutas protegidas**: Sistema de protección de rutas basado en autenticación

## Tecnologías

- **Next.js 14** con App Router
- **JavaScript** (ES6+)
- **Tailwind CSS** para estilos
- **Axios** para peticiones HTTP
- **Zod** para validación
- **Lucide React** para iconos

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── auth/              # Páginas de autenticación
│   │   ├── login/
│   │   ├── register/
│   │   └── verify/
│   ├── survey/            # Encuesta de preferencias
│   ├── home/              # Dashboard principal
│   └── layout.js          # Layout principal
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base
│   └── ProtectedRoute.js # Protección de rutas
├── contexts/             # Context API
│   └── AuthContext.js    # Contexto de autenticación
├── hooks/                # Custom hooks
│   └── useValidation.js  # Hook de validación
├── lib/                  # Utilidades
│   ├── apiClient.js      # Cliente HTTP
│   └── validationSchemas.js # Esquemas de validación
└── services/             # Servicios API
    └── authService.js    # Servicio de autenticación
```

## Flujo de Autenticación

1. **Página de bienvenida** (`/`) - Landing page con opciones de login/registro
2. **Registro** (`/auth/register`) - Formulario de registro con validación
3. **Verificación** (`/auth/verify`) - Verificación de email con código
4. **Inicio de sesión** (`/auth/login`) - Formulario de login
5. **Redirección automática**:
   - Usuario nuevo (firstTime=true) → `/survey`
   - Usuario existente → `/home`

## Estado del Desarrollo

### ✅ Completado (Fase 1: Autenticación y Onboarding)

- [x] Configuración del proyecto Next.js 14
- [x] Componentes UI base (Button, Input, Card)
- [x] Cliente API con interceptores
- [x] Sistema de autenticación completo
- [x] Validación de formularios con Zod
- [x] Páginas de autenticación (welcome, register, verify, login)
- [x] Sistema de rutas protegidas
- [x] Context API para gestión de estado

### 🚧 En Desarrollo

- [ ] Fase 2: Sistema de encuestas
- [ ] Fase 3: Dashboard principal
- [ ] Fase 4: Sistema de recomendaciones

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## Contribución

Este proyecto sigue el plan de acción definido en `docs/PLAN_ACCION_FRONTEND.md`.

## Licencia

MIT
