'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    nationality: '',
    birthYear: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  const loadAuthors = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/authors')
      const data = await res.json()
      setAuthors(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAuthors()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/authors/${editingId}` : '/api/authors'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          birthYear: formData.birthYear ? parseInt(formData.birthYear) : null,
        }),
      })

      if (res.ok) {
        setFormData({ name: '', email: '', bio: '', nationality: '', birthYear: '' })
        setEditingId(null)
        setShowForm(false)
        loadAuthors()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este autor?')) return
    try {
      const res = await fetch(`/api/authors/${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadAuthors()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleEdit = (author: any) => {
    setFormData({
      name: author.name,
      email: author.email,
      bio: author.bio || '',
      nationality: author.nationality || '',
      birthYear: author.birthYear?.toString() || '',
    })
    setEditingId(author.id)
    setShowForm(true)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
              ← Volver al inicio
            </Link>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
              👤 Gestionar Autores
            </h1>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
              setFormData({ name: '', email: '', bio: '', nationality: '', birthYear: '' })
            }}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: showForm ? '#ef4444' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {showForm ? 'Cancelar' : '+ Nuevo Autor'}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>
              {editingId ? 'Editar Autor' : 'Crear Nuevo Autor'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Nombre *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
                required
              />
              <input
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
                required
              />
              <textarea
                placeholder="Biografía"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', minHeight: '80px', gridColumn: '1 / -1' }}
              />
              <input
                type="text"
                placeholder="Nacionalidad"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
              />
              <input
                type="number"
                placeholder="Año de nacimiento"
                value={formData.birthYear}
                onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  gridColumn: '1 / -1',
                }}
              >
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </form>
          </div>
        )}

        {/* Lista de autores */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
              Total: {authors.length} autores
            </h2>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              Cargando autores...
            </div>
          ) : authors.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              No hay autores. ¡Crea el primero!
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f3f4f6' }}>
                  <tr>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937' }}>Nombre</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937' }}>Email</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937' }}>Libros</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: '#1f2937' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {authors.map((author) => (
                    <tr key={author.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem', color: '#1f2937' }}>
                        <strong>{author.name}</strong>
                      </td>
                      <td style={{ padding: '1rem', color: '#6b7280' }}>
                        {author.email}
                      </td>
                      <td style={{ padding: '1rem', color: '#6b7280' }}>
                        📖 {author._count?.books || 0}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <Link href={`/authors/${author.id}`} style={{
                          display: 'inline-block',
                          padding: '0.5rem 1rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          marginRight: '0.5rem',
                          fontSize: '0.875rem',
                        }}>
                          Ver
                        </Link>
                        <button
                          onClick={() => handleEdit(author)}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            marginRight: '0.5rem',
                            fontSize: '0.875rem',
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(author.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
