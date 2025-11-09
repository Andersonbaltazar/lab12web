import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Búsqueda avanzada de libros con paginación
export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams
    
    const search = searchParams.get('search')?.toLowerCase() || ''
    const genre = searchParams.get('genre')
    const authorName = searchParams.get('authorName')?.toLowerCase() || ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'))
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const order = (searchParams.get('order') || 'desc').toLowerCase() as 'asc' | 'desc'

    // Validar sortBy
    const validSortBy = ['title', 'publishedYear', 'createdAt']
    const finalSortBy = validSortBy.includes(sortBy) ? sortBy : 'createdAt'

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {
      AND: [
        search ? {
          OR: [
            {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        } : {},
        genre ? { genre } : {},
        authorName ? {
          author: {
            name: {
              contains: authorName,
              mode: 'insensitive',
            },
          },
        } : {},
      ].filter(w => Object.keys(w).length > 0),
    }

    // Contar total de resultados
    const total = await prisma.book.count({ where })

    // Obtener libros
    const books = await prisma.book.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        [finalSortBy]: order,
      },
      skip,
      take: limit,
    })

    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return NextResponse.json({
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error al buscar libros' },
      { status: 500 }
    )
  }
}
