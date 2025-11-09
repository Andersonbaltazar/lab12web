import { PrismaClient } from '@/generated/prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const authorCount = await prisma.author.count()
    const bookCount = await prisma.book.count()
    
    return Response.json({
      success: true,
      tables: {
        Author: authorCount,
        Book: bookCount
      },
      message: '✅ Ambas tablas existen en la base de datos'
    })
  } catch (error) {
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
