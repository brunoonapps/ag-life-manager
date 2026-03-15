import { prisma } from './src/config/prisma.js';
async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: { email: 'test@example.com', name: 'Test User', language_pref: 'pt' },
  });
  console.log('✅ Seeded user:', user);
  
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name_userId: { name: 'Trabalho', userId: user.id } }, update: {}, create: { name: 'Trabalho', userId: user.id } }),
    prisma.category.upsert({ where: { name_userId: { name: 'Casa', userId: user.id } }, update: {}, create: { name: 'Casa', userId: user.id } }),
    prisma.category.upsert({ where: { name_userId: { name: 'Estudos', userId: user.id } }, update: {}, create: { name: 'Estudos', userId: user.id } }),
  ]);
  console.log('✅ Seeded categories:', categories.map(c => c.name));

  await prisma.task.create({ data: { title: 'Tarefa Restaurada', description: 'Sistema recuperado', priority: 'HIGH', userId: user.id, categoryId: categories[0].id } });
}
main().catch(console.error).finally(() => prisma.$disconnect());
