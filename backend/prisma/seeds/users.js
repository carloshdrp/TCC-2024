const { hash } = require('bcryptjs');

async function seedUsers(tx) {
  const users = [
    {
      email: 'admin@email.com',
      name: 'Admin',
      password: await hash('senha123', 10),
      role: 'ADMIN',
      points: 10,
      avatar: '2024-06-29T154102.500Zmaya.jpg',
    },
    {
      email: 'estudante@email.com',
      name: 'Estudante',
      password: await hash('senha123', 10),
      role: 'ESTUDIOSO',
      points: 10,
      avatar: '2024-06-29T161933.447Z742768164769881.63fcab5871a06.png',
    },
    {
      email: 'usuario@email.com',
      name: 'Usuário',
      password: await hash('senha123', 10),
      role: 'INICIANTE',
    },
  ];

  const createUsers = users.map((user) =>
    tx.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    }),
  );

  await Promise.all(createUsers);

  console.log('✅ Usuários criados com sucesso');
}

module.exports = seedUsers;
