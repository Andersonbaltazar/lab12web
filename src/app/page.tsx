'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [stats, setStats] = useState({ authors: 0, books: 0 })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const authorsRes = await fetch('/api/authors')
        const booksRes = await fetch('/api/books')
        const authorsData = await authorsRes.json()
        const booksData = await booksRes.json()
        setStats({
          authors: authorsData.length || 0,
          books: booksData.length || 0,
        })
      } catch (error) {
        console.error(error)
      }
    }
    loadStats()
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
            📚 Sistema de Biblioteca
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>
            Gestiona autores y libros de forma intuitiva
          </p>
        </div>

        {/* Estadísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {stats.authors}
            </div>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Autores registrados</p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981' }}>
              {stats.books}
            </div>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Libros en la biblioteca</p>
          </div>
        </div>

        {/* Botones de navegación */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Gestionar Autores */}
          <Link href="/authors" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '2px solid #3b82f6',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)'
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                Gestionar Autores
              </h2>
              <p style={{ color: '#6b7280', textAlign: 'center' }}>
                Crear, editar y eliminar autores
              </p>
            </div>
          </Link>

          {/* Gestionar Libros */}
          <Link href="/books" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '2px solid #10b981',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)'
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                Buscar Libros
              </h2>
              <p style={{ color: '#6b7280', textAlign: 'center' }}>
                Buscar, filtrar y gestionar libros
              </p>
            </div>
          </Link>
        </div>

        {/* Info de API */}
        <div style={{
          marginTop: '3rem',
          padding: '1.5rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '12px',
          borderLeft: '4px solid #3b82f6',
        }}>
          <h3 style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            ℹ️ Información del Sistema
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            Este sistema integra una API REST completa con endpoints para gestionar autores y libros. 
            Todos los datos se sincronizan con Supabase PostgreSQL en tiempo real.
          </p>
        </div>
      </div>
    </div>
  )
}
