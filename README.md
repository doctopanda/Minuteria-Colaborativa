# Minutería Colaborativa con Transcripción

Una aplicación web para crear minutas colaborativas en tiempo real con transcripción de voz.

## Características

- Edición colaborativa en tiempo real
- Seguimiento de cursores de otros usuarios
- Transcripción de voz a texto
- Gestión de acciones pendientes
- Generación de códigos QR para invitar participantes
- Grabación de audio

## Tecnologías Utilizadas

- React 18
- Supabase (Backend as a Service)
- Tailwind CSS (Estilos)
- Web Speech API (Transcripción de voz)
- QR Code Styling (Generación de códigos QR)

## Configuración para Despliegue en Netlify

1. Clona o descarga este repositorio
2. Conecta tu repositorio a Netlify
3. Asegúrate de que el directorio de publicación sea el raíz (`.`)
4. No se necesitan comandos de build ya que es una aplicación cliente

## Configuración de Supabase

La aplicación requiere una instancia de Supabase configurada:

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Configura las siguientes tablas:

### Tabla: documents
