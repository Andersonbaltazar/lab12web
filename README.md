# 📚 Lab 12 - Sistema de Gestión de Biblioteca

Sistema completo de gestión de biblioteca construido con **Next.js 16**, **Prisma ORM** y **Supabase PostgreSQL**.

## 🎯 Características

### 🔌 API REST (8 Endpoints)

#### Autores
- `GET /api/authors` - Listar todos los autores
- `POST /api/authors` - Crear nuevo autor
- `GET /api/authors/[id]` - Obtener autor por ID
- `PUT /api/authors/[id]` - Actualizar autor
- `DELETE /api/authors/[id]` - Eliminar autor
- `GET /api/authors/[id]/books` - Listar libros de un autor
- `GET /api/authors/[id]/stats` - Estadísticas del autor (libros, géneros, páginas, etc.)

#### Libros
- `GET /api/books` - Listar todos los libros
- `POST /api/books` - Crear nuevo libro
- `GET /api/books/[id]` - Obtener libro por ID
- `PUT /api/books/[id]` - Actualizar libro
- `DELETE /api/books/[id]` - Eliminar libro
- `GET /api/books/search` - Búsqueda avanzada con paginación, filtros y ordenamiento

### 🎨 Páginas Frontend

- **Dashboard (`/`)** - Inicio intuitivo con botones de navegación y estadísticas
- **Gestión de Autores (`/authors`)** - CRUD de autores con formulario y tabla
- **Detalle de Autor (`/authors/[id]`)** - Perfil completo, estadísticas y lista de libros
- **Búsqueda de Libros (`/books`)** - Búsqueda avanzada, filtros, paginación y CRUD de libros

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 16 (App Router) + React 18
- **Backend**: Next.js Route Handlers
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma
- **Lenguaje**: TypeScript
- **Estilos**: CSS inline (sin dependencias externas)

## 🚀 Instalación y Configuración

### 1. Clonar repositorio
```bash
git clone https://github.com/Andersonbaltazar/lab12web.git
cd lab12web
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` con:
```env
DATABASE_URL="postgresql://usuario:contraseña@host:puerto/database"
```

### 4. Sincronizar base de datos
```bash
npx prisma db push
```

### 5. Iniciar servidor de desarrollo
```bash
npm run dev
```

Acceder a [http://localhost:3000](http://localhost:3000)

## 📦 Scripts Disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Compilar para producción
npm start        # Iniciar servidor de producción
```

## 📊 Modelo de Datos

### Autor
```
- id (UUID)
- name (String)
- email (String, único)
- bio (String, opcional)
- nationality (String, opcional)
- birthYear (Int, opcional)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### Libro
```
- id (UUID)
- title (String)
- genre (String)
- publishedYear (Int)
- pages (Int)
- authorId (UUID, FK)
- createdAt (DateTime)
- updatedAt (DateTime)
```

## ✨ Características Principales

✅ **CRUD Completo** - Crear, leer, actualizar y eliminar autores y libros
✅ **Búsqueda Avanzada** - Filtro por título, género y autor
✅ **Paginación** - 10 libros por página, navegación anterior/siguiente
✅ **Ordenamiento** - Por fecha de creación, título o año de publicación
✅ **Estadísticas** - Información detallada sobre autores (libros, géneros, páginas)
✅ **Validaciones** - Email único, campos requeridos, confirmación en eliminaciones
✅ **Interfaz Intuitiva** - Diseño limpio y fácil de usar
✅ **TypeScript** - Tipado completo para mayor seguridad

## 🔐 Notas de Seguridad

- Las credenciales de base de datos deben estar en `.env` (nunca en el código)
- El archivo `.gitignore` está configurado para no subir datos sensibles
- Validaciones en backend para todas las operaciones

## 📝 Licencia

Proyecto educativo - Lab 12 Web Avanzado
