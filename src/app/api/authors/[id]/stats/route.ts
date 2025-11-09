import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener estadísticas completas del autor
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    // Obtener el autor con todos sus libros
    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        books: {
          orderBy: {
            publishedYear: 'asc',
          },
        },
      },
    })

    if (!author) {
      return NextResponse.json({ error: 'Autor no encontrado' }, { status: 404 })
    }

    const books = author.books

    if (books.length === 0) {
      return NextResponse.json({
        authorId: author.id,
        authorName: author.name,
        totalBooks: 0,
        firstBook: null,
        latestBook: null,
        averagePages: 0,
        genres: [],
        longestBook: null,
        shortestBook: null,
      })
    }

    // Calcular estadísticas
    const totalBooks = books.length
    const firstBook = {
      title: books[0].title,
      year: books[0].publishedYear,
    }
    const latestBook = {
      title: books[books.length - 1].title,
      year: books[books.length - 1].publishedYear,
    }

    // Promedio de páginas
    const booksWithPages = books.filter(b => b.pages !== null)
    const averagePages = booksWithPages.length > 0
      ? Math.round(booksWithPages.reduce((sum, b) => sum + (b.pages || 0), 0) / booksWithPages.length)
      : 0

    // Géneros únicos
    const genres = Array.from(new Set(books.map(b => b.genre).filter(g => g !== null))) as string[]

    // Libro con más páginas
    const longestBook = booksWithPages.reduce((max, book) => {
      return (book.pages || 0) > (max.pages || 0) ? book : max
    })

    // Libro con menos páginas
    const shortestBook = booksWithPages.reduce((min, book) => {
      return (book.pages || 0) < (min.pages || 0) ? book : min
    })

    return NextResponse.json({
      authorId: author.id,
      authorName: author.name,
      totalBooks,
      firstBook: firstBook.year ? firstBook : null,
      latestBook: latestBook.year ? latestBook : null,
      averagePages,
      genres,
      longestBook: longestBook ? {
        title: longestBook.title,
        pages: longestBook.pages,
      } : null,
      shortestBook: shortestBook ? {
        title: shortestBook.title,
        pages: shortestBook.pages,
      } : null,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas del autor' },
      { status: 500 }
    )
  }
}
