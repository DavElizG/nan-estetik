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

  // Crear paciente de ejemplo (opcional)
  const examplePatient = await prisma.patient.create({
    data: {
      firstName: 'María',
      lastName: 'García',
      phone: '+52 555 123 4567',
      email: 'maria.garcia@example.com',
      gender: 'FEMALE',
      dateOfBirth: new Date('1985-06-15'),
    },
  });

  console.log('✅ Example patient created:', examplePatient.id);

  console.log('🎉 Seeding completed!');
}

try {
  await main();
} catch (e) {
  console.error('❌ Error seeding database:', e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
