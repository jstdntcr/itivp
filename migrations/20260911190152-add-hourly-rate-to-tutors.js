'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Добавляем колонку hourlyRate (стоимость академического часа, в руб.)
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Tutors', 'hourlyRate', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  // Откат миграции — удаляем колонку
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tutors', 'hourlyRate');
  },
};
