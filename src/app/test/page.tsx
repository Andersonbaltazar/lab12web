'use client'

import { useState } from 'react'

export default function TestPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testGetAuthors = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/authors')
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testCreateAuthor = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/authors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Author',
          email: `test${Date.now()}@example.com`,
          bio: 'Test bio',
          nationality: 'Test',
          birthYear: 2000,
        }),
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '48rem', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Prueba de API
      </h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={testGetAuthors}
          disabled={loading}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? 'Cargando...' : 'Obtener Autores'}
        </button>

        <button
          onClick={testCreateAuthor}
          disabled={loading}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? 'Cargando...' : 'Crear Autor'}
        </button>
      </div>

      {result && (
        <pre
          style={{
            backgroundColor: '#f3f4f6',
            padding: '1rem',
            borderRadius: '0.375rem',
            overflow: 'auto',
            maxHeight: '24rem',
            fontSize: '0.875rem',
          }}
        >
          {result}
        </pre>
      )}
    </div>
  )
}
