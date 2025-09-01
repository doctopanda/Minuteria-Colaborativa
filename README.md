# Minutería Colaborativa con Transcripción

## Configuración de Supabase

Sigue estos pasos para configurar tu propia instancia de Supabase:

1. **Crear una cuenta en Supabase**:
   - Ve a [https://supabase.com](https://supabase.com) y crea una cuenta

2. **Crear un nuevo proyecto**:
   - Haz clic en "New Project"
   - Completa los detalles del proyecto (nombre, contraseña de base de datos, etc.)
   - Espera a que se complete el aprovisionamiento

3. **Obtener las credenciales**:
   - Ve a Settings → API
   - Encuentra la URL del proyecto en "Configuración"
   - Encuentra la clave anónima pública en "Claves API"

4. **Configurar la aplicación**:
   - Abre el archivo `config.js`
   - Reemplaza `https://tu-proyecto.supabase.co` con tu URL de Supabase
   - Reemplaza `tu-clave-anon-publica` con tu clave anónima pública

5. **Configurar la base de datos**:
   - Ve a SQL Editor en Supabase
   - Ejecuta los siguientes queries para crear las tablas necesarias:

```sql
-- Tabla: documents
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  content TEXT,
  owner_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: actions
CREATE TABLE actions (
  id BIGSERIAL PRIMARY KEY,
  text TEXT,
  responsible TEXT,
  deadline DATE,
  user_id UUID,
  doc_id TEXT REFERENCES documents(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: participants
CREATE TABLE participants (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT,
  position TEXT,
  user_id UUID,
  doc_id TEXT REFERENCES documents(id),
  ordering INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
