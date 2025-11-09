'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  nationality?: string;
  birthYear?: number;
}

interface Stats {
  totalBooks: number;
  firstBook?: number;
  lastBook?: number;
  averagePages?: number;
  genres: string[];
  longestBook?: {
    title: string;
    pages: number;
  };
  shortestBook?: {
    title: string;
    pages: number;
  };
}

interface Book {
  id: string;
  title: string;
  genre: string;
  publishedYear: number;
  pages: number;
}

export default function AuthorDetailPage() {
  const params = useParams();
  const authorId = params.id as string;

  const [author, setAuthor] = useState<Author | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Author>>({});

  // Load author details
  const loadAuthor = async () => {
    try {
      const res = await fetch(`/api/authors/${authorId}`);
      if (res.ok) {
        const data = await res.json();
        setAuthor(data);
        setEditData(data);
      } else {
        alert('Autor no encontrado');
      }
    } catch (error) {
      console.error('Error loading author:', error);
      alert('Error al cargar el autor');
    }
  };

  // Load author statistics
  const loadStats = async () => {
    try {
      const res = await fetch(`/api/authors/${authorId}/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Load author's books
  const loadBooks = async () => {
    try {
      const res = await fetch(`/api/authors/${authorId}/books`);
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  // Initial load
  useEffect(() => {
    if (authorId) {
      const loadAll = async () => {
        setLoading(true);
        await Promise.all([loadAuthor(), loadStats(), loadBooks()]);
        setLoading(false);
      };
      loadAll();
    }
  }, [authorId]);

  // Handle update author
  const handleUpdateAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData.name || !editData.email) {
      alert('Nombre y email son obligatorios');
      return;
    }

    try {
      const res = await fetch(`/api/authors/${authorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        alert('Autor actualizado exitosamente');
        setIsEditing(false);
        await loadAuthor();
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating author:', error);
      alert('Error al actualizar el autor');
    }
  };

  // Handle delete author
  const handleDeleteAuthor = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este autor? Se eliminarán todos sus libros.')) {
      return;
    }

    try {
      const res = await fetch(`/api/authors/${authorId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Autor eliminado exitosamente');
        window.location.href = '/authors';
      }
    } catch (error) {
      console.error('Error deleting author:', error);
      alert('Error al eliminar el autor');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Cargando detalles del autor...</p>
      </div>
    );
  }

  if (!author) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>Autor no encontrado</p>
        <Link href="/authors" style={styles.backButton}>
          ← Volver a Autores
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👤 {author.name}</h1>
        <Link href="/authors" style={styles.backButton}>
          ← Volver a Autores
        </Link>
      </div>

      {/* Información del autor */}
      <div style={styles.section}>
        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <strong>Email:</strong>
            <p>{author.email}</p>
          </div>
          {author.bio && (
            <div style={styles.infoCard}>
              <strong>Biografía:</strong>
              <p>{author.bio}</p>
            </div>
          )}
          {author.nationality && (
            <div style={styles.infoCard}>
              <strong>Nacionalidad:</strong>
              <p>{author.nationality}</p>
            </div>
          )}
          {author.birthYear && (
            <div style={styles.infoCard}>
              <strong>Año de Nacimiento:</strong>
              <p>{author.birthYear}</p>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div style={styles.actionButtons}>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              ...styles.button,
              backgroundColor: isEditing ? '#dc3545' : '#007bff',
            }}
          >
            {isEditing ? '✕ Cancelar Edición' : '✏️ Editar'}
          </button>
          <button
            onClick={handleDeleteAuthor}
            style={styles.deleteButton}
          >
            🗑️ Eliminar Autor
          </button>
        </div>

        {/* Formulario de edición */}
        {isEditing && (
          <form onSubmit={handleUpdateAuthor} style={styles.editForm}>
            <h3 style={styles.formTitle}>Editar Información del Autor</h3>
            <div style={styles.formGrid}>
              <div>
                <label style={styles.label}>Nombre:</label>
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Email:</label>
                <input
                  type="email"
                  value={editData.email || ''}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Nacionalidad:</label>
                <input
                  type="text"
                  value={editData.nationality || ''}
                  onChange={(e) =>
                    setEditData({ ...editData, nationality: e.target.value })
                  }
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Año de Nacimiento:</label>
                <input
                  type="number"
                  value={editData.birthYear || ''}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      birthYear: parseInt(e.target.value),
                    })
                  }
                  style={styles.input}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>Biografía:</label>
                <textarea
                  value={editData.bio || ''}
                  onChange={(e) =>
                    setEditData({ ...editData, bio: e.target.value })
                  }
                  style={{
                    ...styles.input,
                    minHeight: '100px',
                    resize: 'vertical' as const,
                  }}
                />
              </div>
            </div>
            <button type="submit" style={styles.submitButton}>
              Guardar Cambios
            </button>
          </form>
        )}
      </div>

      {/* Estadísticas */}
      {stats && (
        <div style={styles.section}>
          <h2 style={styles.subtitle}>📊 Estadísticas</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{stats.totalBooks}</div>
              <div style={styles.statLabel}>Libros Totales</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>
                {stats.averagePages ? Math.round(stats.averagePages) : 0}
              </div>
              <div style={styles.statLabel}>Páginas Promedio</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{stats.genres.length}</div>
              <div style={styles.statLabel}>Géneros Diferentes</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>
                {stats.firstBook && stats.lastBook
                  ? stats.lastBook - stats.firstBook
                  : 0}
              </div>
              <div style={styles.statLabel}>Años de Carrera</div>
            </div>
          </div>

          {stats.genres.length > 0 && (
            <div style={styles.genresContainer}>
              <strong>Géneros:</strong>
              <div style={styles.genresList}>
                {stats.genres.map((genre) => (
                  <span key={genre} style={styles.genreTag}>
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {stats.longestBook && (
            <p style={styles.bookInfo}>
              📖 <strong>Libro más largo:</strong> {stats.longestBook.title} ({stats.longestBook.pages} páginas)
            </p>
          )}

          {stats.shortestBook && (
            <p style={styles.bookInfo}>
              📖 <strong>Libro más corto:</strong> {stats.shortestBook.title} ({stats.shortestBook.pages} páginas)
            </p>
          )}
        </div>
      )}

      {/* Libros del autor */}
      <div style={styles.section}>
        <h2 style={styles.subtitle}>
          📚 Libros ({books.length})
        </h2>

        {books.length === 0 ? (
          <p style={styles.empty}>Este autor no tiene libros registrados</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableCell}>Título</th>
                <th style={styles.tableCell}>Género</th>
                <th style={styles.tableCell}>Año</th>
                <th style={styles.tableCell}>Páginas</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{book.title}</td>
                  <td style={styles.tableCell}>{book.genre}</td>
                  <td style={styles.tableCell}>{book.publishedYear}</td>
                  <td style={styles.tableCell}>{book.pages}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={styles.linkContainer}>
          <Link href="/books" style={styles.createLink}>
            ➕ Crear Nuevo Libro
          </Link>
        </div>
      </div>
    </div>
  );
}

// Estilos inline
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1000px',
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
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  infoCard: {
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '0.25rem',
    borderLeft: '4px solid #007bff',
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  deleteButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#dc3545',
    border: 'none',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  editForm: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '0.25rem',
    borderTop: '2px solid #007bff',
  },
  formTitle: {
    marginTop: 0,
    color: '#333',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#333',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box' as const,
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statCard: {
    backgroundColor: '#f9f9f9',
    padding: '1rem',
    borderRadius: '0.25rem',
    textAlign: 'center' as const,
    borderTop: '4px solid #007bff',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#007bff',
    margin: '0.5rem 0',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#666',
  },
  genresContainer: {
    marginBottom: '1rem',
  },
  genresList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  genreTag: {
    display: 'inline-block',
    padding: '0.3rem 0.8rem',
    backgroundColor: '#e7f3ff',
    color: '#007bff',
    borderRadius: '0.25rem',
    fontSize: '0.9rem',
  },
  bookInfo: {
    padding: '0.5rem 0',
    color: '#333',
    margin: '0.5rem 0',
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
  empty: {
    textAlign: 'center' as const,
    color: '#999',
    fontSize: '1rem',
  },
  linkContainer: {
    marginTop: '1.5rem',
    textAlign: 'center' as const,
  },
  createLink: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  loading: {
    textAlign: 'center' as const,
    color: '#666',
    fontSize: '1rem',
  },
  error: {
    textAlign: 'center' as const,
    color: '#dc3545',
    fontSize: '1rem',
  },
};
