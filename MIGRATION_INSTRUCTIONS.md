# Script de Migración - Servicios y Tratamientos

⚠️ **IMPORTANTE**: Antes de ejecutar estos comandos, asegúrate de:
1. Detener el servidor de desarrollo (`pnpm dev`)
2. Cerrar VS Code o cualquier proceso que esté usando la base de datos
3. Cerrar Prisma Studio si está abierto

## Comandos de Migración

Ejecuta estos comandos en orden:

### 1. Generar cliente de Prisma
```bash
pnpm prisma generate
```

### 2. Crear y aplicar migración
```bash
pnpm prisma migrate dev --name add_services_and_treatments
```

### 3. Ejecutar seed (poblar datos iniciales)
```bash
pnpm prisma db seed
```

## Si encuentras errores de permisos (EPERM)

1. **Cerrar todos los procesos de Node.js:**
   - Presiona `Ctrl + C` en todas las terminales
   - Cierra VS Code
   - Abre el Administrador de Tareas y finaliza cualquier proceso de Node.js

2. **Reabrir VS Code y ejecutar:**
   ```bash
   pnpm prisma generate
   pnpm prisma migrate dev --name add_services_and_treatments
   pnpm prisma db seed
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   pnpm dev
   ```

## Verificar que todo funciona

1. Abrir el navegador en `http://localhost:3000`
2. Navegar a la sección de Servicios
3. Verificar que se carguen los 4 servicios desde la base de datos
4. Hacer clic en los tratamientos para ver el panel de detalles
5. Observar que los servicios alternan su posición (izquierda/derecha)

## Estructura de archivos modificados

- ✅ `prisma/schema.prisma` - Nuevos modelos Service y Treatment
- ✅ `prisma/seed.ts` - Datos iniciales de servicios
- ✅ `app/api/services/route.ts` - Endpoint API
- ✅ `types/service.ts` - TypeScript types
- ✅ `components/sections/services.tsx` - Componente actualizado

## Próximos pasos

Una vez ejecutadas las migraciones exitosamente:
1. El componente Services consumirá datos desde PostgreSQL
2. Los servicios alternarán su posición (derecha/izquierda)
3. Podrás agregar/editar servicios directamente en la base de datos
4. El sistema es completamente escalable
