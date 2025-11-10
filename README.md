# PascacioFrontend

Frontend del proyecto Pascacio desarrollado con React, Vite y Three.js.

## 🚀 Inicio Rápido

### Desarrollo Local

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Crea un archivo `.env` en la raíz del proyecto:
   ```env
   VITE_BACKEND_URL_DEVELOPMENT=http://localhost:3000
   VITE_API_URL_PRODUCTION_1=https://pascasioapi.onrender.com
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 📦 Build para Producción

```bash
npm run build
```

## 🌐 Despliegue en Vercel

Consulta el archivo [DEPLOY.md](./DEPLOY.md) para instrucciones detalladas de despliegue.

### Configuración Rápida en Vercel

1. Conecta tu repositorio a Vercel
2. Agrega las siguientes variables de entorno en **Settings** → **Environment Variables**:
   - `VITE_BACKEND_URL_DEVELOPMENT` = `http://localhost:3000`
   - `VITE_API_URL_PRODUCTION_1` = `https://pascasioapi.onrender.com`
3. Despliega

## 🔗 Backend

El backend está desplegado en: **https://pascasioapi.onrender.com**

## 📝 Tecnologías

- React 18
- Vite
- Three.js / React Three Fiber
- Tailwind CSS
- Axios
- React Router

