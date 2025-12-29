import bcrypt from 'bcryptjs';
import prisma from '../config/database';

async function seed() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@wholesale.com' },
    update: {},
    create: {
      email: 'admin@wholesale.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@wholesale.com' },
    update: {},
    create: {
      email: 'user@wholesale.com',
      password: userPassword,
      name: 'Test User',
      company: 'Test Company',
      phone: '123-456-7890',
      role: 'USER',
    },
  });
  console.log('Test user created:', user.email);

  console.log('Database seeding completed!');
  console.log('\nTest accounts:');
  console.log('Admin: admin@wholesale.com / admin123');
  console.log('User: user@wholesale.com / user123');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

