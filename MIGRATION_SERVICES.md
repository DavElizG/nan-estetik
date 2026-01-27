# Migraciones de Base de Datos - Servicios

## Descripción

Se han agregado las entidades `Service` y `Treatment` para gestionar los servicios y tratamientos ofrecidos por Nan Estetik de manera escalable desde PostgreSQL.

## Estructura de Datos

### Service
- `id`: Identificador único
- `title`: Nombre del servicio
- `eyebrow`: Texto superior descriptivo
- `description`: Descripción del servicio
- `icon`: Nombre del ícono de Lucide React
- `isPremium`: Indica si es un servicio premium
- `order`: Orden de visualización
- `isActive`: Estado del servicio
- `treatments`: Relación con tratamientos

### Treatment
- `id`: Identificador único
- `serviceId`: ID del servicio al que pertenece
- `name`: Nombre del tratamiento
- `description`: Descripción detallada
- `icon`: Nombre del ícono de Lucide React
- `benefits`: Array de beneficios
- `duration`: Duración estimada
- `price`: Precio desde
- `order`: Orden dentro del servicio
- `isActive`: Estado del tratamiento

## Pasos para Aplicar las Migraciones

### 1. Generar el cliente de Prisma
```bash
pnpm prisma generate
```

### 2. Crear y aplicar la migración
```bash
pnpm prisma migrate dev --name add_services_and_treatments
```

### 3. Poblar la base de datos con datos iniciales
```bash
pnpm prisma db seed
```

Este comando ejecutará el archivo `prisma/seed.ts` que creará:
- 4 servicios principales
- 12 tratamientos (3 por cada servicio)

### 4. Verificar los datos
```bash
pnpm prisma studio
```

Esto abrirá una interfaz gráfica donde podrás ver los datos creados.

## API Endpoints

### GET /api/services
Obtiene todos los servicios activos con sus tratamientos.

**Respuesta:**
```json
[
  {
    "id": "clx...",
    "title": "Tratamientos Faciales",
    "eyebrow": "Experiencia Premium",
    "description": "Limpiezas profundas...",
    "icon": "Sparkles",
    "isPremium": true,
    "order": 1,
    "treatments": [
      {
        "id": "clx...",
        "name": "Limpieza profunda",
        "description": "Limpieza facial...",
        "icon": "Sparkles",
        "benefits": ["Elimina puntos negros", ...],
        "duration": "60 minutos",
        "price": "Desde $80",
        "order": 1
      }
    ]
  }
]
```

## Características del Componente

### Alternancia de Posiciones
Los servicios alternan su posición:
- **Servicio 1 (índice 0)**: Contenido a la derecha, panel se desliza desde la izquierda
- **Servicio 2 (índice 1)**: Contenido a la izquierda, panel se desliza desde la derecha
- **Servicio 3 (índice 2)**: Contenido a la derecha, panel se desliza desde la izquierda
- **Servicio 4 (índice 3)**: Contenido a la izquierda, panel se desliza desde la derecha

### Carga Dinámica
- Fetch de datos desde la API al cargar el componente
- Spinner de carga mientras se obtienen los datos
- Manejo de errores

### Escalabilidad
- Agregar nuevos servicios y tratamientos directamente en la base de datos
- No requiere cambios en el código del componente
- Los íconos se mapean dinámicamente usando el nombre del ícono

## Gestión de Datos

Para agregar nuevos servicios o tratamientos, puedes:

1. **Usar Prisma Studio:**
   ```bash
   pnpm prisma studio
   ```

2. **Crear scripts de migración adicionales**

3. **Usar el área administrativa** (cuando esté implementada)

## Notas Importantes

- Los íconos disponibles son: `Sparkles`, `Droplet`, `Zap`, `Star`, `Sun`
- El campo `order` determina el orden de visualización
- Los campos `isActive` permiten ocultar servicios/tratamientos sin eliminarlos
- Los beneficios se almacenan como array de strings
