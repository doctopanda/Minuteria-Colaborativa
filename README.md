Minutería Colaborativa con Supabase y React
Esta es una aplicación de toma de minutas en tiempo real construida con React (sin un framework como Create React App) y Supabase como backend.

Características
Edición en Tiempo Real: Los cambios en la minuta se reflejan instantáneamente para todos los participantes.

Roles de Usuario: Un "responsable" puede editar, mientras que los "participantes" solo pueden ver.

Salas Únicas: Cada minuta se crea en una sala separada con un enlace único.

Invitaciones por QR: El responsable puede generar un código QR para que otros se unan.

Grabación de Audio: El responsable puede grabar el audio de la reunión.

Acciones Pendientes: Sistema para asignar y visualizar tareas.

Cursores en Vivo: Ve la posición del cursor de otros participantes en tiempo real.

Configuración y Despliegue
Sigue estos pasos para desplegar tu propia versión de la aplicación en Netlify.

1. Configurar Supabase
Necesitas una base de datos de Supabase para almacenar los datos.

Crea un Proyecto: Ve a Supabase.com y crea un nuevo proyecto.

Credenciales ya configuradas: Las credenciales de Supabase (URL y anon key) ya han sido añadidas al archivo app.js.

Ejecuta el Script SQL:

En tu proyecto, ve al SQL Editor.

Crea una nueva consulta y pega el contenido del script SQL que te proporcioné para crear las tablas documents y actions con sus políticas de seguridad (RLS).

Ejecuta el script.

Habilita la Autenticación Anónima:

Ve a Authentication > Providers.

Busca Anonymous en la lista y habilítalo.

2. Desplegar en Netlify
La forma más fácil de desplegar es a través de GitHub.

Crea un Repositorio en GitHub: Sube los archivos (index.html, style.css, app.js, netlify.toml, README.md) a un nuevo repositorio en tu cuenta de GitHub.

Conecta a Netlify:

Inicia sesión en Netlify.

Haz clic en "Add new site" > "Import an existing project".

Elige GitHub y autoriza a Netlify para que acceda a tus repositorios.

Selecciona el repositorio que acabas de crear.

Configura el Despliegue:

Netlify detectará automáticamente el archivo netlify.toml. Las configuraciones de compilación deberían ser correctas por defecto.

Haz clic en "Deploy site".

¡Y eso es todo! Netlify construirá y desplegará tu sitio. Una vez que esté en vivo, obtendrás una URL pública que podrás usar para probar la funcionalidad del código QR con cualquier dispositivo.
