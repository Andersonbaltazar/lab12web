const { PrismaClient } = require('../src/generated/prisma')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('📊 Verificando tablas en la base de datos...\n')
    
    const authorCount = await prisma.author.count()
    const bookCount = await prisma.book.count()
    
    console.log(`✅ Tabla Author: ${authorCount} registros`)
    console.log(`✅ Tabla Book: ${bookCount} registros`)
    
    const tables = await prisma.$queryRaw`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname='public' 
      ORDER BY tablename
    `
    
    console.log('\n📋 Tablas en schema "public":')
    tables.forEach(t => console.log(`  - ${t.tablename}`))
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
