# 🚀 Configurar DATABASE_URL en Vercel

## Por qué falta la variable

El archivo `.env` **NO se sube a GitHub** (está en `.gitignore`), por lo que Vercel no tiene acceso a la variable `DATABASE_URL` en producción.

## ✅ Solución: 4 Pasos

### Paso 1️⃣: Abre el Dashboard de Vercel
📍 https://vercel.com/dashboard

### Paso 2️⃣: Selecciona el proyecto "lab12web"
- Haz clic en el proyecto en la lista

### Paso 3️⃣: Accede a Settings → Environment Variables
```
Settings (en la barra superior)
    ↓
Environment Variables (en el menú izquierdo)
```

### Paso 4️⃣: Agrega la variable DATABASE_URL
1. Haz clic en **"Add New"** o **"Add Environment Variable"**
2. Completa los campos exactamente así:

| Campo | Valor |
|-------|-------|
| **Name** | `DATABASE_URL` |
| **Value** | `postgresql://postgres.yaykecrtdxrldqzeiwoi:74254925@aws-1-us-east-1.pooler.supabase.com:5432/postgres` |
| **Environments** | ✓ Production ✓ Preview ✓ Development |

3. Haz clic en **Save**

## 🔄 Paso Final: Redeploy

### Opción A: Desde Vercel Dashboard (Recomendado)
1. Ve a la pestaña **Deployments**
2. Encuentra el último deployment (arriba de todo)
3. Haz clic en los **3 puntos** (•••) del lado derecho
4. Selecciona **"Redeploy"**
5. Confirma que deseas redeploy

### Opción B: Desde GitHub
```bash
git add .
git commit -m "Trigger redeploy"
git push
```

## ⏳ Espera

- El redeploy tardará **1-2 minutos**
- Una vez complete (ver estado en Deployments), actualiza la página en el navegador
- El error debería desaparecer ✅

---

## 🆘 Si aún tienes problemas

1. **Verifica que la variable esté guardada:**
   - Ve a Settings → Environment Variables
   - Debería aparecer `DATABASE_URL` con valor `postgresql://...`

2. **Abre la consola del navegador (F12):**
   - Ve a la pestaña Console
   - Copia el mensaje de error completo

3. **Comparte el error exacto** para debuggear

---

## ✨ Cuando funcione

Una vez esté todo bien, podrás:
- ✅ Ver la lista de autores
- ✅ Ver la lista de libros  
- ✅ Crear, editar y eliminar autores
- ✅ Crear, editar y eliminar libros
- ✅ Buscar libros con filtros
- ✅ Ver estadísticas de autores
