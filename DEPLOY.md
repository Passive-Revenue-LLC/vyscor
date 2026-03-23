# Despliegue de VYSCOR

## Requisitos previos

- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Vercel](https://vercel.com)
- Node.js 18+

## Pasos

### 1. Configurar Supabase

1. Crear un nuevo proyecto en Supabase
2. Copiar las credenciales desde Settings > API:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Copiar la URL de la base de datos desde Settings > Database:
   - `DATABASE_URL`

### 2. Configurar la base de datos

```bash
# Instalar dependencias
npm install

# Generar el cliente Prisma
npx prisma generate

# Crear las tablas en Supabase
npx prisma db push
```

### 3. Configurar APIs externas (opcional)

- **PandaScore**: Registrarse en [pandascore.co](https://pandascore.co) y obtener API key
- **API-Football**: Registrarse en [api-sports.io](https://api-sports.io) y obtener API key

### 4. Variables de entorno

Crear `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://...
PANDASCORE_API_KEY=tu_api_key
API_FOOTBALL_KEY=tu_api_key
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
NEXT_PUBLIC_APP_NAME=VYSCOR
```

### 5. Desplegar en Vercel

1. Crear un nuevo proyecto en Vercel
2. Conectar el repositorio de GitHub
3. Configurar las variables de entorno en Vercel Dashboard
4. El deploy se ejecuta automaticamente en cada push a `main`

### 6. Verificar

- Acceder a la URL de Vercel
- Verificar que la pagina carga correctamente
- Comprobar que los datos mock se muestran
- Cuando las API keys esten configuradas, los datos reales reemplazaran los mock
