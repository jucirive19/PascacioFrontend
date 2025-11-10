# Guía de Despliegue en Vercel

Esta guía te ayudará a configurar y desplegar el proyecto PascacioFrontend en Vercel.

## 📋 Requisitos Previos

1. Una cuenta en [Vercel](https://vercel.com)
2. El proyecto conectado a un repositorio Git (GitHub, GitLab, o Bitbucket)
3. La URL de tu backend en producción

## 🔧 Configuración de Variables de Entorno

### Variables Necesarias

El proyecto requiere las siguientes variables de entorno:

- `VITE_BACKEND_URL_DEVELOPMENT`: URL del backend en desarrollo (local)
- `VITE_API_URL_PRODUCTION_1`: URL del backend en producción

### Configurar Variables en Vercel

1. Ve a tu proyecto en el dashboard de Vercel
2. Navega a **Settings** → **Environment Variables**
3. Agrega las siguientes variables:

   ```
   VITE_BACKEND_URL_DEVELOPMENT=http://localhost:3000
   VITE_API_URL_PRODUCTION_1=https://pascasioapi.onrender.com
   ```

   ⚠️ **NOTA**: Tu backend está en Render: `https://pascasioapi.onrender.com`

4. Selecciona los entornos donde aplicarán (Production, Preview, Development)
5. Haz clic en **Save**

### Configuración Local

Para desarrollo local, crea un archivo `.env` en la raíz del proyecto:

```env
VITE_BACKEND_URL_DEVELOPMENT=http://localhost:3000
VITE_API_URL_PRODUCTION_1=https://pascasioapi.onrender.com
```

⚠️ **Nota**: El archivo `.env` está en `.gitignore` y no se subirá al repositorio.

## 🚀 Despliegue

### Opción 1: Despliegue Automático (Recomendado)

1. Conecta tu repositorio Git a Vercel
2. Vercel detectará automáticamente que es un proyecto Vite
3. Configura las variables de entorno como se explicó arriba
4. Haz clic en **Deploy**

### Opción 2: Despliegue Manual con Vercel CLI

1. Instala Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Inicia sesión:
   ```bash
   vercel login
   ```

3. Despliega:
   ```bash
   vercel
   ```

4. Para producción:
   ```bash
   vercel --prod
   ```

## ✅ Verificación Post-Despliegue

Después del despliegue, verifica que:

1. ✅ El sitio carga correctamente
2. ✅ Las llamadas a la API funcionan (revisa la consola del navegador)
3. ✅ No hay errores de CORS
4. ✅ Las variables de entorno están configuradas correctamente

## 🔍 Solución de Problemas

### Error: Variables de entorno no encontradas

- Verifica que las variables estén configuradas en Vercel
- Asegúrate de que los nombres de las variables comiencen con `VITE_`
- Reinicia el despliegue después de agregar variables

### Error de CORS

- Verifica que la URL del backend en `VITE_API_URL_PRODUCTION_1` sea correcta (debe ser: `https://pascasioapi.onrender.com`)
- Asegúrate de que el backend en Render tenga configurado CORS para permitir tu dominio de Vercel
- Si tienes problemas de CORS, verifica la configuración en tu backend de Render

### El sitio no carga

- Verifica que el build se complete sin errores
- Revisa los logs de despliegue en Vercel
- Asegúrate de que `vercel.json` esté configurado correctamente

## 📝 Notas Importantes

- Las variables de entorno que comienzan con `VITE_` son expuestas al cliente
- No incluyas información sensible en variables `VITE_*`
- El archivo `vercel.json` ya está configurado para SPA (Single Page Application)
- Los assets estáticos (modelos 3D, audios) tienen caché configurado para mejor rendimiento

