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

  // Servicio 1: Tratamientos Faciales
  const facialesService = await prisma.service.create({
    data: {
      title: 'Tratamientos Faciales',
      eyebrow: 'Experiencia Premium',
      description: 'Limpiezas profundas, peeling químico, microdermabrasión y más para renovar tu piel.',
      icon: 'Sparkles',
      isPremium: true,
      order: 1,
      isActive: true,
      treatments: {
        create: [
          {
            name: 'Limpieza profunda',
            description: 'Limpieza facial profunda que elimina impurezas y células muertas, dejando tu piel radiante y renovada.',
            icon: 'Sparkles',
            benefits: ['Elimina puntos negros', 'Destapa poros', 'Mejora textura de la piel', 'Preparación ideal para otros tratamientos'],
            duration: '60 minutos',
            price: 'Desde $80',
            order: 1,
            isActive: true,
          },
          {
            name: 'Hidratación intensiva',
            description: 'Tratamiento intensivo de hidratación que restaura la humedad natural de tu piel con ácido hialurónico y vitaminas.',
            icon: 'Droplet',
            benefits: ['Hidratación profunda', 'Reduce líneas finas', 'Mejora elasticidad', 'Brillo natural'],
            duration: '45 minutos',
            price: 'Desde $90',
            order: 2,
            isActive: true,
          },
          {
            name: 'Rejuvenecimiento',
            description: 'Tratamiento anti-edad que estimula la producción de colágeno y reduce los signos visibles del envejecimiento.',
            icon: 'Sun',
            benefits: ['Reduce arrugas', 'Estimula colágeno', 'Tensado de piel', 'Efecto lifting natural'],
            duration: '90 minutos',
            price: 'Desde $150',
            order: 3,
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
      description: 'Aplicación de ácido hialurónico y toxina botulínica para resultados naturales.',
      icon: 'Droplet',
      isPremium: true,
      order: 2,
      isActive: true,
      treatments: {
        create: [
          {
            name: 'Rellenos labiales',
            description: 'Aumento y definición de labios con ácido hialurónico de última generación para un resultado natural y armonioso.',
            icon: 'Droplet',
            benefits: ['Mayor volumen', 'Contorno definido', 'Hidratación profunda', 'Resultados inmediatos'],
            duration: '30 minutos',
            price: 'Desde $200',
            order: 1,
            isActive: true,
          },
          {
            name: 'Botox facial',
            description: 'Aplicación de toxina botulínica para suavizar líneas de expresión y prevenir arrugas futuras.',
            icon: 'Sparkles',
            benefits: ['Reduce arrugas dinámicas', 'Previene nuevas líneas', 'Resultado natural', 'Sin tiempo de recuperación'],
            duration: '20 minutos',
            price: 'Desde $180',
            order: 2,
            isActive: true,
          },
          {
            name: 'Eliminación de arrugas',
            description: 'Combinación de rellenos y botox para un tratamiento completo anti-edad con resultados espectaculares.',
            icon: 'Star',
            benefits: ['Rejuvenecimiento facial', 'Piel más tersa', 'Aspecto descansado', 'Efecto duradero'],
            duration: '60 minutos',
            price: 'Desde $350',
            order: 3,
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
      description: 'Procedimientos para moldear y tonificar tu figura con tecnología avanzada.',
      icon: 'Zap',
      isPremium: true,
      order: 3,
      isActive: true,
      treatments: {
        create: [
          {
            name: 'Reducción de grasa',
            description: 'Tecnología no invasiva para eliminar grasa localizada y moldear tu silueta sin cirugía.',
            icon: 'Zap',
            benefits: ['Elimina grasa localizada', 'Sin cirugía', 'Sin tiempo de recuperación', 'Resultados visibles en semanas'],
            duration: '45 minutos',
            price: 'Desde $120',
            order: 1,
            isActive: true,
          },
          {
            name: 'Tonificación muscular',
            description: 'Estimulación electromagnética que fortalece y tonifica músculos de forma rápida y efectiva.',
            icon: 'Star',
            benefits: ['Aumenta masa muscular', 'Define abdomen', 'Fortalece glúteos', 'Equivale a miles de abdominales'],
            duration: '30 minutos',
            price: 'Desde $150',
            order: 2,
            isActive: true,
          },
          {
            name: 'Reafirmación de piel',
            description: 'Tratamiento con radiofrecuencia que tensa y reafirma la piel, combatiendo la flacidez.',
            icon: 'Sparkles',
            benefits: ['Piel más firme', 'Reduce celulitis', 'Mejora textura', 'Estimula colágeno'],
            duration: '60 minutos',
            price: 'Desde $130',
            order: 3,
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
      description: 'Servicios personalizados y paquetes premium para ocasiones especiales.',
      icon: 'Star',
      isPremium: true,
      order: 4,
      isActive: true,
      treatments: {
        create: [
          {
            name: 'Paquetes para novias',
            description: 'Programa completo de preparación para tu día especial, diseñado para que luzcas radiante.',
            icon: 'Star',
            benefits: ['Plan personalizado', 'Múltiples sesiones', 'Resultados garantizados', 'Seguimiento profesional'],
            duration: '3 meses',
            price: 'Desde $800',
            order: 1,
            isActive: true,
          },
          {
            name: 'Eventos especiales',
            description: 'Tratamientos express para lucir impecable en cualquier evento importante.',
            icon: 'Sparkles',
            benefits: ['Resultados inmediatos', 'Efecto wow', 'Piel luminosa', 'Maquillaje profesional incluido'],
            duration: '90 minutos',
            price: 'Desde $200',
            order: 2,
            isActive: true,
          },
          {
            name: 'Tratamientos VIP',
            description: 'Experiencia premium exclusiva con atención personalizada y tratamientos de lujo.',
            icon: 'Star',
            benefits: ['Atención privada', 'Tratamientos exclusivos', 'Productos premium', 'Ambiente de lujo'],
            duration: '2-3 horas',
            price: 'Desde $500',
            order: 3,
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
