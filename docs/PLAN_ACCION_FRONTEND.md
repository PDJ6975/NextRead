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

---

## 📋 **Visión General de la Página Principal**

La página principal (`/home`) será el centro neurálgico de NextRead, donde los usuarios gestionarán su biblioteca personal, recibirán recomendaciones y navegarán por su historial de lectura. La página seguirá un diseño de dashboard modular y responsive.

### 🎯 **Objetivos de la Fase 4**
1. **Dashboard Funcional**: Interface completa para usuarios registrados
2. **Gestión de Biblioteca**: CRUD completo de libros del usuario
3. **Recomendaciones Inteligentes**: Sistema de sugerencias personalizadas
4. **UX Optimizada**: Navegación fluida y acciones rápidas
5. **Performance**: Carga eficiente y lazy loading

---

## 🏗️ **Arquitectura del Dashboard**

### **Estructura Jerárquica**
```
/home
├── DashboardLayout (wrapper)
├── DashboardHeader (navegación + usuario)
├── DashboardStats (métricas rápidas)
├── RecommendationsSection (recomendaciones personalizadas)
├── BookHistorySection (libros del usuario)
└── QuickActionsSection (búsqueda manual + acciones rápidas)
```

### **Layout Responsivo**
```
Desktop (lg+):     Mobile (sm):
┌─────────────────┐  ┌──────────────┐
│ Header          │  │ Header       │
├─────────────────┤  ├──────────────┤
│ Stats (4 cols)  │  │ Stats (2x2)  │
├─────────────────┤  ├──────────────┤
│ Recommendations │  │ Quick Actions│
│ (8/12)          │  │ (full width) │
├─────────────────┤  ├──────────────┤
│ Quick Actions   │  │ Recommenda   │
│ (4/12)          │  │ tions (full) │
├─────────────────┤  ├──────────────┤
│ Book History    │  │ Book History │
│ (full width)    │  │ (full width) │
└─────────────────┘  └──────────────┘
```

---

## 🧩 **Componentes Detallados**

### **1. DashboardLayout**
```javascript
// apps/web/src/components/layout/DashboardLayout.js
```

**Props:**
- `children`: React.ReactNode
- `user`: User object del AuthContext

**Funcionalidades:**
- ✅ Layout base con sidebar colapsable
- 🚧 Navegación principal (Home, Profile, Logout)
- ⏳ Modo oscuro toggle
- ⏳ Notificaciones (futuro)

**Estado interno:**
- `sidebarCollapsed`: boolean
- `currentSection`: string

---

### **2. DashboardHeader**
```javascript
// apps/web/src/components/dashboard/DashboardHeader.js
```

**Props:**
- `user`: User object
- `onLogout`: function

**Funcionalidades:**
- ✅ Saludo personalizado ("¡Hola [nombre]!")
- 🚧 Avatar del usuario
- 🚧 Dropdown menu con opciones
- ⏳ Barra de búsqueda global

**APIs utilizadas:**
- Ninguna (datos del AuthContext)

---

### **3. DashboardStats**
```javascript
// apps/web/src/components/dashboard/DashboardStats.js
```

**Props:**
- `stats`: object con métricas del usuario

**Funcionalidades:**
- ⏳ Libros leídos este año
- ⏳ Libros en progreso
- ⏳ Páginas totales leídas
- ⏳ Tiempo promedio de lectura

**APIs utilizadas:**
- `GET /userbooks/stats` - Obtener estadísticas del usuario

**Estado interno:**
- `loading`: boolean
- `stats`: object
- `error`: string

---

### **4. RecommendationsSection**
```javascript
// apps/web/src/components/dashboard/RecommendationsSection.js
```

**Props:**
- `maxRecommendations`: number (default: 6)
- `onBookSelect`: function

**Funcionalidades:**
- ⏳ Carrusel de recomendaciones personalizadas
- ⏳ Botón "Generar nuevas recomendaciones"
- ⏳ Acción "Me interesa" / "No me interesa"
- ⏳ Agregar directamente a biblioteca
- ⏳ Ver detalles de libro en modal

**APIs utilizadas:**
- `GET /recommendations` - Obtener recomendaciones
- `POST /recommendations/generate` - Generar nuevas recomendaciones
- `POST /recommendations/feedback` - Enviar feedback de recomendación

**Estado interno:**
- `recommendations`: array
- `loading`: boolean
- `generating`: boolean
- `error`: string

**Subcomponentes:**
- `RecommendationCard`: Card individual para cada libro recomendado
- `RecommendationCarousel`: Carrusel navegable
- `GenerateButton`: Botón para nuevas recomendaciones

---

### **5. BookHistorySection**
```javascript
// apps/web/src/components/dashboard/BookHistorySection.js
```

**Props:**
- `initialView`: 'grid' | 'list' (default: 'grid')
- `pageSize`: number (default: 12)

**Funcionalidades:**
- ⏳ Vista grid/list toggleable
- ⏳ Filtros por estado (Leído, Leyendo, Abandonado, Por leer)
- ⏳ Filtros por rating (5★, 4★+, etc.)
- ⏳ Ordenación (Fecha añadido, Rating, Título, Autor)
- ⏳ Búsqueda dentro de la biblioteca personal
- ⏳ Paginación o infinite scroll
- ⏳ Acciones por libro: Editar, Eliminar, Cambiar estado

**APIs utilizadas:**
- `GET /userbooks?page=X&status=Y&sort=Z` - Obtener libros del usuario
- `PUT /userbooks/{id}` - Actualizar libro del usuario
- `DELETE /userbooks/{id}` - Eliminar libro de biblioteca

**Estado interno:**
- `books`: array
- `loading`: boolean
- `filters`: object
- `currentPage`: number
- `totalPages`: number
- `viewMode`: 'grid' | 'list'
- `sortBy`: string

**Subcomponentes:**
- `BookHistoryCard`: Card individual para cada libro del usuario
- `BookHistoryFilters`: Panel de filtros y búsqueda
- `BookHistoryGrid`: Vista en cuadrícula
- `BookHistoryList`: Vista en lista
- `BookActionModal`: Modal para editar/eliminar libros

---

### **6. QuickActionsSection**
```javascript
// apps/web/src/components/dashboard/QuickActionsSection.js
```

**Props:**
- `onBookAdded`: function (callback después de añadir libro)

**Funcionalidades:**
- ⏳ Búsqueda rápida de libros para añadir
- ⏳ Botones de acción rápida ("Marcar como leído", "Añadir a por leer")
- ⏳ Acceso rápido a encuesta (si firstTime=true de algún modo)
- ⏳ Botón "Obtener recomendaciones"

**APIs utilizadas:**
- `GET /books/search?title=X` - Búsqueda general de libros
- `POST /userbooks` - Añadir libro a biblioteca

**Estado interno:**
- `searchQuery`: string
- `searchResults`: array
- `searching`: boolean
- `selectedBook`: object

**Subcomponentes:**
- `QuickSearchForm`: Formulario de búsqueda rápida
- `QuickActionCard`: Card con acciones comunes

---

## 🔄 **Flujos de Usuario Detallados**

### **Flujo 1: Usuario accede a /home**
1. **Carga inicial**:
   - ✅ Verificar autenticación (ProtectedRoute)
   - 🚧 Cargar datos del usuario desde AuthContext
   - ⏳ Obtener estadísticas (`GET /userbooks/stats`)
   - ⏳ Cargar recomendaciones (`GET /recommendations`)
   - ⏳ Cargar primeros libros de historial (`GET /userbooks`)

2. **Renderizado**:
   - 🚧 Mostrar header con saludo personalizado
   - ⏳ Mostrar stats con skeleton loading mientras carga
   - ⏳ Mostrar recomendaciones o placeholder si no hay
   - ⏳ Mostrar grid de libros o mensaje de biblioteca vacía

### **Flujo 2: Usuario busca un libro manualmente**
1. Usuario escribe en QuickSearchForm
2. Debounce de 300ms activa búsqueda
3. API call `GET /books/search?title=X`
4. Mostrar resultados en dropdown
5. Usuario selecciona libro
6. Modal de confirmación con opciones de estado/rating
7. API call `POST /userbooks`
8. Actualizar BookHistorySection
9. Mostrar toast de confirmación

### **Flujo 3: Usuario gestiona un libro existente**
1. Usuario hace click en BookHistoryCard
2. Se abre BookActionModal
3. Opciones disponibles:
   - Cambiar estado (Leído → Leyendo, etc.)
   - Cambiar rating
   - Eliminar de biblioteca
   - Ver detalles completos
4. API call según acción (`PUT /userbooks/{id}` o `DELETE`)
5. Actualizar UI local
6. Mostrar feedback al usuario

### **Flujo 4: Usuario interactúa con recomendaciones**
1. Sistema muestra 6 recomendaciones iniciales
2. Usuario puede:
   - "Me interesa" → `POST /recommendations/feedback`
   - "No me interesa" → `POST /recommendations/feedback`  
   - "Añadir a biblioteca" → `POST /userbooks`
   - "Generar nuevas" → `POST /recommendations/generate`
3. UI se actualiza con nueva información
4. Recomendaciones se recalculan basado en feedback

---

## 🎨 **Estados de UI y Loading**

### **Estados de Carga**
1. **Skeleton Loading**:
   - DashboardStats: 4 cards con shimmer
   - RecommendationsSection: 6 cards con shimmer
   - BookHistorySection: Grid de 12 cards con shimmer

2. **Empty States**:
   - Sin libros: Ilustración + CTA "Añade tu primer libro"
   - Sin recomendaciones: "Completa tu encuesta para obtener recomendaciones"
   - Error de conexión: "Problema de conexión, reintenta"

3. **Loading States**:
   - Botones con spinner durante acciones
   - Overlay loading en modals
   - Progress bar en cargas de listas largas

---

## 📱 **Diseño Responsivo Específico**

### **Breakpoints y Comportamientos**
- **Mobile (sm)**: Stack vertical, navegación en hamburger
- **Tablet (md)**: Grid 2x2 para stats, carrusel horizontal para recomendaciones  
- **Desktop (lg+)**: Layout completo con sidebar, múltiples columnas

### **Interacciones Touch**
- Swipe en carrusel de recomendaciones
- Pull to refresh en BookHistorySection
- Long press para acciones de contexto en móvil

---

## 🔗 **APIs Específicas Requeridas**

### **Nuevas APIs Backend Necesarias**
1. `GET /userbooks/stats` - Estadísticas del usuario
2. `GET /recommendations` - Obtener recomendaciones personalizadas
3. `POST /recommendations/generate` - Generar nuevas recomendaciones  
4. `POST /recommendations/feedback` - Feedback de recomendación
5. `GET /userbooks` - Paginación y filtros mejorados
6. `PUT /userbooks/{id}` - Actualizar libro específico
7. `DELETE /userbooks/{id}` - Eliminar libro específico

### **APIs Existentes a Utilizar**
- ✅ `GET /books/search?title=X` - Búsqueda de libros
- ✅ `POST /userbooks` - Añadir libro a biblioteca
- ✅ `GET /auth/user` - Datos del usuario (si es necesario)

---

## 🎯 **Plan de Implementación Detallado**

### **Paso 1: Componentes Base (2-3 días)**
1. 🚧 Finalizar `DashboardLayout` con navegación
2. 🚧 Completar `DashboardHeader` con dropdown
3. ⏳ Crear `DashboardStats` con skeleton loading
4. ⏳ Implementar estados vacíos y de error

### **Paso 2: Sistema de Recomendaciones (3-4 días)**
1. ⏳ Crear `RecommendationsSection` con carrusel
2. ⏳ Implementar `RecommendationCard` con acciones
3. ⏳ Conectar con APIs de recomendaciones
4. ⏳ Añadir sistema de feedback

### **Paso 3: Gestión de Biblioteca (4-5 días)**
1. ⏳ Desarrollar `BookHistorySection` con filtros
2. ⏳ Crear `BookHistoryCard` con acciones
3. ⏳ Implementar `BookActionModal` para edición
4. ⏳ Añadir paginación e infinite scroll

### **Paso 4: Búsqueda Rápida (2-3 días)**
1. ⏳ Crear `QuickActionsSection`
2. ⏳ Implementar `QuickSearchForm` con debounce
3. ⏳ Conectar con BookSearchForm existente
4. ⏳ Optimizar performance de búsquedas

### **Paso 5: Polish y Optimización (2-3 días)**
1. ⏳ Responsive design y testing móvil
2. ⏳ Animaciones y microinteracciones
3. ⏳ Optimización de performance
4. ⏳ Testing de flujos completos

---

## 📊 **Métricas de Éxito**
- ✅ Tiempo de carga inicial < 2 segundos
- ✅ Todas las acciones CRUD funcionan correctamente
- ✅ Interface responsive en todos los dispositivos
- ✅ Zero errores de JavaScript en consola
- ✅ Feedback visual en todas las interacciones

---

**¿Comenzamos con la implementación paso a paso?** 🚀 