# 📋 Instrucciones de Desarrollo - Nan Estetik

## 🎯 Filosofía del Proyecto

Este documento establece las reglas y mejores prácticas para mantener el código limpio, escalable y fácil de mantener.

---

## 📝 Reglas de Código

### 1. **Comentarios y Documentación**

#### ✅ SIEMPRE comentar:

```typescript
/**
 * Descripción breve de la función
 * 
 * @param param1 - Descripción del parámetro
 * @param param2 - Descripción del parámetro
 * @returns Descripción de lo que retorna
 * 
 * @example
 * const result = myFunction('value');
 */
export function myFunction(param1: string, param2: number): string {
  // Paso 1: Validar entrada
  if (!param1) throw new Error('param1 is required');
  
  // Paso 2: Procesar datos
  const processed = param1.toLowerCase();
  
  // Paso 3: Retornar resultado
  return `${processed}-${param2}`;
}
```

#### 📋 Tipos de comentarios requeridos:

- **JSDoc** para funciones, clases y tipos exportados
- **Comentarios inline** para lógica compleja
- **TODO** para trabajo pendiente: `// TODO: Implementar validación`
- **FIXME** para bugs conocidos: `// FIXME: Bug con fechas negativas`
- **NOTE** para explicaciones importantes: `// NOTE: Este hook debe ejecutarse antes que...`

---

### 2. **Archivos Pequeños y Modulares**

#### ✅ Regla de Oro: **Un archivo = Una responsabilidad**

**MALO ❌:**
```typescript
// components/Dashboard.tsx (500 líneas)
export function Dashboard() {
  // 500 líneas de código mezclando:
  // - UI components
  // - Lógica de negocio
  // - Fetching de datos
  // - Estados complejos
}
```

**BUENO ✅:**
```typescript
// components/dashboard/Dashboard.tsx (50 líneas)
import { DashboardHeader } from './DashboardHeader';
import { DashboardStats } from './DashboardStats';
import { DashboardCharts } from './DashboardCharts';
import { useDashboardData } from '@/hooks/useDashboardData';

export function Dashboard() {
  const { stats, charts, loading } = useDashboardData();
  
  if (loading) return <DashboardSkeleton />;
  
  return (
    <div>
      <DashboardHeader />
      <DashboardStats stats={stats} />
      <DashboardCharts charts={charts} />
    </div>
  );
}

// hooks/useDashboardData.ts (30 líneas)
// components/dashboard/DashboardHeader.tsx (20 líneas)
// components/dashboard/DashboardStats.tsx (40 líneas)
// components/dashboard/DashboardCharts.tsx (60 líneas)
```

#### 📏 Límites recomendados:

- **Componentes:** Máximo 150 líneas
- **Hooks:** Máximo 100 líneas
- **Utilidades:** Máximo 200 líneas
- **API Routes:** Máximo 100 líneas por endpoint

Si excedes estos límites, **refactoriza en archivos más pequeños**.

---

### 3. **NO Crear READMEs Innecesarios**

#### ❌ NO HACER:

```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   └── README.md          ❌ Innecesario
├── Card/
│   ├── Card.tsx
│   └── README.md          ❌ Innecesario
```

#### ✅ HACER:

```typescript
/**
 * Button Component
 * 
 * Componente de botón reutilizable con variantes y tamaños.
 * 
 * @example
 * <Button variant="primary" size="lg">Click me</Button>
 */
export function Button({ variant, size, children }: ButtonProps) {
  // ...
}
```

#### 📌 Regla:
- **Documentación = Comentarios JSDoc en el código**
- **READMEs solo para:** Carpetas principales (app/, components/, lib/)
- **Un README general:** README.md en la raíz

---

### 4. **Estructura de Archivos**

#### ✅ Organización por Feature:

```
components/
├── layout/              # Componentes de layout
│   ├── Navbar.tsx
│   └── Footer.tsx
├── sections/            # Secciones de página
│   ├── Hero.tsx
│   └── Services.tsx
├── ui/                  # Componentes UI reutilizables
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
└── providers/           # React Context Providers
    └── smooth-scroll-provider.tsx
```

#### ✅ Separar lógica de UI:

```
app/admin/patients/
├── page.tsx                    # UI del componente
├── actions.ts                  # Server Actions
└── hooks/
    └── usePatientFilters.ts    # Lógica de filtros
```

---

## 🏗️ Patrones de Diseño

### 1. **Composition over Inheritance**

```typescript
// ✅ BUENO: Composición
export function PatientCard({ patient }: Props) {
  return (
    <Card>
      <CardHeader>
        <PatientAvatar patient={patient} />
        <PatientName patient={patient} />
      </CardHeader>
      <CardBody>
        <PatientInfo patient={patient} />
      </CardBody>
    </Card>
  );
}
```

### 2. **Custom Hooks para Lógica Reutilizable**

```typescript
// hooks/usePatientForm.ts
export function usePatientForm() {
  const [data, setData] = useState<PatientFormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const validate = () => { /* ... */ };
  const handleSubmit = async () => { /* ... */ };
  
  return { data, errors, validate, handleSubmit };
}

// components/PatientForm.tsx
export function PatientForm() {
  const { data, errors, handleSubmit } = usePatientForm();
  // UI simple, lógica en el hook
}
```

### 3. **Principio de Responsabilidad Única (SRP)**

Cada función debe hacer **UNA SOLA COSA**:

```typescript
// ❌ MALO: Hace demasiado
function processPatientData(patient: Patient) {
  const validated = validatePatient(patient);
  const formatted = formatPatient(validated);
  const saved = saveToDatabase(formatted);
  sendNotification(saved);
  return saved;
}

// ✅ BUENO: Separar responsabilidades
function validatePatient(patient: Patient): ValidatedPatient { /* ... */ }
function formatPatient(patient: ValidatedPatient): FormattedPatient { /* ... */ }
function savePatient(patient: FormattedPatient): SavedPatient { /* ... */ }
function notifyPatientCreated(patient: SavedPatient): void { /* ... */ }
```

---

## 🔧 Herramientas y Comandos

### Package Manager: **pnpm** (más rápido y seguro)

```bash
# Instalar dependencias
pnpm install

# Agregar dependencia
pnpm add <package>

# Remover dependencia
pnpm remove <package>

# Actualizar dependencias
pnpm update
```

### Scripts Disponibles:

```bash
# Desarrollo
pnpm dev              # Servidor de desarrollo

# Verificación (USAR ANTES DE COMMIT)
pnpm type-check       # Verificar tipos TypeScript
pnpm lint             # Verificar estilo de código
pnpm build            # Compilar para producción
pnpm verify           # Ejecutar type-check + lint + build

# Producción
pnpm start            # Servidor de producción

# Base de datos
pnpm prisma:generate  # Generar cliente Prisma
pnpm prisma:push      # Aplicar schema a BD
pnpm prisma:studio    # UI de base de datos
pnpm prisma:seed      # Insertar datos iniciales
```

---

## 📦 Dependencias

### ✅ Antes de agregar una librería:

1. **¿Es realmente necesaria?** - ¿Puedo hacerlo con código propio?
2. **¿Está mantenida?** - Última actualización < 6 meses
3. **¿Es popular?** - +1000 descargas semanales en npm
4. **¿Tiene tipos?** - TypeScript support

### ⚠️ Evitar:

- Librerías muy grandes para features simples
- Dependencias sin mantenimiento
- Múltiples librerías para lo mismo (elige una)

---

## 🧪 Testing (Futuro)

### Estructura de tests:

```typescript
// components/Button.test.tsx
describe('Button Component', () => {
  it('should render with correct text', () => {
    // Test
  });
  
  it('should handle click events', () => {
    // Test
  });
});
```

---

## 🚀 Git y Commits

### Formato de commits:

```bash
# ANTES DE HACER COMMIT - VERIFICAR TODO
pnpm verify  # Ejecuta type-check + lint + build

# Si todo pasa, hacer commit con formato:

# Feature nueva
git commit -m "feat: add patient search functionality"

# Bug fix
git commit -m "fix: resolve date formatting issue"

# Refactor
git commit -m "refactor: split PatientForm into smaller components"

# Docs
git commit -m "docs: update API documentation"

# Styles
git commit -m "style: improve button hover states"
```

### Prefijos:
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `refactor:` - Refactorización de código
- `docs:` - Documentación
- `style:` - Estilos visuales
- `perf:` - Mejoras de performance
- `test:` - Tests
- `chore:` - Tareas de mantenimiento

---

## 🎨 Código Limpio

### ✅ Principios:

1. **Nombres descriptivos:**
   ```typescript
   // ❌ MALO
   const d = new Date();
   const p = patients.filter(x => x.a);
   
   // ✅ BUENO
   const currentDate = new Date();
   const activePatients = patients.filter(patient => patient.isActive);
   ```

2. **Funciones pequeñas:**
   ```typescript
   // Una función debe caber en tu pantalla sin scroll
   // Si es más grande, divídela
   ```

3. **DRY (Don't Repeat Yourself):**
   ```typescript
   // Si copias código 2+ veces, créa una función/componente
   ```

4. **Early returns:**
   ```typescript
   // ✅ BUENO: Salir temprano
   function processPatient(patient?: Patient) {
     if (!patient) return null;
     if (!patient.isActive) return null;
     
     return <PatientCard patient={patient} />;
   }
   ```

---

## 📚 Referencias

- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [TypeScript Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

## 🔄 Flujo de Trabajo Obligatorio

### ⚠️ ANTES DE CADA COMMIT:

```bash
# 1. Verificar tipos TypeScript
pnpm type-check

# 2. Verificar linting
pnpm lint

# 3. Verificar que el build funciona (OBLIGATORIO)
pnpm build

# 4. O ejecutar todo de una vez
pnpm verify

# 5. Solo si TODO pasa, hacer commit
git add .
git commit -m "feat: descripción clara"
git push
```

### 🚨 Regla de Oro

**❌ NUNCA hacer commit si `pnpm build` falla**

Si el build falla:
1. Leer el error cuidadosamente
2. Arreglar el problema
3. Volver a ejecutar `pnpm build`
4. Repetir hasta que pase

### 🔄 Ciclo de Desarrollo Completo

```
1. Escribir código
   ↓
2. Agregar comentarios JSDoc
   ↓
3. pnpm type-check (verificar tipos)
   ↓
4. pnpm lint (verificar estilo)
   ↓
5. pnpm build (compilar)
   ↓
6. Probar en navegador (pnpm dev)
   ↓
7. Si TODO pasa → Commit
   ↓
8. Si algo falla → Volver al paso 1
```

## 🎯 Checklist antes de PR/Commit

- [ ] Código comentado con JSDoc
- [ ] Sin archivos >200 líneas (refactorizar si es necesario)
- [ ] Sin READMEs innecesarios
- [ ] Nombres descriptivos
- [ ] Sin código duplicado
- [ ] **`pnpm build` exitoso** ✅
- [ ] **`pnpm lint` sin errores** ✅
- [ ] **`pnpm type-check` sin errores** ✅
- [ ] Sin console.logs olvidados
- [ ] Variables de entorno en .env (no hardcoded)
- [ ] Probado manualmente en navegador

---

**Recuerda: Código limpio = Código feliz 😊**

*Última actualización: 23 de enero de 2026*
