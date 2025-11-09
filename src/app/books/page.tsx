'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  genre: string;
  publishedYear: number;
  pages: number;
  author: {
    id: string;
    name: string;
  };
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface SearchResponse {
  data: Book[];
  pagination: PaginationData;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  // Search filters
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'title' | 'publishedYear'>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  // Create form
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    publishedYear: new Date().getFullYear(),
    pages: 0,
    authorId: '',
  });

  // Load books
  const loadBooks = async (page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedGenre) params.append('genre', selectedGenre);
      if (selectedAuthor) params.append('authorName', selectedAuthor);
      params.append('page', page.toString());
      params.append('limit', '10');
      params.append('sortBy', sortBy);
      params.append('order', order);

      const res = await fetch(`/api/books/search?${params}`);
      const data: SearchResponse = await res.json();
      setBooks(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading books:', error);
      alert('Error al cargar los libros');
    } finally {
      setLoading(false);
    }
  };

  // Load authors and genres
  const loadMetadata = async () => {
    try {
      const res = await fetch('/api/authors');
      const data = await res.json();
      setAuthors(data.map((a: any) => ({ id: a.id, name: a.name })));

      // Extract unique genres from books
      const booksRes = await fetch('/api/books?limit=1000');
      const booksData = await booksRes.json();
      const uniqueGenres = [...new Set(booksData.map((b: any) => b.genre))].sort() as string[];
      setGenres(uniqueGenres);
    } catch (error) {
      console.error('Error loading metadata:', error);
    }
  };

  // Initial load
  useEffect(() => {
    loadBooks(1);
    loadMetadata();
  }, []);

  // Reload when filters change
  useEffect(() => {
    loadBooks(1);
  }, [search, selectedGenre, selectedAuthor, sortBy, order]);

  // Handle create book
  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.genre || !formData.authorId) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Libro creado exitosamente');
        setShowCreateForm(false);
        setFormData({
          title: '',
          genre: '',
          publishedYear: new Date().getFullYear(),
          pages: 0,
          authorId: '',
        });
        loadBooks(1);
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating book:', error);
      alert('Error al crear el libro');
    }
  };

  // Handle delete book
  const handleDeleteBook = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este libro?')) return;

    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Libro eliminado exitosamente');
        loadBooks(pagination.page);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Error al eliminar el libro');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📚 Búsqueda de Libros</h1>
        <Link href="/" style={styles.backButton}>
          ← Volver al Inicio
        </Link>
      </div>

      {/* Botón crear libro */}
      <div style={styles.section}>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            ...styles.button,
            backgroundColor: showCreateForm ? '#dc3545' : '#28a745',
          }}
        >
          {showCreateForm ? '✕ Cerrar Formulario' : '+ Crear Nuevo Libro'}
        </button>

        {/* Formulario crear */}
        {showCreateForm && (
          <form onSubmit={handleCreateBook} style={styles.form}>
            <div style={styles.formGrid}>
              <input
                type="text"
                placeholder="Título del libro"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                style={styles.input}
              />
              <select
                value={formData.authorId}
                onChange={(e) =>
                  setFormData({ ...formData, authorId: e.target.value })
                }
                style={styles.input}
              >
                <option value="">Selecciona un autor</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Género"
                value={formData.genre}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="number"
                placeholder="Año de publicación"
                value={formData.publishedYear}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    publishedYear: parseInt(e.target.value),
                  })
                }
                style={styles.input}
              />
              <input
                type="number"
                placeholder="Número de páginas"
                value={formData.pages}
                onChange={(e) =>
                  setFormData({ ...formData, pages: parseInt(e.target.value) })
                }
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.submitButton}>
              Crear Libro
            </button>
          </form>
        )}
      </div>

      {/* Filtros */}
      <div style={styles.section}>
        <h2 style={styles.subtitle}>Filtros y Búsqueda</h2>
        <div style={styles.filterGrid}>
          <input
            type="text"
            placeholder="🔍 Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            style={styles.input}
          >
            <option value="">Todos los géneros</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            style={styles.input}
          >
            <option value="">Todos los autores</option>
            {authors.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as 'createdAt' | 'title' | 'publishedYear')
            }
            style={styles.input}
          >
            <option value="createdAt">Más recientes</option>
            <option value="title">Por título (A-Z)</option>
            <option value="publishedYear">Por año de publicación</option>
          </select>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
            style={styles.input}
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </div>
      </div>

      {/* Resultados */}
      <div style={styles.section}>
        <h2 style={styles.subtitle}>
          Resultados ({pagination.total} libros)
        </h2>

        {loading ? (
          <p style={styles.loading}>Cargando libros...</p>
        ) : books.length === 0 ? (
          <p style={styles.empty}>No se encontraron libros</p>
        ) : (
          <>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.tableCell}>Título</th>
                  <th style={styles.tableCell}>Autor</th>
                  <th style={styles.tableCell}>Género</th>
                  <th style={styles.tableCell}>Año</th>
                  <th style={styles.tableCell}>Páginas</th>
                  <th style={styles.tableCell}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{book.title}</td>
                    <td style={styles.tableCell}>
                      <Link
                        href={`/authors/${book.author.id}`}
                        style={styles.link}
                      >
                        {book.author.name}
                      </Link>
                    </td>
                    <td style={styles.tableCell}>{book.genre}</td>
                    <td style={styles.tableCell}>{book.publishedYear}</td>
                    <td style={styles.tableCell}>{book.pages}</td>
                    <td style={styles.tableCell}>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        style={styles.deleteButton}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación */}
            <div style={styles.pagination}>
              <button
                onClick={() => loadBooks(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                style={{
                  ...styles.paginationButton,
                  opacity: pagination.hasPrev ? 1 : 0.5,
                  cursor: pagination.hasPrev ? 'pointer' : 'not-allowed',
                }}
              >
                ← Anterior
              </button>
              <span style={styles.pageInfo}>
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => loadBooks(pagination.page + 1)}
                disabled={!pagination.hasNext}
                style={{
                  ...styles.paginationButton,
                  opacity: pagination.hasNext ? 1 : 0.5,
                  cursor: pagination.hasNext ? 'pointer' : 'not-allowed',
                }}
              >
                Siguiente →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Estilos inline
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #007bff',
  },
  title: {
    fontSize: '2.5rem',
    color: '#333',
    margin: 0,
  },
  backButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6c757d',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
  },
  section: {
    marginBottom: '2rem',
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  subtitle: {
    fontSize: '1.3rem',
    color: '#333',
    marginTop: 0,
    marginBottom: '1rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    color: 'white',
    cursor: 'pointer',
    transition: 'opacity 0.3s',
  },
  form: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '0.25rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    fontFamily: 'Arial, sans-serif',
  },
  submitButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '1rem',
  },
  tableHeader: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  tableCell: {
    padding: '0.75rem',
    textAlign: 'left' as const,
    borderBottom: '1px solid #ddd',
  },
  tableRow: {
    transition: 'background-color 0.3s',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
  },
  paginationButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  pageInfo: {
    fontSize: '1rem',
    color: '#333',
  },
  loading: {
    textAlign: 'center' as const,
    color: '#666',
    fontSize: '1rem',
  },
  empty: {
    textAlign: 'center' as const,
    color: '#999',
    fontSize: '1rem',
  },
};
