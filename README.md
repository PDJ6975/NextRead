# 📚 NextRead - Tu próximo libro favorito te está esperando

¿Cansado de no saber qué leer después? NextRead es la plataforma inteligente que te ayuda a descubrir tu próxima gran lectura usando inteligencia artificial personalizada.

## ✨ Experiencia en vivo

🌟 **[Prueba NextRead aquí →](https://PDJ6975.github.io/NextRead_NOAI/)**

*Descubre libros que realmente te van a encantar, personalizados según tus gustos únicos.*

---

## 🎯 ¿Qué hace NextRead especial?

NextRead no es solo otra app de libros. Es tu compañero de lectura personal que:

- 🤖 **Te conoce realmente**: Analiza tus preferencias y patrones de lectura para sugerencias precisas
- 🎨 **Es bonito de usar**: Diseño cozy y acogedor que hace que buscar libros sea un placer  
- ⚡ **Respuestas inteligentes**: Integración con GPT-4 para recomendaciones con explicación detallada
- 🔐 **Seguro y confiable**: Sistema de autenticación robusto con verificación por email

## 🚀 Funcionalidades principales

### Para lectores como tú
- 📖 **Recomendaciones personalizadas**: IA que aprende de tus gustos y te sorprende con sugerencias perfectas
- 📚 **Tu biblioteca personal**: Organiza los libros que has leído, estás leyendo o quieres leer  
- ⭐ **Califica**: Lleva registro de qué te gustó
- 🔍 **Búsqueda inteligente**: Encuentra cualquier libro combinando Google Books con nuestra base de datos
- 📊 **Dashboard personalizado**: Ve tu progreso de lectura de un vistazo

---

## 🛠️ ¿Cómo está construido?

*Para desarrolladores curiosos y reclutadores*

### 🎨 Frontend - La cara bonita
**Next.js 15** con todo lo último en React
- **App Router**: Navegación fluida y moderna
- **Tailwind CSS**: Diseño "cozy" personalizado
- **Componentes inteligentes**: Reutilizables, accesibles y responsive
- **Estado global**: Context API para autenticación seamless
- **Validación en tiempo real**: Con Zod para formularios que no fallan

### ⚙️ Backend - El cerebro
**Spring Boot 3.5.3** con arquitectura empresarial
- **Seguridad robusta**: JWT + Spring Security con CORS configurado
- **API RESTful**: Endpoints limpios que siguen las mejores prácticas
- **Base de datos**: PostgreSQL en Supabase con schema normalizado
- **Integración AI**: GPT-4 con prompts ingeniería cuidadosamente diseñados
- **Email service**: Verificaciones automáticas con templates HTML
- **Manejo de errores**: Respuestas consistentes y mensajes amigables

### 🗄️ Base de datos - La memoria
**PostgreSQL** en Supabase para escalabilidad
- **Schema inteligente**: Relaciones optimizadas para consultas rápidas
- **Integridad garantizada**: Constraints que mantienen datos consistentes
- **Indexación estratégica**: Performance optimizado desde el diseño

### 🚀 DevOps - El despliegue
- **Frontend**: GitHub Pages con CI/CD automático
- **Backend**: Railway con deploy sin interrupciones  
- **Base de datos**: Supabase con backups automáticos
- **SSL/TLS**: Comunicación segura en todos los endpoints

---

## 🎯 Para desarrolladores

### Quick Start
```bash
# Frontend
cd apps/web
npm install && npm run dev

# Backend  
cd apps/api
mvn spring-boot:run
```

### Variables de entorno necesarias
```bash
# Backend
SPRING_DATASOURCE_URL=tu_postgres_url
JWT_SECRET_KEY=tu_clave_super_secreta
OPENAI_API_KEY=tu_openai_key
SUPPORT_EMAIL=tu_gmail@gmail.com
APP_PASSWORD=tu_app_password_gmail

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 🏗️ Arquitectura del proyecto

```
NextRead/
├── apps/web/                 # Frontend en Next.js
│   ├── src/app/              # Páginas con App Router
│   ├── src/components/       # Componentes reutilizables
│   └── src/services/         # Cliente API
├── apps/api/                 # Backend en Spring Boot  
│   ├── controller/           # Endpoints REST
│   ├── services/             # Lógica de negocio
│   └── entities/             # Modelos de datos
└── 🚀 .github/workflows/     # CI/CD automático
```

---

## 🎉 Lo que hace este proyecto especial

### Para usuarios
- **Experiencia personalizada**: Cada recomendación está pensada para ti
- **Interfaz acogedora**: Diseño que invita a quedarse y explorar
- **Funciona en todos lados**: Responsive y rápido en móvil y desktop

### Para desarrolladores  
- **Código limpio**: Arquitectura clara y mantenible
- **Stack moderno**: Tecnologías actuales y best practices
- **Despliegue automático**: CI/CD que funciona sin intervención

### Para el negocio
- **Escalable**: Preparado para crecer sin refactorizar
- **Seguro**: Autenticación robusta y datos protegidos

---

### 💭 Ideas futuras
- 🎧 Audiolibros
- 🤝 Red social lectora
- 📝 Blog integrado
- 🏆 Sistema de logros

---

## ❤️ Contribuir

¿Te gusta NextRead? 
- ⭐ Danos una estrella
- 🐛 Reporta bugs
- 💡 Sugiere features
- 🔧 Envía PRs

---

## 📄 Licencia (en proceso)

MIT License - Úsalo, modifícalo, compártelo.

---

<div align="center">

**Hecho con ❤️ para amantes de los libros**

*¿Tu próximo libro favorito? Lo encontraremos juntos.*

</div>