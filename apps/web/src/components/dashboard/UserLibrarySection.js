import { useEffect, useState } from 'react';
import userBookService from '../../services/userBookService';
import { bookService } from '../../services/bookService';
import { Card, CardHeader, CardContent } from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { EmptyLibrary } from '../ui/EmptyState';
import { StarRating } from '../ui/StarRating';
import { Menu } from '@headlessui/react';

export default function UserLibrarySection() {
  const [userBooks, setUserBooks] = useState([]);
  const [booksDetails, setBooksDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Eliminamos el loading global de actualización
  const [updatingBookId, setUpdatingBookId] = useState(null);

  const fetchBooks = async () => {
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
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, []);

  // Mover libro de sección
  const handleMoveBook = async (userBook, newStatus) => {
    setUpdatingBookId(userBook.id);
    // Actualización optimista
    setUserBooks(prev => prev.map(ub => ub.id === userBook.id ? { ...ub, status: newStatus } : ub));
    try {
      await userBookService.updateBook(userBook.id, { status: newStatus });
    } catch (e) {
      setError('No se pudo actualizar el estado del libro');
      // Revertir si falla
      setUserBooks(prev => prev.map(ub => ub.id === userBook.id ? { ...ub, status: userBook.status } : ub));
    } finally {
      setUpdatingBookId(null);
    }
  };

  // Valorar libro leído
  const handleRateBook = async (userBook, rating) => {
    setUpdatingBookId(userBook.id);
    // Actualización optimista
    setUserBooks(prev => prev.map(ub => ub.id === userBook.id ? { ...ub, rating } : ub));
    try {
      await userBookService.updateBook(userBook.id, { rating });
    } catch (e) {
      setError('No se pudo guardar la valoración');
      setUserBooks(prev => prev.map(ub => ub.id === userBook.id ? { ...ub, rating: userBook.rating } : ub));
    } finally {
      setUpdatingBookId(null);
    }
  };

  // Use consistent UI components for loading and error states
  if (loading) return (
    <div className="flex justify-center items-center h-32">
      <LoadingSpinner label={'Cargando tu biblioteca...'} />
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
  if (!userBooks.length) return (
    <div className="my-8">
      <Card>
        <CardContent>
          <EmptyLibrary />
        </CardContent>
      </Card>
    </div>
  );

  // Agrupar libros por estado
  const toReadBooks = userBooks.filter((ub) => ub.status === 'TO_READ');
  const readBooks = userBooks.filter((ub) => ub.status === 'READ');
  const abandonedBooks = userBooks.filter((ub) => ub.status === 'ABANDONED');

  // Utilidad para truncar títulos largos
  const truncate = (str, n = 60) => (str && str.length > n ? str.slice(0, n - 1) + '…' : str);

  // Renderiza una card de libro
  const renderBookCard = (userBook, section) => {
    const book = booksDetails[userBook.bookId];
    const title = truncate(book?.title?.trim() || 'Información no disponible', 45);
    const authors = Array.isArray(book?.authors) && book.authors.length > 0
      ? book.authors.map(a => a.name).filter(Boolean).join(', ')
      : 'Información no disponible';
    const coverUrl = book?.coverUrl || 'https://placehold.co/96x140?text=Sin+portada';
    let statusColor = 'bg-gray-200 text-gray-700';
    if (userBook.status === 'READ') statusColor = 'bg-green-100 text-green-700';
    if (userBook.status === 'READING') statusColor = 'bg-blue-100 text-blue-700';
    if (userBook.status === 'ABANDONED') statusColor = 'bg-red-100 text-red-700';
    if (userBook.status === 'TO_READ') statusColor = 'bg-yellow-100 text-yellow-700';

    return (
      <div
        key={userBook.id}
        className="flex gap-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-200 p-4 items-center min-h-[140px]"
      >
        <img
          src={coverUrl}
          alt={title}
          className="w-20 h-32 object-cover rounded-md border border-gray-200 bg-gray-50 shadow-sm flex-shrink-0"
        />
        <div className="flex-1 flex flex-col justify-between h-full min-w-0">
          <div className="min-w-0">
            <h3 className="font-semibold text-base text-gray-900 truncate" title={book?.title}>{title}</h3>
            <p className="text-sm text-gray-600 mb-2 truncate" title={authors}>{authors}</p>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor}`}>{userBook.status || 'Desconocido'}</span>
            {/* Valoración */}
            {section === 'READ' && (
              <div className="flex items-center gap-1 max-w-full">
                <StarRating
                  rating={userBook.rating || 0}
                  onChange={rating => handleRateBook(userBook, rating)}
                  readOnly={false}
                  size="sm"
                  showValue={true}
                />
                <span className="text-xs text-blue-600 ml-1 truncate max-w-[80px]">{userBook.rating ? 'Editar valoración' : 'Valora este libro'}</span>
              </div>
            )}
          </div>
          {/* Acciones para mover libro de sección, solo si NO es ABANDONED ni READ */}
          {section !== 'ABANDONED' && section !== 'READ' && (
            <div className="flex mt-2">
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 transition disabled:opacity-60" disabled={updatingBookId === userBook.id}>
                  Cambiar estado
                </Menu.Button>
                <Menu.Items className="absolute z-10 mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg focus:outline-none">
                  {section !== 'READ' && (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`block w-full text-left px-3 py-2 text-xs ${active ? 'bg-green-100 text-green-700' : ''}`}
                          onClick={() => handleMoveBook(userBook, 'READ')}
                          disabled={updatingBookId === userBook.id}
                        >
                          Marcar como leído
                        </button>
                      )}
                    </Menu.Item>
                  )}
                  {section !== 'TO_READ' && (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`block w-full text-left px-3 py-2 text-xs ${active ? 'bg-yellow-100 text-yellow-700' : ''}`}
                          onClick={() => handleMoveBook(userBook, 'TO_READ')}
                          disabled={updatingBookId === userBook.id}
                        >
                          Marcar como pendiente
                        </button>
                      )}
                    </Menu.Item>
                  )}
                  {section !== 'ABANDONED' && (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`block w-full text-left px-3 py-2 text-xs ${active ? 'bg-red-100 text-red-700' : ''}`}
                          onClick={() => handleMoveBook(userBook, 'ABANDONED')}
                          disabled={updatingBookId === userBook.id}
                        >
                          Marcar como abandonado
                        </button>
                      )}
                    </Menu.Item>
                  )}
                </Menu.Items>
              </Menu>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="my-8">
      <Card className="shadow-md border border-gray-100">
        <CardHeader>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Tu biblioteca</h2>
            <p className="text-gray-600 text-sm">Gestiona tus libros leídos y en progreso</p>
          </div>
        </CardHeader>
        <CardContent>
          {/* Sección TO_READ */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-yellow-700 mb-3 flex items-center gap-2">📚 Por leer</h3>
            {toReadBooks.length === 0 ? (
              <p className="text-gray-400 text-sm">No tienes libros pendientes por leer.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {toReadBooks.map(ub => renderBookCard(ub, 'TO_READ'))}
              </div>
            )}
          </div>
          {/* Sección READ */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">✅ Leídos</h3>
            {readBooks.length === 0 ? (
              <p className="text-gray-400 text-sm">No tienes libros leídos aún.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {readBooks.map(ub => renderBookCard(ub, 'READ'))}
              </div>
            )}
          </div>
          {/* Sección ABANDONED */}
          <div>
            <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">🚫 Abandonados</h3>
            {abandonedBooks.length === 0 ? (
              <p className="text-gray-400 text-sm">No tienes libros abandonados.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {abandonedBooks.map(ub => renderBookCard(ub, 'ABANDONED'))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
