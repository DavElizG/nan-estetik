# 🌸 Nan Estetik - Guía de Configuración

## 📋 Estructura del Proyecto

```
nan-estetik/
├── app/                          # Next.js 15 App Router
│   ├── (public)/                # Rutas públicas (landing page)
│   ├── admin/                   # Área administrativa (protegida)
│   ├── api/                     # API Routes
│   ├── globals.css              # Estilos globales + Lenis config
│   ├── layout.tsx               # Layout raíz
│   ├── page.tsx                 # Página principal
│   └── providers.tsx            # React Context Providers
│
├── components/                   # Componentes React
│   ├── layout/                  # Componentes de layout
│   │   ├── navbar.tsx           # Barra de navegación
│   │   └── footer.tsx           # Pie de página
│   ├── sections/                # Secciones de la landing page
│   │   ├── hero.tsx             # Sección hero con animaciones GSAP
│   │   ├── about.tsx            # Sección nosotros
│   │   ├── services.tsx         # Sección servicios
│   │   ├── gallery.tsx          # Galería de trabajos
│   │   └── contact.tsx          # Formulario de contacto
│   ├── providers/               # Context Providers
│   │   └── smooth-scroll-provider.tsx  # Lenis smooth scroll
│   └── ui/                      # Componentes UI reutilizables
│
├── lib/                          # Librerías y utilidades
│   ├── prisma.ts                # Prisma Client (Singleton pattern)
│   └── utils.ts                 # Funciones helper
│
├── types/                        # Tipos TypeScript
│   └── index.ts                 # Tipos globales
│
├── config/                       # Configuración
│   └── constants.ts             # Constantes de la aplicación
│
├── prisma/                       # Prisma ORM
│   ├── schema.prisma            # Esquema de base de datos
│   └── seed.ts                  # Datos iniciales
│
├── public/                       # Archivos estáticos
│   └── images/                  # Imágenes
│
├── .env                         # Variables de entorno (no subir a Git)
├── .env.example                 # Ejemplo de variables de entorno
├── .gitignore                   # Archivos ignorados por Git
├── next.config.js               # Configuración de Next.js
├── tailwind.config.js           # Configuración de Tailwind CSS
├── tsconfig.json                # Configuración de TypeScript
└── package.json                 # Dependencias del proyecto
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/DavElizG/nan-estetik.git
cd nan-estetik
```

### 2. Instalar dependencias
```bash
pnpm install
```

### 3. Configurar variables de entorno
Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

Edita `.env` con tus valores:
- `DATABASE_URL`: URL de conexión a PostgreSQL
- `NEXTAUTH_SECRET`: Genera uno con `openssl rand -base64 32`
- `ADMIN_EMAIL` y `ADMIN_PASSWORD`: Credenciales del administrador

### 4. Configurar base de datos
```bash
# Generar cliente de Prisma
pnpm prisma:generate

# Crear tablas en la base de datos
pnpm prisma:push

# Insertar datos iniciales (usuario admin)
pnpm prisma:seed
```

### 5. Ejecutar en desarrollo
```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🎨 Tecnologías y Patrones

### Frontend
- **Next.js 15**: Framework React con App Router
- **TypeScript**: Tipado estático para mayor seguridad
- **Tailwind CSS**: Estilos utilitarios
- **Lenis**: Smooth scroll característico
- **GSAP + ScrollTrigger**: Animaciones avanzadas
- **Framer Motion**: Animaciones de componentes

### Backend
- **Next.js API Routes**: Endpoints API
- **Prisma ORM**: ORM moderno para PostgreSQL
- **NextAuth.js**: Autenticación segura
- **bcryptjs**: Hashing de contraseñas

### Patrones de Diseño Implementados

1. **Singleton Pattern** (`lib/prisma.ts`)
   - Una única instancia de Prisma Client
   - Evita conexiones múltiples en desarrollo

2. **Provider Pattern** (`app/providers.tsx`)
   - Centraliza Context Providers
   - Fácil agregar nuevos providers

3. **Composition Pattern** (Componentes)
   - Componentes pequeños y reutilizables
   - Separación de concerns

4. **Repository Pattern** (Preparado para)
   - Abstracción de acceso a datos
   - Fácil testing y mantenimiento

## 🎭 Características Principales

### Página Informativa (Landing Page)
- ✅ Smooth scrolling con Lenis
- ✅ Animaciones fluidas con GSAP
- ✅ Sección Hero con CTA
- ✅ Servicios destacados
- ✅ Galería de trabajos
- ✅ Formulario de contacto
- ✅ Integración WhatsApp
- ✅ Responsive design

### Área Administrativa (TODO)
- 🔲 Login seguro con NextAuth
- 🔲 Dashboard con métricas
- 🔲 Gestión de pacientes (CRUD)
- 🔲 Bitácoras de tratamientos
- 🔲 Historial de consultas
- 🔲 Carga de fotos antes/después
- 🔲 Búsqueda y filtros avanzados
- 🔲 Exportación de datos

## 📝 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Servidor de desarrollo

# Producción
pnpm build            # Build optimizado
pnpm start            # Servidor de producción

# Base de datos
pnpm prisma:generate  # Generar cliente Prisma
pnpm prisma:push      # Aplicar cambios a la BD
pnpm prisma:studio    # UI visual de la BD
pnpm prisma:seed      # Insertar datos iniciales

# Calidad de código
pnpm lint             # Verificar errores ESLint
```

## 🎨 Smooth Scrolling con Lenis

El proyecto usa **Lenis** para lograr ese efecto de scroll suave característico:

### Configuración
- **Duración**: 1.2s para suavidad óptima
- **Easing**: Función personalizada para efecto natural
- **Integración con GSAP**: Sincronización perfecta con ScrollTrigger

### Uso en componentes
```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Las animaciones se sincronizan automáticamente con Lenis
gsap.from(element, {
  scrollTrigger: {
    trigger: element,
    start: 'top 80%',
    // ...
  },
  // animaciones
});
```

## 🗄️ Base de Datos

### Modelos Principales

1. **User**: Administradores del sistema
2. **Patient**: Información de pacientes
3. **PatientRecord**: Bitácoras de tratamientos

### Relaciones
- Un Usuario puede crear múltiples Bitácoras
- Un Paciente puede tener múltiples Bitácoras
- Cada Bitácora pertenece a un Paciente y fue creada por un Usuario

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Variables de entorno para secretos
- ✅ Headers de seguridad configurados
- ✅ Validación de datos con Zod (preparado)
- ✅ Autenticación con NextAuth (preparado)

## 📱 Responsive Design

- Mobile First approach
- Breakpoints de Tailwind CSS
- Componentes adaptables
- Touch optimizado para móviles

## 🎯 Próximos Pasos

1. Implementar área administrativa completa
2. Agregar autenticación con NextAuth
3. Crear CRUD de pacientes
4. Implementar sistema de bitácoras
5. Agregar carga de imágenes (Cloudinary/S3)
6. Implementar búsqueda y filtros
7. Agregar dashboard con analytics
8. Implementar sistema de notificaciones
9. Testing con Jest y React Testing Library
10. Deploy en Vercel

## 🤝 Contribuir

Este es un proyecto privado. Para colaborar, contacta al propietario.

## 📄 Licencia

Private - © 2026 Nan Estetik

## 👨‍💻 Desarrollador

**David Elizalde**
- GitHub: [@DavElizG](https://github.com/DavElizG)

---

**Nota**: Este README se actualizará conforme se agreguen nuevas características al proyecto.
