# 📋 Guía: Configurar Variables de Entorno en Vercel

## Paso 1: Accede a Vercel Dashboard
1. Ve a: https://vercel.com/dashboard
2. Inicia sesión con tu cuenta de GitHub

## Paso 2: Selecciona el proyecto
1. Busca y haz clic en el proyecto **lab12web**

## Paso 3: Ve a Settings
1. En la navegación superior, haz clic en **Settings**

## Paso 4: Environment Variables
1. En el menú lateral izquierdo, haz clic en **Environment Variables**

## Paso 5: Agrega la variable DATABASE_URL
1. Haz clic en el botón **Add New**
2. Completa los campos:
   - **Name:** `DATABASE_URL`
   - **Value:** `postgresql://postgres.yaykecrtdxrldqzeiwoi:74254925@aws-1-us-east-1.pooler.supabase.com:5432/postgres`
   - **Environments:** Selecciona:
     ✓ Production
     ✓ Preview  
     ✓ Development

3. Haz clic en **Save**

## Paso 6: Redeploy
1. Ve a la pestaña **Deployments**
2. Busca el último deployment (más reciente)
3. Haz clic en el menú de 3 puntos (•••)
4. Selecciona **Redeploy**
5. Confirma el redeploy

## ⏳ Espera
- El redeploy tardará 1-2 minutos
- Una vez complete, actualiza la página en el navegador
- El error debería desaparecer ✓

---

**Si aún tienes problemas:**
1. Abre la consola del navegador (F12)
2. Copia el error completo
3. Comparte el error exacto
