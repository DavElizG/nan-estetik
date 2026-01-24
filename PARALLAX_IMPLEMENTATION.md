# Efectos Parallax Implementados - Nan Estetik

## 🎨 Resumen de Implementación

Se han implementado efectos parallax avanzados en toda la página web de Nan Estetik usando **GSAP**, **ScrollTrigger** y **Lenis** para smooth scrolling.

## ✨ Efectos Implementados

### 1. **Hero Section - Parallax Multi-capa**
- **Background**: Se mueve más lento que el contenido (30% más lento)
- **Overlay**: Aumenta opacidad gradualmente al hacer scroll
- **Contenido**: Se desvanece y mueve más rápido que el fondo (50% más rápido)
- **Efecto**: Sensación de profundidad 3D

### 2. **About Section - Parallax Vertical con Elementos Decorativos**
- **Elemento decorativo circular**: Se mueve con velocidad diferente (-30%) creando profundidad
- **Contenido principal**: Animación de entrada suave desde abajo
- **Estadísticas**: Aparecen con efecto cascada (stagger)

### 3. **Services Section - Parallax Horizontal (Scroll Infinito)**
- **Cards horizontales**: Se desplazan horizontalmente con el scroll vertical
- **Pin effect**: La sección se fija mientras los cards se desplazan
- **Snap**: Se ajusta automáticamente a cada card
- **Entrada**: Cada card aparece con escala y fade-in

### 4. **Gallery Section - Parallax de Profundidad**
- **Items individuales**: Cada imagen se mueve a velocidad diferente
- **Efecto de profundidad**: Velocidades alternadas crean sensación 3D
- **Animación de entrada**: Escala con efecto bounce

### 5. **Testimonials Section - Parallax Diferencial**
- **Cards alternados**: Se mueven en direcciones opuestas
- **Elementos decorativos**: Parallax independiente con blur
- **Efecto flotante**: Los testimonios parecen flotar

### 6. **Contact Section - Parallax Suave**
- **Formulario**: Entrada desde la izquierda
- **Info de contacto**: Entrada desde la derecha con stagger
- **Elemento decorativo**: Parallax suave de fondo

## 🛠️ Archivos Creados/Modificados

### Nuevos Archivos:
1. **`components/providers/lenis-provider.tsx`**
   - Provider para Lenis smooth scrolling
   - Integración con GSAP ScrollTrigger
   - Configuración optimizada (duration: 1.2s)

2. **`hooks/use-parallax.tsx`**
   - Hook personalizado para efectos parallax
   - Soporta parallax vertical y horizontal
   - Opciones configurables (velocidad, dirección, escala, rotación)

3. **`components/sections/testimonials.tsx`**
   - Nueva sección de testimonios
   - Parallax diferencial en cards
   - Elementos decorativos con blur

### Archivos Modificados:
1. **`app/providers.tsx`** - Integración de LenisProvider
2. **`app/page.tsx`** - Agregada sección Testimonials
3. **`app/globals.css`** - Utilidades para optimización de parallax
4. **`components/sections/hero.tsx`** - Parallax multi-capa
5. **`components/sections/about.tsx`** - Parallax con elementos decorativos
6. **`components/sections/services.tsx`** - Scroll horizontal con pin
7. **`components/sections/gallery.tsx`** - Parallax de profundidad
8. **`components/sections/contact.tsx`** - Parallax suave en formulario

## 🎯 Características Principales

### Smooth Scrolling con Lenis
```javascript
const lenis = new Lenis({
  duration: 1.2,              // Duración suave
  easing: (t) => ...,         // Easing personalizado
  smoothWheel: true,          // Scroll suave con rueda
  smoothTouch: false,         // Desactivado en móvil
});
```

### Parallax Horizontal (Services)
```javascript
gsap.to(cards, {
  xPercent: -100 * (cards.length - 1),  // Movimiento horizontal
  ease: 'none',
  scrollTrigger: {
    trigger: container,
    pin: true,                           // Fija la sección
    scrub: 1,                           // Sincronizado con scroll
    snap: 1 / (cards.length - 1),      // Snap a cada card
  },
});
```

### Parallax Vertical Multi-velocidad
```javascript
gsap.to(element, {
  yPercent: speed * 100,
  ease: 'none',
  scrollTrigger: {
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,                        // Suave y sincronizado
  },
});
```

## 📊 Optimización de Rendimiento

### CSS Optimizations
```css
.parallax-item {
  will-change: transform;              /* Pre-optimización GPU */
  transform: translateZ(0);            /* Fuerza aceleración 3D */
  backface-visibility: hidden;         /* Mejora rendering */
}
```

### GSAP Configuration
- **invalidateOnRefresh**: true - Recalcula en resize
- **anticipatePin**: 1 - Mejora pin anticipado
- **scrub**: true/1 - Sincronización suave

## 🎨 Efectos Visuales Adicionales

### Elementos Decorativos
- Círculos con blur para profundidad
- Gradientes con transparencia
- Movimiento parallax independiente

### Animaciones de Entrada
- Fade-in con translateY
- Scale con bounce
- Stagger para secuencias

### Interactividad
- Hover effects en cards
- Transiciones suaves
- Estados activos

## 🚀 Cómo Usar

### Desarrollo
```bash
pnpm dev
```

### Producción
```bash
pnpm build
pnpm start
```

## 🔧 Configuración Personalizable

### useParallax Hook
```typescript
useParallax(ref, {
  speed: 1,                    // Velocidad del parallax
  direction: 'vertical',       // 'vertical' | 'horizontal'
  start: 'top bottom',         // Inicio del trigger
  end: 'bottom top',           // Fin del trigger
  scrub: true,                 // Smooth scroll
  scale: false,                // Agregar escala
  rotate: false,               // Agregar rotación
});
```

### useParallaxScroll Hook
```typescript
useParallaxScroll(triggerRef, targetRef, {
  speed: 0.5,                  // Velocidad relativa
  direction: 'vertical',
  start: 'top bottom',
  end: 'bottom top',
  scrub: true,
});
```

## 📱 Responsive

- **Mobile**: Parallax reducido para mejor rendimiento
- **Tablet**: Efectos optimizados
- **Desktop**: Efectos completos

## 🎓 Referencias

### Ejemplos Utilizados
1. **webdevpie/Smooth-Scrolling-For-Your-Website**
   - Lenis + GSAP integration
   - ScrollTrigger configuration

2. **web-unlocked/13.parallax-locomotive**
   - Parallax patterns
   - Pin effects

### Librerías
- **GSAP 3.12.5**: Animaciones
- **ScrollTrigger**: Animaciones con scroll
- **Lenis 1.1.18**: Smooth scrolling

## 💡 Tips de Uso

1. **Ajustar velocidades**: Cambiar `speed` en useParallax
2. **Modificar triggers**: Ajustar `start` y `end`
3. **Agregar efectos**: Usar `scale` y `rotate`
4. **Elementos decorativos**: Agregar círculos con blur
5. **Optimización**: Usar `will-change` con precaución

## 🐛 Solución de Problemas

### Parallax no funciona
- Verificar que GSAP y ScrollTrigger estén registrados
- Confirmar que Lenis está inicializado
- Revisar que los refs estén correctamente asignados

### Rendimiento lento
- Reducir número de elementos con parallax
- Usar `will-change` solo en elementos activos
- Considerar reducir `scrub` para menos cálculos

### Scroll no suave
- Verificar configuración de Lenis
- Confirmar integración con ScrollTrigger
- Revisar que no haya conflictos con otros scripts

## 📝 Próximas Mejoras

- [ ] Parallax con mouse movement
- [ ] Efectos 3D con perspectiva
- [ ] Parallax en imágenes de fondo
- [ ] Animaciones más complejas con timelines
- [ ] Efectos de partículas

---

**Desarrollado por**: David Elizalde (@DavElizG)
**Fecha**: Enero 2026
**Versión**: 1.0.0
