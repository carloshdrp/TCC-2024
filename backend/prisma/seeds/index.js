const { prisma } = require('../../config/database');
const seedUsers = require('./users');
const seedConquistas = require('./conquistas');
const seedQuestions = require('./questions');
const seedAnswers = require('./answers');
const seedQuizzes = require('./quiz');
const seedQuizAttempts = require('./quizAttempt');
const seedReports = require('./report');
const seedRatings = require('./rating');
const seedNotifications = require('./notification');

async function cleanDatabase() {
  const deleteOrder = [
    'UserAchievements',
    'quizRelation',
    'QuizQuestionAnswer',
    'quizAttempt',
    'quizQuestion',
    'Quiz',
    'Achievement',
    'Answer',
    'Question',
    'Notification',
    'Rating',
    'Report',
    'Token',
    'User',
  ];

  const deleteOperations = deleteOrder.reduce((acc, modelName) => {
    if (typeof prisma[modelName]?.deleteMany === 'function') {
      acc.push(async () => {
        try {
          await prisma[modelName].deleteMany();
          console.log(`|-Tabela ${modelName} limpa com sucesso.`);
        } catch (error) {
          console.error(`|-Erro ao limpar tabela ${modelName}:`, error);
        }
      });
    }
    return acc;
  }, []);

  await deleteOperations.reduce((promise, operation) => promise.then(operation), Promise.resolve());
}

async function main() {
  try {
    console.log('Iniciando limpeza do banco de dados...');
    await cleanDatabase();
    console.log('🧹 Banco de dados limpo com sucesso');

    console.log('Iniciando processo de seed...');
    await prisma.$transaction(async (tx) => {
      await seedUsers(tx);
      await seedConquistas(tx);
      await seedQuestions(tx);
      await seedAnswers(tx);
      await seedQuizzes(tx);
      await seedQuizAttempts(tx);
      await seedReports(tx);
      await seedRatings(tx);
      await seedNotifications(tx);
    });
  } catch (error) {
    console.error('❌ Erro durante o processo de seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('🌱 Seed concluído com sucesso');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro inesperado durante o processo de seed:', error);
    process.exit(1);
  });
