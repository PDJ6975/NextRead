# Plan de Acción para Completar Backend NextRead

## Descripción de la Aplicación

NextRead es una aplicación web donde los usuarios pueden obtener recomendaciones personalizadas de libros. El flujo principal incluye:

1. Registro e inicio de sesión de usuarios
2. Completar una encuesta obligatoria para usuarios nuevos que incluye:
   - Selección de géneros favoritos
   - Ritmo de lectura preferido
   - Libros ya leídos (con valoraciones)
   - Libros que no ha podido terminar
3. Sistema de recomendaciones basado en preferencias del usuario
4. Posibilidad de buscar y añadir libros manualmente
5. Historial de lectura en la página principal

## Flujo General de la Aplicación

### 1. Usuario Nuevo - Primera Vez

#### 1.1 Registro e Inicio de Sesión
- **Frontend**: Formulario de registro
- **Backend**: `POST /auth/signup` → `AuthenticationService.signUp()`
- **Backend**: `POST /auth/verify` → `AuthenticationService.verifyUser()`
- **Backend**: `POST /auth/login` → `AuthenticationService.authenticate()`

#### 1.2 Completar Encuesta Obligatoria
- **Frontend**: Redirige automáticamente a página de encuesta
- **Backend**: `GET /surveys/find` → `SurveyService.findByUserOrCreate()` (crea encuesta con `firstTime=true`)

**Paso 1: Seleccionar Ritmo y Géneros**
- **Frontend**: Formulario con ritmo de lectura y géneros favoritos
- **Backend**: `PUT /surveys/update` → `SurveyService.updatePaceGenreSurvey()`

**Paso 2: Añadir Libros Leídos (con valoración)**
- **Frontend**: Búsqueda de libros + valoración
- **Backend**: `GET /books/search/survey?title=X` → `BookService.findBookCauseSurvey()` (solo si `firstTime=true`)
- **Backend**: `POST /userbooks/add` → `UserBookService.addBookSelected()` con `status=READ` y `rating`

**Paso 3: Añadir Libros No Terminados (que no le han gustado, sin valoración)**
- **Frontend**: Búsqueda de libros sin valoración
- **Backend**: `GET /books/search/survey?title=X` → `BookService.findBookCauseSurvey()`
- **Backend**: `POST /userbooks/add` → `UserBookService.addBookSelected()` con `status=abandoned` y `rating=null`

#### 1.3 Redirigir al Home
- **Frontend**: Navegación automática al home después de completar encuesta
- **Backend**: `GET /userbooks` → `UserBookService.findUserBooksAsDTO()` (obtiene historial del usuario)

#### 1.4 Generar Recomendaciones
- **Frontend**: Botón "Generar Recomendaciones"
- **Backend**: `POST /recommendations/generate` → `RecommendationService.generateRecommendations()` → `ChatGPTService.generateRecommendations()`

#### 1.5 Elegir Recomendación
- **Frontend**: Muestra 3 recomendaciones con título y razón
- **Frontend**: Usuario puede hacer clic en cada recomendación para ver detalles
- **Backend**: `GET /books/search/basic?title=X` → `BookService.findBooks()` (para obtener detalles del libro)
- **Frontend**: Usuario selecciona una recomendación
- **Backend**: `POST /recommendations` → `RecommendationService.createRecommendation()` (guarda la recomendación elegida)

#### 1.6 Volver al Home
- **Frontend**: Navegación automática al home
- **Backend**: `GET /userbooks` → `UserBookService.findUserBooksAsDTO()` (historial actualizado)
- **Backend**: `GET /recommendations` → `RecommendationService.getRecommendationsForUser()` (recomendaciones guardadas)

### 2. Usuario Existente - Sesiones Posteriores

#### 2.1 Inicio de Sesión
- **Frontend**: Formulario de login
- **Backend**: `POST /auth/login` → `AuthenticationService.authenticate()`

#### 2.2 Ir Directo al Home
- **Frontend**: Navegación automática al home (sin encuesta)
- **Backend**: `GET /userbooks` → `UserBookService.findUserBooksAsDTO()` (historial del usuario)
- **Backend**: `GET /recommendations` → `RecommendationService.getRecommendationsForUser()` (recomendaciones previas)

#### 2.3 Generar Nuevas Recomendaciones (Opcional)
- **Frontend**: Botón "Generar Recomendaciones"

**Paso 1: Actualizar Preferencias (Opcional)**
- **Frontend**: Modal/página para actualizar solo ritmo y géneros
- **Backend**: `GET /surveys/find` → `SurveyService.findByUserOrCreate()` (obtiene encuesta existente con `firstTime=false`)
- **Backend**: `PUT /surveys/update` → `SurveyService.updatePaceGenreSurvey()` (actualiza solo ritmo y géneros)

**Paso 2: Generar Recomendaciones**
- **Backend**: `POST /recommendations/generate` → `RecommendationService.generateRecommendations()` → `ChatGPTService.generateRecommendations()`
- **Nota**: Como `firstTime=false`, ChatGPT usará directamente los `UserBooks` existentes (no permite añadir nuevos libros)

**Paso 3: Elegir Recomendación**
- **Frontend**: Proceso idéntico al usuario nuevo
- **Backend**: `GET /books/search/basic?title=X` → `BookService.findBooks()` (detalles del libro)
- **Backend**: `POST /recommendations` → `RecommendationService.createRecommendation()` (guarda nueva recomendación)

**Paso 4: Volver al Home**
- **Frontend**: Navegación automática al home
- **Backend**: `GET /userbooks` → `UserBookService.findUserBooksAsDTO()` (historial)
- **Backend**: `GET /recommendations` → `RecommendationService.getRecommendationsForUser()` (recomendaciones actualizadas)

### 3. Funcionalidades Adicionales del Home

#### 3.1 Gestión Manual de Libros
- **Frontend**: Búsqueda manual de libros
- **Backend**: `GET /books/search/basic?title=X` → `BookService.findBooks()`
- **Backend**: `POST /userbooks/add` → `UserBookService.addBookSelected()` (añadir libro manualmente)

#### 3.2 Actualizar Estado de Libros
- **Frontend**: Cambiar estado/valoración de libros existentes
- **Backend**: `PUT /userbooks/{id}` → `UserBookService.updateUserBook()`

#### 3.3 Eliminar Libros
- **Frontend**: Eliminar libros del historial
- **Backend**: `DELETE /userbooks/{id}` → `UserBookService.deleteUserBook()`

#### 3.4 Gestión de Recomendaciones
- **Frontend**: Ver recomendaciones guardadas
- **Backend**: `GET /recommendations` → `RecommendationService.getRecommendationsForUser()`
- **Frontend**: Eliminar recomendaciones
- **Backend**: `DELETE /recommendations/{id}` → `RecommendationService.deleteRecommendation()`

### 4. Validaciones Clave del Flujo

1. **Encuesta Primera Vez**: `SurveyService.findByUserOrCreate()` crea encuesta con `firstTime=true`
2. **Búsqueda en Encuesta**: `BookService.findBookCauseSurvey()` solo funciona si `firstTime=true`
3. **Generación de Recomendaciones**: `ChatGPTService.generateRecommendations()` valida que `firstTime=false` para nuevos usuarios y se pueda usar la funcionalidad, es decir, que ya se haya completado la encuesta antes
4. **Finalización de Encuesta**: `UserBookService.addBookSelected()` marca `firstTime=false` al añadir el primer libro
5. **Usuarios Existentes**: `ChatGPTService.generateRecommendations()` con `firstTime=false` solo permite actualizar ritmo/géneros

### 5. Estados de la Aplicación

- **Usuario Nuevo**: `firstTime=true` → Encuesta obligatoria → Generación de recomendaciones
- **Usuario Existente**: `firstTime=false` → Home directo → Generación opcional de recomendaciones
- **Libros UserBook**: Estados `read`, `abandoned`, `to_read` con valoraciones opcionales
- **Recomendaciones**: Almacenadas permanentemente hasta que el usuario las elimine

## Estado Actual del Proyecto

Basado en la estructura de archivos, ya están implementados:
- Sistema de autenticación
- Gestión de usuarios
- Sistema de libros
- Encuestas de preferencias
- Relación usuario-libro

## Componentes Pendientes

### 1. Sistema de Recomendaciones

#### 1.1 RecommendationRepository
```java
@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByUserId(Long userId);
    void deleteByUserIdAndBookId(Long userId, Long bookId);
}
```

#### 1.2 RecommendationService
```java
@Service
public class RecommendationService {
    private final RecommendationRepository recommendationRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    // Constructor con inyección de dependencias
    
    // Obtener recomendaciones de un usuario
    public List<Recommendation> getRecommendationsForUser(Long userId) {
        return recommendationRepository.findByUserId(userId);
    }
    
    // Crear nueva recomendación (simulando IA)
    public Recommendation createRecommendation(Long userId, Long bookId, String reason) {
        // Implementar lógica
    }
    
    // Eliminar recomendación
    public void deleteRecommendation(Long id) {
        // Implementar lógica
    }
}
```

#### 1.3 RecommendationController
```java
@RestController
@RequestMapping("/recommendations")
public class RecommendationController {
    private final RecommendationService recommendationService;
    
    // Constructor
    
    @GetMapping
    public ResponseEntity<List<Recommendation>> getRecommendations(@AuthenticationPrincipal User user) {
        // Implementar
    }
    
    @PostMapping
    public ResponseEntity<Recommendation> createRecommendation(@RequestBody RecommendationRequestDTO request,
                                                            @AuthenticationPrincipal User user) {
        // Implementar
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecommendation(@PathVariable Long id,
                                                  @AuthenticationPrincipal User user) {
        // Implementar
    }
}
```

#### 1.4 RecommendationRequestDTO
```java
@Data
@Builder
public class RecommendationRequestDTO {
    private Long bookId;
    private String reason;
}
```

### 2. Completar Endpoints Faltantes

#### 2.1 AuthenticationController
- Verificar implementación completa de `/auth/verify` y `/auth/resend`

#### 2.2 UserController
- Implementar `/users/avatar` (modifando el PUT de changeAvatar) y `/users/nickname`

#### 2.3 BookController
- Completar implementación de búsqueda de libros (`/books/search`)

### 3. Pruebas Unitarias Pendientes

#### 3.1 RecommendationServiceTest
```java
@ExtendWith(MockitoExtension.class)
public class RecommendationServiceTest {
    @Mock
    private RecommendationRepository recommendationRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private BookRepository bookRepository;
    
    @InjectMocks
    private RecommendationService recommendationService;
    
    // Pruebas para getRecommendationsForUser
    // Pruebas para createRecommendation
    // Pruebas para deleteRecommendation
}
```

#### 3.2 RecommendationControllerTest
```java
@WebMvcTest(RecommendationController.class)
public class RecommendationControllerTest {
    @MockBean
    private RecommendationService recommendationService;
    @MockBean
    private JwtService jwtService;
    
    @Autowired
    private MockMvc mockMvc;
    
    // Pruebas para getRecommendations
    // Pruebas para createRecommendation
    // Pruebas para deleteRecommendation
}
```

#### 3.3 Completar UserControllerTest
- Pruebas para actualizar avatar y nickname

### 4. Seguridad y Validaciones

- Verificar que todos los endpoints protegidos requieran autenticación
- Implementar validaciones para todos los DTOs
- Asegurar roles adecuados para endpoints de administración

## Plan de Ejecución

1. ✅ Crear RecommendationRepository
2. ✅ Implementar RecommendationService
3. ✅ Crear RecommendationController
4. ✅ Integrar API de ChatGPT para generar recomendaciones
5. ✅ Completar endpoints pendientes en controladores existentes
6. ✅ Desarrollar pruebas unitarias para nuevos componentes
7. Realizar pruebas de integración (más tarde)
9. Validar seguridad y permisos (más tarde)
10. Documentar API (más tarde)