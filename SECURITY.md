# 🔐 Guía de Seguridad - Nan Estetik

## ✅ Configuración Completada

### Base de Datos Railway PostgreSQL
- ✅ Conectada exitosamente
- ✅ Tablas migradas
- ✅ Usuario admin creado

## 🚨 SEGURIDAD CRÍTICA

### ⚠️ Archivos que NUNCA deben subirse a Git

El archivo `.gitignore` está configurado para proteger:

```
.env                      # ⛔ CREDENCIALES - Nunca subir
.env*.local               # ⛔ Variables locales
node_modules/             # ⛔ Dependencias
.next/                    # ⛔ Build files
```

### ✅ Verificación antes de cada commit

```bash
# Verifica que .env NO esté siendo trackeado
git status

# Si aparece .env, DETENTE y ejecuta:
git rm --cached .env
```

### 🔑 Credenciales

**Base de Datos (Railway PostgreSQL):**
- Host: `[TU_HOST_RAILWAY]`
- Database: `railway`
- ⚠️ **Credenciales solo en .env - NO en código**

**Usuario Admin Inicial:**
- Email: `[Ver .env → ADMIN_EMAIL]`
- Password: `[Ver .env → ADMIN_PASSWORD]`
- ⚠️ **CAMBIAR después del primer login**

### 🛡️ Mejores Prácticas Implementadas

1. **❌ Sin credenciales hardcoded**
   ```typescript
   // ❌ MALO
   const password = 'admin123';
   
   // ✅ BUENO
   const password = process.env.ADMIN_PASSWORD;
   if (!password) throw new Error('ADMIN_PASSWORD not set');
   ```

2. **✅ Validación obligatoria**
   - `seed.ts` ahora requiere variables de entorno
   - No hay valores por defecto inseguros

3. **✅ .env.example limpio**
   - Sin valores reales
   - Solo placeholders

4. **✅ Prisma Client singleton**
   - Previene múltiples conexiones
   - Logs solo en desarrollo

## 🔄 Cambiar Credenciales del Admin

### Opción 1: Usando Prisma Studio
```bash
pnpm prisma:studio
```
- Abre en navegador
- Edita tabla `users`
- Cambia email/password

### Opción 2: Script (crear después)
```bash
pnpm change-admin-password
```

## 🌐 Variables de Entorno por Ambiente

### Desarrollo Local (.env)
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXTAUTH_URL="http://localhost:3000"
```

### Producción (Vercel)
Configurar en: https://vercel.com/proyecto/settings/environment-variables

```
DATABASE_URL     → Mismo de Railway
NEXTAUTH_URL     → https://tu-dominio.com
NEXTAUTH_SECRET  → Generar nuevo: openssl rand -base64 32
```

## 🚀 Deploy Seguro

### Antes de hacer push a GitHub:

```bash
# 1. Verifica que .env NO esté incluido
git status

# 2. Verifica .gitignore
cat .gitignore | grep ".env"  # Debe aparecer .env

# 3. Busca credenciales hardcoded en el código
# No debe haber passwords, API keys en archivos .ts/.tsx

# 4. Push seguro
git add .
git commit -m "feat: initial setup"
git push origin main
```

### En Vercel (Deploy):

1. Importar repo desde GitHub
2. **Agregar variables de entorno**:
   - `DATABASE_URL` (Railway)
   - `NEXTAUTH_SECRET` (generar nuevo)
   - `NEXTAUTH_URL` (tu dominio)
3. Deploy automático

## 📋 Checklist de Seguridad

- [✅] `.env` en `.gitignore`
- [✅] Sin credenciales hardcoded en código
- [✅] Validación de variables de entorno en `seed.ts`
- [✅] `.env.example` sin valores reales
- [✅] Contraseñas hasheadas con bcrypt (12 rounds)
- [✅] Prisma logs solo en desarrollo
- [ ] Cambiar password admin después del primer login
- [ ] Generar NEXTAUTH_SECRET único
- [ ] Configurar CORS en producción
- [ ] Habilitar HTTPS en producción
- [ ] Backup regular de base de datos

## 🆘 ¿Comprometiste credenciales?

### Si subiste .env a GitHub:

1. **Inmediato:**
   ```bash
   # Remover del historial de Git
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   
   git push origin --force --all
   ```

2. **Railway:**
   - Crear nueva base de datos
   - Actualizar DATABASE_URL

3. **NextAuth:**
   - Generar nuevo NEXTAUTH_SECRET
   - Actualizar en .env

## 📚 Recursos

- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Railway Security](https://docs.railway.app/reference/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Última actualización:** 23 de enero de 2026
**Responsable:** @DavElizG
