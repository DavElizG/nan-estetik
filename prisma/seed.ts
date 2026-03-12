/**
 * Script de seed para datos iniciales
 * Crea un usuario administrador por defecto
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Validar que las variables de entorno existan
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error(
      '❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file'
    );
  }

  // Crear usuario administrador
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD,
    12
  );

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL,
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Crear pacientes de ejemplo
  console.log('👥 Creating example patients...');

  const patient1 = await prisma.patient.create({
    data: {
      firstName: 'María',
      lastName: 'García',
      phone: '+52 555 123 4567',
      email: 'maria.garcia@example.com',
      gender: 'FEMALE',
      dateOfBirth: new Date('1985-06-15'),
      address: 'Av. Insurgentes Sur 1234, CDMX',
      allergies: 'Ninguna conocida',
      medicalHistory: 'Sin antecedentes relevantes',
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      firstName: 'Ana',
      lastName: 'Martínez',
      phone: '+52 555 234 5678',
      email: 'ana.martinez@example.com',
      gender: 'FEMALE',
      dateOfBirth: new Date('1990-03-22'),
      address: 'Calle Reforma 567, CDMX',
      allergies: 'Sensibilidad a productos con alcohol',
    },
  });

  const patient3 = await prisma.patient.create({
    data: {
      firstName: 'Laura',
      lastName: 'Rodríguez',
      phone: '+52 555 345 6789',
      email: 'laura.rodriguez@example.com',
      gender: 'FEMALE',
      dateOfBirth: new Date('1988-11-08'),
      address: 'Col. Roma Norte, CDMX',
    },
  });

  const patient4 = await prisma.patient.create({
    data: {
      firstName: 'Sofía',
      lastName: 'López',
      phone: '+52 555 456 7890',
      email: 'sofia.lopez@example.com',
      gender: 'FEMALE',
      dateOfBirth: new Date('1992-07-14'),
      address: 'Polanco, CDMX',
      medicalHistory: 'Piel sensible',
    },
  });

  console.log('✅ Created 4 example patients');

  // Crear registros de tratamientos
  console.log('📋 Creating treatment records...');

  await prisma.patientRecord.createMany({
    data: [
      {
        patientId: patient1.id,
        userId: admin.id,
        type: 'CONSULTATION',
        treatmentName: 'Consulta inicial',
        description: 'Primera consulta para evaluación de piel y recomendación de tratamientos. Se identificó piel mixta con tendencia a poros dilatados.',
        observations: 'Paciente interesada en limpieza profunda y rejuvenecimiento.',
        date: new Date('2026-01-15'),
        nextAppointment: new Date('2026-01-25'),
      },
      {
        patientId: patient1.id,
        userId: admin.id,
        type: 'TREATMENT',
        treatmentName: 'Limpieza Profunda',
        description: 'Limpieza facial profunda con extracción de comedones y aplicación de mascarilla purificante.',
        observations: 'Excelente respuesta al tratamiento. Piel notablemente más limpia y luminosa.',
        productsUsed: JSON.stringify(['Limpiador enzimático', 'Tónico equilibrante', 'Mascarilla de arcilla']),
        date: new Date('2026-01-25'),
        nextAppointment: new Date('2026-02-15'),
      },
      {
        patientId: patient2.id,
        userId: admin.id,
        type: 'CONSULTATION',
        treatmentName: 'Consulta inicial',
        description: 'Evaluación para tratamiento anti-edad. Se observan líneas de expresión leves en frente y contorno de ojos.',
        observations: 'Paciente busca prevención de envejecimiento prematuro.',
        date: new Date('2026-01-10'),
      },
      {
        patientId: patient2.id,
        userId: admin.id,
        type: 'TREATMENT',
        treatmentName: 'Botox facial',
        description: 'Aplicación de toxina botulínica en frente y entrecejo. 20 unidades totales.',
        observations: 'Paciente muy satisfecha con los resultados. Sin efectos adversos.',
        productsUsed: JSON.stringify(['Botox 20U', 'Crema anestésica']),
        date: new Date('2026-01-20'),
        nextAppointment: new Date('2026-05-20'),
      },
      {
        patientId: patient3.id,
        userId: admin.id,
        type: 'TREATMENT',
        treatmentName: 'Hidratación intensiva',
        description: 'Tratamiento con ácido hialurónico y vitamina C para hidratación profunda.',
        observations: 'Piel mucho más hidratada y luminosa inmediatamente después del tratamiento.',
        date: new Date('2026-01-18'),
      },
      {
        patientId: patient4.id,
        userId: admin.id,
        type: 'TREATMENT',
        treatmentName: 'Rellenos labiales',
        description: 'Aumento sutil de labios con 1ml de ácido hialurónico.',
        observations: 'Resultado natural y armonioso. Paciente muy satisfecha.',
        productsUsed: JSON.stringify(['Ácido hialurónico 1ml', 'Crema anestésica']),
        date: new Date('2026-01-22'),
        nextAppointment: new Date('2026-07-22'),
      },
      {
        patientId: patient3.id,
        userId: admin.id,
        type: 'FOLLOW_UP',
        treatmentName: 'Seguimiento de hidratación',
        description: 'Revisión post-tratamiento. Resultados excelentes mantenidos.',
        observations: 'Se recomienda continuar con rutina de cuidado en casa.',
        date: new Date('2026-01-26'),
      },
    ],
  });

  console.log('✅ Created 7 treatment records');

  // Crear servicios con sus tratamientos
  console.log('🏥 Seeding services and treatments...');
  
  // Eliminar tratamientos y servicios existentes para evitar conflictos
  await prisma.treatment.deleteMany({});
  await prisma.service.deleteMany({});
  console.log('🗑️ Cleared existing services and treatments');

  // Servicio 1: Tratamientos Faciales
  const facialesService = await prisma.service.create({
    data: {
      title: 'Tratamientos Faciales',
      eyebrow: 'Experiencia Premium',
      description: 'Descubre nuestra línea completa de tratamientos faciales diseñados para transformar tu piel. Desde limpiezas profundas con tecnología de punta hasta tratamientos de rejuvenecimiento avanzado, cada procedimiento está personalizado para tus necesidades específicas. Nuestro equipo de especialistas utiliza los mejores productos y técnicas para garantizar resultados excepcionales.',
      icon: 'Sparkles',
      isPremium: true,
      order: 1,
      isActive: true,
      treatments: {
        create: [
          {
            name: 'Limpieza profunda',
            description: 'Limpieza facial profunda profesional que elimina impurezas, células muertas y residuos acumulados. Incluye extracción de comedones, vaporización, exfoliación enzimática y mascarilla purificante personalizada.',
            icon: 'Sparkles',
            benefits: ['Elimina puntos negros y espinillas', 'Destapa y minimiza poros', 'Mejora textura y luminosidad', 'Preparación ideal para otros tratamientos', 'Oxigenación celular profunda'],
            duration: '60-75 minutos',
            price: 'Desde $80',
            order: 1,
            isActive: true,
          },
          {
            name: 'Hidratación intensiva',
            description: 'Tratamiento de hidratación profunda con ácido hialurónico de bajo y alto peso molecular, vitaminas antioxidantes y péptidos bioactivos. Restaura la barrera cutánea y devuelve la luminosidad natural.',
            icon: 'Droplet',
            benefits: ['Hidratación hasta las capas más profundas', 'Reduce líneas finas por deshidratación', 'Mejora elasticidad y firmeza', 'Brillo natural sin grasa', 'Efecto plumping inmediato'],
            duration: '45-60 minutos',
            price: 'Desde $90',
            order: 2,
            isActive: true,
          },
          {
            name: 'Rejuvenecimiento facial',
            description: 'Tratamiento anti-edad avanzado que combina radiofrecuencia, LED terapia y activos de última generación. Estimula la producción natural de colágeno y elastina para un efecto lifting sin cirugía.',
            icon: 'Sun',
            benefits: ['Reduce arrugas y líneas de expresión', 'Estimula colágeno y elastina', 'Tensado visible de la piel', 'Efecto lifting natural', 'Mejora contorno facial'],
            duration: '90 minutos',
            price: 'Desde $150',
            order: 3,
            isActive: true,
          },
          {
            name: 'Peeling químico',
            description: 'Exfoliación química controlada con ácidos específicos según tu tipo de piel. Renueva las capas superficiales, unifica el tono y estimula la regeneración celular para una piel como nueva.',
            icon: 'Sparkles',
            benefits: ['Renueva capas superficiales', 'Unifica tono de piel', 'Reduce manchas y cicatrices', 'Estimula regeneración celular', 'Piel más suave y luminosa'],
            duration: '45 minutos',
            price: 'Desde $100',
            order: 4,
            isActive: true,
          },
        ],
      },
    },
  });
  console.log('✅ Service created:', facialesService.title);

  // Servicio 2: Rellenos y Botox
  const rellenosService = await prisma.service.create({
    data: {
      title: 'Rellenos y Botox',
      eyebrow: 'Estética Avanzada',
      description: 'Tratamientos de medicina estética no invasiva con los más altos estándares de seguridad y calidad. Utilizamos únicamente productos premium de marcas reconocidas mundialmente, aplicados por profesionales certificados. Resultados naturales que realzan tu belleza sin alterar tu expresividad natural.',
      icon: 'Droplet',
      isPremium: true,
      order: 2,
      isActive: true,
      treatments: {
        create: [
          {
            name: 'Rellenos labiales',
            description: 'Aumento y definición de labios con ácido hialurónico reticulado de última generación. Técnica personalizada para lograr volumen, hidratación y contorno perfectamente natural y armonioso con tus facciones.',
            icon: 'Droplet',
            benefits: ['Mayor volumen natural', 'Contorno y perfil definido', 'Hidratación profunda duradera', 'Resultados inmediatos visibles', 'Corrección de asimetrías'],
            duration: '30-45 minutos',
            price: 'Desde $200',
            order: 1,
            isActive: true,
          },
          {
            name: 'Botox facial',
            description: 'Aplicación precisa de toxina botulínica para suavizar líneas de expresión en frente, entrecejo y patas de gallo. Técnica avanzada que mantiene tu expresividad natural mientras previene arrugas futuras.',
            icon: 'Sparkles',
            benefits: ['Reduce arrugas dinámicas efectivamente', 'Previene formación de nuevas líneas', 'Resultado natural y expresivo', 'Sin tiempo de recuperación', 'Efecto de frescura visible'],
            duration: '20-30 minutos',
            price: 'Desde $180',
            order: 2,
            isActive: true,
          },
          {
            name: 'Relleno de ojeras',
            description: 'Tratamiento especializado para el área periorbital con ácido hialurónico específico. Corrige hundimiento, oscurecimiento y aspecto cansado devolviendo luminosidad y juventud a tu mirada.',
            icon: 'Sun',
            benefits: ['Elimina aspecto de cansancio', 'Rellena hundimientos', 'Reduce coloración oscura', 'Mirada más joven y descansada', 'Resultados duraderos'],
            duration: '30 minutos',
            price: 'Desde $250',
            order: 3,
            isActive: true,
          },
          {
            name: 'Armonización facial',
            description: 'Protocolo completo de rejuvenecimiento que combina estratégicamente rellenos y botox para un resultado integral. Recupera volúmenes perdidos, suaviza arrugas y redefine contornos faciales.',
            icon: 'Star',
            benefits: ['Rejuvenecimiento facial completo', 'Piel más tersa y firme', 'Aspecto natural y descansado', 'Efecto duradero 6-12 meses', 'Resultados personalizados'],
            duration: '60-90 minutos',
            price: 'Desde $450',
            order: 4,
            isActive: true,
          },
        ],
      },
    },
  });
  console.log('✅ Service created:', rellenosService.title);

  // Servicio 3: Tratamientos Corporales
  const corporalesService = await prisma.service.create({
    data: {
      title: 'Tratamientos Corporales',
      eyebrow: 'Esculpe tu Figura',
      description: 'Tecnología de vanguardia para moldear, tonificar y reafirmar tu cuerpo sin cirugía. Nuestros tratamientos corporales combinan equipos de última generación con protocolos personalizados para atacar grasa localizada, celulitis y flacidez. Resultados visibles desde las primeras sesiones con cero tiempo de recuperación.',
      icon: 'Zap',
      isPremium: true,
      order: 3,
      isActive: true,
      treatments: {
        create: [
          {
            name: 'Reducción de grasa localizada',
            description: 'Criolipólisis y cavitación ultrasónica de alta potencia para eliminar depósitos de grasa resistentes al ejercicio. Tecnología no invasiva que destruye células grasas de forma permanente sin dañar tejidos circundantes.',
            icon: 'Zap',
            benefits: ['Elimina grasa localizada permanentemente', 'Sin cirugía ni agujas', 'Sin tiempo de recuperación', 'Resultados visibles en 4-8 semanas', 'Ideal para abdomen, flancos y muslos'],
            duration: '45-60 minutos',
            price: 'Desde $120',
            order: 1,
            isActive: true,
          },
          {
            name: 'Tonificación muscular HIFEM',
            description: 'Estimulación electromagnética de alta intensidad que provoca contracciones supramáximas, equivalentes a miles de abdominales en una sesión. Fortalece, tonifica y define músculos de forma rápida y efectiva.',
            icon: 'Star',
            benefits: ['Aumenta masa muscular hasta 25%', 'Define abdomen y glúteos', 'Fortalece core profundo', 'Equivale a 20,000 contracciones', 'Resultados en 4 sesiones'],
            duration: '30 minutos',
            price: 'Desde $150',
            order: 2,
            isActive: true,
          },
          {
            name: 'Reafirmación con radiofrecuencia',
            description: 'Radiofrecuencia multipolar que calienta capas profundas de la piel para estimular colágeno y elastina. Combate flacidez, celulitis y mejora textura de la piel en todo el cuerpo.',
            icon: 'Sparkles',
            benefits: ['Piel más firme y tonificada', 'Reduce celulitis visible', 'Mejora textura y suavidad', 'Estimula producción de colágeno', 'Resultados progresivos duraderos'],
            duration: '60 minutos',
            price: 'Desde $130',
            order: 3,
            isActive: true,
          },
          {
            name: 'Drenaje linfático',
            description: 'Masaje especializado que activa el sistema linfático para eliminar toxinas, reducir retención de líquidos y mejorar la circulación. Perfecto para desinflamar y complementar otros tratamientos corporales.',
            icon: 'Droplet',
            benefits: ['Elimina retención de líquidos', 'Reduce inflamación y volumen', 'Mejora circulación sanguínea', 'Desintoxicación profunda', 'Sensación de ligereza inmediata'],
            duration: '50 minutos',
            price: 'Desde $85',
            order: 4,
            isActive: true,
          },
        ],
      },
    },
  });
  console.log('✅ Service created:', corporalesService.title);

  // Servicio 4: Tratamientos Especiales
  const especialesService = await prisma.service.create({
    data: {
      title: 'Tratamientos Especiales',
      eyebrow: 'Experiencia VIP',
      description: 'Experiencias únicas y personalizadas para momentos especiales de tu vida. Desde programas completos para novias hasta tratamientos express para eventos importantes, cada servicio está diseñado para que luzcas y te sientas espectacular. Atención exclusiva con los más altos estándares de lujo y resultados garantizados.',
      icon: 'Star',
      isPremium: true,
      order: 4,
      isActive: true,
      treatments: {
        create: [
          {
            name: 'Programa Novias',
            description: 'Plan integral de 3 meses diseñado especialmente para tu día especial. Incluye evaluación inicial, tratamientos faciales progresivos, cuidado corporal y sesión final pre-boda para lucir radiante.',
            icon: 'Star',
            benefits: ['Plan 100% personalizado', 'Múltiples sesiones coordinadas', 'Resultados garantizados', 'Seguimiento profesional continuo', 'Prueba de maquillaje incluida'],
            duration: 'Programa de 3 meses',
            price: 'Desde $800',
            order: 1,
            isActive: true,
          },
          {
            name: 'Glow Express',
            description: 'Tratamiento intensivo express para lucir impecable en cualquier evento importante. Combina limpieza, hidratación flash, mascarilla luminosidad y maquillaje profesional en una sola sesión.',
            icon: 'Sparkles',
            benefits: ['Resultados inmediatos visibles', 'Efecto wow garantizado', 'Piel luminosa y radiante', 'Maquillaje profesional incluido', 'Perfecto para fotos'],
            duration: '90 minutos',
            price: 'Desde $200',
            order: 2,
            isActive: true,
          },
          {
            name: 'Experiencia VIP Privada',
            description: 'Sesión exclusiva en suite privada con atención completamente personalizada. Incluye champagne de bienvenida, tratamientos premium a elección, masaje relajante y amenidades de lujo.',
            icon: 'Star',
            benefits: ['Atención privada exclusiva', 'Tratamientos premium a elección', 'Productos de lujo internacional', 'Ambiente spa 5 estrellas', 'Regalo de cortesía incluido'],
            duration: '2-3 horas',
            price: 'Desde $500',
            order: 3,
            isActive: true,
          },
          {
            name: 'Detox Facial Completo',
            description: 'Protocolo intensivo de desintoxicación facial que elimina impurezas acumuladas, revitaliza la piel y restaura su equilibrio natural. Ideal para pieles urbanas expuestas a contaminación.',
            icon: 'Droplet',
            benefits: ['Limpieza profunda extrema', 'Elimina toxinas ambientales', 'Restaura equilibrio natural', 'Piel purificada y oxigenada', 'Brillo saludable renovado'],
            duration: '75 minutos',
            price: 'Desde $160',
            order: 4,
            isActive: true,
          },
        ],
      },
    },
  });
  console.log('✅ Service created:', especialesService.title);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
