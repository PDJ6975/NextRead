import { useEffect, useState } from 'react';
import userBookService from '../../services/userBookService';
import { bookService } from '../../services/bookService';
import { Card, CardHeader, CardContent } from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function UserLibrarySection() {
  const [userBooks, setUserBooks] = useState([]);
  const [booksDetails, setBooksDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        const data = await userBookService.getUserBooks();
        setUserBooks(data);
        // Obtener detalles de cada libro
        const detailsPromises = data.map(async (ub) => {
          try {
            const book = await bookService.getBook(ub.bookId);
            return [ub.bookId, book];
          } catch (e) {
            return [ub.bookId, null];
          }
        });
        const detailsArr = await Promise.all(detailsPromises);
        const detailsObj = Object.fromEntries(detailsArr);
        setBooksDetails(detailsObj);
      } catch (err) {
        setError('No se pudo cargar tu biblioteca');
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  // Use consistent UI components for loading and error states
  if (loading) return (
    <div className="flex justify-center items-center h-32">
      <LoadingSpinner label="Cargando tu biblioteca..." />
    </div>
  );
  if (error) return (
    <div className="flex justify-center items-center h-32">
      <Card>
        <CardContent>
          <p className="text-red-600 font-semibold">{error}</p>
        </CardContent>
      </Card>
    </div>
  );
  if (!userBooks.length) return <div>No tienes libros en tu biblioteca.</div>;

  return (
    <section className="my-8">
      <Card>
        <CardHeader>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Tu biblioteca</h2>
            <p className="text-gray-600 text-sm">Gestiona tus libros leídos y en progreso</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userBooks.map((userBook) => {
              const book = booksDetails[userBook.bookId];
              const title = book?.title?.trim() || 'Información no disponible';
              const authors = Array.isArray(book?.authors) && book.authors.length > 0
                ? book.authors.map(a => a.name).filter(Boolean).join(', ')
                : 'Información no disponible';
              return (
                <Card key={userBook.id}>
                  <CardHeader>
                    <h3 className="font-semibold text-lg truncate" title={title}>{title}</h3>
                    <p className="text-sm text-gray-600 mb-1 truncate" title={authors}>{authors}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-500 mb-2">Estado: <span className="font-medium text-gray-700">{userBook.status || 'Desconocido'}</span></p>
                    {/* Aquí puedes añadir más detalles, como fecha de añadido, rating, etc. */}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
