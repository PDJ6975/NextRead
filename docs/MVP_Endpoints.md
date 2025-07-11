# MVP – Endpoints obligatorios

> Este documento resume los endpoints REST que debe exponer el backend para cumplir con el MVP de **NextRead**.

## 1. Autenticación y perfil de usuario
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST   | `/auth/signup` | Registro de usuario (email, password, nickname). |
| POST   | `/auth/login`  | Inicio de sesión. Devuelve JWT. |
| POST   | `/auth/verify` | Verificación de cuenta por código. |
| POST   | `/auth/resend` | Reenvío de código de verificación. |
| GET    | `/users/me`    | Devuelve `UserProfileDTO` (nickname, avatarUrl). |
| PUT    | `/users/avatar`| Actualiza avatar del usuario autenticado. |
| PUT    | `/users/nickname` | Actualiza nickname. |

---

## 2. Libros (`Book`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | `/books`           | Lista todos los libros en BD. |
| GET    | `/books/{id}`      | Devuelve el libro por id (nuevo método en `BookService`). |
| GET    | `/books/search?title=` | Busca libros (BD → Google Books) y devuelve lista `BookDTO`. |
| POST   | `/books`           | Crea libro manualmente (opcional para admin, no hacer para mvp). |
| PUT    | `/books/{id}`      | Actualiza libro (opcional para admin, no hacer para mvp). |
| DELETE | `/books/{id}`      | Elimina libro (opcional para admin, no hacer para mvp). |

---

## 3. Relación Usuario-Libro (`UserBook`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | `/userbooks`            | Lista los libros del usuario (lecturas actuales). |
| POST   | `/userbooks`            | Añade libro al usuario (desde recomendación o búsqueda). |
| PUT    | `/userbooks/{id}`       | Actualiza `status` y/o `rating`. |
| DELETE | `/userbooks/{id}`       | Elimina la relación. |

---

## 4. Encuesta de preferencias de lectura (`Survey`)
*Cada usuario mantiene **una única** encuesta que puede crear/actualizar.*

Hay que actualizar la relación User-Survey.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | `/surveys`        | Devuelve la encuesta del usuario autenticado (o lista si decides versionar). |
| POST   | `/surveys`        | Crea encuesta si no existe. |
| PUT    | `/surveys/{id}`   | Actualiza la encuesta. |
| DELETE | `/surveys/{id}`   | Elimina la encuesta. |

---

## 5. Géneros (`Genre`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | `/genres`        | Lista todos los géneros disponibles. |
| GET    | `/genres/{id}`   | Devuelve un género por id. |

---

## 6. Recomendaciones (`Recommendation`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | `/recommendations`        | Lista las recomendaciones generadas para el usuario. |
| POST   | `/recommendations`        | Crea una nueva recomendación a partir de la IA (requiere título recibido). |
| DELETE | `/recommendations/{id}`   | Elimina la recomendación. |

---

## 7. Esquema de datos clave
| Entidad | PK | Campos principales |
|---------|----|--------------------|
| User    | id | email, password (hash), nickname, avatarUrl, enabled |
| Book    | id | title, isbn10, isbn13, publisher, coverUrl, synopsis, pages, publishedYear |
| UserBook| id | user_id, book_id, rating, status |
| Survey  | id | user_id, pace, selectedGenres |
| Genre   | id | name |
| Recommendation | id | user_id, book_id, reason |

---

## Notas técnicas
1. **JWT**: firmado con email como subject; los endpoints protegidos requieren `Authorization: Bearer <token>`.
2. **Validaciones**: usar Bean Validation para `isbn10`, `isbn13`, tamaños, etc.
3. **Roles**: mínimo `USER`, `ADMIN`. Los endpoints de administración (`POST/PUT/DELETE /books`) protegidos mediante `hasRole('ADMIN')`.
4. **Pagos externos**: N/A en MVP.
5. **Google Books**: `BookService.findBooks()` primero consulta BD y después `https://www.googleapis.com/books/v1/volumes?q=intitle:`.

Con estos endpoints el MVP cubre autenticación, gestión de perfil, catálogo de libros, interacción usuario-libro, preferencias de lectura y recomendaciones. 