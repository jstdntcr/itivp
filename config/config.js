// Конфигурация Sequelize. Строку подключения берём из переменной окружения
// DATABASE_URL (файл .env), чтобы не хранить пароль в репозитории.
require('dotenv').config();

const common = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
};

module.exports = {
  development: common,
  test: common,
  production: common,
};
