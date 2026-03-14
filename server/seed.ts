import { prisma } from './src/config/prisma.js';
async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: { email: 'test@example.com', name: 'Test User', language_pref: 'pt' },
  });
  console.log('✅ Seeded user:', user);
  await prisma.task.create({ data: { title: 'Tarefa Restaurada', description: 'Sistema recuperado', priority: 'HIGH', userId: user.id } });
}
main().catch(console.error).finally(() => prisma.$disconnect());
