'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('Tutors', [
      {
        name: 'Анна Смирнова',
        subject: 'Математика',
        bio: 'Готовлю к ЦТ и олимпиадам.',
        hourlyRate: 40,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Игорь Петров',
        subject: 'Английский язык',
        bio: 'Разговорный английский, подготовка к IELTS.',
        hourlyRate: 35,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Мария Ковалёва',
        subject: 'Физика',
        bio: 'Механика и электродинамика для школьников.',
        hourlyRate: 45,
        createdAt: now,
        updatedAt: now,
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tutors', null, {});
  },
};
