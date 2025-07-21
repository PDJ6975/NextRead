# Plan de Acción para el Frontend NextRead

## Descripción General

El frontend de NextRead ha sido desarrollado con **Next.js 15** y **JavaScript**, proporcionando una interfaz moderna y responsive para el sistema de recomendaciones de libros. La aplicación sigue el flujo definido en el backend, adaptándose a las necesidades específicas de usuarios nuevos y existentes.

**Estado actual**: Sistema de autenticación y encuestas completamente funcional. Sistema de búsqueda híbrida implementado para manejo de múltiples ediciones de libros.

## Arquitectura del Frontend

### Tecnologías Principales
- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: JavaScript (ES6+)
- **Estilos**: Tailwind CSS
- **Gestión de Estado**: React Context API
- **Autenticación**: JWT con localStorage
- **HTTP Client**: Axios
- **Validación**: Zod
- **Iconos**: Lucide React

### Estructura del Proyecto
```
apps/web/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── auth/               # ✅ COMPLETADO
│   │   │   ├── login/          # ✅ Login funcional
│   │   │   ├── register/       # ✅ Registro funcional
│   │   │   └── verify/         # ✅ Verificación por email
│   │   ├── survey/             # ✅ COMPLETADO
│   │   ├── home/               # 🚧 EN DESARROLLO
│   │   ├── recommendations/    # ⏳ PENDIENTE
│   │   └── profile/            # ⏳ PENDIENTE
│   ├── components/             # ✅ Base implementada
│   │   ├── ui/                # ✅ BookCard, BookSearchForm, Button, Input, etc.
│   │   ├── survey/            # ✅ SurveyWizard completo
│   │   └── ProtectedRoute.js  # ✅ Protección de rutas
│   ├── contexts/              # ✅ AuthContext funcional
│   ├── hooks/                 # ✅ useDebounce, useValidation
│   ├── lib/                   # ✅ apiClient, validationSchemas, genreTranslations
│   ├── services/              # ✅ Todos los servicios API implementados
│   └── types/                 # ⏳ PENDIENTE (para futuro TypeScript)
├── public/                    # Assets estáticos
└── package.json
```

## Estado Actual de Implementación

### ✅ **Funcionalidades Completadas**

#### **Sistema de Autenticación (100%)**
- ✅ Registro de usuarios con validación
- ✅ Verificación por código de email
- ✅ Inicio de sesión con JWT
- ✅ Protección de rutas con `ProtectedRoute`
- ✅ Context API para gestión de estado de usuario
- ✅ Redirección automática según estado del usuario

#### **Sistema de Encuestas (100%)**
- ✅ Wizard multi-paso completamente funcional
- ✅ Selección de ritmo de lectura (pace)
- ✅ Selección múltiple de géneros literarios
- ✅ Búsqueda y selección de libros leídos con rating
- ✅ Búsqueda y selección de libros abandonados
- ✅ Integración completa con backend
- ✅ Actualización del estado `firstTime` del usuario
- ✅ Redirección correcta a `/home` tras completar

#### **Sistema de Búsqueda de Libros (100%)**
- ✅ Búsqueda híbrida (BD local + Google Books API)
- ✅ Manejo inteligente de múltiples ediciones
- ✅ Deduplicación por ISBN13
- ✅ Interfaz educativa para múltiples ediciones
- ✅ Cards informativos con editorial, año, ISBN
- ✅ Debounce para optimizar búsquedas

#### **Componentes UI (95%)**
- ✅ `BookCard` con información detallada de ediciones
- ✅ `BookSearchForm` con UX educativa
- ✅ `Button`, `Input`, `Card` components
- ✅ `StarRating` component funcional
- ✅ `StepIndicator` para wizard
- ✅ Responsive design con Tailwind CSS

### 🚧 **En Desarrollo**

#### **Página Principal (20%)**
- ✅ Estructura básica implementada
- 🚧 Dashboard de usuario
- ⏳ Lista de libros del usuario
- ⏳ Recomendaciones personalizadas

### ⏳ **Pendientes**

#### **Sistema de Recomendaciones (0%)**
- ⏳ Página de recomendaciones
- ⏳ Algoritmo de matching frontend
- ⏳ Interfaz para feedback de recomendaciones

#### **Perfil de Usuario (0%)**
- ⏳ Página de perfil
- ⏳ Edición de preferencias
- ⏳ Historial de lecturas

### 🎯 **Logros Recientes**
- **Resolución de bug crítico**: Problema de redirección en encuestas solucionado
- **Mejora en UX**: Sistema híbrido de búsqueda implementado
- **Optimización**: Manejo inteligente de múltiples ediciones de libros
- **Robustez**: Sistema de persistencia de datos completamente funcional

## Flujo de Navegación del Frontend

### 1. Autenticación y Onboarding

#### 1.1 Página de Bienvenida (`/`)
- **Componente**: `WelcomePage`
- **Funcionalidad**: Landing page con opciones de login/registro
- **Redirección**: Si ya está autenticado → `/home`

#### 1.2 Registro (`/auth/register`)
- **Componente**: `RegisterForm`
- **Funcionalidad**: Formulario de registro con validación
- **API**: `POST /auth/signup`
- **Redirección**: Éxito → `/auth/verify`

#### 1.3 Verificación (`/auth/verify`)
- **Componente**: `VerificationForm`
- **Funcionalidad**: Formulario de código de verificación
- **API**: `POST /auth/verify`
- **Redirección**: Éxito → `/auth/login`

#### 1.4 Inicio de Sesión (`/auth/login`)
- **Componente**: `LoginForm`
- **Funcionalidad**: Formulario de login con validación
- **API**: `POST /auth/login`
- **Redirección**: 
  - Usuario nuevo (firstTime=true) → `/survey`
  - Usuario existente → `/home`

### 2. Sistema de Encuestas (Solo Usuarios Nuevos)

#### 2.1 Página de Encuesta (`/survey`)
- **Componente**: `SurveyWizard`
- **Protección**: Requiere autenticación + firstTime=true
- **Funcionalidad**: Wizard de múltiples pasos

**Paso 1: Preferencias Básicas**
- **Componente**: `PreferencesStep`
- **Funcionalidad**: Selección de ritmo de lectura y géneros
- **API**: `PUT /surveys/update`
- **Validación**: Mínimo 1 género, ritmo obligatorio

**Paso 2: Libros Leídos**
- **Componente**: `ReadBooksStep`
- **Funcionalidad**: Búsqueda y valoración de libros leídos
- **API**: 
  - `GET /books/search/survey?title=X` (búsqueda)
  - `POST /userbooks` (añadir con rating)
- **Validación**: Mínimo 3 libros, rating obligatorio

**Paso 3: Libros Abandonados**
- **Componente**: `AbandonedBooksStep`
- **Funcionalidad**: Búsqueda de libros no terminados
- **API**: 
  - `GET /books/search/survey?title=X` (búsqueda)
  - `POST /userbooks` (añadir sin rating)
- **Validación**: Opcional, sin rating

**Paso 4: Confirmación**
- **Componente**: `SurveyConfirmation`
- **Funcionalidad**: Resumen de selecciones
- **Redirección**: Completar → `/home`

### 3. Página Principal (`/home`)

#### 3.1 Dashboard Principal
- **Componente**: `HomePage`
- **Protección**: Requiere autenticación
- **Funcionalidad**: Centro de control de la aplicación

**Secciones del Home:**
1. **Header con navegación**
2. **Sección de recomendaciones**
3. **Historial de libros**
4. **Búsqueda manual**
5. **Perfil de usuario**

#### 3.2 Gestión de Recomendaciones
- **Componente**: `RecommendationsSection`
- **Funcionalidad**: 
  - Botón "Generar Recomendaciones"
  - Mostrar recomendaciones existentes
  - Eliminar recomendaciones
- **API**: 
  - `POST /recommendations/generate`
  - `GET /recommendations`
  - `DELETE /recommendations/{id}`

#### 3.3 Historial de Libros
- **Componente**: `BookHistory`
- **Funcionalidad**: 
  - Mostrar libros por estado (leídos, abandonados, por leer)
  - Actualizar estado/valoración
  - Eliminar libros
- **API**: 
  - `GET /userbooks`
  - `PUT /userbooks/{id}`
  - `DELETE /userbooks/{id}`

#### 3.4 Búsqueda Manual
- **Componente**: `ManualBookSearch`
- **Funcionalidad**: 
  - Búsqueda de libros
  - Añadir libros manualmente
- **API**: 
  - `GET /books/search/basic?title=X`
  - `POST /userbooks/add`

### 4. Generación de Recomendaciones (`/recommendations`)

#### 4.1 Proceso de Generación
- **Componente**: `RecommendationWizard`
- **Protección**: Requiere autenticación + firstTime=false

**Para Usuarios Existentes:**
- **Paso 1**: Actualizar preferencias (opcional) (solo ritmo y géneros)
- **Paso 2**: Generar recomendaciones
- **Paso 3**: Seleccionar recomendación

#### 4.2 Visualización de Recomendaciones
- **Componente**: `RecommendationsList`
- **Funcionalidad**: 
  - Mostrar 3 recomendaciones con título y razón
  - Ver detalles de cada libro
  - Seleccionar recomendación
- **API**: 
  - `GET /books/search/basic?title=X` (detalles)
  - `POST /recommendations` (guardar selección)

### 5. Perfil de Usuario (`/profile`)

#### 5.1 Gestión de Perfil
- **Componente**: `ProfilePage`
- **Funcionalidad**: 
  - Actualizar información personal
  - Cambiar avatar
  - Modificar nickname
- **API**: 
  - `PUT /users/avatar`
  - `PUT /users/nickname`

## Componentes Principales

### 1. Componentes de Layout

#### 1.1 `AppLayout`
```javascript
// Layout principal con navegación
export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

#### 1.2 `Header`
```javascript
// Navegación principal
export default function Header() {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Logo />
          <NavigationMenu />
          <UserMenu user={user} onLogout={logout} />
        </div>
      </nav>
    </header>
  );
}
```

#### 1.3 `ProtectedRoute`
```javascript
// HOC para rutas protegidas
export default function ProtectedRoute({ children, requiresFirstTime = false }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth/login" />;
  if (requiresFirstTime && !user.firstTime) return <Navigate to="/home" />;
  
  return children;
}
```

### 2. Componentes de Formularios

#### 2.1 `LoginForm`
```javascript
export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch (error) {
      setErrors(error.response.data);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        error={errors.email}
      />
      <Input
        type="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        error={errors.password}
      />
      <Button type="submit" className="w-full">
        Iniciar Sesión
      </Button>
    </form>
  );
}
```

#### 2.2 `BookSearchForm`
```javascript
export default function BookSearchForm({ onBookSelect, showRating = false }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const searchBooks = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await bookService.searchBooks(searchQuery);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Buscar libro..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={() => searchBooks(query)}>
          Buscar
        </Button>
      </div>
      
      {loading && <LoadingSpinner />}
      
      <div className="grid gap-4">
        {results.map(book => (
          <BookCard
            key={book.id}
            book={book}
            showRating={showRating}
            onSelect={onBookSelect}
          />
        ))}
      </div>
    </div>
  );
}
```

### 3. Componentes de Funcionalidades

#### 3.1 `SurveyWizard`
```javascript
export default function SurveyWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [surveyData, setSurveyData] = useState({
    pace: '',
    genres: [],
    readBooks: [],
    abandonedBooks: []
  });
  
  const steps = [
    { component: PreferencesStep, title: 'Preferencias' },
    { component: ReadBooksStep, title: 'Libros Leídos' },
    { component: AbandonedBooksStep, title: 'Libros Abandonados' },
    { component: SurveyConfirmation, title: 'Confirmación' }
  ];
  
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  return (
    <div className="max-w-2xl mx-auto">
      <StepIndicator currentStep={currentStep} totalSteps={steps.length} />
      
      <div className="mt-8">
        {steps.map((step, index) => (
          <div key={index} className={currentStep === index + 1 ? 'block' : 'hidden'}>
            <step.component
              data={surveyData}
              onUpdate={setSurveyData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### 3.2 `RecommendationsSection`
```javascript
export default function RecommendationsSection() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const response = await recommendationService.generate();
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const selectRecommendation = async (recommendation) => {
    try {
      await recommendationService.save(recommendation);
      // Actualizar lista de recomendaciones
      fetchRecommendations();
    } catch (error) {
      console.error('Error saving recommendation:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recomendaciones</h2>
        <Button onClick={generateRecommendations} disabled={loading}>
          {loading ? 'Generando...' : 'Generar Recomendaciones'}
        </Button>
      </div>
      
      {recommendations.length > 0 ? (
        <div className="grid gap-4">
          {recommendations.map(rec => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onSelect={selectRecommendation}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No hay recomendaciones"
          description="Genera nuevas recomendaciones basadas en tus preferencias"
          action={
            <Button onClick={generateRecommendations}>
              Generar Recomendaciones
            </Button>
          }
        />
      )}
    </div>
  );
}
```

## Gestión de Estado

### 1. Context de Autenticación

#### 1.1 `AuthContext`
```javascript
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Verificar token al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verificar token y obtener usuario
      verifyToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);
  
  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    setUser(user);
    
    return user;
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### 2. Context de Aplicación

#### 2.1 `AppContext`
```javascript
const AppContext = createContext();

const initialState = {
  books: [],
  recommendations: [],
  survey: null,
  loading: false,
  error: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_BOOKS':
      return { ...state, books: action.payload };
    case 'SET_RECOMMENDATIONS':
      return { ...state, recommendations: action.payload };
    case 'SET_SURVEY':
      return { ...state, survey: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
```

## Servicios API

### 1. Configuración Base

#### 1.1 `apiClient.js`
```javascript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2. Servicios Específicos

#### 2.1 `authService.js`
```javascript
import apiClient from './apiClient';

export const authService = {
  register: (userData) => apiClient.post('/auth/signup', userData),
  verify: (verificationData) => apiClient.post('/auth/verify', verificationData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  resendCode: (email) => apiClient.post('/auth/resend', { email }),
};
```

#### 2.2 `bookService.js`
```javascript
import apiClient from './apiClient';

export const bookService = {
  searchBooks: (query) => apiClient.get(`/books/search/basic?title=${query}`),
  searchForSurvey: (query) => apiClient.get(`/books/search/survey?title=${query}`),
  getUserBooks: () => apiClient.get('/userbooks'),
  addBook: (bookData) => apiClient.post('/userbooks/add', bookData),
  updateBook: (id, bookData) => apiClient.put(`/userbooks/${id}`, bookData),
  deleteBook: (id) => apiClient.delete(`/userbooks/${id}`),
};
```

#### 2.3 `surveyService.js`
```javascript
import apiClient from './apiClient';

export const surveyService = {
  getSurvey: () => apiClient.get('/surveys/find'),
  updateSurvey: (surveyData) => apiClient.put('/surveys/update', surveyData),
};
```

#### 2.4 `recommendationService.js`
```javascript
import apiClient from './apiClient';

export const recommendationService = {
  generate: () => apiClient.post('/recommendations/generate'),
  getRecommendations: () => apiClient.get('/recommendations'),
  save: (recommendation) => apiClient.post('/recommendations', recommendation),
  delete: (id) => apiClient.delete(`/recommendations/${id}`),
};
```

## Validación y Manejo de Errores

### 1. Esquemas de Validación (Zod)

#### 1.1 `validationSchemas.js`
```javascript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const surveySchema = z.object({
  pace: z.enum(['SLOW', 'MEDIUM', 'FAST'], 'Selecciona un ritmo de lectura'),
  genres: z.array(z.string()).min(1, 'Selecciona al menos un género'),
  readBooks: z.array(z.object({
    id: z.number(),
    rating: z.number().min(0.5).max(5),
  })).min(3, 'Añade al menos 3 libros leídos'),
});
```

### 2. Hook de Validación

#### 2.1 `useValidation.js`
```javascript
import { useState } from 'react';

export function useValidation(schema) {
  const [errors, setErrors] = useState({});
  
  const validate = (data) => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      const fieldErrors = {};
      error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
  };
  
  return { errors, validate, setErrors };
}
```

## Componentes UI Base (Shadcn/ui)

### 1. Componentes Básicos

#### 1.1 `Button`
```javascript
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
}
```

#### 1.2 `Input`
```javascript
export function Input({ 
  label, 
  error, 
  helper, 
  className = '', 
  ...props 
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`
          block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500
          ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
}
```

#### 1.3 `Card`
```javascript
export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}
```

## Responsive Design y UX

### 1. Breakpoints (Tailwind CSS)
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
};
```

### 2. Componentes Responsive

#### 2.1 `ResponsiveGrid`
```javascript
export function ResponsiveGrid({ children, className = '' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
}
```

#### 2.2 `MobileMenu`
```javascript
export function MobileMenu({ isOpen, onClose }) {
  return (
    <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
        <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl">
          <div className="p-4">
            <button onClick={onClose} className="float-right">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-8">
            {/* Navegación móvil */}
          </nav>
        </div>
      </div>
    </div>
  );
}
```

## Plan de Desarrollo

### ✅ Fase 1: Configuración Inicial - COMPLETADA
**Estado: 100% Completado**

1. ✅ **Configurar proyecto Next.js**
   - ✅ Instalar Next.js 15 con App Router
   - ✅ Configurar Tailwind CSS
   - ✅ Instalar dependencias (Axios, Zod, Lucide React)
   - ✅ Configurar estructura de carpetas

2. ✅ **Configurar servicios base**
   - ✅ Crear `apiClient.js` con interceptores
   - ✅ Implementar manejo de errores globales
   - ✅ Configurar variables de entorno

3. ✅ **Crear componentes UI base**
   - ✅ Implementar Button, Input, Card
   - ✅ Crear componentes de layout básicos
   - ✅ Configurar sistema de colores y tipografía

### ✅ Fase 2: Autenticación - COMPLETADA
**Estado: 100% Completado**

1. ✅ **Implementar sistema de autenticación**
   - ✅ Crear `AuthContext` y `AuthProvider`
   - ✅ Implementar `authService` completo
   - ✅ Crear componente `ProtectedRoute`

2. ✅ **Desarrollar páginas de autenticación**
   - ✅ Página de bienvenida (`/`)
   - ✅ Formulario de registro (`/auth/register`)
   - ✅ Formulario de verificación (`/auth/verify`)
   - ✅ Formulario de login (`/auth/login`)

3. ✅ **Implementar validación**
   - ✅ Crear esquemas de validación con Zod
   - ✅ Implementar hook `useValidation`
   - ✅ Agregar manejo de errores

### ✅ Fase 3: Sistema de Encuestas - COMPLETADA
**Estado: 100% Completado**

1. ✅ **Desarrollar wizard de encuestas**
   - ✅ Crear componente `SurveyWizard`
   - ✅ Implementar `StepIndicator`
   - ✅ Crear navegación entre pasos

2. ✅ **Implementar pasos de encuesta**
   - ✅ `PreferencesStep` (ritmo y géneros)
   - ✅ `ReadBooksStep` (libros leídos con rating)
   - ✅ `AbandonedBooksStep` (libros abandonados)
   - ✅ `SurveyConfirmation` (resumen)

3. ✅ **Integrar búsqueda de libros**
   - ✅ Crear componente `BookSearchForm`
   - ✅ Implementar `BookCard` con información de ediciones
   - ✅ Agregar sistema de valoración (`StarRating`)
   - ✅ **EXTRA**: Sistema híbrido de búsqueda (BD local + Google Books)
   - ✅ **EXTRA**: Manejo inteligente de múltiples ediciones

### 🚧 Fase 4: Página Principal - EN DESARROLLO
**Estado: 20% Completado**

1. 🚧 **Desarrollar dashboard principal**
   - ✅ Crear layout básico del home
   - 🚧 Implementar navegación principal
   - ⏳ Crear secciones del dashboard

2. ⏳ **Implementar gestión de libros**
   - ⏳ Componente `BookHistory`
   - ⏳ Funcionalidad de actualización/eliminación
   - ⏳ Búsqueda manual de libros

3. ⏳ **Crear sistema de recomendaciones**
   - ⏳ Componente `RecommendationsSection`
   - ⏳ Generación de recomendaciones
   - ⏳ Selección y guardado

### ⏳ Fase 5: Funcionalidades Avanzadas - PENDIENTE
**Estado: 0% Completado**

1. ⏳ **Implementar perfil de usuario**
   - ⏳ Página de perfil (`/profile`)
   - ⏳ Actualización de información
   - ⏳ Gestión de avatar

2. ⏳ **Mejorar UX/UI**
   - ⏳ Implementar loading states
   - ⏳ Agregar animaciones
   - ⏳ Optimizar responsive design

3. ⏳ **Optimización y performance**
   - ⏳ Implementar lazy loading
   - ⏳ Optimizar imágenes
   - ⏳ Mejorar SEO

### ⏳ Fase 6: Testing y Pulido - PENDIENTE
**Estado: 0% Completado**

1. ⏳ **Implementar testing**
   - ⏳ Unit tests para componentes
   - ⏳ Integration tests para flujos
   - ⏳ E2E tests para funcionalidades críticas

## Configuración del Proyecto

### 1. package.json
```json
{
  "name": "nextread-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.5.0",
    "zod": "^3.22.0",
    "lucide-react": "^0.290.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0"
  },
  "devDependencies": {
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.52.0",
    "eslint-config-next": "14.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.3.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^6.1.0"
  }
}
```

### 2. next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    domains: ['localhost', 'api.nextread.com'],
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/home',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

### 3. tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f9fafb',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

## Consideraciones Técnicas

### 1. SEO y Performance
- Implementar meta tags dinámicos
- Optimizar imágenes con Next.js Image
- Implementar lazy loading
- Configurar sitemap y robots.txt

### 2. Accesibilidad
- Implementar navegación por teclado
- Agregar ARIA labels
- Asegurar contraste de colores
- Implementar screen reader support

### 3. Seguridad
- Sanitizar inputs del usuario
- Implementar CSRF protection
- Validar datos en frontend y backend
- Secure token storage

### 4. Monitoreo y Analytics
- Implementar error tracking
- Agregar analytics de usuario
- Monitorear performance
- Implementar logging

## Conclusión

Este plan de acción proporciona una hoja de ruta completa para el desarrollo del frontend de NextRead. La implementación seguirá un enfoque incremental, priorizando la funcionalidad core y mejorando progresivamente la experiencia de usuario. El resultado será una aplicación moderna, responsive y fácil de usar que complementará perfectamente el backend desarrollado.

La arquitectura propuesta es escalable y mantenible, permitiendo futuras mejoras y expansiones del sistema de recomendaciones de libros. 